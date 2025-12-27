// This file is manually created & edited for typesafe-i18n
/* eslint-disable */
import type { Formatters, Locales } from '@/i18n/i18n-types';
import type { FormattersInitializer } from 'typesafe-i18n';

import zodFormatter from '@/i18n/formatters/zod';

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
  const formatters: Formatters = {
    ...zodFormatter,
  };

  return formatters;
};
