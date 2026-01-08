import { confirm, input } from '@inquirer/prompts';
import { logger, Snapshot } from '@rabel-lab/specnova';

const DEMO_URL =
  'https://raw.githubusercontent.com/OAI/learn.openapis.org/refs/heads/main/examples/v3.0/api-with-examples.json';

export async function inquireInit(prevSource?: string): Promise<string | null> {
  //# Ask for branch overwrite
  await logger.mute();
  let canOverwrite = false;
  if (prevSource) {
    canOverwrite = await confirm(
      {
        message: 'Do you want to overwrite the current source?',
      },
      {
        clearPromptOnDone: true,
      },
    );
  } else {
    //-> Else, create branch by default
    canOverwrite = true;
  }
  //# Exit
  if (!canOverwrite) {
    return null;
  }
  //# Ask for source
  const newSource: Snapshot['sourceUrl'] = await input(
    {
      message: `What is the new openapi source url?`,
      default: prevSource ?? DEMO_URL,
    },
    { clearPromptOnDone: true },
  );
  await logger.unmute();
  return newSource;
}
