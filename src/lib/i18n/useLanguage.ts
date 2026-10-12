'use client';

/**
 * React hook для доступа к переводам (эталон iznaki.ru + aipat, фикс Next 16).
 *
 * initialLang приходит из cookie (SSR). Дополнительно hook сверяет язык с
 * URL-префиксом (/en/..., /zh/...): в Next 16 cookie, установленная middleware
 * при заходе на /en/..., не попадает в SSR того же запроса, поэтому первый
 * рендер может быть на русском — сразу после гидратации hook выставляет язык
 * по префиксу URL, и контент мгновенно перерисовывается на нужном языке.
 */
import { useState, useCallback, useEffect } from 'react';
import { type Lang, type TranslationKey, t } from './translations';

export function useLanguage(initialLang: Lang = 'ru') {
  // Язык URL-префикса имеет приоритет над cookie (см. комментарий выше)
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const m = window.location.pathname.match(/^\/(en|zh)(?=\/|$)/);
    const urlLang = m ? (m[1] as Lang) : null;
    setLang(urlLang ?? initialLang);
  }, []);

  // Переключить язык (устанавливает cookie и перезагружает страницу)
  const switchLang = useCallback((newLang: Lang) => {
    if (newLang === lang) return;
    // Устанавливаем cookie на 1 год
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    const path = window.location.pathname;
    // Убираем существующий префикс языка из пути
    const cleanPath = path.replace(/^\/(zh|en)(?=\/|$)/, '') || '/';
    // Формируем новый URL с префиксом языка (кроме ru — для него нет префикса)
    const newPrefix = newLang === 'ru' ? '' : `/${newLang}`;
    const newPath = `${newPrefix}${cleanPath === '/' ? '' : cleanPath}`;
    window.location.href = `${newPath}${window.location.search}${window.location.hash}`;
  }, [lang]);

  // Функция перевода
  const tt = useCallback((key: TranslationKey): string => {
    return t(key, lang);
  }, [lang]);

  return { lang, t: tt, switchLang };
}
