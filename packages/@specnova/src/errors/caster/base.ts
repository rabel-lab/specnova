import { __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';

type ErrorConstructor<In extends Error, Out extends __SpecnovaErrorImpl<any>> = new (
  error: In,
  options?: __SpecnovaErrorOptions,
) => Out;

interface ErrorCaster<In extends Error, Out> {
  readonly name: string;
  isCastable(error: unknown): error is In;
  cast(error: In): Out;
}

export function createErrorCaster<In extends Error, Out extends __SpecnovaErrorImpl<any>>(
  caster: ErrorConstructor<In, Out>,
  guard: (e?: unknown) => e is In,
) {
  return {
    name: caster.name,
    cast(error: In): Out {
      return new caster(error, { error, casterName: caster.name });
    },
    isCastable(error?: unknown): error is In {
      return guard(error);
    },
  } satisfies ErrorCaster<In, Out>;
}

/* @internal */
export type __ErrorCasters = ReadonlyArray<ErrorCaster<any, __SpecnovaErrorImpl<any>>>;
