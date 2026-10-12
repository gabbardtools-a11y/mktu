/**
 * Next.js 16 middleware для трёхъязычности МКТУ.рус (RU/EN/ZH).
 * Эталон: aipat (фикс цикла Next 16) ← iznaki (Next 15).
 *
 * Логика:
 * - URL /en/... → rewrite на /... + cookie lang=en + request-header x-mktu-lang
 * - URL /zh/... → rewrite на /... + cookie lang=zh + request-header x-mktu-lang
 * - URL /... (без префикса) → отдаётся как есть; язык SSR берётся из cookie.
 *
 * УЛУЧШЕНИЕ против aipat: заголовок x-mktu-lang ставится на ЗАПРОС rewrite
 * (request: { headers }), поэтому SSR видит язык с первого захода — без
 * мигания «ru → en» до гидратации.
 *
 * ОТЛИЧИЕ ОТ ЭТАЛОНА iznaki (Next 15): в Next 16 middleware (Proxy)
 * выполняется и на rewritten URL, поэтому redirect из default-ветки
 * (cookie=en на «/» → redirect /en) создаёт бесконечный цикл
 * (/en → rewrite / → redirect /en → …). Здесь redirect-ветка УДАЛЕНА:
 * язык рендера определяется cookie (ставится middleware на /en|/zh и
 * переключателем), а URL-префикс остаётся как есть. Актуальный язык после
 * гидратации дополнительно фиксирует useLanguage() по pathname.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function rewriteWithLang(
  request: NextRequest,
  newPath: string,
  lang: 'en' | 'zh',
) {
  const url = request.nextUrl.clone();
  url.pathname = newPath;
  // Заголовок на запрос → SSR (getLang в server.ts) рендерит правильный язык сразу
  const headers = new Headers(request.headers);
  headers.set('x-mktu-lang', lang);
  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set('lang', lang, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const langCookie = request.cookies.get('lang')?.value;

  // URL начинается с /zh — переписываем
  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    // cookie lang=ru → пользователь вернулся на русский: redirect без префикса
    if (langCookie === 'ru') {
      const newPath = pathname.replace(/^\/zh/, '') || '/';
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    return rewriteWithLang(request, pathname.replace(/^\/zh/, '') || '/', 'zh');
  }

  // URL начинается с /en — переписываем
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    // cookie lang=ru → redirect без префикса
    if (langCookie === 'ru') {
      const newPath = pathname.replace(/^\/en/, '') || '/';
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    // cookie lang=zh, а URL /en/... → перенаправим на /zh/...
    if (langCookie === 'zh') {
      const subPath = pathname.replace(/^\/en/, '') || '';
      const url = request.nextUrl.clone();
      url.pathname = `/zh${subPath}`;
      return NextResponse.redirect(url);
    }
    return rewriteWithLang(request, pathname.replace(/^\/en/, '') || '/', 'en');
  }

  // URL без префикса языка:
  // ВНИМАНИЕ (Next 16): здесь МОЖЕТ быть и внутренний проход после rewrite
  // (URL /en → rewrite → проход на «/»). Redirect на /en здесь создаёт цикл,
  // поэтому просто отдаём страницу — язык рендера возьмётся из cookie
  // (установленной выше при заходе на /en|/zh или переключателем).

  // По умолчанию (нет cookie) — фиксируем ru (cookie на 1 год)
  const response = NextResponse.next();
  if (!langCookie) {
    response.cookies.set('lang', 'ru', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
  }
  return response;
}

export const config = {
  // Применяем middleware ко всем URL кроме:
  // - API routes
  // - Next.js служебных файлов (_next/*)
  // - Статических файлов (с расширением)
  // - favicon, robots.txt, sitemap, site.webmanifest, og-image, logo
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|apple-touch-icon|robots\\.txt|sitemap|site\\.webmanifest|google|og-image|logo|.*\\.(?:svg|jpg|jpeg|webp|png|ico|xml|txt|html|mp4|css|js|woff2?|ttf|map)$).*)',
  ],
};
