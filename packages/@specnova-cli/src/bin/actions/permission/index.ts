import { SpecnovaCliError } from '@rabel-lab/specnova/errors';
import { tasks } from '@rabel-lab/specnova/tasks';

/**
 * Ask for permission to overwrite the snapshot branch.
 */
export async function actionPermissionOverwrite() {
  await tasks.allow((l) => l.overwriteSettings(), {
    name: 'init',
    clearPromptOnDone: true,
    onExit() {
      throw new SpecnovaCliError((l) => l.permission.cantOverwrite(), { fatal: false });
    },
    onError(error) {
      throw new SpecnovaCliError((l) => l.permission.cantOverwrite(), { fatal: false, error });
    },
    onDone(value) {
      if (value === false) {
        throw new SpecnovaCliError((l) => l.permission.cantOverwrite(), { fatal: false });
      }
    },
  });
}
