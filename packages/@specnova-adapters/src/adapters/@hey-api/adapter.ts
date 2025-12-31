import { HeyApiPlugin, heyApiPluginName } from '@/adapters/@hey-api/type';

import { FileAdapter } from '@rabel-lab/specnova/adapters';
import type { ResolvedSpecnovaConfig, SpecnovaConfig } from '@rabel-lab/specnova/config';
import { mergeWithDefaults } from '@rabel-lab/specnova/config';
import { SpecnovaConfig } from '@rabel-lab/specnova/config';
function isHeyApiPlugin(plugin: unknown): plugin is HeyApiPlugin['Config'] {
  return typeof plugin === 'object' && plugin !== null && (plugin as any).name === heyApiPluginName;
}

import { UserConfig as HeyApiUserConfig } from '@hey-api/openapi-ts';

export class HeyApiAdapater extends FileAdapter<HeyApiUserConfig> {
  name = heyApiPluginName;
  filePath: string = 'openapi-ts.config';
  constructor() {
    super();
  }
  private findConfig(config: HeyApiUserConfig): Partial<SpecnovaConfig> {
    const { plugins } = config;
    let pluginConfig: Partial<SpecnovaConfig> = {};
    plugins?.forEach((p) => {
      if (isHeyApiPlugin(p)) {
        pluginConfig = p.config;
      }
    });
    return pluginConfig;
  }
  async transform(externalConfig: ResolvedSpecnovaConfig): Promise<ResolvedSpecnovaConfig> {
    //!TODO - Ensure adapter is loaded
    const resolvedConfig = this.findConfig(await this.load());
    return mergeWithDefaults(externalConfig, resolvedConfig);
  }
  async generate() {
    throw new SpecnovaError();
  }
}
