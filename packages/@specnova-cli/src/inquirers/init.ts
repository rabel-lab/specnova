import { Package, SpecnovaPackage } from '@rabel-lab/specnova';
import { catchError } from '@rabel-lab/specnova/errors';

export async function inquireInit() {
  //-> Check if we have a specnova config
  const pkg = new Package();
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
    catchError(e, { safe: true });
    catchError(e, { safe: true });
    catchError(e, { safe: true });
  }
  //-> Apply result
  /* await pkg.edit({
    source: await input({ message: 'What is your openapi source url?' }),
  });*/
}
