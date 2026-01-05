import L from '@/i18n/i18n-node';
import { Locales } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';
import { createTranslation, I18nTranslations, Translator } from '@/translator';

/* Extact types */
type ErrorsTranslations = I18nTranslations<'errors'>;
type ErrorTranslationsKeys = keyof ErrorsTranslations;

/* @internal */
export type ErrorTranslator<TK extends ErrorTranslationsKeys> = Translator<'errors', TK>;

/* @internal */
export type __SpecnovaErrorOptions = {
  error?: Error | unknown;
  casterName?: string;
  fatal?: boolean;
};

/* Clean stack helper */
/*function cleanStack(message: string, stack?: string) {
  return stack?.split(message + '\n').pop();
}*/

/* Specnova Error namespace */
const ERROR_HANDLER_NAME = 'Specnova';

/* @internal */
export abstract class __SpecnovaErrorImpl<TK extends ErrorTranslationsKeys> extends Error {
  //# Public properties
  public readonly name = ERROR_HANDLER_NAME;
  public readonly type: TK;
  public readonly header: string;
  public readonly cause?: Error;
  public readonly casterName?: string;
  public readonly fatal: boolean = true;

  //# Private properties
  private readonly locale: Locales = detectLocale();
  private readonly getHeader = () => {
    return L[this.locale].errorsUtils.header({ name: this.name, type: this.type });
  };

  //# Constructor
  constructor(type: TK, formatter: ErrorTranslator<TK>, options: __SpecnovaErrorOptions = {}) {
    const { translations, locale } = createTranslation('errors', type);
    const message = formatter(translations);
    super(message);
    this.type = type;
    this.locale = locale;
    this.header = this.getHeader();
    this.casterName = options.casterName;
    this.fatal = options.fatal ?? true;
    //-> Capture stack
    //IF error, use it
    if (options.error && options.error instanceof Error) {
      this.cause = options.error;
      this.stack = options.error.stack;
    } else if (typeof Error.captureStackTrace === 'function') {
      //IF captureStackTrace is available, use it
      Error.stackTraceLimit = 5;
      Error.captureStackTrace(this, this.constructor);
    } else {
      //IF not, create stack
      const newStack = new Error().stack ?? '';
      this.stack = newStack;
    }
    return this;
  }
}
