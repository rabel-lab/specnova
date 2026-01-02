#!/usr/bin/env node

import installFetch from '@/bin/installers/fetch';
import installGenerate from '@/bin/installers/generate';
import installInit from '@/bin/installers/init';
import installLookup from '@/bin/installers/lookup';
import installPull from '@/bin/installers/pull';
import installSet from '@/bin/installers/set';
import logger from '@/logger';
import { NpmPackage } from '@/npm';

import { Command } from 'commander';

const program = new Command();
program.name('specnova').description('SpecNova CLI').version(NpmPackage.getPackage().version);

// Installers
installInit(program);
installFetch(program);
installPull(program);
installLookup(program);
installGenerate(program);
installSet(program);

// start process
try {
  program.parse(process.argv);
} catch (e) {
  // handle error
  logger.error(e);
  process.exit(1);
}
