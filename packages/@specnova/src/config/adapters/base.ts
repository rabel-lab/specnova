// Adapter interface for external tool configs

import { UserConfig } from '@/config/base';
import { createLoader } from '@/config/loader';
import { ResolvedSpecnovaConfig } from '@/config/type';

import { UserInputConfig } from 'c12';

type FilePathFunc = (config: ResolvedSpecnovaConfig) => string;

function isFilePathFunc(filePath: string | FilePathFunc): filePath is FilePathFunc {
  return typeof filePath === 'function';
}

export abstract class BaseAdapter {
  public abstract readonly name: string;
  abstract transform(externalConfig: ResolvedSpecnovaConfig): Promise<ResolvedSpecnovaConfig>;
  abstract generate(): Promise<void>;
  constructor() {}
}

export abstract class FileAdapter<L extends UserInputConfig = UserInputConfig> extends BaseAdapter {
  protected abstract filePath: string | FilePathFunc;
  private loader = createLoader<L>();
  constructor() {
    super();
  }
  private getConfigFile(externalConfig: ResolvedSpecnovaConfig): string {
    return isFilePathFunc(this.filePath) ? this.filePath(externalConfig) : this.filePath;
  }
  protected async load(externalConfig: ResolvedSpecnovaConfig): Promise<L> {
    const configFile = this.getConfigFile(externalConfig);
    const loaderResult = await this.loader({
      cwd: UserConfig.getConfigPath(),
      configFile: configFile,
      packageJson: true,
    });
    return loaderResult.config;
  }
}
