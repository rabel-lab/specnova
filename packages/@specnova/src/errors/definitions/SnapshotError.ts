import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaSnapshotError extends __SpecnovaErrorImpl<'snapshot'> {
  constructor(l: __ErrorTranslation<'snapshot'>, error?: Error) {
    super('snapshot', l, error);
  }
}
