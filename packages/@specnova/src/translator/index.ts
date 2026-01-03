import L from '@/i18n/i18n-node';
import { BaseLocale, Locales } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';

import { LocalizedString } from 'typesafe-i18n';

/* Extact types */
type I18nKeys = keyof (typeof L)[BaseLocale];
export type I18nTranslations<K extends I18nKeys> = Readonly<(typeof L)[BaseLocale][K]>;
export type ErrorTranslationsKeys<K extends I18nKeys> = keyof I18nTranslations<K>;

type ErrorTranslationRoot<
  K extends I18nKeys,
  TK extends ErrorTranslationsKeys<K>,
> = I18nTranslations<K>[TK];

/* @internal */
export type __ErrorTranslation<K extends I18nKeys, TK extends ErrorTranslationsKeys<K>> = (
  l: ErrorTranslationRoot<K, TK>,
) => LocalizedString;

type Translations<K extends I18nKeys, TK extends ErrorTranslationsKeys<K>> = {
  locale: Locales;
  translations: ErrorTranslationRoot<K, TK>;
};

export function createTranslation<K extends I18nKeys, TK extends ErrorTranslationsKeys<K>>(
  root: K,
  type: TK,
): Translations<K, TK> {
  const locale = detectLocale();
  return {
    locale,
    translations: L[locale][root][type],
  };
}
