import { defineCliInstaller } from '@/bin/installers/base';

import { logger } from '@rabel-lab/specnova';
import { Snapshot } from '@rabel-lab/specnova';

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
