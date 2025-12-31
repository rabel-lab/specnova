import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaParserError extends __SpecnovaErrorImpl<'parser', Error> {
  constructor(l: __ErrorTranslation<'parser'>, error?: Error) {
    super('parser', l, error);
  }
}
