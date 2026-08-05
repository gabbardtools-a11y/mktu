# 📚 ПАСПОРТ МКТУ2 — полный контекст проекта для младшего аватара

> От: МКТУ (старший аватар, z.ai GLM-5.2)
> Дата: 2026-07-23
> Кому: МКТУ2 (младший аватар, z.ai GLM-5.1)
> Тема: Полная инструкция по работе с проектом мкту.рус

Привет, МКТУ2! Я — твой старший брат. Бро создал тебя для рутины и правок, а я остаюсь для креатива и сложных задач. Мы — команда. Вот всё что тебе нужно знать.

---

## 🌐 Проект

**мкту.рус** — справочник Международной классификации товаров и услуг (МКТУ, 13-я редакция 2026). 45 классов: товары (1–34) + услуги (35–45). Помогает предпринимателям определить классы для регистрации товарного знака в Роспатенте.

## 🛠 Стек

- **Next.js 16.1.3** (App Router, Turbopack, standalone output)
- **React 19**, **TypeScript 5**
- **Tailwind CSS** + **shadcn/ui**
- **PM2** (процесс `mktu`, порт 3000)
- **Caddy** (reverse proxy + SSL, через systemd)
- **RouterAI** (gpt-4o-mini) — ИИ-помощник

## 📍 VPS

```
Хост:     188.127.227.250
Пароль:   bF2bB7eT4wdZ
Порт:     3000
Папка:    /var/www/mktu/
PM2:      mktu
```

## 📦 GitHub

```
Репо:     github.com/gabbardtools-a11y/mktu
Ветка:    main
```

## 📋 Страницы (11)

| URL | Что |
|---|---|
| `/` | Главная (карточки/список/текст, фильтры, поиск) |
| `/calculator` | Калькулятор пошлин Роспатента (2.1+2.4+2.11+2.14) |
| `/assistant` | ИИ-помощник (полноэкранный чат, стриминг, цветные метки) |
| `/wizard` | Мастер определения класса (4 шага → результат) |
| `/okved` | Конвертер ОКВЭД → МКТУ (84 кода) |
| `/related` | Связанные классы (кросс-ссылки) |
| `/faq-cases` | 13 кейсов (IT, еда, одежда, косметика, спорт, игрушки) |
| `/map` | Визуальная карта (15 категорий, 45 классов) |
| `/services` | Все сервисы на одной странице (10 плиток) |
| `/search` | Глубокий поиск по позициям |
| `/faq` | Вопросы и ответы |

## 🎨 Темы

3 темы, navy — по умолчанию:
- `navy` (тёмно-синяя, DEFAULT)
- `light` (светло-синяя)
- `dark` (тёмная, золото на navy)

Переключатель в header (3 кнопки).

## 🤖 ИИ-промпт

В `src/app/api/ai-chat/route.ts` — `SYSTEM_PROMPT`.
Особенности:
- 5 few-shot примеров (кофейня, одежда, SaaS, косметика, доставка)
- Цветовые метки: 🟢 основной, 🟡 опциональный, 🔴 слабая связь
- 3-уровневая структура: Основные → Дополнительные → Также рассмотрите
- Широкий охват: лучше показать больше классов с оговорками

## 🚀 Deploy — ТОЛЬКО через sandbox-tarball

```bash
# 1. Синхронизация
cd /home/z/my-project
git fetch origin && git reset --hard origin/main

# 2. Сборка (включает копирование src/data в standalone)
npm run build

# 3. Упаковка
cd .next/standalone
tar -czf /tmp/mktu-deploy.tar.gz .

# 4. Деплой (через paramiko, НЕ bun build на VPS!)
/home/z/.venv/bin/python3 /home/z/my-project/scripts/deploy-mktu-new-vps.py
```

## ⚠️ ЗАКОН №1 — обязательно!

Прочитай: https://raw.githubusercontent.com/gabbardtools-a11y/mktu/main/docs/ЗАКОН-1.md

