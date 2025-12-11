// Adapter interface for external tool configs

import { ResolvedOpenapiGenConfig } from '@/config/type';

export type BaseAdapterOptions = {
  name: string;
};

export type BaseAdapterOptionsWithFile = BaseAdapterOptions & {
  processor: (...args: any[]) => any;
};

export class BaseAdapter<T extends ResolvedOpenapiGenConfig = ResolvedOpenapiGenConfig> {
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
  T extends ResolvedOpenapiGenConfig = ResolvedOpenapiGenConfig,
> extends BaseAdapter<T> {
  protected processor: (...args: any[]) => any = () => {};
  constructor(options?: BaseAdapterOptionsWithFile) {
    super(options);
    if (!options) return;
    this.processor = options.processor;
  }
  async transform(externalConfig: T): Promise<T> {
    return externalConfig;
  }
}
