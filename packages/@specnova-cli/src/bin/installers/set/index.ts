import { actionPermissionOverwrite } from '@/bin/actions/permission';
import {
  actionSnapshotBranchGather,
  actionSnapshotBranchSet,
  actionSnapshotBranchSwitch,
} from '@/bin/actions/snapshot/branch';
import { defineCliInstaller } from '@/bin/installers/base';

import { Snapshot } from '@rabel-lab/specnova';
import { SpecnovaCliError } from '@rabel-lab/specnova/errors';

export default defineCliInstaller({
  name: 'set',
  description: 'Set the branch target to a semver version.',
  async action() {
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
      //# Set
      await actionSnapshotBranchSet(snapshot);
    } else {
      //-> Throw error
      throw new SpecnovaCliError((l) => l.missing.branch(1));
    }
  },
});
