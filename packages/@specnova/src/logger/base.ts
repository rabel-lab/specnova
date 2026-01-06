/* Allow pinoConsole.log for logger only */

import { loadSafeEnvConfig } from '@/config/env';
import { __SpecnovaErrorImpl } from '@/errors/base';
import { createTranslation, I18nTranslations, Translator } from '@/translator';

import chalk from 'chalk';
import { find } from 'node-emoji';
import pino from 'pino';

/* Extact types */
type LoggerTranslations = I18nTranslations<'logger'>;
type LoggerTranslationsKeys = keyof LoggerTranslations;

/* @internal */
export type LoggerTranslator<TK extends LoggerTranslationsKeys> = Translator<'logger', TK>;

type ErrorMessageOptions = {
  verbose?: boolean;
  fatal?: boolean;
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

function withEmoji(key: keyof typeof writerLevel) {
  return writerLevel[key];
}

function formatTranslation<TK extends LoggerTranslationsKeys>(
  key: TK,
  formatter: LoggerTranslator<TK>,
) {
  const emoji = withEmoji(key);
  const { translations } = createTranslation('logger', key);
  return `${emoji}${formatter(translations)}`;
}

function formatError(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
  const emoji = withEmoji(options?.fatal ? 'error' : 'warn');
  const col = options?.fatal ? chalk.red : chalk.yellow;
  const header = `${emoji}${error.header}`;
  let message = [col(header), chalk.black(error.message)];
  if (options?.verbose && error.stack) {
    message.push(chalk.dim(withPadding(error.stack)));
  }
  return message.join(' → ');
}

async function createLogger() {
  const env = await loadSafeEnvConfig();
  const isDevelopment = env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  return pino({
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    serializers: {
      err: (error: __SpecnovaErrorImpl<any>) => {
        return {
          type: error.type,
          error: !error.cause
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : undefined,
          cause: error.cause
            ? {
                name: error.cause.name,
                caster: error.casterName,
                message: error.cause.message,
                stack: error.cause.stack,
              }
            : undefined,
        };
      },
    },
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss:ms',
          },
        }
      : undefined,
    // Disable in tests
    enabled: !isTest,
  });
}

export class Logger {
  logger = createLogger();
  constructor() {}
  async debug(...args: any[]) {
    const length = args.length;
    if (length === 1) {
      (await this.logger).debug(args[0]);
    } else {
      (await this.logger).debug(args);
    }
  }
  async seed(formatter: LoggerTranslator<'seed'>) {
    (await this.logger).info(formatTranslation('seed', formatter));
  }
  async config(formatter: LoggerTranslator<'config'>) {
    (await this.logger).info(formatTranslation('config', formatter));
  }
  async success(formatter: LoggerTranslator<'success'>) {
    (await this.logger).info(formatTranslation('success', formatter));
  }
  async warn(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    if (options?.verbose) {
      (await this.logger).warn({ err: error }, formatError(error, { ...options, fatal: false }));
    } else {
      (await this.logger).warn(formatError(error, { ...options, fatal: false, verbose: false }));
    }
  }
  async error(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    (await this.logger).error(
      { err: error },
      formatError(error, { fatal: error.fatal, ...options }),
    );
  }
}
