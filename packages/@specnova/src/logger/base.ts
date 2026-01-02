/* Allow console.log for logger only */
/* eslint-disable no-console */

import { catchError } from '@/errors/catch';

import { find } from 'node-emoji';

const writerLevel = {
  seed: find(':seedling:')?.emoji,
  config: find(':wrench:')?.emoji,
  success: find(':sparkles:')?.emoji,
  error: find(':x:')?.emoji,
  warn: find(':rotating_light:')?.emoji,
} as const;

export class Logger {
  async debug(...args: any[]) {
    console.debug(...args);
  }
  async seed(...args: any[]) {
    console.info(writerLevel.seed, ...args);
  }
  async config(...args: any[]) {
    console.info(writerLevel.config, ...args);
  }
  async success(...args: any[]) {
    console.info(writerLevel.success, ...args);
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
