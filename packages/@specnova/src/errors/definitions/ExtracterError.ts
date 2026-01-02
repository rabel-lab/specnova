import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
export class SpecnovaExtracterError extends __SpecnovaErrorImpl<'extracter'> {
  constructor(l: __ErrorTranslation<'extracter'>, options?: __SpecnovaErrorOptions) {
    super('extracter', l, options);
  }
}
