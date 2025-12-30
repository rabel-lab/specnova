import SpecnovaErrorImpl from '@/errors/base';

import { ZodError } from 'zod';

export function isZodError(value: any): value is ZodError {
  return value instanceof Error && value.name === 'ZodError';
}

export class SpecnovaZodError extends SpecnovaErrorImpl<'zod', ZodError> {
  public static predicate = isZodError;
  constructor(error?: ZodError) {
    super('zod', (l) => l.fromError(error));
  }
}
