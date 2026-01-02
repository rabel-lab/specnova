import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
import { createErrorCaster } from '@/errors/caster/base';

import { CommanderError } from 'commander';

type Guess<T extends CommanderError> = T extends CommanderError ? T : __ErrorTranslation<'cli'>;

export class SpecnovaCliError<
  T extends CommanderError | never = never,
> extends __SpecnovaErrorImpl<'cli'> {
  constructor(error: T, options?: __SpecnovaErrorOptions);
  constructor(l: __ErrorTranslation<'cli'>, options?: __SpecnovaErrorOptions);
  constructor(args: Guess<T>, options?: __SpecnovaErrorOptions) {
    if (args instanceof Error) {
      super('cli', (l) => l.fromError(args), options);
    } else {
      super('cli', args, options);
    }
  }
}

/* @internal */
export const cliErrorCaster = createErrorCaster(
  SpecnovaCliError,
  (error): error is CommanderError =>
    error instanceof CommanderError && error.name === 'CommanderError',
);
