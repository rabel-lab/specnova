import type { DefinePlugin } from '@hey-api/openapi-ts';
import { SpecnovaConfig } from '@specnova/core/config';

export const heyApiPluginName = '@specnova' as const;
export type HeyApiUserConfig = {
  name: typeof heyApiPluginName;
} & Partial<SpecnovaConfig>;

export type HeyApiPlugin = DefinePlugin<HeyApiUserConfig>;
