import { ErrorCasters } from '@/errors/caster/base';
import { unimplimentedError } from '@/errors/UnimplimentedError';
import { ZodErrorCaster } from '@/errors/ZodError';

/* Export all casters */
/**
 * Order of importance:
 * ...
 * last: default
 */
export const errorCasters: ErrorCasters = [ZodErrorCaster, unimplimentedError] as const;
