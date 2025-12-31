// This file required `PNPM run dev` to generate
import { BaseTranslation } from '@/i18n/i18n-types';

const en: BaseTranslation = {
  errorsUtils: {
    header: '[{name:string}]{type:string|capitalize}:',
  },
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
      noHandlerFound: 'No handler found.',
      failedToExecute: 'Failed to execute "{name:string}" command for element "{element:string}."',
      refractor: {
        noRefractorFound: 'No refractor found.',
      },
    },
    unimplimented: {
      unknownError: 'Unknown error',
      fromError: '{0:error|error}',
    },
    typesafe_i18n: {
      'invalid-formatter-param': '\{\{i18n_invalid_param\}\}',
    },
    config: {
      notLoaded: 'Configuration is not loaded.',
      adapter: {
        generateNotImplemented: 'Generation is not implemented',
      },
    },
    extracter: {
      noHandlerFound: 'No handler found.',
    },
    zod: {
      fromError: '{0|zodPrettifiedError}',
    },
  },
};

export default en;
