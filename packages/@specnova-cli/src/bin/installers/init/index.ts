import { defineCliInstaller } from '@/bin/installers/base';
import { inquireInit } from '@/inquirers/init';

import { logger, Snapshot } from '@rabel-lab/specnova';
import { catchError, SpecnovaCliError } from '@rabel-lab/specnova/errors';

export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    //# Check if we have a specnova config
    const snapshot = new Snapshot();
    let prevSource: string | undefined;
    try {
      const prevMeta = (await snapshot.loadBranch()).getMeta()?.get();
      if (prevMeta) {
        prevSource = prevMeta.origin.source;
      }
    } catch (e) {
      await catchError(e, { safe: true });
    }
    //# Inquire
    const nextSource = await inquireInit(prevSource);
    //# Leave if no source
    if (!nextSource) {
      throw new SpecnovaCliError((l) => l.init.cantOverwrite(), { fatal: false });
    }
    //# Apply
    await snapshot.loadUrl(nextSource);
    await snapshot.prepareAllAndCommit();
    //# Set Main
    await snapshot.setMain();
    if (prevSource) {
      await logger.success((l) => l.cli.init.changedSource(prevSource, nextSource));
    } else {
      await logger.success((l) => l.cli.init.newSource(nextSource));
    }
  },
});
