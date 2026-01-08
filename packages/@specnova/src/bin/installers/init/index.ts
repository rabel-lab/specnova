import { defineCliInstaller } from '@/bin/installers/base';
import { Snapshot } from '@/core';

export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    const snapshot = await new Snapshot().loadSource();
    await snapshot.prepareAllAndCommit();
    await snapshot.setBranch();
    return (await snapshot.getSpecnovaSource()).info.version;
  },
});
