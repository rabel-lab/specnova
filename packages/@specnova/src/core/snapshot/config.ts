import { Resolved } from '@/config/type';
import { snapshotFileExtensionEnum } from '@/types/files';

import z from 'zod';

const SNAPSHOTS_DIR = '.snapshots';
const SOURCE_FILENAME = 'source';
const NORMALIZED_FILENAME = 'normalized';
const META_FILENAME = 'meta';

/**
 * Snapshot files
 **/
export const snapshotFileSlotsEnum = z.enum(['source', 'normalized', 'meta'] as const);
export type SnapshotFileSlots = z.infer<typeof snapshotFileSlotsEnum>;

export const snapshotConfigSchema = z.object({
  /**
   * Enable snapshot.
   * @default true
   */
  enabled: z.boolean().optional().default(true),
  /**
   * Snapshot root folder.
   * @default '.snapshots'
   */
  folder: z
    .union([z.string(), z.object({ root: z.string(), subfolder: z.string() })])
    .default(SNAPSHOTS_DIR),
  /**
   * Snapshot files.
   * @default {...}
   */
  names: z.record(snapshotFileSlotsEnum, z.string()).default({
    source: SOURCE_FILENAME,
    normalized: NORMALIZED_FILENAME,
    meta: META_FILENAME,
  }),
  /**
   * Snapshot file extensions.
   * @default {...}
   */
  extensions: z
    .object({
      source: snapshotFileExtensionEnum,
      normalized: snapshotFileExtensionEnum,
      meta: snapshotFileExtensionEnum.extract(['json']),
    })
    .strict()
    .default({
      source: 'infer',
      normalized: 'json',
      meta: 'json',
    }),
});

export type SnapshotConfig = z.infer<typeof snapshotConfigSchema>;

export const defaultSnapshotConfig: Resolved<SnapshotConfig> = {
  enabled: true,
  folder: SNAPSHOTS_DIR,
  names: {
    source: SOURCE_FILENAME,
    normalized: NORMALIZED_FILENAME,
    meta: META_FILENAME,
  },
  extensions: {
    source: 'infer',
    normalized: 'json',
    meta: 'json',
  },
} as const;
