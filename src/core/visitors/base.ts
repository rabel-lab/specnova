import { PredicateFunc } from '@/core/predicate';
import { Element } from '@swagger-api/apidom-core';

export interface VisitorHandler<E extends Element, T> {
  predicate: PredicateFunc<E>;
  handler: (element: E) => Readonly<T>;
}

export abstract class Visitor<T> {
  private handlers: VisitorHandler<any, T>[] = [];
  constructor(handlers: VisitorHandler<any, T>[] = []) {
    this.handlers = handlers;
  }
  visit(element: Element): T {
    for (const h of this.handlers) {
      if (h.predicate(element)) {
        return h.handler(element);
      }
    }
    throw new Error('Visitor: no handler found');
  }
}
