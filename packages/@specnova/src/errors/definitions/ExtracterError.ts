import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaExtracterError extends __SpecnovaErrorImpl<'extracter'> {
  constructor(l: __ErrorTranslation<'extracter'>, error?: Error) {
    super('extracter', l, error);
  }
}
