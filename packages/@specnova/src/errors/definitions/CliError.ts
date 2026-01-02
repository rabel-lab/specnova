import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
import { __ErrorCaster } from '@/errors/caster/base';

import { CommanderError } from 'commander';

type Guess<T extends CommanderError> = T extends CommanderError ? T : __ErrorTranslation<'cli'>;

export class SpecnovaCliError<
  T extends CommanderError | never = never,
> extends __SpecnovaErrorImpl<'cli'> {
  constructor(error: T);
  constructor(l: __ErrorTranslation<'cli'>);
  constructor(args: Guess<T>) {
    if (args instanceof Error) {
      super('cli', (l) => l.fromError(args), args);
    } else {
      super('cli', args, new Error(), 'zod');
    }
  }
}

/* @internal */
export const cliErrorCaster = new __ErrorCaster<CommanderError, SpecnovaCliError>(
  SpecnovaCliError,
  (error): error is CommanderError =>
    error instanceof CommanderError && error.name === 'CommanderError',
);
