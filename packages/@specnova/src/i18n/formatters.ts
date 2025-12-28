// This file is manually created & edited for typesafe-i18n
/* eslint-disable */
import type { Formatters, Locales } from '@/i18n/i18n-types';
import type { FormattersInitializer } from 'typesafe-i18n';

import { getZodPrettifiedError } from '@/i18n/formatters/zod';

export type FormatterFunc = (value: unknown) => unknown;

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
  const formatters: Formatters = {
    zodPrettifiedError: (value) => getZodPrettifiedError(value),
  };
  return formatters;
};
