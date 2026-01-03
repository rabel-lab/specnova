/* Allow console.log for logger only */
/* eslint-disable no-console */

import { catchError } from '@/errors/catch';
import { createTranslation, I18nTranslations, Translator } from '@/translator';

import { find } from 'node-emoji';

/* Extact types */
type LoggerTranslations = I18nTranslations<'logger'>;
type LoggerTranslationsKeys = keyof LoggerTranslations;

/* @internal */
export type LoggerTranslator<TK extends LoggerTranslationsKeys> = Translator<'logger', TK>;

const writerLevel = {
  seed: find(':seedling:')?.emoji,
  config: find(':wrench:')?.emoji,
  success: find(':sparkles:')?.emoji,
  error: find(':x:')?.emoji,
  warn: find(':rotating_light:')?.emoji,
} as const;

function formatMessage<TK extends LoggerTranslationsKeys>(
  key: TK,
  formatter: LoggerTranslator<TK>,
) {
  const { translations } = createTranslation('logger', key);
  return formatter(translations);
}

export class Logger {
  constructor() {}
  async debug(...args: any[]) {
    console.debug(...args);
  }
  async seed(formatter: LoggerTranslator<'seed'>) {
    const message = formatMessage('seed', formatter);
    console.info(message);
  }
  async config(formatter: LoggerTranslator<'config'>) {
    const message = formatMessage('config', formatter);
    console.info(message);
  }
  async success(formatter: LoggerTranslator<'success'>) {
    const message = formatMessage('success', formatter);
    console.info(message);
  }
  async warn(...args: any[]) {
    console.warn(writerLevel.warn, ...args);
  }
  async error(...args: any[]) {
    const error = args[0];
    if (error instanceof Error) {
      //-> recurse & disperse
      catchError(error);
    } else {
      //-> print error
      console.error(...args);
    }
  }
}
