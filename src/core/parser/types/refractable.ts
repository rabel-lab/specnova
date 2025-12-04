import {
  ParserCommandHandler,
  ParserCommandName,
  ParserCommandOptions,
} from '@/core/parser/command';
import { PredicateFunc } from '@/core/predicate';

import { Element } from '@swagger-api/apidom-core';

export type Refractable = {
  refract: typeof Element.refract;
};

function isRefractable(value: any): value is Refractable {
  return typeof value?.refract === 'function';
}

type RefractableProcess = () => void;
type RefractableVisitor<E extends Element> = {
  [key in E['element']]?: {
    enter?: (...args: any[]) => void;
    leave?: (...args: any[]) => void;
  };
};

type RefractablePluginShape = (toolbox?: any) => {
  name?: string;
  pre?: RefractableProcess;
  visitor: RefractableVisitor<Element>;
  post?: RefractableProcess;
};

export class RefractablePlugin<O> {
  public plugin: (option?: O) => RefractablePluginShape;
  public Element: Refractable;
  private defaultOption: O;
  constructor(
    defaultOption: O,
    plugin: (option?: O) => RefractablePluginShape,
    refractor?: Refractable,
  ) {
    this.defaultOption = defaultOption;
    this.plugin = (option?: O) => plugin(option ?? this.defaultOption);
    this.Element = isRefractable(refractor) ? refractor : Element;
  }
}

/**
 * Create a VisitorHandler.
 * @param predicate - PredicateFunc<E>
 * @param handler - (element: E, options?: Partial<OpenapiGenPluginConfig>) => T
 * @param refractor - Refractable - default Element
 * @returns - VisitorHandler<E, T>
 */
export function refractableParser<E extends Element, O = ParserCommandOptions>(
  name: ParserCommandName,
  predicate: PredicateFunc<E>,
  refractable: RefractablePlugin<O>,
): ParserCommandHandler<E> {
  return {
    name,
    predicate,
    handler: (element: E, options?: O) => {
      const refractorTarget = refractable.Element;
      console.log(refractorTarget);
      if (!isRefractable(refractorTarget)) throw new Error('ParserCommander: no refractor found');
      const h = refractorTarget.refract(element, {
        plugins: [refractable.plugin(options)],
      }) as E;
      return h;
    },
  };
}
