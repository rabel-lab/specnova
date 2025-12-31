import SpecnovaErrorBase from '@/errors/base';
import { ErrorCaster } from '@/errors/caster/base';

export class SpecnovaError extends SpecnovaErrorBase<'default'> {
  constructor(error: Error) {
    super('default', (l) => l.fromError(error));
  }
}

export const unimplimentedError: ErrorCaster<Error, SpecnovaError> = {
  cast(error) {
    return new SpecnovaError(error);
  },
  isCastable(error): error is Error {
    return error instanceof Error;
  },
};
