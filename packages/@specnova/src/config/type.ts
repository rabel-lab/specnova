import { parserConfigSchema } from '@/core/parser/config';
import { snapshotConfigSchema } from '@/core/snapshot/config';

import z from 'zod';

export const specnovaConfigSchema = z.object({
  /**
   * The parser configuration.
   * @default {...}
   */
  normalized: parserConfigSchema.nullable().optional().default(null),
  /**
   * The snapshot configuration.
   * @default {...}
   */
  snapshot: snapshotConfigSchema,
});

export type SpecnovaConfig = z.infer<typeof specnovaConfigSchema>;

export type Resolved<T> = T & {
  [K in keyof T]-?: Resolved<T[K]>;
};

export type ResolvedSpecnovaConfig = Resolved<SpecnovaConfig>;
