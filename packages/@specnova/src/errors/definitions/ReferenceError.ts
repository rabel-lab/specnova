import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaReferenceError extends __SpecnovaErrorImpl<'reference'> {
  constructor(l: __ErrorTranslation<'reference'>, error?: Error) {
    super('reference', l, error);
  }
}
