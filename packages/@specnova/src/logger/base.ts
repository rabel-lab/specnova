/* Allow console.log for logger only */
/* eslint-disable no-console */
import { __SpecnovaErrorImpl } from '@/errors/base';
import { errorCasters } from '@/errors/caster';
import { SpecnovaUnimplementedError } from '@/errors/definitions/UnimplimentedError';

import chalk from 'chalk';
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
  async error(error: Error | unknown) {
    let adapterResult: __SpecnovaErrorImpl<any> | null = null;
    //-> if instance of SpecnovaError, use it
    console.log('ERROR CALLED');
    if (error instanceof __SpecnovaErrorImpl) {
      console.log('FOUND ERROR');
      adapterResult = error;
    } else {
      //-> apply casters
      console.log('APPLY CASTERS');
      for (const caster of errorCasters) {
        if (caster.isCastable(error)) {
          adapterResult = caster.cast(error);
          break;
        }
      }
      //-> if no adapter found, throw unkown error
      adapterResult ||= adapterResult ??= new SpecnovaUnimplementedError(error);
    }
    const message = [
      chalk.red(adapterResult.header),
      adapterResult.message,
      chalk.dim(adapterResult.stack),
    ];
    console.error(message.join('\n'));
  }
}
