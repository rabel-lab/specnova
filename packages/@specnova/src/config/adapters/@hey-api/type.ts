import { OpenapiGenConfig } from '@/config/type';

import type { DefinePlugin } from '@hey-api/openapi-ts';

export const heyApiPluginName = '@openapiGen/core' as const;
export type HeyApiUserConfig = {
  name: typeof heyApiPluginName;
} & Partial<OpenapiGenConfig>;

export type HeyApiPlugin = DefinePlugin<HeyApiUserConfig>;
