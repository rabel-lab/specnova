import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
export class SpecnovaParserError extends __SpecnovaErrorImpl<'parser'> {
  constructor(l: __ErrorTranslation<'parser'>, options?: __SpecnovaErrorOptions) {
    super('parser', l, options);
  }
}
