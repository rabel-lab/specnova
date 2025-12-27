import i18n from '@/i18n/i18n-node';
import type { Formatters } from '@/i18n/i18n-types';

import z from 'zod';
import { $ZodError, $ZodIssue } from 'zod/v4/core';

export type ZodIssueBase = $ZodError;
export type ZodIssueParam = Omit<keyof ZodIssueBase, 'input'>;
type ZodIssuesCode = $ZodIssue['code'];
export type ZodIssuesCodeMessage = Record<ZodIssuesCode, string>;

function isZodIssue(value: any): value is ZodIssue {
  if (typeof value !== 'object') return false;
  return 'code' in value && 'message' in value;
}

export const zodIssueSchema = z
  .object({
    code: z.custom<ZodIssuesCode>().optional(),
    message: z.string(),
    input: z.string().optional(),
    path: z.array(z.string()).optional(),
  })
  .refine(isZodIssue, { message: 'Invalid ZodIssue' });

type ZodIssue = z.infer<typeof zodIssueSchema>;

function zodPathToString(path: ZodIssue['path']) {
  return path?.map((p) => p.toString()).join('.') ?? '';
}

function zodCodeToString(code: ZodIssuesCode) {
  return i18n.en.errors.zod.codes[code];
}

function getZodParam(issue: ZodIssue, param: ZodIssueParam) {
  const parsed = zodIssueSchema.safeParse(issue);
  if (!parsed.success) {
    return null;
  }
  switch (param) {
    case 'code':
      if (!parsed.data.code) return null;
      if (parsed.data.code === 'custom') return parsed.data.message;
      return zodCodeToString(parsed.data.code);
    case 'message':
      return parsed.data.message;
    case 'path':
      return zodPathToString(parsed.data.path);
  }
}

export default {
  zodErrorCode: (issue: ZodIssue) => getZodParam(issue, 'code'),
  zodErrorMessage: (issue: ZodIssue) => getZodParam(issue, 'message'),
  zodErrorPath: (issue: ZodIssue) => getZodParam(issue, 'path'),
} satisfies Formatters;
