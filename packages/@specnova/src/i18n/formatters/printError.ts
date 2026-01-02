import { FormatterFunc } from '@/i18n/formatters';

import { CommanderError } from 'commander';

const printCommanderError: FormatterFunc<'printCommanderError'> = (error: CommanderError) => {
  return `E:${error.exitCode}T:${error.code}\n${error.message}`;
};

export default printCommanderError;
