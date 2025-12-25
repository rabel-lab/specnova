import { zodWithTransformativeCheckSchema } from '@/types/utils';

import semverTool from 'semver';
import z from 'zod';

export const semver = zodWithTransformativeCheckSchema(
  z.string(),
  [
    (val) => {
      return { success: true, result: val.trim() };
    },
    (val) => {
      const coerced = semverTool.coerce(val) as semverTool.SemVer;
      const pass = semverTool.valid(coerced);
      if (pass && coerced) {
        return { success: true, result: coerced.format() };
      } else {
        return { success: false, error: { message: 'Invalid semver version' } };
      }
    },
  ],
  (val) => Boolean(semverTool.valid(val)),
);

export type Semver = z.infer<typeof semver>;
