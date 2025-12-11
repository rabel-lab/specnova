import { Resolved } from '@/config/type';
import {
  defaultParserOperationIdConfig,
  ParserOperationIdConfig,
} from '@/core/parser/operationId/config';

export type ParserConfig = {
  operationId?: ParserOperationIdConfig;
  sort?: null;
};

export const defaultParserConfig: Resolved<ParserConfig> = {
  operationId: defaultParserOperationIdConfig,
  sort: null,
};
