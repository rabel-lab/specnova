import { __SpecnovaErrorImpl, __SpecnovaErrorOptions, ErrorTranslator } from '@/errors/base';
export class SpecnovaReferenceError extends __SpecnovaErrorImpl<'reference'> {
  constructor(l: ErrorTranslator<'reference'>, options?: __SpecnovaErrorOptions) {
    super('reference', l, options);
  }
}
