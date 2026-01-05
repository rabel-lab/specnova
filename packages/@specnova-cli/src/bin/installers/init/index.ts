import { defineCliInstaller } from '@/bin/installers/base';
import { inquireInit } from '@/inquirers/init';

import { logger } from '@rabel-lab/specnova';

export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    let specnova = await inquireInit();
    logger.success((l) => l.cli.init.setupAlreadyExists());
    return '';
  },
});
