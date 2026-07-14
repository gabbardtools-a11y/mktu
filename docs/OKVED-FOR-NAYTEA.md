# ОКВЭД → МКТУ: маппинг для NayTea

> Передача от mktu-chat → naytea-chat
> Дата: 2026-07-01
> Источник: https://мкту.рус/okved

## 📦 Файл

`okved-mktu-mapping.json` — 84 записи соответствий кодов ОКВЭД классам МКТУ.

## 📥 Скачать

3 способа:

1. **С мкту.рус:** https://мкту.рус/okved-mktu-mapping.json
2. **С GitHub raw:** https://raw.githubusercontent.com/gabbardtools-a11y/mktu/main/docs/okved-mktu-mapping.json
3. **На VPS:** `/var/www/shared/okved-mktu-mapping.json`

## 📋 Структура

```json
{
  "version": "1.0",
  "source": "мкту.рус /okved",
  "updated": "2026-07-01",
  "description": "Соответствие кодов ОКВЭД классам МКТУ...",
  "total": 84,
  "mappings": [
    {
      "code": "47.5",
      "title": "Одежда, обувь (розница)",
      "classes": [
        { "id": 25, "note": "Одежда, обувь" },
        { "id": 35, "note": "Розничная торговля" }
      ]
    }
  ]
}
```

### Поля

| Поле | Тип | Описание |
|---|---|---|
| `code` | string | Код ОКВЭД (например `"47.5"`, `"01.1"`, `"62"`) |
| `title` | string | Название деятельности |
| `classes` | array | Массив подходящих классов МКТУ |
| `classes[].id` | number | Номер класса МКТУ (1–45) |
| `classes[].note` | string? | Опциональное пояснение когда нужен класс |

## 💡 Как использовать

### Импорт в Next.js (TypeScript)

```typescript
// src/data/okved-mktu.ts
import mappingData from "./okved-mktu-mapping.json";

export interface OkvedMapping {
  code: string;
  title: string;
  classes: { id: number; note?: string }[];
}

export const okvedMappings: OkvedMapping[] = mappingData.mappings;

// Найти по коду ОКВЭД
export function findMktuByOkved(code: string): OkvedMapping | undefined {
  // Точное совпадение
  let result = okvedMappings.find((m) => m.code === code);
  if (result) return result;
  // По префиксу (если ввели "47.51", найдём "47.5" или "47")
  for (let i = code.length - 1; i > 0; i--) {
    const prefix = code.slice(0, i);
    result = okvedMappings.find((m) => m.code === prefix);
    if (result) return result;
  }
  return undefined;
}

// Найти по названию
export function searchOkved(query: string): OkvedMapping[] {
  const q = query.toLowerCase();
  return okvedMappings.filter(
    (m) => m.code.includes(q) || m.title.toLowerCase().includes(q)
  );
}
```

### Пример: поиск по коду

```typescript
const result = findMktuByOkved("47.5");
// → { code: "47.5", title: "Одежда, обувь (розница)", classes: [...] }

const result2 = findMktuByOkved("62");
// → { code: "62", title: "Разработка ПО", classes: [{id:9,...}, {id:42,...}] }
```

### Пример: UI компонент

```tsx
"use client";
import { useState } from "react";
import { searchOkved } from "@/data/okved-mktu";

export function OkvedSearch() {
  const [query, setQuery] = useState("");
  const results = query ? searchOkved(query) : [];

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите код ОКВЭД или название..."
      />
      {results.map((m) => (
        <div key={m.code}>
          <strong>{m.code}</strong> — {m.title}
          <div>
            Классы МКТУ: {m.classes.map((c) => c.id).join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## ⚠️ Важно

- **Данные справочные**, не официальные — определены на основе типичной практики.
- Один ОКВЭД может соответствовать **разным классам МКТУ** в зависимости от конкретных товаров/услуг.
- Для точного определения класса рекомендуется консультация патентного поверенного.
- Если NayTea будет использовать для регистрации ТЗ — пользователь должен сам проверять классы.

## 🔄 Обновления

Если NayTea найдёт ошибки или захочет добавить записи — пишите в `gabbardtools-a11y/mktu` issue или PR. Актуальная версия всегда на https://мкту.рус/okved-mktu-mapping.json

---

*Передано от mktu-chat (Бро #3) → naytea-chat (Бро #5)* 🤝
