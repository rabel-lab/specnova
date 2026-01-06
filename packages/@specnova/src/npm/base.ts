import converter from '@/core/converter';
import { SpecnovaConfigError } from '@/errors';
import { Semver } from '@/types/semver';

import { readFileSync, writeFileSync } from 'fs';
import { resolve as path } from 'path';
import { z } from 'zod';

const specNovaPackageSchema = z.object({
  source: z.httpUrl(),
  branch: z
    .object({
      target: z.string(),
    })
    .catch({
      target: '',
    }),
});

export type SpecnovaPackage = z.infer<typeof specNovaPackageSchema>;

type PackageJson = {
  version: Semver;
  specnova: SpecnovaPackage;
};

export class Package {
  static PKG_PATH = path(process.cwd(), 'package.json');
  private packageJson: PackageJson;

  private get(): PackageJson {
    const text = readFileSync(Package.PKG_PATH, 'utf8');
    const pkg = converter.fromText<PackageJson>(text, 'json');
    return { ...pkg };
  }

  constructor() {
    this.packageJson = this.get();
  }

  async edit(values: Partial<SpecnovaPackage>) {
    const pkg = this.packageJson;
    // Merge values
    pkg.specnova = specNovaPackageSchema.parse({
      ...values,
    });
    writeFileSync(Package.PKG_PATH, converter.fromJson(pkg, true), 'utf8');
    this.packageJson = pkg;
  }

  async getSpecnova() {
    const pkg = this.packageJson;
    const parsedPkg = specNovaPackageSchema.safeParse(pkg.specnova);
    if (parsedPkg.success === false) {
      throw new SpecnovaConfigError((l) => l.npm.package.missingOrInvalid(), {
        error: parsedPkg.error,
      });
    } else {
      return pkg['specnova'];
    }
  }
}
