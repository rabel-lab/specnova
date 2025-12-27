import { ZodIssuesCodeMessage } from '@/i18n/formatters/zod';
import type { BaseTranslation } from '@/i18n/i18n-types';

const en = {
  errors: {
    zod: {
      codes: {
        custom: 'Custom error',
        invalid_type: 'Invalid type',
        too_big: 'Size is too big',
        too_small: 'Size is too small',
        invalid_format: 'Invalid format',
        not_multiple_of: 'Not a multiple of',
        unrecognized_keys: 'Keys are not recognized',
        invalid_union: 'Invalid union',
        invalid_key: 'Invalid key',
        invalid_element: 'Invalid element',
        invalid_value: 'Invalid value',
      } satisfies ZodIssuesCodeMessage,
    },
  },
} satisfies BaseTranslation;

export default en;
