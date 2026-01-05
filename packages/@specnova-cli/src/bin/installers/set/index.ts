import { defineCliInstaller } from '@/bin/installers/base';

import { logger } from '@rabel-lab/specnova';
export default defineCliInstaller({
  name: 'set',
  description: 'Set the branch target to a semver version.',
  async action() {
    logger.debug('🚧 Coming soon');
  },
});
