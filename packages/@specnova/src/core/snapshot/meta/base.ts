import { ResolvedSpecnovaConfig } from '@/config/type';
import converter from '@/core/converter';
import {
  snapshotConfigSchema,
  SnapshotFileSlots,
  snapshotFileSlotsEnum,
} from '@/core/snapshot/config';
import {
  buildMetaFile,
  buildMetaOrigin,
  buildMetaPath,
  buildMetaRootPath,
  buildMetaSourceFiles,
} from '@/core/snapshot/meta/lib/build';
import { compareSha256, digestString, sha256StringSchema } from '@/core/snapshot/meta/lib/compare';
import { SpecnovaSnapshotError } from '@/errors/definitions/SnapshotError';
import logger from '@/logger';
import { SpecnovaSource } from '@/types';
import { relativePathSchema } from '@/types/files';
import { Semver, semver } from '@/types/semver';

import { readFileSync } from 'fs';
import { mkdir, rename, rm, writeFile } from 'fs/promises';
import { join as pathJoin } from 'path';
import { isDeepStrictEqual } from 'util';
import { z } from 'zod';

const TEMP_FOLDER = '.tmp-write';

export const snapshotMetaDataSchema = z.object({
  info: z.any(),
  path: z.string(),
  files: z.object({
    names: snapshotConfigSchema.shape.names,
    extensions: snapshotConfigSchema.shape.extensions,
  }),
  origin: z.object({
    source: z.url(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  sha256: z.partialRecord(
    snapshotFileSlotsEnum.exclude(['meta']),
    z.union([sha256StringSchema, z.promise(sha256StringSchema)]),
  ),
});

type SnapshotMetaData = z.infer<typeof snapshotMetaDataSchema>;
type SnapshotMetaHashes = z.infer<typeof snapshotMetaDataSchema.shape.sha256>;

type SnapshotMetaDigestors = {
  [key in SnapshotFileSlots]?: string;
};

type SnapshotMetaEditedFiles = {
  [key in SnapshotFileSlots]?: {
    text: string;
  };
};

class SnapshotMetaImpl {
  private lock: boolean = false;
  private data: SnapshotMetaData;
  protected editData: SnapshotMetaData;
  protected editFiles: SnapshotMetaEditedFiles = {};

  constructor(data: SnapshotMetaData) {
    this.data = data;
    this.editData = data;
  }

  private apply() {
    this.editData = this.data;
  }

  private clear() {
    this.editData = this.data;
    this.editFiles = {};
    this.lock = false;
  }

  /**
   * Ensure meta is unlocked.
   * @throws - if locked
   */
  protected ensureUnlocked() {
    if (this.lock) {
      throw new SpecnovaSnapshotError((l) => l.meta.notUnlocked());
    }
  }

  /**
   * Ensure meta is locked.
   * @throws - if unlocked
   */
  protected ensureLocked() {
    if (!this.lock) {
      throw new SpecnovaSnapshotError((l) => l.meta.notLocked());
    }
  }

  /**
   * Digest a document via sha256 digest.
   * @param target - Specific target to sync.
   * @returns - true if saved, false if failed
   * @default - sync all
   */
  async addDocument(digester: SnapshotMetaDigestors) {
    this.ensureUnlocked();
    for (const key in digester) {
      switch (key) {
        case 'source':
        case 'normalized':
          if (!digester[key]) continue;
          this.editFiles[key as keyof SnapshotMetaHashes] = {
            text: digester[key],
          };
          this.editData.sha256[key] = digestString(digester[key]);
          break;
        case 'meta':
          if (!digester[key]) continue;
          this.editFiles.meta = {
            text: digester[key],
          };
          break;
        default:
          throw new SpecnovaSnapshotError((l) => l.meta.invalidDigest());
      }
    }
  }

  private async prepareMetaSubmit() {
    //# Await Meta hashes
    for (const key in this.editData.sha256) {
      if (!this.editData.sha256[key as keyof SnapshotMetaHashes]) continue;
      this.editData.sha256[key as keyof SnapshotMetaHashes] =
        await this.editData.sha256[key as keyof SnapshotMetaHashes];
    }
    //# Add Meta document
    const text = converter.fromJson(this.editData, true);
    await this.addDocument({
      meta: text,
    });
  }

  private startSubmit() {
    this.lock = true;
  }

  private async endSubmit() {
    const revertUpdateTime = this.editData.origin.updatedAt;
    //# Prepare data;
    this.ensureLocked();
    const documentEntries = Object.entries(this.editFiles);
    const tempFolder = pathJoin(this.editData.path, TEMP_FOLDER);
    const destFolder = this.editData.path;
    const files = this.editData.files;
    this.editData.origin.updatedAt = new Date();
    await mkdir(tempFolder, { recursive: true });
    try {
      //# Write all files into temp folder
      await Promise.all(
        documentEntries.map(([key, value]) => {
          const { text } = value;
          const file = files.names[key as SnapshotFileSlots];
          return writeFile(pathJoin(tempFolder, file), text);
        }),
      );
      //# Move them only if ALL writes succeeded
      await Promise.all(
        documentEntries.map(([key]) => {
          return rename(
            pathJoin(tempFolder, files.names[key as SnapshotFileSlots]),
            pathJoin(destFolder, files.names[key as SnapshotFileSlots]),
          );
        }),
      );
      //# if successful, apply & clear
      logger.success((l) => l.snapshot.submit(this.editData.path));
      this.apply();
      this.clear();
    } catch (e) {
      //# Cleanup
      this.editData.origin.updatedAt = revertUpdateTime;
      await rm(tempFolder, { recursive: true, force: true });
      this.lock = false;
      throw e;
    }
    //# Cleanup
    await rm(tempFolder, { recursive: true, force: true });
    this.lock = false;
  }

  protected async submit() {
    await this.prepareMetaSubmit();
    this.startSubmit();
    await this.endSubmit();
  }

  get() {
    return this.data;
  }
}

export class SnapshotMeta extends SnapshotMetaImpl {
  constructor(args: { meta: SnapshotMetaData });
  constructor(args: { specnovaSource: SpecnovaSource; config: ResolvedSpecnovaConfig });
  constructor(
    args:
      | { meta: SnapshotMetaData }
      | { specnovaSource: SpecnovaSource; config: ResolvedSpecnovaConfig },
  ) {
    if ('meta' in args) {
      // Existing meta
      super(args.meta);
      // Validate files & sha256
      if (!this.softCompare(this)) {
        throw new SpecnovaSnapshotError((l) => l.meta.missmatch());
      }
      return;
    } else if ('specnovaSource' in args && 'config' in args) {
      // Fresh meta
      const { specnovaSource, config } = args;
      super({
        info: specnovaSource.info,
        path: buildMetaPath(config, specnovaSource.info.version),
        files: buildMetaSourceFiles(config, specnovaSource),
        origin: buildMetaOrigin(config, specnovaSource),
        sha256: {
          source: Promise.resolve(''),
          normalized: Promise.resolve(''),
        },
      });
    } else {
      throw new SpecnovaSnapshotError((l) => l.meta.failedToCreate());
    }
  }

  /**
   * Return a new meta from a full path.
   * @param fullPath - The full path to the meta file.
   * @returns - this
   */
  static fromFile(fullPath: string) {
    const relativePath = relativePathSchema.parse(fullPath);
    const text = readFileSync(relativePath, 'utf8');
    const meta = converter.fromText<SnapshotMetaData>(text.toString(), 'json');
    const parsedMeta = snapshotMetaDataSchema.parse(meta);
    return new this({ meta: parsedMeta });
  }

  /**
   * Complete meta path from branch.
   * @param branch, config
   * @param config
   * @returns - this
   */
  static fromBranch(branch: string): SnapshotMeta {
    const metaFile = buildMetaFile();
    const fullPath = pathJoin(branch, metaFile.file);
    return this.fromFile(fullPath);
  }

  /**
   * Complete meta path from version.
   * @param rawVersion, config
   * @param config
   * @returns - this
   */
  static fromVersion(rawVersion: Semver, config: ResolvedSpecnovaConfig): SnapshotMeta {
    const version = semver.parse(rawVersion);
    const branch = buildMetaPath(config, version);
    return this.fromBranch(branch);
  }

  /**
   * Validate the digest compared to this snapshot files
   * @param meta - The meta to validate.
   * @param fileTarget - The file to validate.
   * @returns - true if valid, false if not.
   */
  async validateDigest(
    meta: SnapshotMeta = this,
    fileTarget: keyof SnapshotMetaHashes,
  ): Promise<boolean> {
    //# Get This snapshot files
    const { path, files } = this.get();
    //# Get target snapshot hases
    const { sha256: targetHashes } = meta.get();
    const hash = targetHashes[fileTarget];
    //# Validate
    const filePath = pathJoin(path, files.names[fileTarget]);
    if (!hash) return Promise.resolve(false);
    return compareSha256(hash, filePath);
  }
  /**
   * Make other is from the same meta family.
   * Via comparing info,
   * @param other - The other meta.
   * @returns - true if identical, false if not */
  async softCompare(other: SnapshotMeta): Promise<boolean> {
    const thisData = this.get();
    const otherData = other.get();
    const matches = [
      //# Version & path
      thisData.info.title === otherData.info.title,
      isDeepStrictEqual(thisData.info.license, otherData.info.license),
    ];
    return matches.every((match) => match === true);
  }
  /**
   * Make sure metas are identical copies.
   * @param other - The other meta.
   * @returns - true if identical, false if not
   */
  async stricCompare(other: SnapshotMeta): Promise<boolean> {
    //# Get Sha256 Comparisons rules
    const thisData = this.get();
    const otherData = other.get();
    const sha256Compares = Object.entries(thisData.sha256).map(([shaKey, thisSha]) => {
      const otherSha = other.editData.sha256[shaKey as keyof SnapshotMetaHashes];
      const identical = Boolean(thisSha) === Boolean(otherSha);
      if (identical && thisSha && otherSha) {
        //Is: Identical && not null(true)
        //-> trigger comparison
        const compare = Promise.all([
          this.validateDigest(this, shaKey as keyof SnapshotMetaHashes),
          this.validateDigest(other, shaKey as keyof SnapshotMetaHashes),
        ]).then(([thisValid, otherValid]) => {
          return thisValid && otherValid;
        });
        return compare;
      } else {
        //Is either: Not identical(false) : Identical && null (true)
        return identical;
      }
    });
    //# Compile all matches rules
    const matches = [
      //# Version & path
      thisData.path === otherData.path,
      thisData.info.version === otherData.info.version,
      //# config
      //# sha256
      await Promise.race(sha256Compares),
    ];
    //# Return true if all matches rules are true
    return matches.every((match) => match === true);
  }
  /**
   * Save the meta to the snapshot path.
   * @returns - true if saved, false if failed
   */
  async commit() {
    this.submit();
  }
  /**
   * Return root directory of the snapshot.
   * @returns - The root directory.
   */
  static getRootDir(config: ResolvedSpecnovaConfig) {
    return buildMetaRootPath(config);
  }
}
