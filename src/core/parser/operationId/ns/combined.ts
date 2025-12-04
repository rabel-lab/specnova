import {
  defaultParserOperationIdConfig,
  ParserOperationIdConfig,
} from '@/core/parser/operationId/config';
import { operationIdNormalizer } from '@/core/parser/operationId/utils';
import { RefractablePlugin } from '@/core/parser/types/refractable';

import { OpenApi3_1Element } from '@swagger-api/apidom-ns-openapi-3-1';
import { refractorPluginNormalizeOperationIds } from '@swagger-api/apidom-ns-openapi-3-1';

export const refractorPluginOperationIdParser = new RefractablePlugin<ParserOperationIdConfig>(
  defaultParserOperationIdConfig,
  (option) =>
    refractorPluginNormalizeOperationIds({
      operationIdNormalizer: operationIdNormalizer(option),
    }),
  OpenApi3_1Element,
);
