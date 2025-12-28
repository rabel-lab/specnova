import { find } from 'node-emoji';

const writerLevel = {
  seed: find(':seedling:')?.emoji,
  config: find(':wrench:')?.emoji,
  success: find(':sparkles:')?.emoji,
  error: find(':x:')?.emoji,
  warn: find(':rotating_light:')?.emoji,
} as const;

export abstract class LoggerErrorAdapter<TE extends Error> {
  public abstract predicate(error: TE): boolean;
  public abstract write(error: TE): string;
}

export class Logger {
  // private specnovaConfig = getResolvedSpecnovaConfig();
  private errorAdapters: LoggerErrorAdapter<Error>[] = [];

  constructor() {}
  async info(message: string) {
    console.log(message);
  }

  async registerErrorAdapter(...errorAdapter: LoggerErrorAdapter<Error>[]) {
    this.errorAdapters.push(...errorAdapter);
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
    let adapterResult: string = error.message;
    //-> apply adapters if needed
    for (const key in this.errorAdapters) {
      const adapter = this.errorAdapters[key];
      if (adapter.predicate(error)) {
        adapterResult = adapter.write(error);
        break;
      }
    }
    console.log(writerLevel.error, adapterResult);
  }
}
