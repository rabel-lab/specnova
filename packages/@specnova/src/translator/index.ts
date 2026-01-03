import L from '@/i18n/i18n-node';
import { BaseLocale, Locales } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';

import { LocalizedString } from 'typesafe-i18n';

/* Extact types */
type I18nKeys = keyof (typeof L)[BaseLocale];
export type I18nTranslations<K extends I18nKeys> = Readonly<(typeof L)[BaseLocale][K]>;
export type I18nTranslationKey<K extends I18nKeys> = keyof I18nTranslations<K>;

type TranslationRoot<
  K extends I18nKeys,
  TK extends I18nTranslationKey<K>,
> = I18nTranslations<K>[TK];

type Translations<K extends I18nKeys, TK extends I18nTranslationKey<K>> = {
  locale: Locales;
  translations: TranslationRoot<K, TK>;
};

/* @internal */
export type Translator<K extends I18nKeys, TK extends I18nTranslationKey<K>> = (
  l: TranslationRoot<K, TK>,
) => LocalizedString;

/* @internal */
export function createTranslation<K extends I18nKeys, TK extends I18nTranslationKey<K>>(
  root: K,
  type: TK,
): Translations<K, TK> {
  const locale = detectLocale();
  return {
    locale,
    translations: L[locale][root][type],
  };
}
