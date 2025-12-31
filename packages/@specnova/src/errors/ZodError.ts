import SpecnovaErrorBase from '@/errors/base';
import { ErrorCaster } from '@/errors/caster/base';

import { ZodError } from 'zod';

export class SpecnovaZodError extends SpecnovaErrorBase<'zod', ZodError> {
  constructor(error?: Error) {
    super('zod', (l) => l.fromError(error));
  }
}

export const ZodErrorCaster: ErrorCaster<ZodError, SpecnovaZodError> = {
  cast(error) {
    return new SpecnovaZodError(error);
  },
  isCastable(error): error is ZodError {
    return error instanceof ZodError && error.name === 'ZodError';
  },
};
