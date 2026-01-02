import { __ErrorTranslation, __SpecnovaErrorImpl, __SpecnovaErrorOptions } from '@/errors/base';
export class SpecnovaSnapshotError extends __SpecnovaErrorImpl<'snapshot'> {
  constructor(l: __ErrorTranslation<'snapshot'>, options?: __SpecnovaErrorOptions) {
    super('snapshot', l, options);
  }
}
