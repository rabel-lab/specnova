import { UserConfig } from '@/config';
import { getUserConfig } from '@/config/resolved';
import { ResolvedSpecnovaConfig } from '@/config/type';
import { hasNormalize } from '@/config/utils';
import converter from '@/core/converter';
import parserCommander from '@/core/parser';
import { parseSource } from '@/core/reference';
import { SnapshotMeta } from '@/core/snapshot/meta/base';
import { SpecnovaSnapshotError } from '@/errors/definitions/SnapshotError';
import logger from '@/logger';
import { Package } from '@/npm/base';
import { SpecnovaSource } from '@/types';
import { relativePathSchema } from '@/types/files';
import { Semver, semver } from '@/types/semver';

import { readdir } from 'fs/promises';
import { join as pathJoin } from 'path';
import z from 'zod';

export class Snapshot {
  //# initialize
  private userConfig: Promise<UserConfig> = getUserConfig();
  private packageHandler: Package = new Package();
  private sourceUrl: string = '';

  //= OpenAPI source
  private specnovaSource: SpecnovaSource | null = null;
  //= Meta
  private meta: SnapshotMeta | null = null;

  //# clear cache
  private clearCache() {
    this.specnovaSource = null;
    this.meta = null;
    this.sourceUrl = '';
  }