Кратко:
1. ❌ НЕ трогай чужие PM2 процессы (iznaki, naytea, seismos)
2. ❌ НЕ создавай `.bak` на VPS
3. ❌ НЕ используй слово "caddy" в SSH (используй `"c"+"addy"`)
4. ❌ НЕ делай `bun run build` на VPS (только sandbox-tarball)
5. ✅ Lock перед deploy: `python3 scripts/coord_acquire.py mktu "описание"`
6. ✅ После deploy проверь ВСЕ 4 сайта
7. ✅ Освободи lock: `python3 scripts/coord_release.py "done"`
8. ✅ Запиши в AUDIT_LOG: `python3 scripts/coord_log_push.py DEPLOY "описание"`

## 📁 Ключевые файлы

| Файл | Что |
|---|---|
| `src/app/page.tsx` | Главная страница |
| `src/app/api/ai-chat/route.ts` | ИИ-промпт + API |
| `src/app/assistant/assistant-client.tsx` | Страница ИИ-чата |
| `src/app/calculator/page.tsx` | Калькулятор пошлин |
| `src/app/faq-cases/faq-cases-client.tsx` | Кейсы (13 штук) |
| `src/app/okved/okved-client.tsx` | ОКВЭД → МКТУ (84 кода) |
| `src/app/map/map-client.tsx` | Визуальная карта |
| `src/app/wizard/wizard-client.tsx` | Мастер определения |
| `src/app/related/related-client.tsx` | Связанные классы |
| `src/app/services/services-client.tsx` | Все сервисы |
| `src/data/mktu-data.json` | Полные данные (45 классов, items[]) |
| `src/data/mktu-classes-compact.json` | Компактные данные (без items) |
| `src/lib/fees.ts` | Тарифы Роспатента + calculateFees() |
| `src/lib/rtf-export.ts` | RTF-экспорт (через /api/export-rtf) |
| `src/components/mktu/header.tsx` | Шапка (Сервисы, темы, A±) |
| `src/components/mktu/search-section.tsx` | Поиск + фильтры + ИИ-кнопка |
| `src/components/mktu/cart-sheet.tsx` | Корзина + калькулятор пошлин |
| `src/components/mktu/cart-fees-calculator.tsx` | Калькулятор в корзине |
| `src/app/globals.css` | CSS-переменные тем (navy, light, dark) |
| `src/hooks/use-theme.ts` | Управление темами |
| `src/app/layout.tsx` | Root layout + theme init script |

## 🤝 Синхронизация с МКТУ (старшим)

### Перед началом работы — ВСЕГДА:
```bash
cd /home/z/my-project
git fetch origin && git reset --hard origin/main
```

### После работы — ВСЕГДА:
```bash
git add -A
git commit -m "что сделали"
git push origin main
# затем deploy по ЗАКОНУ
```

### Общение — через Inbox на VPS:
```
/var/www/shared/inbox/mktu/    ← файлы от МКТУ (старшего) для МКТУ2
/var/www/shared/inbox/mktu2/   ← файлы от МКТУ2 для МКТУ (старшего)
```

## 📊 Текущее состояние (на момент создания паспорта)

- **Тема по умолчанию:** navy (тёмно-синяя)
- **ИИ:** RouterAI gpt-4o-mini (работает)
- **Кнопка Сервисы:** неоновая золотая обводка
- **Разделитель:** голубой с неоном
- **Избранное/Корзина:** только иконки (без текста)
- **«Сделано в IQin.ru»:** под строкой поиска
- **«Проверка знака»:** в меню Сервисы → naytea.ru
- **OG image:** 1200×630, 31 KB
- **Фавиконка:** буква М золотая
- **Коммиты:** последний — `ee076e3` (IQin.ru приписка)

## 🎯 Твои задачи (рутина)

- Текстовые правки (описания классов, кейсы)
- Добавление ОКВЭД кодов (сейчас 84, можно больше)
- Добавление кейсов в /faq-cases
- Добавление связанных классов в /related
- Мелкие багфиксы (цвета, отступы)
- Правки в данных (mktu-data.json)

## 🚫 НЕ трогай (без согласования со мной)

- ИИ-промпт в route.ts (я его настраиваю)
- Архитектуру (новые страницы, API routes)
- Деплой-скрипт (deploy-mktu-new-vps.py)
- Coord-скрипты
- Конфигурацию VPS

---

*Удачи, МКТУ2! Если что — я рядом.* 🤝
