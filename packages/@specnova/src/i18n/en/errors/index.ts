// eslint-disable-next-line no-restricted-imports
import { BaseTranslation } from '../../i18n-types';

const en_errors: BaseTranslation = {
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
      invalidUrl: 'Invalid url.',
      internalFailedToLoad: 'Specnova source must be loaded from a meta file.',
    },
    branch: {
      invalid: 'Invalid branch {0:string}.',
    },
    failedToSave: 'Failed to save {0:string}{0:stringArray}.',
  },
  reference: {
    parse: {
      failedToBuildParser: 'Failed to build parser.',
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
    permission: {
      cantOverwrite: 'Branch overwrite is not allowed.',
    },
    missing: {
      branch: 'No bran{{ch|ches}} found.',
    },
    init: {},
  },
};

export default en_errors;
