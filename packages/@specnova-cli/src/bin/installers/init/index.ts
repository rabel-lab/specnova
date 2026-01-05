import { defineCliInstaller } from '@/bin/installers/base';
import { inquireInit } from '@/inquirers/init';

export default defineCliInstaller({
  name: 'init',
  description: 'Start a new snapshot branch.',
  async action() {
    let specnova = await inquireInit();
    return '';
  },
});
