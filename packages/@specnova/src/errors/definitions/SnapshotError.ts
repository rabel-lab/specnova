import { __SpecnovaErrorImpl, __SpecnovaErrorOptions, ErrorTranslator } from '@/errors/base';
export class SpecnovaSnapshotError extends __SpecnovaErrorImpl<'snapshot'> {
  constructor(l: ErrorTranslator<'snapshot'>, options?: __SpecnovaErrorOptions) {
    super('snapshot', l, options);
  }
}
