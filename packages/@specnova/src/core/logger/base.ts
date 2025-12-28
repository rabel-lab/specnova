import { find } from 'node-emoji';

const writerLevel = {
  seed: find(':seedling:'),
  config: find(':wrench:'),
  success: find(':sparkles:'),
  error: find(':x:'),
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
  async config(message: string) {
    console.log(writerLevel.config, message);
  }
  async success(message: string) {
    console.log(writerLevel.success, message);
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
    console.log(adapterResult);
  }
}
