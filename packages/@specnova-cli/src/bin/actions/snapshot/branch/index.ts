import { logger, Snapshot } from '@rabel-lab/specnova';
import { catchError } from '@rabel-lab/specnova/errors';
import { tasks } from '@rabel-lab/specnova/tasks';

/**
 * Gather the snapshot branches.
 * @param snapshot - The snapshot.
 * @returns - The list of branches.
 */
export async function actionSnapshotBranchGather(snapshot: Snapshot) {
  try {
    return await snapshot.getBranches();
  } catch (e) {
    catchError(e, { safe: true });
  }
  return [];
}

/**
 * Switch the snapshot branch.
 * @param snapshot - The snapshot.
 * @param branches - The list of branches.
 */
export async function actionSnapshotBranchSwitch(snapshot: Snapshot, branches: string[]) {
  const newBranch = await tasks.select((l) => l.branches(), {
    name: 'init',
    input: branches,
  });
  //-> unmute & load
  await snapshot.loadVersion(newBranch);
}

/**
 * Create a new snapshot branch.
 * @param snapshot - The snapshot.
 */
export async function actionSnapshotBranchCreate(snapshot: Snapshot) {
  const newSource = await tasks.input((l) => l.newSource(), {
    name: 'init',
  });
  //-> unmute & load
  await logger.unmute();
  await snapshot.loadUrl(newSource);
  await snapshot.prepareAllAndCommit();
}

/**
 * Set the snapshot branch.
 * @param snapshot - The snapshot.
 */
export async function actionSnapshotBranchSet(snapshot: Snapshot) {
  const { prev, next } = await snapshot.setBranch();
  //# Inform
  if (prev.source && prev.branch.target) {
    await logger.success((l) => l.cli.init.changedSource(prev.branch.target, next.branch.target));
  } else {
    await logger.success((l) => l.cli.init.newSource(next.branch.target));
  }
}
