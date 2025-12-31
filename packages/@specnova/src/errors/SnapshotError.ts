import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaSnapshotError extends __SpecnovaErrorImpl<'snapshot', Error> {
  constructor(l: __ErrorTranslation<'snapshot'>, error?: Error) {
    super('snapshot', l, error);
  }
}
