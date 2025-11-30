import { parserCommander, ParserHandler } from '@/core/parser/parserCommander';
import { isOpenApi3x } from '@/core/predicate';
import {
  OpenApi3_1Element,
  refractorPluginNormalizeOperationIds,
} from '@swagger-api/apidom-ns-openapi-3-1';
import { createOperationIdParser } from './action';
import { toValue } from '@swagger-api/apidom-core';

const operationIdParsers: ParserHandler[] = [
  {
    name: 'operationId',
    predicate: isOpenApi3x,
    handler(element) {
      const openApiElement = OpenApi3_1Element.refract(element, {
        plugins: [
          refractorPluginNormalizeOperationIds({
            operationIdNormalizer: createOperationIdParser(),
          }),
        ],
      });
      const test = toValue(openApiElement);
      console.log(test.paths);
      return element;
    },
  },
];

operationIdParsers.forEach((p) => parserCommander.push(p));
