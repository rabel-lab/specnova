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
  const isTest = env.NODE_ENV === 'test';
  const logLevel = env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');
  const logger = pino({
    level: logLevel,
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
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss:ms',
      },
    },
    // Disable in tests
    enabled: !isTest,
  });
  return {
    logger,
    defaultSettings: {
      level: logLevel,
    },
  };
}

export class Logger {
  private pino;
  constructor() {
    this.pino = createLogger();
  }
  private async getLogger() {
    return (await this.pino).logger;
  }
  private async getDefaultSettings() {
    return (await this.pino).defaultSettings;
  }
  async debug(...args: any[]) {
    const length = args.length;
    if (length === 1) {
      (await this.getLogger()).debug(args[0]);
    } else {
      (await this.getLogger()).debug(args);
    }
  }
  async seed(formatter: LoggerTranslator<'seed'>) {
    (await this.getLogger()).info(formatTranslation('seed', formatter));
  }
  async config(formatter: LoggerTranslator<'config'>) {
    (await this.getLogger()).info(formatTranslation('config', formatter));
  }
  async success(formatter: LoggerTranslator<'success'>) {
    (await this.getLogger()).info(formatTranslation('success', formatter));
  }
  async warn(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    if (options?.verbose) {
      (await this.getLogger()).warn(
        { err: error },
        formatError(error, { ...options, fatal: false }),
      );
    } else {
      (await this.getLogger()).warn(
        formatError(error, { ...options, fatal: false, verbose: false }),
      );
    }
  }
  async error(error: __SpecnovaErrorImpl<any>, options?: ErrorMessageOptions) {
    if (error.fatal) {
      (await this.getLogger()).fatal(
        { err: error },
        formatError(error, { fatal: error.fatal, ...options }),
      );
    } else {
      (await this.getLogger()).error(formatError(error, { ...options, fatal: error.fatal }));
    }
  }
  async mute() {
    (await this.getLogger()).trace('mute');
    (await this.getLogger()).level = 'silent';
    // Await to sync the flush
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  async unmute() {
    (await this.getLogger()).trace('unmute');
    (await this.getLogger()).level = 'info';
  }
}
