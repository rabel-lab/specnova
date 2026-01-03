import { __SpecnovaErrorImpl, __SpecnovaErrorOptions, ErrorTranslator } from '@/errors/base';
export class SpecnovaExtracterError extends __SpecnovaErrorImpl<'extracter'> {
  constructor(l: ErrorTranslator<'extracter'>, options?: __SpecnovaErrorOptions) {
    super('extracter', l, options);
  }
}
