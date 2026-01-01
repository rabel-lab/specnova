// This file is manually created & edited for typesafe-i18n
/* eslint-disable */
import type { Formatters, Locales } from '@/i18n/i18n-types';
import type { FormattersInitializer } from 'typesafe-i18n';
import printError from '@/i18n/formatters/printError';
import printZodError from '@/i18n/formatters/zod';
import capitalize from '@/i18n/formatters/capitalize';

type FormattersKey = keyof Formatters;
export type FormatterFunc<K extends FormattersKey> = Formatters[K];

export const initFormatters: FormattersInitializer<Locales, Formatters> = () => {
  const formatters: Formatters = {
    printZodError,
    printError,
    capitalize,
  };
  return formatters;
};
