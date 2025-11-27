import {
  isSwaggerElement as isOpenApi2Element,
  SwaggerElement,
} from '@swagger-api/apidom-ns-openapi-2';
import { Element } from '@swagger-api/apidom-core';
import { isOpenApi3_0Element, OpenApi3_0Element } from '@swagger-api/apidom-ns-openapi-3-0';
import { isOpenApi3_1Element, OpenApi3_1Element } from '@swagger-api/apidom-ns-openapi-3-1';

/**
 * @public
 */
export interface PredicateFunc<E extends Element> {
  (element: E): element is E;
}

//-> apidom-ns-openapi-2
export const isOpenApi2: PredicateFunc<SwaggerElement> = (el): el is SwaggerElement => {
  return isOpenApi2Element(el);
};

//-> apidom-ns-openapi-3-0
export const isOpenApi3_0: PredicateFunc<OpenApi3_0Element> = (el): el is OpenApi3_0Element => {
  return isOpenApi3_0Element(el);
};

//-> apidom-ns-openapi-3-1
export const isOpenApi3_1: PredicateFunc<OpenApi3_1Element> = (el): el is OpenApi3_1Element => {
  return isOpenApi3_1Element(el);
};

//-> appidom-ns-openapi-3-0 | 3-1
export const isOpenApi3x: PredicateFunc<OpenApi3_0Element | OpenApi3_1Element> = (
  el,
): el is OpenApi3_0Element | OpenApi3_1Element => {
  return isOpenApi3_0(el) || isOpenApi3_1(el);
};
