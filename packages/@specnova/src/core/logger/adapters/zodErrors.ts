import { LoggerErrorAdapter } from '@/core/logger/base';
import { SpecnovaZodError } from '@/errors/ZodError';

export default class ZodLoggerAdapter extends LoggerErrorAdapter {
  caster = SpecnovaZodError.prototype;
}
