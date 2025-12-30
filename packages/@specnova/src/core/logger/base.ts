import SpecnovaErrorImpl from '@/errors/base';
import { SpecnovaError } from '@/errors/SpecnovaUnimplimentedError';
import { SpecnovaZodError } from '@/errors/ZodError';

import chalk from 'chalk';
import { find } from 'node-emoji';

const writerLevel = {
  seed: find(':seedling:')?.emoji,
  config: find(':wrench:')?.emoji,
  success: find(':sparkles:')?.emoji,
  error: find(':x:')?.emoji,
  warn: find(':rotating_light:')?.emoji,
} as const;

type LoggerErrorCaster = new (error: unknown) => SpecnovaErrorImpl<any>;

abstract class LoggerCaster<C extends LoggerErrorCaster> {
  protected abstract caster: C;
  public abstract try(error: unknown): C;
}

export class Logger {
  private errorAdapters = [SpecnovaError, SpecnovaZodError];

  async info(message: string) {
    console.log(message);
  }
  async seed(message: string) {
    console.log(writerLevel.seed, message);
  }
  async config(...args: string[]) {
    console.log(writerLevel.config, ...args);
  }
  async success(message: string) {
    console.log(writerLevel.success, message);
  }
  async warn(message: string) {
    console.log(writerLevel.warn, message);
  }
  async error(error: Error) {
    console.log(error);
    let adapterResult;
    SpecnovaError.predicate(error);
    //-> apply specnova error if needed
    for (const key in this.errorAdapters) {
      const caster = this.errorAdapters[key];
      if (caster.predicate(error)) {
        adapterResult = new caster(error);
      }
    }
    //-> Fallback to default adapter
    if (!adapterResult) {
      adapterResult = new SpecnovaError(error);
    }

    const message = [
      chalk.red(adapterResult.header),
      adapterResult.message,
      chalk.dim(adapterResult.stack),
    ];
    console.error(message.join('\n'));
  }
}
