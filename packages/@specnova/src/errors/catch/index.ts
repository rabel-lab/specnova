import { __SpecnovaErrorImpl } from '@/errors/base';
import { errorCasters } from '@/errors/caster';
import { unimplimentedErrorCaster } from '@/errors/definitions';
import logger from '@/logger';

type CatchErrorOptions = {
  throw?: boolean;
  exit?: 1;
};

export function castError(e: unknown) {
  //->IF, instance of SpecnovaError, use it
  if (e instanceof __SpecnovaErrorImpl) {
    return e;
  } else {
    //->ELSE, find a caster
    for (const caster of errorCasters) {
      if (caster.isCastable(e)) {
        return caster.cast(e);
      }
    }
  }
  //->IF, no caster found,
  // return UnimplementedError [Error:(unkown|undefined)]
  if (e instanceof Error) {
    return unimplimentedErrorCaster.cast(e);
  } else {
    return unimplimentedErrorCaster.cast(new Error());
  }
}

export function catchError(e: unknown, options?: CatchErrorOptions) {
  const err = castError(e);
  //-> IF, fatal error
  if (err.fatal) {
    //-> IF, throw error
    if (options?.throw) {
      throw err;
    }
    //-> Else, Continue
    logger.error(err);
    if (options?.exit) {
      process.exitCode = options.exit;
    }
  } else {
    //-> IF, non-fatal error
    logger.warn(err);
  }
}

process.exitCode;
