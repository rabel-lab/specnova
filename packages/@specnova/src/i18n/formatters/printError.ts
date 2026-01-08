import { FormatterFunc } from '@/i18n/formatters';

const error: FormatterFunc<'printError'> = (error: Error) => {
  return error.message;
};

export default error;
