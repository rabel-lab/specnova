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
function cleanStack(message: string, stack?: string) {
  return stack?.split(message + '\n').pop();
}

/* Specnova Error namespace */
const ERROR_HANDLER_NAME = 'Specnova';
/* @internal */
export function isSpecnovaError(e: unknown): e is __SpecnovaErrorImpl<any> {
  return e instanceof Error && e.name === ERROR_HANDLER_NAME && (e as any)?.type;
}

function getHeader(specnovaError: __SpecnovaErrorImpl<any>, locale: Locales) {
  return L[locale].errorsUtils.header({
    name: specnovaError.name,
    type: specnovaError.type,
  });
}

/* @internal */
export abstract class __SpecnovaErrorImpl<TK extends ErrorTranslationsKeys> extends Error {
  //# Public properties
  public readonly name: string;
  public readonly type: TK;
  public readonly header: string;
  public readonly cause?: Error;
  public readonly casterName?: string;
  public readonly fatal: boolean = true;

  //# Private properties
  private readonly locale: Locales = detectLocale();

  //# Constructor
  constructor(type: TK, formatter: ErrorTranslator<TK>, options: __SpecnovaErrorOptions = {}) {
    //-> continue
    const { translations, locale } = createTranslation('errors', type);
    const message = formatter(translations);
    super(message);
    this.name = ERROR_HANDLER_NAME;
    this.type = type;
    this.locale = locale;
    this.casterName = options.casterName;
    this.fatal = options.fatal ?? true;
    this.header = getHeader(this, this.locale);
    //-> Capture stack
    //IF error, use it
    if (options.error && options.error instanceof Error) {
      this.cause = options.error;
      this.cause = {
        name: options.error.name,
        message: options.error.message,
        stack: cleanStack(options.error.message, options.error.stack),
      };
      this.stack = cleanStack(options.error.message, options.error.stack);
    } else if (typeof Error.captureStackTrace === 'function') {
      //IF captureStackTrace is available, use it
      Error.stackTraceLimit = 5;
      Error.captureStackTrace(this, this.constructor);
      this.stack = cleanStack(this.message, this.stack);
    } else {
      //IF not, create stack
      const newStack = new Error();
      this.stack = cleanStack(newStack.message, newStack.stack);
    }
    return this;
  }
}
