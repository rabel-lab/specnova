import { __SpecnovaErrorImpl } from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

import { ZodError } from 'zod';

export class SpecnovaZodError extends __SpecnovaErrorImpl<'zod'> {
  constructor(error: ZodError) {
    super('zod', (l) => l.fromError(error), error, 'zod');
  }
}

/* @internal */
export const zodErrorCaster = new __ErrorCaster<ZodError, SpecnovaZodError>(
  SpecnovaZodError,
  (error): error is ZodError => error instanceof ZodError && error.name === 'ZodError',
);
