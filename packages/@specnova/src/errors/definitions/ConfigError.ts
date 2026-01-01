import { __ErrorTranslation, __SpecnovaErrorImpl } from '@/errors/base';
export class SpecnovaConfigError extends __SpecnovaErrorImpl<'config'> {
  constructor(l: __ErrorTranslation<'config'>, error?: Error) {
    super('config', l, error);
  }
}
