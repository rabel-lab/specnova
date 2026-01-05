// This file required `PNPM run dev` to generate
import { BaseTranslation } from '@/i18n/i18n-types';

const en: BaseTranslation = {
  // Logger
  logger: {
    seed: {},
    config: {
      extracting: 'Extracting OpenAPI spec from source.',
    },
    success: {
      cli: {
        init: {
          setupAlreadyExists: 'Setup already exists in package.json.',
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
  },
  // Errors
  errors: {
    snapshot: {
      meta: {
        notFound: 'Snapshot meta not found.',
        notLocked: 'Snapshot meta is not locked.',
        notUnlocked: 'Snapshot meta is not unlocked.',
        invalidDigest: 'Invalid digester key.',
        missmatch: 'The snapshot meta does not match.',
        failedToCreate: 'Failed to create snapshot meta.',
        failedToLoad: 'Failed to load snapshot meta.',
      },
      source: {
        notFound: 'Source not found.',
        internalFailedToLoad: 'Specnova source must be loaded from a meta file.',
      },
      failedToSave: 'Failed to save {0:string}{0:stringArray}.',
    },
    reference: {
      parse: {
        failedToParse: 'Failed to parse source.',
        invalidFileExtension:
          'Invalid file extension. Supported extensions: {extension:stringArray}.',
        noResult: 'No result found.',
      },
    },
    parser: {
      unknownCommand: 'Unknown command.',
      noHandlerFound: 'No {0:string} handler found.',
      failedToExecute: 'Failed to execute "{name:string}" command for element "{element:string}."',
      refractor: {
        noRefractorFound: 'No refractor found.',
      },
    },
    unimplimented: {
      unknownError: 'Unknown error',
      fromError: '{0:error|printError}',
    },
    typesafe_i18n: {
      'invalid-formatter-param': '\{\{i18n_invalid_param\}\}',
    },
    config: {
      notLoaded: 'Configuration is not loaded.',
      adapter: {
        generateNotImplemented: 'Generation is not implemented',
      },
      npm: {
        package: {
          missingOrInvalid: 'Setting is missing or invalid in package.json.',
        },
      },
    },
    extracter: {
      noHandlerFound: 'No handler found.',
    },
    zod: {
      fromError: '{0:zodError|printZodError}',
    },
    cli: {
      fromError: '{0:commanderError|printCommanderError}',
    },
  },
  errorsUtils: {
    header: '[{name:string}]{type:string|capitalize}',
  },
};

export default en;
