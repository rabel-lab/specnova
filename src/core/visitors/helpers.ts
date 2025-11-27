import { PredicateFunc } from '@/core/predicate';
import { VisitorHandler } from '@/core/visitors/base';
import { Element } from '@swagger-api/apidom-core';

/**
 * Create a VisitorHandler.
 * @param predicate - ElementPredicate<E>
 * @param handler - (element: E) => T
 * @returns - VisitorHandler<E, T>
 */
export function createVisitorHandler<E extends Element, T>(
  predicate: PredicateFunc<E>,
  handler: (element: E) => T,
): VisitorHandler<E, T> {
  return { predicate, handler };
}
