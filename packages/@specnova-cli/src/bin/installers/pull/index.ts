import { defineCliInstaller } from '@/bin/installers/base';

import { Snapshot } from '@rabel-lab/specnova';

export default defineCliInstaller({
  name: 'pull',
  description: 'Download the latest version of the Spec origin & update the target branch.',
  async action() {
    const snapshot = await new Snapshot().loadBranch();
    snapshot.prepareAllAndCommit();
    snapshot.setMain();
    return (await snapshot.getSpecnovaSource()).info.version;
  },
});
