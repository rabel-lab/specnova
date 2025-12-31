// This file required `PNPM run dev` to generate
import type { BaseTranslation } from '@/i18n/i18n-types';

const en = {
  errorsUtils: {
    header: '[{name:string}]{type:string|capitalize}:',
  },
  errors: {
    parser: {
      unknownCommand: 'Unknown command',
      noHandlerFound: 'No handler found',
      failedToExecute: 'Failed to execute "{name|string}" command for element "{element|string}"',
    },
    unimplimented: {
      unknownError: 'Unknown error',
      fromError: '{0|error}',
    },
    typesafe_i18n: {
      'invalid-formatter-param': '\{\{i18n_invalid_param\}\}',
    },
    config: {
      'invalid-adapter': 'Invalid adapter',
    },
    zod: {
      fromError: '{0|zodPrettifiedError}',
    },
  },
} satisfies BaseTranslation;

export default en;
