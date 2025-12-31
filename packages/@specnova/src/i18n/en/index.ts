import type { BaseTranslation } from '@/i18n/i18n-types';

const en = {
  errorsUtils: {
    header: '[{name:string}]{type:string|capitalize}:',
  },
  errors: {
    default: {
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
