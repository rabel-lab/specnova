// eslint-disable-next-line no-restricted-imports
import { BaseTranslation } from '../../i18n-types';

const en_logger: BaseTranslation = {
  seed: {},
  config: {
    extracting: 'Extracting OpenAPI spec from source.',
  },
  success: {
    cli: {
      init: {
        changedSource: 'Source changed: {0:string} → {1:string}.',
        newSource: 'Source started at: {0:string}.',
      },
      lookup: {
        upToDate: 'Local patch is up to date.',
        updateAvailable: 'Update available: {0:string} → {1:string}.',
      },
    },
    snapshot: {
      submit: 'Applied changes to {0:string}.',
    },
    core: {
      parser: {
        noNormalization: 'No normalization settings found.',
      },
      reference: {
        parse: 'Parsed spec.',
      },
    },
  },
};

export default en_logger;
