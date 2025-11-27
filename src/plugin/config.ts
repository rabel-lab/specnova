import { handler } from '@/plugin/plugin';
import { OpenapiGenPlugin } from '@/plugin/types';
import { definePluginConfig } from '@hey-api/openapi-ts';

export const defaultOpenapiGenConfig: OpenapiGenPlugin['Config'] = {
  name: '@openapiGen/core',
  dependencies: ['@hey-api/typescript'],
  config: {
    syncVersion: false,
    parser: {
      operationId: undefined,
      sort: undefined,
      filter: undefined,
      reject: undefined,
    },
  },
  handler,
};

export const defineOpenapiGenConfig = definePluginConfig(defaultOpenapiGenConfig);
