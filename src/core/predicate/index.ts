import { Element } from '@swagger-api/apidom-core';
import { isSwaggerElement as isOpenApi2Element } from '@swagger-api/apidom-ns-openapi-2';
import { isOpenApi3_0Element } from '@swagger-api/apidom-ns-openapi-3-0';
import { isOpenApi3_1Element } from '@swagger-api/apidom-ns-openapi-3-1';

interface PredicateFunc {
  (element: Element): boolean;
}

//-> apidom-ns-openapi-2
export const isOpenApi2: PredicateFunc = (element): boolean => {
  return isOpenApi2Element(element);
};

//-> apidom-ns-openapi-3-0
export const isOpenApi3_0: PredicateFunc = (element): boolean => {
  return isOpenApi3_0Element(element);
};

//-> apidom-ns-openapi-3-1
export const isOpenApi3_1: PredicateFunc = (element): boolean => {
  return isOpenApi3_1Element(element);
};

//-> appidom-ns-openapi-3-0 | 3-1
export const isOpenApi3x: PredicateFunc = (element): boolean => {
  return isOpenApi3_0(element) || isOpenApi3_1(element);
};

//-> appidom-ns-openapi | All
export const isOpenApi: PredicateFunc = (element): boolean => {
  return isOpenApi2(element) || isOpenApi3x(element);
};
