import L from '@/i18n/i18n-node';
import { BaseLocale } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';

import { LocalizedString } from 'typesafe-i18n';

/* Extact types */
type I18nErrorsTranslations = (typeof L)[BaseLocale]['errors'];
type ErrorTranslationsKeys = keyof I18nErrorsTranslations;
type ErrorTranslationsRoot<T extends ErrorTranslationsKeys> = I18nErrorsTranslations[T];
export type ErrorTranslation<T extends ErrorTranslationsKeys> = (
  translations: ErrorTranslationsRoot<T>,
) => LocalizedString;

/* Specnova Error */
export class SpecnovaError<T extends ErrorTranslationsKeys> extends Error {
  public readonly name = 'SpecnovaError';
  public readonly type: T;

  constructor(type: T, formatter: ErrorTranslation<T>) {
    const locale = detectLocale();
    const translations = L[locale].errors[type];
    const message = formatter(translations);
    super(message);

    this.type = type;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }
}
