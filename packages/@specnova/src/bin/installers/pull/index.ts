import { defineCliInstaller } from '@/bin/installers/base';
import { Snapshot } from '@/core';

export default defineCliInstaller({
  name: 'pull',
  description: 'Download the latest version of the Spec origin & update the target branch.',
  async action() {
    const snapshot = await new Snapshot().loadBranch();
    snapshot.prepareAllAndCommit();
    snapshot.setBranch();
    return (await snapshot.getSpecnovaSource()).info.version;
  },
});
