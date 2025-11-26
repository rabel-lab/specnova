import { resolve as path } from 'path';

export const PKG_PATH = path(process.cwd(), 'package.json');
export const SNAPSHOTS_DIR = path(process.cwd(), 'snapshots');
