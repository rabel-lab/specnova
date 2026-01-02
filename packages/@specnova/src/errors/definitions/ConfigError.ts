import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
export class SpecnovaConfigError extends __SpecnovaErrorImpl<'config'> {
  constructor(l: __ErrorTranslation<'config'>, options?: __SpecnovaErrorOptions) {
    super('config', l, options);
  }
}
