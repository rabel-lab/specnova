import { UserConfig } from '@/config/base';
import { ResolvedSpecnovaConfig } from '@/config/type';

let userConfig: UserConfig | undefined;
let resolvedConfig: ResolvedSpecnovaConfig | undefined;

export async function getUserConfig() {
  if (!userConfig) {
    userConfig = await new UserConfig().load();
  }
  return userConfig;
}

export async function getResolvedConfig() {
  const userConfig = await getUserConfig();
  if (!resolvedConfig) {
    resolvedConfig = await userConfig.getConfig();
  }
  return resolvedConfig;
}
