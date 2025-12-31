import { unimplimentedErrorCaster } from '@/errors/UnimplimentedError';
import { FormatterFunc } from '@/i18n/formatters';
import { L } from '@/i18n/i18n-node';

const error: FormatterFunc<'error'> = (error: unknown) => {
  if (!unimplimentedErrorCaster.isCastable(error)) {
    return L.en.errors.typesafe_i18n['invalid-formatter-param'];
  }
  return error.message;
};

export default error;