  //# Getters
  //-> Config
  private async getFullConfig(): Promise<ResolvedSpecnovaConfig> {
    //= Appy user config to base config
    const userConfig = await Promise.resolve(this.userConfig);
    return userConfig.getSpecnovaConfig();
  }
  //-> User config
  private async getUserConfig(): Promise<UserConfig> {
    return await Promise.resolve(this.userConfig);
  }
  //-> Lazily compute and cache parsed OpenAPI source
  public async getSpecnovaSource() {
    //!TODO: Remove & use meta instead
    if (this.specnovaSource) return this.specnovaSource;
    this.specnovaSource = await parseSource(this.sourceUrl);
    return this.specnovaSource;
  }
  //->Get Meta
  public getMeta() {
    return this.meta;
  }
  //# Constructor
  constructor() {}
  //# Functions
  //-> ENSURING DATA
  private async ensureSpecnovaSource(): Promise<SpecnovaSource> {
    const specnovaSource = await this.getSpecnovaSource();
    if (!specnovaSource) throw new SpecnovaSnapshotError((l) => l.source.notFound());
    return specnovaSource;
  }
  private ensureMeta(): SnapshotMeta {
    if (!this.meta) throw new SpecnovaSnapshotError((l) => l.meta.notFound());
    return this.meta;
  }
  //-> LOADING
  /**
   * Load from a source url.
   * @param source - The OpenAPI source.
   * @returns  - this
   */
  private async doLoad(source: string): Promise<this> {
    this.clearCache();
    const config = await this.getFullConfig();
    this.sourceUrl = source;
    logger.debug('doload', { source });
    const specnovaSource = await this.ensureSpecnovaSource();
    // Ccompute the snapshot path and create a new meta.
    let newMeta: SnapshotMeta;
    if (specnovaSource.isExternal) {
      // Create a fresh meta
      newMeta = new SnapshotMeta({ specnovaSource, config });
    } else {
      // Must be loaded using meta file
      throw new SpecnovaSnapshotError((l) => l.source.internalFailedToLoad());
    }
    // set the new meta
    this.meta = newMeta;
    return this;
  }
  /**
   * Load from a meta file
   * @param filePath - The meta path.
   * @returns - this
   */
  private async doLoadFromMeta(newMeta: SnapshotMeta) {
    this.clearCache();
    // -> load meta
    this.meta = newMeta;
    // -> load source
    const { path, files } = newMeta.get();
    const fullSourcePath = relativePathSchema.parse(pathJoin(path, files.names.source));
    this.sourceUrl = fullSourcePath;
    await this.ensureSpecnovaSource();
    this.meta = newMeta;
    return this;
  }
  /** Verify external url integrity.
   * Then, load the spec version.
   * @returns - this
   */
  async loadUrl(source: string): Promise<this> {
    //!TODO: Create a uniform ExternalUrl interface
    const specnovaSource = z.httpUrl().safeParse(source);
    if (specnovaSource.success === false) {
      throw new SpecnovaSnapshotError((l) => l.source.invalidUrl(), {
        error: specnovaSource.error,
      });
    }
    return await this.doLoad(source);
  }
  /**
   * Load the spec branch from package.json
   *  Then, load the spec version.
   * @returns - this
   */
  async loadBranch(): Promise<this> {
    //!TODO: Handle packagehandler failure
    const specnovaPkg = await this.packageHandler.getSpecnova();
    const meta = SnapshotMeta.fromFile(specnovaPkg.branch.target);
    return await this.doLoadFromMeta(meta);
  }
  /**
   * Get the main spec version from package.json
   *  Then, load the spec version.
   * @returns - this
   */
  async loadSource(): Promise<this> {
    //!TODO: Handle packagehandler failure
    const { source } = await this.packageHandler.getSpecnova();
    return await this.doLoad(source);
  }
  /**
   * Get a specific spec version snapshot folder.
   *  Then, load the spec version.
   * @param rawVersion - The spec version.
   * @returns - this
   */
  async loadVersion(rawVersion: Semver): Promise<this> {
    const parsedVersion = semver.parse(rawVersion);
    const config = await this.getFullConfig();
    const newMeta = SnapshotMeta.fromVersion(parsedVersion, config);
    return this.doLoadFromMeta(newMeta);
  }
  //-> PREPARING & COMMITING FILES
  /**
   * Prepare the source to be saved.
   * @returns - true if prepared, false if failed
   */
  async prepareSource(): Promise<boolean> {
    const specnovaSource = await this.ensureSpecnovaSource();
    const meta = this.ensureMeta();
    const { files } = meta.get();
    //# Extension check
    let extension = specnovaSource.extension;
    if (files.extensions.normalized !== 'infer') {
      extension = files.extensions.normalized;
    }
    //# Write source
    const sourceOutText = converter.fromApiDom(specnovaSource.parseResult, extension);
    try {
      meta.addDocument({
        source: sourceOutText,
      });
      return true;
    } catch (e) {
      throw new SpecnovaSnapshotError((l) => l.failedToSave('source'), { error: e });
    }
  }
  /**
   * Perpare the normalized source to be saved.
   * @returns - true if prepared, false if failed
   */
  async prepareNormalized(): Promise<boolean> {
    const config = await this.getFullConfig();
    //# Check if normalization is needed
    if (!hasNormalize(config)) {
      logger.success((l) => l.core.parser.noNormalization());
      return true;
    }
    //# Get normalized file location
    const specnovaSource = await this.ensureSpecnovaSource();
    const meta = this.ensureMeta();
    const { files } = meta.get();
    //# Apply normalization
    const normalizedElement = parserCommander.byConfig(specnovaSource.parseResult, config);
    //# Extension check
    let extension = specnovaSource.extension;
    if (files.extensions.normalized !== 'infer') {
      extension = files.extensions.normalized;
    }
    //# Write normalized
    const normalizedOutText = converter.fromApiDom(normalizedElement, extension);
    try {
      meta.addDocument({
        normalized: normalizedOutText,
      });
      return true;
    } catch (e) {
      throw new SpecnovaSnapshotError((l) => l.failedToSave('normalized'), { error: e });
    }
  }
  /**
   * Prepare all files to be saved.
   * @returns - { source, normalized }
   */
  async prepareAll() {
    const [source, normalized] = await Promise.all([
      this.prepareSource(),
      this.prepareNormalized(),
    ]);
    return { source, normalized };
  }
  /**
   * Commit changes to the snapshot folder.
   * @returns - true if saved, false if failed
   */
  async commit() {
    const meta = this.ensureMeta();
    return meta.commit();
  }
  /**
   * Prepare all & commit changes to the snapshot folder.
   * @returns - true if saved, false if failed
   * @default - sync all
   */
  async prepareAllAndCommit() {
    const result = await this.prepareAll();
    if (result.source && result.normalized) {
      return await this.commit();
    }
  }
  //-> PACKAGE.JSON & Branches
  /** Get the currently established branch.
   * @returns - SpecnovaConfig
   */
  async getBranch() {
    return this.packageHandler.getSpecnova();
  }
  /**
   * Set this snapshot as the main branch.
   * @returns - prev: SpecnovaConfig, next: SpecnovaConfig
   */
  async setBranch() {
    const { path, files, origin } = this.ensureMeta().get();
    const metaPath = pathJoin(path, files.names.meta);
    const prevSpec = this.packageHandler.getSpecnova();
    const nextSpec = this.packageHandler.edit({
      source: origin.source,
      branch: {
        target: metaPath,
      },
    });
    const [prev, next] = await Promise.all([prevSpec, nextSpec]);
    return {
      prev,
      next,
    };
  }
  /**
   * Get a list of all the branches.
   * @returns - The list of branches.
   */
  async getBranches() {
    const config = await this.getFullConfig();
    const rootDir = SnapshotMeta.getRootDir(config);
    const relativeRootDir = relativePathSchema.parse(rootDir);
    try {
      const entries = await readdir(relativeRootDir, { recursive: false, withFileTypes: true });
      const rawBranches = entries
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      //-> Check if they have a valid meta
      const validBranches = rawBranches.filter((dir) => {
        try {
          const meta = SnapshotMeta.fromVersion(semver.parse(dir), config);
          return meta.get().origin.source !== '';
        } catch {
          logger.warn(new SpecnovaSnapshotError((l) => l.branch.invalid(dir)));
          return false;
        }
      });
      return validBranches;
    } catch (err) {
      throw err;
    }
  }
  //-> GENERATION
  /**
   * Generate the selected snapshot to SDK.
   * @returns - true if g  try {
    const entries = await readdir(dir, { recursive: true, withFileTypes: true });
    const directories = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    console.log(directories);
  } catch (err) {
    console.error('Error reading directory:', err);
  }enerated, false if failed
   */
  async generate() {
    const userConfig = await this.getUserConfig();
    return await userConfig.generate();
  }
}
