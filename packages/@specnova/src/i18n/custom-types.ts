import { CommanderError } from 'commander';
import { ZodError } from 'zod';

// use this file to export your custom types; these types will be imported by './i18n-types.ts'
export type error = Error;
export type zodError = ZodError;
export type commanderError = CommanderError;
export type stringArray = string[];
