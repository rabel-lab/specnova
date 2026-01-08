import { zodWithTransformativeCheckSchema } from '@/types/utils';

import { resolve } from 'path';
import { z } from 'zod';

const SAFE_PATH_REGEX =
  /^(?!.*(?:^|\/)\.(?:\/|$))(?!.*\.\.)[\/]?([A-Za-z0-9-_+@.]+\/)*([A-Za-z0-9-_+@.]+)$/;
const SAFE_FILE_REGEX = /^([A-z0-9-_+\.]+(.{0,7}))$/;

function resolveRelativeSafePath(path: string) {
  const localPath = resolve(process.cwd());
  const resolved = resolve(localPath, path);
  if (!resolved.startsWith(localPath)) {
    return null;
  }
  return resolved;
}

function resolveSafeFile(file: string) {
  const resolved = resolve(file);
  // resolve then cut (Ensure user input safety)
  const fileName = resolved.split('/').pop();
  if (!fileName) {
    return null;
  }
  return fileName;
}

export const relativePathSchema = zodWithTransformativeCheckSchema(z.string(), [
  (val) => {
    return { success: true, result: val.trim() };
  },
  (val) => {
    const path = resolve(val);
    const pass = SAFE_PATH_REGEX.test(path);
    // Resolve path and check if it's relative
    let result = pass ? resolveRelativeSafePath(path) : null;
    if (result) {
      return { success: true, result };
    } else {
      return { success: false, error: { message: 'Invalid relative path' } };
    }
  },
]);

export type RelativePath = z.infer<typeof relativePathSchema>;

const baseFile = z.string().check(z.refine((val) => SAFE_FILE_REGEX.test(val), 'Invalid file'));

export const configFileExtensionEnum = z.enum(['config'] as const);
export const configFileSchema = zodWithTransformativeCheckSchema(baseFile, [
  (val) => {
    return { success: true, result: val.trim() };
  },
  (val) => {
    const pass = configFileExtensionEnum.safeParse(val.split('.').pop() ?? '').success;
    // Resolve path and check if file is safe
    const result = pass ? resolveSafeFile(val) : null;
    if (result) {
      return { success: true, result };
    } else {
      return { success: false, error: { message: 'Invalid config file' } };
    }
  },
]);

export type ConfigFile = z.infer<typeof configFileSchema>;
export type ConfigFileExtension = z.infer<typeof configFileExtensionEnum>;

export const snapshotFileExtensionEnum = z.enum(['yaml', 'yml', 'json', 'infer'] as const);
export const strictSnapshotFileEnum = snapshotFileExtensionEnum.exclude(['infer']);
export const snapshotFileSchema = zodWithTransformativeCheckSchema(baseFile, [
  (val) => {
    return { success: true, result: val.trim() };
  },
  (val) => {
    const pass = strictSnapshotFileEnum.safeParse(val.split('.').pop() ?? '').success;
    // Resolve path and check if file is safe
    const result = pass ? resolveSafeFile(val) : null;
    if (result) {
      return { success: true, result };
    } else {
      return { success: false, error: { message: 'Invalid snapshot file' } };
    }
  },
]);

export type SnapshotFile = z.infer<typeof snapshotFileSchema>;
export type StrictSnapshotFile = z.infer<typeof strictSnapshotFileEnum>;
export type SnapshotFileExtension = z.infer<typeof snapshotFileExtensionEnum>;
