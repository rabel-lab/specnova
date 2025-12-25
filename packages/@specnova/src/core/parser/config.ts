import { Resolved } from '@/config/type';
import {
  defaultParserOperationIdConfig,
  parserOperationIdConfigSchema,
} from '@/core/parser/operationId/config';

import z from 'zod';

export const parserConfigSchema = z.object({
  operationId: z.optional(parserOperationIdConfigSchema),
  sort: z.optional(z.null()),
});
export type ParserConfig = z.infer<typeof parserConfigSchema>;

export const defaultParserConfig: Resolved<ParserConfig> = {
  operationId: defaultParserOperationIdConfig,
  sort: null,
} as const;
