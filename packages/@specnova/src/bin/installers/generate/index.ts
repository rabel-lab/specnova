import { defineCliInstaller } from '@/bin/installers/base';
import { UserConfig } from '@/config';
export default defineCliInstaller({
  name: 'generate',
  description: 'Generate the SDK based ont the adapter.',
  async action() {
    const config = await new UserConfig().load();
    await config.generate();
  },
});
