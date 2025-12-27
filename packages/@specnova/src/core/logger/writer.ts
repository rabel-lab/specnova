import { find } from 'node-emoji';

const writerLevel = {
  seed: find(':seedling:'),
  config: find(':wrench:'),
  success: find(':sparkles:'),
  error: find(':x:'),
} as const;

export abstract class LoggerErrorAdapter<TE extends any> {
  public abstract predicate(error: TE): boolean;
  public abstract write(error: TE): string;
}

export class Logger {
  // private specnovaConfig = getResolvedSpecnovaConfig();
  private errorAdapters: LoggerErrorAdapter<any>[] = [];

  constructor() {}
  async info(message: string) {
    console.log(message);
  }

  async registerErrorAdapter(...errorAdapter: LoggerErrorAdapter<any>[]) {
    this.errorAdapters.push(...errorAdapter);
  }

  async seed(message: string) {
    console.log(writerLevel.seed, message);
  }
  async config(message: string) {
    console.log(writerLevel.config, message);
  }
  async success(message: string) {
    console.log(writerLevel.success, message);
  }
  async error(error: Error) {
    let adapterResult: string | null = null;
    for (const key in this.errorAdapters) {
      const adapter = this.errorAdapters[key];
      if (adapter.predicate(error)) {
        adapterResult = adapter.write(error);
        break;
      }
    }
    //-> return adapter result
    if (adapterResult) {
      return adapterResult;
    } else {
      //-> cast default error
      return error.message;
    }
  }
}
