import __SpecnovaErrorImpl from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

export class SpecnovaUnimplementedError extends __SpecnovaErrorImpl<'unimplimented'> {
  constructor(error?: Error) {
    if (error) {
      super('unimplimented', (l) => l.fromError(error));
      return;
    } else {
      super('unimplimented', (l) => l.unknownError());
    }
  }
}

/* @internal */
export const unimplimentedErrorCaster = new __ErrorCaster<Error, SpecnovaUnimplementedError>(
  SpecnovaUnimplementedError,
  (error): error is Error => error instanceof Error,
);
