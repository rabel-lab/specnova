import { defineCliInstaller } from '@/bin/installers/base';

import { getUserConfig } from '@rabel-lab/specnova/config';

export default defineCliInstaller({
  name: 'generate',
  description: 'Generate the SDK based on the adapter.',
  async action() {
    const config = await getUserConfig();
    await config.generate();
  },
});
