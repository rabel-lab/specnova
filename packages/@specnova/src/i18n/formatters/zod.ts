import { FormatterFunc } from '@/i18n/formatters';

import { ZodError } from 'zod';
import { prettifyError } from 'zod/v4/core';

const zodPrettifiedError: FormatterFunc<'printZodError'> = (error: ZodError) => {
  return prettifyError(error);
};

export default zodPrettifiedError;
