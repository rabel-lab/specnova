import { HeyApiPlugin, heyApiPluginName } from '@/adapters/@hey-api/type';

import type { ResolvedSpecnovaConfig, SpecnovaConfig } from '@specnova/core';
import { createLoader, mergeWithDefaults, UserConfig } from '@specnova/core';
import { BaseAdapterOptionsWithFile, FileAdapter } from '@specnova/core/adapters';
function isHeyApiPlugin(plugin: unknown): plugin is HeyApiPlugin['Config'] {
  return typeof plugin === 'object' && plugin !== null && (plugin as any).name === heyApiPluginName;
}

import { UserConfig as HeyApiUserConfig } from '@hey-api/openapi-ts';

export class HeyApiAdapater extends FileAdapter {
  name: string = heyApiPluginName;
  filePath: string = 'openapi-ts.config';
  loader = createLoader<HeyApiUserConfig>();
  constructor(options?: BaseAdapterOptionsWithFile) {
    super(options);
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
    const resolvedConfig = await this.loader({
      cwd: UserConfig.getConfigRootDir(),
      configFile: this.filePath,
      packageJson: true,
    }).then((res) => {
      return this.findConfig(res.config);
    });
    return mergeWithDefaults(externalConfig, resolvedConfig);
  }
}
