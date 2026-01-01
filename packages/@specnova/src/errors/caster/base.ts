import { __SpecnovaErrorImpl } from '@/errors/base';

type ErrorConstructor<In extends Error, Out extends __SpecnovaErrorImpl<any>> = new (
  error: In,
  casterName?: string,
) => Out;

/* @internal */
export class __ErrorCaster<In extends Error, Out extends __SpecnovaErrorImpl<any>> {
  constructor(
    private readonly caster: ErrorConstructor<In, Out>,
    private readonly guard: (e: unknown) => e is In,
  ) {}
  name = this.caster.name;
  isCastable(error: unknown): error is In {
    return this.guard(error);
  }
  cast(error: In): Out {
    return new this.caster(error, this.name);
  }
}

/* @internal */
export type __ErrorCasters = ReadonlyArray<__ErrorCaster<any, __SpecnovaErrorImpl<any>>>;
