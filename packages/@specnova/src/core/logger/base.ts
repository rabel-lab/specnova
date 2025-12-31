/* Allow console.log for logger only */
/* eslint-disable no-console */
import __SpecnovaErrorImpl from '@/errors/base';
import { errorCasters } from '@/errors/caster';
import { SpecnovaUnimplementedError } from '@/errors/UnimplimentedError';

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
  async debug(message: string) {
    console.debug(message);
  }
  async seed(message: string) {
    console.info(writerLevel.seed, message);
  }
  async config(...args: string[]) {
    console.info(writerLevel.config, ...args);
  }
  async success(message: string) {
    console.info(writerLevel.success, message);
  }
  async warn(message: string) {
    console.warn(writerLevel.warn, message);
  }
  async error(error: Error | unknown) {
    console.log(error);
    let adapterResult: __SpecnovaErrorImpl<any, any> | undefined;
    //-> apply casters
    for (const caster of errorCasters) {
      if (caster.isCastable(error)) {
        adapterResult = caster.cast(error);
      }
    }
    //-> if no adapter found, throw unkown error
    if (!adapterResult) {
      adapterResult = new SpecnovaUnimplementedError();
    }
    const message = [
      chalk.red(adapterResult.header),
      adapterResult.message,
      chalk.dim(adapterResult.stack),
    ];
    console.error(message.join('\n'));
  }
}
