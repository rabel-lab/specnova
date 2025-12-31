type ErrorConstructor<In extends Error, Out extends Error> = new (error: In) => Out;

/* @internal */
export class __ErrorCaster<In extends Error, Out extends Error> {
  constructor(
    private readonly caster: ErrorConstructor<In, Out>,
    private readonly guard: (e: unknown) => e is In,
  ) {}
  isCastable(error: unknown): error is In {
    return this.guard(error);
  }

  cast(error: In): Out {
    return new this.caster(error);
  }
}

/* @internal */
export type __ErrorCasters = ReadonlyArray<__ErrorCaster<any, any>>;
