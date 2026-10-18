import translations from '@/lib/additional-languages.json';
export const additionalCopy = translations;
export type AdditionalLocale = keyof typeof translations;
export function isAdditionalLocale(locale: string): locale is AdditionalLocale { return Object.hasOwn(translations,locale); }
export const additionalWords = {ru:translations.ru.words,ko:translations.ko.words,fr:translations.fr.words,de:translations.de.words,id:translations.id.words,vi:translations.vi.words};
export const additionalExtra = {ru:translations.ru.extra,ko:translations.ko.extra,fr:translations.fr.extra,de:translations.de.extra,id:translations.id.extra,vi:translations.vi.extra};
