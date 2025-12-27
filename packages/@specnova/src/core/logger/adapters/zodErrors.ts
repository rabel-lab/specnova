import { LoggerErrorAdapter } from '@/core/logger/writer';
import { ZodIssueBase, zodIssueSchema } from '@/i18n/formatters/zod';

import { prettifyError } from 'zod/v4/core';

export default class ZodErrorAdapter extends LoggerErrorAdapter<ZodIssueBase> {
  public predicate(error: ZodIssueBase) {
    const res = zodIssueSchema.safeParse(error);
    return res.success;
  }
  public write(error: ZodIssueBase): string {
    const prettified = prettifyError(error);
    return `{0|zodErrorCode} {0|zodErrorPath} \n ${prettified}`;
  }
}
