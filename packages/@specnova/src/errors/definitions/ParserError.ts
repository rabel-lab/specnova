import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaParserError extends __SpecnovaErrorImpl<'parser'> {
  constructor(l: __ErrorTranslation<'parser'>, error?: Error) {
    super('parser', l, error);
  }
}
