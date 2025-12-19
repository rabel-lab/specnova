import { BaseAdapter } from '@/config/adapters/base';
import { DefaultAdapter } from '@/config/adapters/defaultAdapter';
import { defaultSpecnovaGenConfig } from '@/config/default';
import { loadEnvConfig } from '@/config/env';
import { ResolvedSpecnovaConfig, SpecnovaConfig } from '@/config/type';
import { mergeWithDefaults } from '@/config/utils';

import { join as pathJoin } from 'path';

type Adapter = BaseAdapter;

export type UserConfigOptions = {
  adapter?: Adapter;
  config?: Partial<SpecnovaConfig>;
};

export class UserConfig {
  private isLoaded = false;
  public readonly adapter: Adapter;
  private resolved: Promise<ResolvedSpecnovaConfig> | ResolvedSpecnovaConfig;

  //-> Static Helpers
  static getConfigPath(subPath?: string): string {
    const path = subPath ? subPath : process.env.SPECNOVA_CONFIG_PATH;
    return pathJoin(process.cwd(), path ? path : '');
  }
  static getConfigFile(): string {
    return process.env.SPECNOVA_CONFIG_FILE ?? 'specnova.config';
  }
  //-> Load .Env
  private static async loadEnvConfig() {
    await loadEnvConfig();
  }
  constructor(options?: UserConfigOptions) {
    this.adapter = options?.adapter ?? new DefaultAdapter();
    this.resolved = mergeWithDefaults(defaultSpecnovaGenConfig, options?.config ?? {});
  }
  /** Ensure is loaded */
  private ensureLoaded() {
    if (!this.isLoaded) throw new Error('Config: config is not loaded');
    return this.isLoaded;
  }
  /**
   * Load config from adapters.
   * @returns - SpecnovaGenConfig
   */
  private async applyAdapter() {
    const adapter = this.adapter;
    if (!adapter) {
      return;
    }
    const transformer = await adapter.transform(await Promise.resolve(this.resolved));
    this.resolved = transformer;
  }
  /**
   * Load config from adapters.
   * @returns - SpecnovaGenConfig
   */
  public async load() {
    // load env config first & apply adapter
    await UserConfig.loadEnvConfig();
    await this.applyAdapter();
    this.isLoaded = true;
    return this;
  }
  /**
   * Get resolved config.
   * @returns - SpecnovaGenConfig
   */
  async getConfig(): Promise<ResolvedSpecnovaConfig> {
    this.ensureLoaded();
    return await Promise.resolve(this.resolved);
  }
  /**
   * Use adapters to generate SDK.
   * @Throws - Error
   */
  async generate() {
    this.ensureLoaded();
    return await this.adapter.generate();
  }
}
