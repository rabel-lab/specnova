import { __SpecnovaErrorImpl } from '@/errors/base';
import { errorCasters } from '@/errors/caster';
import { unimplimentedErrorCaster } from '@/errors/definitions';
import logger from '@/logger';

type CatchErrorOptions = {
  safe?: boolean;
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

function handleSafeError(e: __SpecnovaErrorImpl<any>) {
  logger.warn(e);
  return e;
}

export function catchError(e: unknown, options?: CatchErrorOptions) {
  const err = castError(e);
  if (options?.safe) {
    //-> IF, safe error
    logger.debug();
    handleSafeError(err);
    return;
  } else if (err.fatal) {
    //-> IF, fatal error
    if (options?.throw) {
      //->IF, throw fatal error
      throw err;
    }
    //-> Else, Continue
    logger.error(err);
    if (options?.exit) {
      //->IF, exit code
      process.exitCode = options.exit;
    }
  } else {
    //-> IF, non-fatal error
    logger.warn(err);
  }
}

process.exitCode;
