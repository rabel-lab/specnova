import { defineCliInstaller } from '@/bin/installers/base';
import { Snapshot } from '@/core';
import logger from '@/core/logger';

export default defineCliInstaller({
  name: 'lookup',
  description: 'Lookup the spec origin.',
  async action() {
    const branchSnapshot = await (await new Snapshot().loadBranch()).getSpecnovaSource();
    const sourceSnapshot = await (await new Snapshot().loadSource()).getSpecnovaSource();
    const branchVersion = branchSnapshot.info.version;
    const sourceVersion = sourceSnapshot.info.version;

    if (branchVersion === sourceVersion) {
      logger.success('Local patch is up to date.');
      return false;
    }
    logger.warn(`Update available: ${branchVersion} → ${sourceVersion}`);
    return true;
  },
});
