import { input } from '@inquirer/prompts';
import { logger, Package, SpecnovaPackage } from '@rabel-lab/specnova';
import { catchError } from '@rabel-lab/specnova/errors';

async function trySpecnova(pkg: Package) {
  let specnova: SpecnovaPackage | null = null;
  try {
    const trySpecnova = await pkg.getSpecnova();
    specnova = trySpecnova;
    if (specnova) {
      //-> exit if we have a specnova config
      return specnova;
    }
  } catch (e) {
    //-> IF, no specnova config
    // Notify & continue for further
    await catchError(e, { safe: true });
  }
  return null;
}

const DEMO_URL =
  'https://raw.githubusercontent.com/OAI/learn.openapis.org/refs/heads/main/examples/v3.0/api-with-examples.json';

export async function inquireInit(): Promise<{
  prev: SpecnovaPackage | null;
  next: SpecnovaPackage;
}> {
  //-> Check if we have a specnova config
  const pkg = new Package();
  const prev = await trySpecnova(pkg);
  // -> await reading input
  await new Promise((resolve) => setTimeout(resolve, 50));
  const specnova: Partial<SpecnovaPackage> = {
    source: await input({
      message: 'What is your openapi source url?',
      default: prev?.source ?? DEMO_URL,
    }),
  };
  logger.debug(specnova);
  const next = await pkg.edit(specnova);
  return {
    prev,
    next,
  };
}
