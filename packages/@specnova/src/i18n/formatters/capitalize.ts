import { FormatterFunc } from '@/i18n/formatters';

const capitalize: FormatterFunc<'capitalize'> = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default capitalize;
