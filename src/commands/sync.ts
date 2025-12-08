import { parseSource } from '@/core';
import { infoExtracter } from '@/core/extracter';
import { NpmPackage } from '@/npm/base';

export async function syncPatch() {
  const { source: pkgOpenApiSource } = NpmPackage.getPackage().specnova;
  const openapiSource = await parseSource(pkgOpenApiSource);
  const { version } = infoExtracter.extract(openapiSource.parseResult);
  console.log(`🔀 Syncing patch for ${version}`);
  console.log(`🔧 Synced patch to ${version}`);
}

export async function syncVersion() {
  const pkg = new NpmPackage();
  const { version: pkgOpenApiVersion, source: pkgOpenApiSource } = NpmPackage.getPackage().specnova;
  const openapiSource = await parseSource(pkgOpenApiSource);
  const { version } = infoExtracter.extract(openapiSource.parseResult);
  console.log(`🔀 Syncing version for ${pkgOpenApiVersion} → ${version}`);
  pkg.editPackage({ version });
  console.log(`🔧 Synced version to ${version}`);
}
