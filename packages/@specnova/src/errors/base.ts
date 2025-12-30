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

/* Specnova Error */
const ERROR_HANDLER_NAME = 'Specnova';

export type SpecnovaErrorPredicate<T extends Error> = (error: T) => boolean;

function cleanStack(message: string, stack?: string) {
  return stack?.split(message + '\n').pop();
}

export default abstract class SpecnovaErrorImpl<
  T extends ErrorTranslationsKeys,
  BaseError extends Error | never = never,
> extends Error {
  public readonly name = ERROR_HANDLER_NAME;
  public readonly type: T;
  public readonly header: string;
  private readonly locale: Locales = detectLocale();

  protected readonly createHeader = () => {
    return L[this.locale].errorsUtils.header({ name: this.name, type: this.type });
  };

  public static readonly predicate: SpecnovaErrorPredicate<Error> = (
    error: unknown,
  ): error is typeof this => {
    if (error instanceof Error) {
      return error.name === this.name;
    }
    return false;
  };

  constructor(type: T, formatter: ErrorTranslation<T>, error?: BaseError) {
    const locale = detectLocale();
    const translations = L[locale].errors[type];
    const message = formatter(translations);
    super(message);
    this.type = type;
    this.locale = locale;
    this.header = this.createHeader();
    // Capture stack
    //# If has error use it
    if (error) {
      this.stack = cleanStack(error.message, error.stack);
    } else if (typeof Error.captureStackTrace === 'function') {
      //# If not, capture stack
      Error.stackTraceLimit = 5;
      Error.captureStackTrace(this, this.constructor);
      this.stack = cleanStack(this.message, this.stack);
    } else {
      // If not, create stack
      this.stack = new Error().stack;
    }
  }
}
