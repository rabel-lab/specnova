import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'], // LIBRARY
    format: ['esm'],
    dts: true,
    clean: true,
  },
  {
    entry: ['src/bin/cli.ts'], // CLI
    format: ['esm'], // CommonJS for Node CLI
    sourcemap: true,
    shims: true,
    clean: false,
    external: [
      'commander', // <-- mark commander external
    ],
  },
]);
