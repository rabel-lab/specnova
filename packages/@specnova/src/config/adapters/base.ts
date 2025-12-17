// Adapter interface for external tool configs

import { ResolvedSpecnovaConfig } from '@/config/type';

export type BaseAdapterOptions = {
  name: string;
};

export type BaseAdapterOptionsWithFile = BaseAdapterOptions & {
  loader: (...args: any[]) => any;
  generator: (...args: any[]) => any;
};

export class BaseAdapter<T extends ResolvedSpecnovaConfig = ResolvedSpecnovaConfig> {
  protected loader: (...args: any[]) => any = () => {};
  protected generator: (...args: any[]) => any = () => {};
  public name: string | null = null;
  constructor(options?: BaseAdapterOptions) {
    if (!options) return;
    this.name = options.name;
  }
  async transform(externalConfig: T): Promise<T> {
    return externalConfig;
  }
  async generate(): Promise<void> {
    throw new Error('Adapter: generate is not implemented');
  }
}

export class FileAdapter<
  T extends ResolvedSpecnovaConfig = ResolvedSpecnovaConfig,
> extends BaseAdapter<T> {
  constructor(options?: BaseAdapterOptionsWithFile) {
    super(options);
    if (!options) return;
    this.loader = options.loader;
    this.generator = options.generator;
  }
  async transform(externalConfig: T): Promise<T> {
    return externalConfig;
  }
  async generate(): Promise<void> {
    throw new Error('Adapter: generate is not implemented');
  }
}
