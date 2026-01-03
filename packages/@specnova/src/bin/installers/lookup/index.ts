import { defineCliInstaller } from '@/bin/installers/base';
import { Snapshot } from '@/core';
import logger from '@/logger';

export default defineCliInstaller({
  name: 'lookup',
  description: 'Lookup the spec origin.',
  async action() {
    const branchSnapshot = await (await new Snapshot().loadBranch()).getSpecnovaSource();
    const sourceSnapshot = await (await new Snapshot().loadSource()).getSpecnovaSource();
    const branchVersion = branchSnapshot.info.version;
    const sourceVersion = sourceSnapshot.info.version;

    if (branchVersion === sourceVersion) {
      logger.success((l) => l.cli.lookup.upToDate());
      return false;
    }
    logger.success((l) => l.cli.lookup.updateAvailable(branchVersion, sourceVersion));
    return true;
  },
});
