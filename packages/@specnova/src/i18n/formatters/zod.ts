import { FormatterFunc } from '@/i18n/formatters';
import { L } from '@/i18n/i18n-node';

import z from 'zod';
import { $ZodError } from 'zod/v4/core';
import { prettifyError } from 'zod/v4/core';

export type ZodError = $ZodError<any>;
type ZodErrorIssues = ZodError['issues'];
type ZodIssue = ZodErrorIssues[number];
type ZodIssuesCode = ZodIssue['code'];
export type ZodIssuesCodeMessage = Record<ZodIssuesCode, string>;

export function isZodError(value: any): value is ZodError {
  return value instanceof Error && value.name === 'ZodError';
}

export const zodIssueSchema = z
  .object({
    code: z.custom<ZodIssuesCode>().optional(),
    message: z.string(),
    input: z.string().optional(),
    path: z.array(z.string()).optional(),
  })
  .refine(isZodError, { message: 'Invalid ZodIssue' });

export const getZodPrettifiedError: FormatterFunc = (error) => {
  if (!isZodError(error)) {
    return L.en.errors.typesafe_i18n['invalid-formatter-param'];
  }
  return prettifyError(error);
};
