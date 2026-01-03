import { __SpecnovaErrorImpl, __SpecnovaErrorOptions, ErrorTranslator } from '@/errors/base';
export class SpecnovaParserError extends __SpecnovaErrorImpl<'parser'> {
  constructor(l: ErrorTranslator<'parser'>, options?: __SpecnovaErrorOptions) {
    super('parser', l, options);
  }
}
