import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI
  {
    entry: ['src/bin/index.ts'],
    format: ['esm'],
    sourcemap: true,
    shims: true,
    clean: false,
    outDir: 'dist/bin',
    external: ['@rabel-lab/specnova'],
    target: 'es2022',
  },
  // Dev-only build
  {
    entry: ['src/**.config.ts'],
    format: ['esm'],
    sourcemap: true,
    clean: false,
    outDir: 'dist/dev',
    external: ['@rabel-lab/specnova'],
    target: 'es2022',
  },
]);
