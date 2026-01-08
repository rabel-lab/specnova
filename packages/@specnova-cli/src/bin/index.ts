#!/usr/bin/env node

import installFetch from '@/bin/installers/fetch';
import installGenerate from '@/bin/installers/generate';
import installInit from '@/bin/installers/init';
import installLookup from '@/bin/installers/lookup';
import installSet from '@/bin/installers/set';

import { Command } from 'commander';

import { catchError } from '@rabel-lab/specnova/errors';

const program = new Command();

program.name('specnova').description('SpecNova CLI');

// Installers
installInit(program);
installFetch(program);
installLookup(program);
installGenerate(program);
installSet(program);

// start process
try {
  await program.parseAsync(process.argv);
} catch (err) {
  catchError(err, { exit: 1 });
}
