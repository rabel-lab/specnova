import { __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

import { ZodError } from 'zod';

export class SpecnovaZodError extends __SpecnovaErrorImpl<'zod'> {
  constructor(error: ZodError, options?: __SpecnovaErrorOptions) {
    super('zod', (l) => l.fromError(error), options);
  }
}

/* @internal */
export const zodErrorCaster = new __ErrorCaster<ZodError, SpecnovaZodError>(
  SpecnovaZodError,
  (error): error is ZodError => error instanceof ZodError && error.name === 'ZodError',
);
