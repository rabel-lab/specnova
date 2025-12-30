import { SpecnovaError } from '@/errors/SpecnovaUnimplimentedError';
import { FormatterFunc } from '@/i18n/formatters';
import { L } from '@/i18n/i18n-node';

const error: FormatterFunc<'zodPrettifiedError'> = (error: unknown) => {
  if (!SpecnovaError.predicate(error)) {
    return L.en.errors.typesafe_i18n['invalid-formatter-param'];
  }
  return error.message;
};

export default error;
