import { defineCliInstaller } from '@/bin/installers/base';
import { getUserConfig } from '@/config/resolved';
export default defineCliInstaller({
  name: 'generate',
  description: 'Generate the SDK based on the adapter.',
  async action() {
    const config = await getUserConfig();
    await config.generate();
  },
});
