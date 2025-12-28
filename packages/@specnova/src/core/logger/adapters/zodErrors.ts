import { LoggerErrorAdapter } from '@/core/logger/base';
import { isZodError, ZodError } from '@/i18n/formatters/zod';
import L from '@/i18n/i18n-node';

export default class ZodErrorAdapter extends LoggerErrorAdapter<ZodError> {
  public predicate(error: ZodError) {
    return isZodError(error);
  }
  public write(error: ZodError): string {
    const prettyfied = L.en.errors.zod.fromError(error);
    return `${L.en.errors.zod.label()} - \n ${prettyfied}`;
  }
}
