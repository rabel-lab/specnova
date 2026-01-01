import { BaseAdapter } from '@/config/adapters/base';
import { StarterAdapter } from '@/config/adapters/starterAdapter';
import { defaultSpecnovaGenConfig } from '@/config/default';
import { Env, loadSafeEnvConfig } from '@/config/env';
import { ResolvedSpecnovaConfig, SpecnovaConfig } from '@/config/type';
import { SpecnovaConfigError } from '@/errors/definitions/ConfigError';

export type UserConfigOptions = {
  adapter?: BaseAdapter;
  config?: Partial<SpecnovaConfig>;
};

export class UserConfig {
  private isLoaded = false;
  public readonly adapter: BaseAdapter;
  private env: Env | null = null;
  private resolvedSpecnovaConfig: ResolvedSpecnovaConfig;

  //# Static getters
  public static async getEnv(): Promise<Env> {
    return await loadSafeEnvConfig();
  }

  //# Lazy load .Env
  private async getEnv() {
    if (this.env) return this.env;
    this.env = await loadSafeEnvConfig();
    return this.env;
  }

  //# Getters
  public getConfigPath(): string {
    this.ensureLoaded();
    return this.env!.SPECNOVA_CONFIG_PATH;
  }
  public getConfigFile(): string {
    this.ensureLoaded();
    return this.env!.SPECNOVA_CONFIG_FILE;
  }

  //# Constructor
  constructor() {
    this.adapter = new StarterAdapter();
    this.resolvedSpecnovaConfig = defaultSpecnovaGenConfig;
  }

  //# Functions
  /** Ensure is loaded */
  private ensureLoaded() {
    if (!this.isLoaded || !this.env) throw new SpecnovaConfigError((l) => l.notLoaded());
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
    const transformer = await adapter.transform(await Promise.resolve(this.resolvedSpecnovaConfig));
    this.resolvedSpecnovaConfig = transformer;
  }
  /**
   * Load config from adapters.
   * @returns - SpecnovaGenConfig
   */
  public async load() {
    // load env config first & apply adapter
    await this.getEnv();
    await this.applyAdapter();
    this.isLoaded = true;
    return this;
  }
  /**
   * Get resolved config.
   * @returns - SpecnovaGenConfig
   */
  async getSpecnovaConfig(): Promise<ResolvedSpecnovaConfig> {
    this.ensureLoaded();
    return await Promise.resolve(this.resolvedSpecnovaConfig);
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
