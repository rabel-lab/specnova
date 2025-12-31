import __SpecnovaErrorImpl, { __ErrorTranslation } from '@/errors/base';

export class SpecnovaConfigError extends __SpecnovaErrorImpl<'config', Error> {
  constructor(l: __ErrorTranslation<'config'>, error?: Error) {
    super('config', l, error);
  }
}
