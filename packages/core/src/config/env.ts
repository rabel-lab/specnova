import { mergeWithDefaults } from '@/config/utils';

import { loadConfig } from 'c12';

type EnvConfig = {
  SPECNOVA_CONFIG_PATH?: string;
};

function withProcess(): Required<EnvConfig> {
  return {
    SPECNOVA_CONFIG_PATH: process.env.SPECNOVA_CONFIG_PATH ?? '',
  };
}
export async function loadEnvConfig(): Promise<Required<EnvConfig>> {
  const dotenv = (await loadConfig({
    cwd: process.cwd(),
    dotenv: {
      fileName: [
        '.env',
        '.env.local',
        '.env.dev',
        '.env.prod',
        '.env.development',
        '.env.production',
      ],
    },
  })) as EnvConfig;
  return mergeWithDefaults(withProcess(), dotenv);
}
