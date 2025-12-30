import SpecnovaErrorImpl from '@/errors/base';

function isUnimplimentedError(value: any): value is Error {
  return value instanceof Error;
}

export class SpecnovaError extends SpecnovaErrorImpl<'default'> {
  public static predicate = isUnimplimentedError;
  constructor(error: Error) {
    super('default', (l) => l.fromError(error));
  }
}
