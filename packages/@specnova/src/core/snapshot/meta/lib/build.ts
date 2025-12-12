import { ResolvedOpenapiGenConfig } from '@/config/type';
import { SnapshotFileExtension } from '@/core/snapshot/config';
import { SnapshotMetaFiles } from '@/core/snapshot/meta/base';
import { OpenApiSource } from '@/types';

const META_EXT = 'json' satisfies SnapshotFileExtension;
const META_FILE = `meta.${META_EXT}`;

export function buildMetaPath(config: ResolvedOpenapiGenConfig, version: string): string {
  const snapshotConfig = config.snapshot;
  const rootDir =
    typeof snapshotConfig.folder === 'string' ? snapshotConfig.folder : snapshotConfig.folder.root;
  return `${rootDir}/${version}`;
}

export function buildMetaFile(): { file: string; extension: SnapshotFileExtension } {
  const file = META_FILE;
  const extension = META_EXT;
  return {
    file,
    extension,
  };
}

export function buildMetaSourceFiles(
  config: ResolvedOpenapiGenConfig,
  openapiSource: OpenApiSource,
): SnapshotMetaFiles {
  const snapshotConfig = config.snapshot;
  let sourceExtension: SnapshotFileExtension;
  switch (snapshotConfig.extensions.source) {
    case 'json':
      sourceExtension = 'json';
      break;
    case 'yaml':
      sourceExtension = 'yaml';
      break;
    case 'infer':
    default:
      sourceExtension = openapiSource!.extension;
  }
  let normalizedExtension: SnapshotFileExtension;
  switch (snapshotConfig.extensions.normalized) {
    case 'yaml':
      normalizedExtension = 'yaml';
      break;
    case 'infer':
      normalizedExtension = openapiSource!.extension;
    case 'json':
    default:
      normalizedExtension = 'json';
      break;
  }
  //-> Set extension
  const extensions = {
    source: sourceExtension,
    normalized: normalizedExtension,
    meta: 'json',
  } satisfies SnapshotMetaFiles['extensions'];
  //-> Set names
  const names = {
    source: `${snapshotConfig.files.source}.${extensions.source}`,
    normalized: `${snapshotConfig.files.normalized}.${extensions.normalized}`,
    meta: `${snapshotConfig.files.meta}.${extensions.meta}`,
  } satisfies SnapshotMetaFiles['names'];

  return {
    extensions,
    names,
  };
}
