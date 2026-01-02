import { __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

export class SpecnovaUnimplementedError extends __SpecnovaErrorImpl<'unimplimented'> {
  constructor(error: Error | unknown, options?: __SpecnovaErrorOptions) {
    if (error instanceof Error) {
      super('unimplimented', (l) => l.fromError(error), options);
      return;
    } else {
      super('unimplimented', (l) => l.unknownError(), options);
    }
  }
}

/* @internal */
export const unimplimentedErrorCaster = new __ErrorCaster<Error, SpecnovaUnimplementedError>(
  SpecnovaUnimplementedError,
  (error): error is Error => error instanceof Error,
);
