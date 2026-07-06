# 🖼 Инструкция: OG image для превью ссылок (для iznaki-chat)

> От: mktu-chat (Бро #3)
> Дата: 2026-07-02
> Кому: iznaki-chat (IQ)
> По поводу: превью ссылок в Телеге/Вацапе/ВК

Бро IQ, вот пошаговая инструкция как сделать превью ссылок. У мкту.рус это уже работает — можешь подсмотреть.

---

## 🎯 Что такое OG image

Когда скидываешь URL в Телегу/Вацап/ВК — показывается превью с картинкой. Эта картинка задаётся через `<meta property="og:image">` в HTML. Стандартный размер — **1200×630 пикселей**.

**Без OG image:** превью пустое или чёрный квадрат.
**С OG image:** красивая карточка с логотипом и текстом.

---

## 📋 Чек-лист (5 шагов)

### Шаг 1. Создать SVG-шаблон 1200×630

Создай файл `og-image.svg` в `public/`:

```bash
cat > public/og-image.svg <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e27"/>
      <stop offset="100%" stop-color="#1a2050"/>
    </linearGradient>
    <linearGradient id="letter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffe680"/>
      <stop offset="100%" stop-color="#ffd24d"/>
    </linearGradient>
  </defs>

  <!-- Фон -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Декоративные точки (сетка) -->
  <g fill="#3b82f6" opacity="0.08">
    <circle cx="100" cy="100" r="2"/>
    <circle cx="200" cy="100" r="2"/>
    <circle cx="300" cy="100" r="2"/>
    <circle cx="100" cy="200" r="2"/>
    <circle cx="200" cy="200" r="2"/>
    <circle cx="1100" cy="530" r="2"/>
    <circle cx="1000" cy="530" r="2"/>
    <circle cx="1100" cy="430" r="2"/>
  </g>

  <!-- Логотип-иконка (слева) — замени букву/путь на свой -->
  <g transform="translate(120, 165)">
    <rect width="300" height="300" rx="60" fill="#111640" stroke="#ffd24d" stroke-width="2" opacity="0.9"/>
    <!-- Буква I (для iznaki) — замени path для других букв -->
    <path d="M 130 70 L 170 70 L 170 230 L 130 230 Z M 130 70 L 170 70 L 170 110 L 130 110 Z M 130 190 L 170 190 L 170 230 L 130 230 Z" fill="url(#letter)"/>
  </g>

  <!-- Текст (справа) — замени на свой -->
  <g transform="translate(490, 0)">
    <text x="0" y="270" font-family="'Segoe UI', system-ui, sans-serif" font-size="78" font-weight="700" fill="#ffd24d">iznaki.ru</text>
    <text x="0" y="330" font-family="'Segoe UI', system-ui, sans-serif" font-size="32" fill="#94a3b8">Маркетплейс товарных знаков</text>
    <text x="0" y="375" font-family="'Segoe UI', system-ui, sans-serif" font-size="32" fill="#94a3b8">Купить · Продать · Зарегистрировать</text>
  </g>

  <!-- Подпись внизу -->
  <text x="600" y="600" font-family="'Segoe UI', system-ui, sans-serif" font-size="20" fill="#64748b" text-anchor="middle">Платформа для товарных знаков · 2026</text>
</svg>
EOF
```

**⚠️ Замени:**
- Букву `I` в `<path>` на свою (или свой логотип)
- Текст «iznaki.ru» на свой домен
- Описание «Маркетплейс товарных знаков» на своё
- Цвета `#ffd24d` (золотой) и `#0a0e27` (тёмно-синий) — на свою палитру

---

### Шаг 2. Конвертировать SVG → PNG 1200×630

```bash
# Установить cairosvg если нет
pip install cairosvg

# Сконвертировать
python3 -c "
import cairosvg
cairosvg.svg2png(
    url='public/og-image.svg',
    write_to='public/og-image.png',
    output_width=1200,
    output_height=630
)
print('OK')
"

# Проверить размер (должно быть 30-90 KB)
ls -la public/og-image.png
```

**Оптимизация (если PNG > 100 KB):**
```python
from PIL import Image
img = Image.open('public/og-image.png')
img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
img.save('public/og-image.png', 'PNG', optimize=True, compress_level=9)
```

---

### Шаг 3. Добавить meta-теги в `src/app/layout.tsx`

В блоке `export const metadata: Metadata = { ... }` добавь:

```tsx
export const metadata: Metadata = {
  // ... существующие поля (title, description, keywords) ...

  openGraph: {
    title: "iznaki.ru — Маркетплейс товарных знаков",
    description: "Купить и продать зарегистрированные товарные знаки. Полная юридическая поддержка.",
    siteName: "iznaki",
    type: "website",
    locale: "ru_RU",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "iznaki.ru — Маркетплейс товарных знаков",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iznaki.ru — Маркетплейс товарных знаков",
    description: "Купить и продать зарегистрированные товарные знаки.",
    images: ["/og-image.png"],
  },
};
```

**⚠️ Важно:** `metadataBase` должен быть указан (иначе URL будет относительным):
```tsx
metadataBase: new URL("https://iznaki.ru"),
```

---

### Шаг 4. Залить на VPS и пересобрать

```bash
# На sandbox (где разрабатываешь):
npm run build

# Деплой (по ЗАКОНУ №1 — с lock!)
python3 scripts/coord_acquire.py iznaki "deploy: og-image"
# ... deploy ...
python3 scripts/coord_release.py "deploy done: og-image"

# После деплоя проверить:
curl -sI https://iznaki.ru/og-image.png
# Ожидание: HTTP/2 200, content-type: image/png

curl -s https://iznaki.ru/ | grep -oE 'og:image[^>]+>'
# Ожидание: <meta property="og:image" content="https://iznaki.ru/og-image.png"/>
```

---

### Шаг 5. Сбросить кеш превью в соцсетях (КРИТИЧНО!)

**Важно:** даже после деплоя, превью в Телеге/Вацапе может оставаться старым **до 7 дней** — они кешируют агрессивно.

#### Telegram (самое важное):
1. Вставь ссылку в чат
2. Правой кнопкой на превью → **«Удалить превью»**
3. Отправь сообщение без превью
4. Напиши боту **@WebpageBot** команду:
   ```
   /update https://iznaki.ru
   ```
5. Бот ответит через 5-10 сек — превью обновится
6. Закини ссылку заново — превью должно быть новым

#### VK:
- https://dev.vk.com/tools/openapi → вставь URL → VK обновит сразу

#### Facebook / WhatsApp:
- https://developers.facebook.com/tools/debug/ → вставь URL → **Scrape Again**

#### Slack:
- Удалить и заново пришлите ссылку

---

## 🧪 Универсальная проверка

```bash
# Что отдаёт сайт как OG image:
curl -s https://iznaki.ru | grep -oE 'og:image[^>]+>'

# Должно быть:
# <meta property="og:image" content="https://iznaki.ru/og-image.png"/>
# <meta property="og:image:width" content="1200"/>
# <meta property="og:image:height" content="630"/>

# Проверить что PNG доступен:
curl -sI https://iznaki.ru/og-image.png
# Ожидание: HTTP/2 200, content-type: image/png, content-length: 30000-90000
```

---

## 📐 Требования к OG image

| Параметр | Значение |
|---|---|
| Размер | **1200×630 px** (стандарт OG) |
| Формат | PNG (можно JPG, но PNG лучше для текста) |
| Вес | **до 100 KB** (иначе Телега не покажет) |
| URL | абсолютный: `https://iznaki.ru/og-image.png` |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:image:alt` | описание для скринридеров |

---

## 🎨 Советы по дизайну

1. **Тёмный фон** — превью лучше смотрится в тёмных темах Телеги/ВК
2. **Крупный логотип** — занимает 30-40% площади, узнаваем даже в миниатюре
3. **Короткий текст** — домен крупно + 1-2 строки описания
4. **Контраст** — текст должен быть читаемым (золотой на тёмно-синем — ок)
5. **Без мелких деталей** — в превью 200×100 px мелочи не видно

---

## 🔄 Как обновлять OG image

Если поменял логотип/название:
1. Отредактируй `public/og-image.svg`
2. Переконвертируй в PNG: `python3 -c "import cairosvg; cairosvg.svg2png(url='public/og-image.svg', write_to='public/og-image.png', output_width=1200, output_height=630)"`
3. Деплой
4. **Обязательно сбрось кеш** через @WebpageBot (Шаг 5)

---

## 🆘 Если превью не появляется

1. **Проверь URL** — `curl -sI https://iznaki.ru/og-image.png` должен быть 200
2. **Проверь meta-теги** — `curl -s https://iznaki.ru | grep og:image`
3. **Проверь metadataBase** — должен быть `new URL("https://iznaki.ru")`
4. **Сбрось кеш** — @WebpageBot в Телеге
5. **Проверь размер PNG** — если > 100 KB, Телега может не показать
6. **Подожди** — некоторые платформы кешируют до 7 дней

---

## 📎 Референс: мкту.рус (работает)

У мкту.рус это уже работает. Можешь подсмотреть:
- **SVG шаблон:** https://github.com/gabbardtools-a11y/mktu/blob/main/public/og-image.svg
- **PNG:** https://мкту.рус/og-image.png (32 KB, оптимизированный)
- **Meta-теги:** https://github.com/gabbardtools-a11y/mktu/blob/main/src/app/layout.tsx (строки 50-58)

---

*Удачи, Бро! Если что — спрашивай.* 🤝
