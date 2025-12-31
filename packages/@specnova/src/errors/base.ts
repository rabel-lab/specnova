import L from '@/i18n/i18n-node';
import { BaseLocale, Locales } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';

import { LocalizedString } from 'typesafe-i18n';

/* Extact types */
type I18nErrorsTranslations = (typeof L)[BaseLocale]['errors'];
type ErrorTranslationsKeys = keyof I18nErrorsTranslations;
type ErrorTranslationsRoot<T extends ErrorTranslationsKeys> = I18nErrorsTranslations[T];
export type ErrorTranslation<T extends ErrorTranslationsKeys> = (
  translations: ErrorTranslationsRoot<T>,
) => LocalizedString;

/* Clean stack helper */
function cleanStack(message: string, stack?: string) {
  return stack?.split(message + '\n').pop();
}

/* Specnova Error namespace */
const ERROR_HANDLER_NAME = 'Specnova';
export default abstract class SpecnovaErrorBase<
  T extends ErrorTranslationsKeys,
  BaseError extends Error | never = never,
> extends Error {
  //# Public properties
  public readonly name = ERROR_HANDLER_NAME;
  public readonly type: T;
  public readonly header: string;
  public readonly cause?: BaseError;

  //# Private properties
  private readonly locale: Locales = detectLocale();
  private readonly getHeader = () => {
    return L[this.locale].errorsUtils.header({ name: this.name, type: this.type });
  };

  //# Constructor
  constructor(type: T, formatter: ErrorTranslation<T>, error?: BaseError) {
    const locale = detectLocale();
    const translations = L[locale].errors[type];
    const message = formatter(translations);
    super(message);
    this.type = type;
    this.locale = locale;
    this.header = this.getHeader();
    //-> Capture stack
    //IF error, use it
    if (error) {
      this.cause = error;
      this.stack = cleanStack(error.message, error.stack);
    } else if (typeof Error.captureStackTrace === 'function') {
      //IF captureStackTrace is available, use it
      Error.stackTraceLimit = 5;
      Error.captureStackTrace(this, this.constructor);
      this.stack = cleanStack(this.message, this.stack);
    } else {
      //IF not, create stack
      const newStack = new Error().stack ?? '';
      this.stack = cleanStack(newStack);
    }
  }
}
