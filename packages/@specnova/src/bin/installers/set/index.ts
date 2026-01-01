import { defineCliInstaller } from '@/bin/installers/base';
import logger from '@/logger';
export default defineCliInstaller({
  name: 'set',
  description: 'Set the branch target to a semver version.',
  async action() {
    logger.info('🚧 Coming soon');
  },
});
