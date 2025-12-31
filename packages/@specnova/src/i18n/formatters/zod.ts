import { zodErrorCaster } from '@/errors/ZodError';
import { FormatterFunc } from '@/i18n/formatters';
import { L } from '@/i18n/i18n-node';

import { prettifyError } from 'zod/v4/core';

const zodPrettifiedError: FormatterFunc<'zodPrettifiedError'> = (error: unknown) => {
  if (!zodErrorCaster.isCastable(error)) {
    return L.en.errors.typesafe_i18n['invalid-formatter-param'];
  }
  return prettifyError(error);
};

export default zodPrettifiedError;
