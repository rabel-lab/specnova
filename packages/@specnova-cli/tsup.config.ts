import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI
  {
    entry: ['src/bin/index.ts'],
    format: ['esm'],
    sourcemap: true,
    shims: true,
    clean: false,
    minify: true,
    treeshake: true,
    outDir: 'dist/bin',
    external: ['@rabel-lab/specnova'],
    target: 'es2022',
  },
]);
