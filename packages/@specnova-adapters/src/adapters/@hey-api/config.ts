import { handler } from '@/adapters/@hey-api/plugin';
import { HeyApiPlugin, heyApiPluginName } from '@/adapters/@hey-api/type';

import { definePluginConfig } from '@hey-api/openapi-ts';
import { defaultSpecnovaGenConfig } from '@specnova/core';

const defaultHeyApiConfig: HeyApiPlugin['Config'] = {
  name: heyApiPluginName,
  handler: handler,
  config: defaultSpecnovaGenConfig,
};

/**
 * Type helper for `my-plugin` plugin, returns {@link Plugin.Config} object
 */
export const defineSpecNovaHeyApiPlugin = definePluginConfig(defaultHeyApiConfig);
