import { defineCliInstaller } from '@/bin/installers/base';

import { logger } from '@rabel-lab/specnova';
import { Snapshot } from '@rabel-lab/specnova';

export default defineCliInstaller({
  name: 'lookup',
  description: 'Lookup information on the source and target branch.',
  async action() {
    const snapshot = new Snapshot();
    const test = await snapshot.loadBranch();
    test.getSpecnovaSource();
    const branchSnapshot = test.getMeta()?.get();
    const sourceSnapshot = (await snapshot.loadSource()).getMeta()?.get();
    const branchVersion = branchSnapshot?.info.version;
    const sourceVersion = sourceSnapshot?.info.version;
    if (branchVersion === sourceVersion) {
      logger.success((l) => l.cli.lookup.upToDate());
      return false;
    }
    logger.success((l) => l.cli.lookup.updateAvailable(branchVersion, sourceVersion));
    return true;
  },
});
