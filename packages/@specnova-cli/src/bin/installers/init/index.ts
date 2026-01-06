import { defineCliInstaller } from '@/bin/installers/base';
import { inquireInit } from '@/inquirers/init';

import { logger } from '@rabel-lab/specnova';

export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    let { prev, next } = await inquireInit();
    if (prev?.source) {
      await logger.success((l) => l.cli.init.changedSource(prev.source, next.source));
    } else {
      await logger.success((l) => l.cli.init.newSource(next.source));
    }
  },
});
