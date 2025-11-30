import { Element } from '@swagger-api/apidom-core';
import { PredicateFunc } from '../predicate';
import { OpenApi3_0Element } from '@swagger-api/apidom-ns-openapi-3-0';

type ParserCommandName = 'operationId' | 'sort';

type ParserCommand<E extends Element> = (element: E) => E;

export interface ParserHandler<PE extends Element = any> {
  name: ParserCommandName;
  predicate: PredicateFunc<PE>;
  handler<PE>(element: PE): PE;
}

type ParserHandlersShape = {
  [Name in ParserCommandName]: ParserHandler<Element>[];
};

type CommandExecutor = {
  [Name in ParserCommandName]: ParserCommand<Element>;
};

class ParserCommander implements CommandExecutor {
  private handlers: ParserHandlersShape = {
    operationId: [],
    sort: [],
  };
  constructor(handlers?: ParserHandlersShape) {
    if (handlers) {
      this.handlers = handlers;
    }
  }
  push(handler: ParserHandler<Element>) {
    switch (handler.name) {
      case 'operationId':
        this.handlers.operationId.push(handler);
        break;
      case 'sort':
        this.handlers.sort.push(handler);
        break;
      default:
        throw new Error('ParserCommander: unknown command');
    }
  }
  operationId<T extends Element>(element: T): T {
    for (const h of this.handlers.operationId) {
      if (h.predicate(element)) {
        return h.handler<T>(element);
      }
    }
    throw new Error('ParserCommander: no handler found');
  }
  sort<T extends Element>(element: T): T {
    for (const h of this.handlers.sort) {
      if (h.predicate(element)) {
        return h.handler(element);
      }
    }
    throw new Error('ParserCommander: no handler found');
  }
}

export const parserCommander = new ParserCommander();

const test = parserCommander.operationId(new OpenApi3_0Element());
