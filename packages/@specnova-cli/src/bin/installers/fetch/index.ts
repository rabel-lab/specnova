import { defineCliInstaller } from '@/bin/installers/base';

import { Snapshot } from '@rabel-lab/specnova';

export default defineCliInstaller({
  name: 'fetch',
  description: 'Snapshot the latest version.',
  async action() {
    const snapshot = await new Snapshot().loadBranch();
    snapshot.prepareAllAndCommit();
    return (await snapshot.getSpecnovaSource()).info.version;
  },
});
