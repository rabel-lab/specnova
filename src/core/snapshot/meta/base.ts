import converter from '@/core/converter';
import { Info } from '@/core/extracter/info/type';
import { SnapshotConfig, SnapshotFileExtension, SnapshotFileSlots } from '@/core/snapshot/config';
import { buildMetaFile, buildMetaPath, buildMetaSourceFiles } from '@/core/snapshot/meta/lib/build';
import { compareSha256, digestString, Sha256String } from '@/core/snapshot/meta/lib/compare';
import { OpenApiSource } from '@/utils';

import { readFileSync } from 'fs';
import { mkdir, rename, rm, writeFile } from 'fs/promises';
import { join as pathJoin } from 'path';

const TEMP_FOLDER = '.tmp-write';

export type SnapshotMetaFiles = {
  names: {
    [key in SnapshotFileSlots]: string;
  };
  extensions: {
    [key in SnapshotFileSlots]: SnapshotFileExtension;
  };
};

export type SnapshotMetaHashes = {
  [key in Exclude<SnapshotFileSlots, 'meta'>]?: Promise<Sha256String> | Sha256String;
};

type SnapshotMetaData = {
  info: Info;
  path: string;
  config: Required<SnapshotConfig>;
  files: SnapshotMetaFiles;
  sha256: SnapshotMetaHashes;
};

type SnapshotMetaDigestors = {
  [key in SnapshotFileSlots]?: string;
};

type SnapshotMetaDocuments = {
  [key in SnapshotFileSlots]?: {
    text: string;
  };
};

class SnapshotMetaImpl {
  private lock: boolean = false;
  private data: SnapshotMetaData;
  protected softData: SnapshotMetaData;
  protected documents: SnapshotMetaDocuments = {};

  constructor(data: SnapshotMetaData) {
    this.data = data;
    this.softData = data;
  }

  private apply() {
    this.softData = this.data;
  }

  private clear() {
    this.softData = this.data;
    this.documents = {};
    this.lock = false;
  }

  /**
   * Ensure meta is unlocked.
   * @throws - if locked
   */
  protected ensureUnlocked() {
    if (this.lock) {
      throw new Error('Snapshot: meta is not locked');
    }
  }

  /**
   * Ensure meta is locked.
   * @throws - if unlocked
   */
  protected ensureLocked() {
    if (!this.lock) {
      throw new Error('Snapshot: meta is locked');
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
          this.documents[key as keyof SnapshotMetaHashes] = {
            text: digester[key],
          };
          this.softData.sha256[key] = digestString(digester[key]);
          break;
        case 'meta':
          if (!digester[key]) continue;
          this.documents.meta = {
            text: digester[key],
          };
          break;
        default:
          throw new Error('Snapshot: invalid digester key');
      }
    }
  }

  private async prepareMetaSubmit() {
    //# Await Meta hashes
    for (const key in this.softData.sha256) {
      if (!this.softData.sha256[key as keyof SnapshotMetaHashes]) continue;
      this.softData.sha256[key as keyof SnapshotMetaHashes] =
        await this.softData.sha256[key as keyof SnapshotMetaHashes];
    }
    //# Add Meta document
    const text = converter.fromJson(this.softData, true);
    await this.addDocument({
      meta: text,
    });
  }

  private startSubmit() {
    this.lock = true;
  }

  private async endSubmit() {
    //# Prepare data;
    this.ensureLocked();
    const documentEntries = Object.entries(this.documents);
    const tempFolder = pathJoin(this.softData.path, TEMP_FOLDER);
    const destFolder = this.softData.path;
    const files = this.softData.files;
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
      console.log(`✅ Applied changes to ${this.softData.path}`);
      this.apply();
      this.clear();
    } catch (e) {
      //# Cleanup
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
  constructor(args: { openapiSource: OpenApiSource; config: Required<SnapshotConfig> });
  constructor(
    args:
      | { meta: SnapshotMetaData }
      | { openapiSource: OpenApiSource; config: Required<SnapshotConfig> },
  ) {
    if ('meta' in args) {
      super(args.meta);
      return;
    } else if ('openapiSource' in args && 'config' in args) {
      const { openapiSource, config } = args;
      super({
        info: openapiSource.info,
        path: buildMetaPath(config, openapiSource.info.version),
        files: buildMetaSourceFiles(config, openapiSource),
        config,
        sha256: {
          source: Promise.resolve(''),
          normalized: Promise.resolve(''),
        },
      });
    } else {
      throw new Error('Snapshot: invalid meta constructor');
    }
  }
  static pull(version: string, config: Required<SnapshotConfig>): SnapshotMeta {
    const path = buildMetaPath(config, version);
    const metaFile = buildMetaFile();
    const pathTo = pathJoin(path, metaFile.file);
    const text = readFileSync(pathTo);
    try {
      const meta = converter.fromText<SnapshotMetaData>(text.toString(), 'json');
      return new SnapshotMeta({ meta });
    } catch {
      throw new Error('Snapshot: failed to load meta');
    }
  }
  /**
   * Compare the meta to another meta.
   * @param other - The other meta.
   * @returns - true if identical, false if not
   */
  async compare(other: SnapshotMeta): Promise<boolean> {
    const sha256Compares = Object.entries(this.softData.sha256).map(([indexKey, indexValue]) => {
      const otherValue = other.softData.sha256[indexKey as keyof SnapshotMetaHashes];
      const identical = Boolean(indexValue) === Boolean(otherValue);
      if (identical && indexValue && otherValue) {
        //Is: Identical && not null
        //-> trigger comparison
        return compareSha256([indexValue, otherValue]);
      } else {
        //Is: Not identical(false) : Identical && null(true)
        return identical;
      }
    });
    const matches = [
      //# Version & path
      this.softData.path === other.softData.path,
      this.softData.info.version === other.softData.info.version,
      //# sha256
      await Promise.race(sha256Compares),
    ];
    return matches.every((match) => match === true);
  }
  /**
   * Save the meta to the snapshot path.
   * @returns - true if saved, false if failed
   */
  async commit() {
    this.submit();
  }
}
