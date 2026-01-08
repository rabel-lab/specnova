import { actionPermissionOverwrite } from '@/bin/actions/permission';
import {
  actionSnapshotBranchCreate,
  actionSnapshotBranchGather,
  actionSnapshotBranchSet,
  actionSnapshotBranchSwitch,
} from '@/bin/actions/snapshot/branch';
import { defineCliInstaller } from '@/bin/installers/base';

import { Snapshot } from '@rabel-lab/specnova';
export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    //# Check if we have a specnova config
    const snapshot = new Snapshot();
    //# Check branches info
    const branches = await actionSnapshotBranchGather(snapshot);
    //# Inquire
    if (branches.length > 0) {
      //-> If branches, switch to one of them
      //# Permission
      await actionPermissionOverwrite();
      //# Switch
      await actionSnapshotBranchSwitch(snapshot, branches);
    } else {
      //-> If no branches, create first source
      await actionSnapshotBranchCreate(snapshot);
    }
    //# Set Main
    await actionSnapshotBranchSet(snapshot);
  },
});
