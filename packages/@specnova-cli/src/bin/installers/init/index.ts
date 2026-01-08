import { defineCliInstaller } from '@/bin/installers/base';

import { logger, Snapshot } from '@rabel-lab/specnova';
import { catchError, SpecnovaCliError } from '@rabel-lab/specnova/errors';
import { tasks } from '@rabel-lab/specnova/tasks';
export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    //# Check if we have a specnova config
    const snapshot = new Snapshot();
    //# Check gather branches info
    let branches: string[] = [];
    try {
      branches = await snapshot.getBranches();
    } catch (e) {
      catchError(e, { safe: true });
    }
    //# Inquire
    //-> If branches, list them
    await logger.mute();
    if (branches.length > 0) {
      await tasks.allow((l) => l.overwriteSettings(), {
        name: 'init',
        onExit() {
          //# Leave if not allowed to overwrite
          throw new SpecnovaCliError((l) => l.init.cantOverwrite(), { fatal: false });
        },
        onError(error) {
          //# Leave if not allowed to overwrite
          throw new SpecnovaCliError((l) => l.init.cantOverwrite(), { fatal: false, error });
        },
        onDone(value) {
          if (value === false) {
            throw new SpecnovaCliError((l) => l.init.cantOverwrite(), { fatal: false });
          }
        },
      });
      const newBranch = await tasks.select((l) => l.branches(), {
        name: 'init',
        input: branches,
      });
      //-> unmute & load
      await logger.unmute();
      await snapshot.loadVersion(newBranch);
    } else {
      //-> If no branches, create first source
      const newSource = await tasks.input((l) => l.newSource(), {
        name: 'init',
      });
      //-> unmute & load
      await logger.unmute();
      await snapshot.loadUrl(newSource);
      await snapshot.prepareAllAndCommit();
    }
    //# Set Main
    const { prev, next } = await snapshot.setBranch();
    //# Inform
    if (prev.source && prev.branch.target) {
      await logger.success((l) => l.cli.init.changedSource(prev.branch.target, next.branch.target));
    } else {
      await logger.success((l) => l.cli.init.newSource(next.branch.target));
    }
  },
});
