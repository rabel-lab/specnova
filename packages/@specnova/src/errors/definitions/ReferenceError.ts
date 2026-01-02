import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
export class SpecnovaReferenceError extends __SpecnovaErrorImpl<'reference'> {
  constructor(l: __ErrorTranslation<'reference'>, options?: __SpecnovaErrorOptions) {
    super('reference', l, options);
  }
}
