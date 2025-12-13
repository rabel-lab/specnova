import { loadConfig, UserInputConfig } from 'c12';

export function createLoader<T extends UserInputConfig>() {
  return loadConfig<T>;
}
