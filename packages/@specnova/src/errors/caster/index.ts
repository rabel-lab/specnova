import { __ErrorCasters } from '@/errors/caster/base';
import { cliErrorCaster } from '@/errors/definitions/CliError';
import { unimplimentedErrorCaster } from '@/errors/definitions/UnimplimentedError';
import { zodErrorCaster } from '@/errors/definitions/ZodError';

/* Export all casters */
/**
 * Order of importance:
 * ...
 * last: default
 */
export const errorCasters: __ErrorCasters = [
  zodErrorCaster,
  cliErrorCaster,
  unimplimentedErrorCaster,
] as const;
