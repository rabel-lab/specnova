import { __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
import { createErrorCaster } from '@/errors/caster/base';

import { ZodError } from 'zod';

export class SpecnovaZodError extends __SpecnovaErrorImpl<'zod'> {
  constructor(error: ZodError, options?: __SpecnovaErrorOptions) {
    super('zod', (l) => l.fromError(error), options);
    if (this.cause?.message) {
      this.cause.message = this.message;
      this.message = this.cause.name;
    }
    return this;
  }
}

/* @internal */
export const zodErrorCaster = createErrorCaster(SpecnovaZodError, (error): error is ZodError => {
  return error instanceof ZodError && error.name === 'ZodError';
});
