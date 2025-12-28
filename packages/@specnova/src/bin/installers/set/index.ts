import { defineCliInstaller } from '@/bin/installers/base';
import logger from '@/core/logger';
export default defineCliInstaller({
  name: 'set',
  description: 'Set the branch target to a semver version.',
  async action() {
    logger.info('🚧 Coming soon');
  },
});
