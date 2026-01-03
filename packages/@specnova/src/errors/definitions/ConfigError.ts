import { __SpecnovaErrorImpl, __SpecnovaErrorOptions, ErrorTranslator } from '@/errors/base';
export class SpecnovaConfigError extends __SpecnovaErrorImpl<'config'> {
  constructor(l: ErrorTranslator<'config'>, options?: __SpecnovaErrorOptions) {
    super('config', l, options);
  }
}
