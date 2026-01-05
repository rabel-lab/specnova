import { FormatterFunc } from '@/i18n/formatters';

import { CommanderError } from 'commander';

const printCommanderError: FormatterFunc<'printCommanderError'> = (error: CommanderError) => {
  return `${error.message}`;
};

export default printCommanderError;
