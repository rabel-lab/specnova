/* Allow console.log for logger only */
/* eslint-disable no-console */

import { __SpecnovaErrorImpl } from '@/errors/base';
import { createTranslation, I18nTranslations, Translator } from '@/translator';

import chalk from 'chalk';
import { find } from 'node-emoji';

/* Extact types */
type LoggerTranslations = I18nTranslations<'logger'>;
type LoggerTranslationsKeys = keyof LoggerTranslations;

/* @internal */
export type LoggerTranslator<TK extends LoggerTranslationsKeys> = Translator<'logger', TK>;

type ErrorMessageOptions = {
  verbose?: boolean;
};

const writerLevel = {
  seed: find(':seedling:')?.emoji,
  config: find(':wrench:')?.emoji,
  success: find(':sparkles:')?.emoji,
  error: find(':x:')?.emoji,
  warn: find(':rotating_light:')?.emoji,
} as const;

const padding = 21;

function withPadding(message: string) {
  return message.padStart(padding);
}

function formatTranslation<TK extends LoggerTranslationsKeys>(
  key: TK,
  formatter: LoggerTranslator<TK>,
) {
  const { translations } = createTranslation('logger', key);
  return formatter(translations);
}

function formatError(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
  const col = error.fatal ? chalk.red : chalk.yellow;
  let message = [col(error.header), withPadding(error.message)];
  if (options?.verbose && error.stack) {
    message.push(chalk.dim(withPadding(error.stack)));
  }
  return message.join('\n');
}

export class Logger {
  constructor() {}

  async debug(...args: any[]) {
    console.debug(...args);
  }
  async seed(formatter: LoggerTranslator<'seed'>) {
    const message = formatTranslation('seed', formatter);
    console.info(writerLevel.seed, message);
  }
  async config(formatter: LoggerTranslator<'config'>) {
    const message = formatTranslation('config', formatter);
    console.info(writerLevel.config, message);
  }
  async success(formatter: LoggerTranslator<'success'>) {
    const message = formatTranslation('success', formatter);
    console.info(writerLevel.success, message);
  }
  async warn(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    const message = formatError(error, options);
    console.warn(writerLevel.warn, message);
  }
  async error(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    const message = formatError(error, options);
    console.error(writerLevel.error, message);
  }
}
