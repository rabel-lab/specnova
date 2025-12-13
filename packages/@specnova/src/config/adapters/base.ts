// Adapter interface for external tool configs

import { ResolvedSpecnovaConfig } from '@/config/type';

export type BaseAdapterOptions = {
  name: string;
};

export type BaseAdapterOptionsWithFile = BaseAdapterOptions & {
  processor: (...args: any[]) => any;
};

export class BaseAdapter<T extends ResolvedSpecnovaConfig = ResolvedSpecnovaConfig> {
  public name: string | null = null;
  constructor(options?: BaseAdapterOptions) {
    if (!options) return;
    this.name = options.name;
  }
  async transform(externalConfig: T): Promise<T> {
    return externalConfig;
  }
}

export class FileAdapter<
  T extends ResolvedSpecnovaConfig = ResolvedSpecnovaConfig,
> extends BaseAdapter<T> {
  protected loader: (...args: any[]) => any = () => {};
  constructor(options?: BaseAdapterOptionsWithFile) {
    super(options);
    if (!options) return;
    this.loader = options.processor;
  }
  async transform(externalConfig: T): Promise<T> {
    return externalConfig;
  }
}
