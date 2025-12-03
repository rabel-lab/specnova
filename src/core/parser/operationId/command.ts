import { CommandParserHandler } from '@/core/parser/base';
import { createParserHandler } from '@/core/parser/helpers';
import { createOperationIdParser } from '@/core/parser/operationId/action';
import { isOpenApi2, isOpenApi3x } from '@/core/predicate';

import { SwaggerElement } from '@swagger-api/apidom-ns-openapi-2';
import { OpenApi3_0Element } from '@swagger-api/apidom-ns-openapi-3-0';
import {
  OpenApi3_1Element,
  refractorPluginNormalizeOperationIds,
} from '@swagger-api/apidom-ns-openapi-3-1';

const operationIdParsers: CommandParserHandler[] = [
  createParserHandler('operationId', isOpenApi2, (element, options) => {
    const openApiElement = SwaggerElement.refract(element, {
      plugins: [
        refractorPluginNormalizeOperationIds({
          operationIdNormalizer: createOperationIdParser(options),
        }),
      ],
    }) as SwaggerElement;
    return openApiElement;
  }),
  createParserHandler('operationId', isOpenApi3x, (element, options) => {
    const openApiElement = OpenApi3_1Element.refract(element, {
      plugins: [
        refractorPluginNormalizeOperationIds({
          operationIdNormalizer: createOperationIdParser(options),
        }),
      ],
    }) as OpenApi3_1Element | OpenApi3_0Element;
    return openApiElement;
  }),
];

export default operationIdParsers;
