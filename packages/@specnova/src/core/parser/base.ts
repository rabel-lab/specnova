import { defaultSpecnovaGenConfig } from '@/config/default';
import { SpecnovaConfig } from '@/config/type';
import { hasNormalize, mergeWithDefaults } from '@/config/utils';
import logger from '@/core/logger';
import { ParserConfig } from '@/core/parser/config';
import { PredicateFunc } from '@/core/predicate';
import { SpecnovaParserError } from '@/errors/ParserError';

import { Element } from '@swagger-api/apidom-core';

export type ParserCommandName = keyof ParserConfig;
export type ParserCommandOptions = Partial<ParserConfig>;

type ParserCommandHandlerFunc<E extends Element, O = any> = (element: E, options?: O) => E;

export interface ParserCommandHandler<PE extends Element = any> {
  name: ParserCommandName;
  predicate: PredicateFunc<PE>;
  handler: ParserCommandHandlerFunc<PE, ParserCommandOptions>;
}

interface ParserCommandHandlers {
  operationId: ParserCommandHandler<Element>[];
  sort: ParserCommandHandler<Element>[];
}

type ParserCommanderImpl = {
  [Name in ParserCommandName]: ParserCommandHandlerFunc<Element>;
};

export class ParserCommander implements ParserCommanderImpl {
  private handlers: ParserCommandHandlers = {
    operationId: [],
    sort: [],
  };
  constructor(handlers?: ParserCommandHandlers) {
    if (handlers) {
      this.handlers = handlers;
    }
  }
  push(...handlers: ParserCommandHandler<Element>[]) {
    for (const h of handlers) {
      if (h.name in this.handlers) {
        this.handlers[h.name].push(h);
      } else {
        throw new SpecnovaParserError((l) => l.unknownCommand());
      }
    }
  }
  operationId<T extends Element>(element: T, options?: ParserCommandOptions): T {
    for (const h of this.handlers.operationId) {
      if (h.predicate(element)) {
        return h.handler(element, options) as T;
      }
    }
    throw new SpecnovaParserError((l) => l.noHandlerFound());
  }
  sort<T extends Element>(element: T, options?: ParserCommandOptions): T {
    for (const h of this.handlers.sort) {
      if (h.predicate(element)) {
        return h.handler(element, options) as T;
      }
    }
    throw new SpecnovaParserError((l) => l.noHandlerFound());
  }
  byConfig<T extends Element>(element: T, config?: SpecnovaConfig): T {
    const mergedConfig = mergeWithDefaults(defaultSpecnovaGenConfig, config);
    if (!mergedConfig.normalized || !hasNormalize(mergedConfig)) {
      logger.success('No normalization settings found');
      return element;
    } else {
      const key = Object.keys(mergedConfig.normalized);
      let normalizedElement = element;
      for (const cn of key as ParserCommandName[]) {
        try {
          normalizedElement = this[cn](normalizedElement, mergedConfig.normalized);
        } catch (e) {
          if (e instanceof SpecnovaParserError) {
            throw e;
          } else {
            throw new SpecnovaParserError(
              (l) => l.failedToExecute({ element: element, name: cn }),
              e instanceof Error ? e : new Error('Unknown error'),
            );
          }
        }
      }
      return normalizedElement;
    }
  }
}
