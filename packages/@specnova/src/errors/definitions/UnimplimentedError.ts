import { __SpecnovaErrorImpl } from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

export class SpecnovaUnimplementedError extends __SpecnovaErrorImpl<'unimplimented'> {
  constructor(error?: Error | unknown, casterName?: string) {
    if (error instanceof Error) {
      super('unimplimented', (l) => l.fromError(error), error, casterName);
      return;
    } else {
      super('unimplimented', (l) => l.unknownError(), undefined, casterName);
    }
  }
}

/* @internal */
export const unimplimentedErrorCaster = new __ErrorCaster<Error, SpecnovaUnimplementedError>(
  SpecnovaUnimplementedError,
  (error): error is Error => error instanceof Error,
);
