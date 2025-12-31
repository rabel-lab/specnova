import __SpecnovaErrorImpl, { __ErrorTranslation } from '@/errors/base';

export class SpecnovaReferenceError extends __SpecnovaErrorImpl<'reference', Error> {
  constructor(l: __ErrorTranslation<'reference'>, error?: Error) {
    super('reference', l, error);
  }
}
