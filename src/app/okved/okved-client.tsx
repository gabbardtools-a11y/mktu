"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Info } from "lucide-react";

// ─────────────────── Таблица соответствий ОКВЭД → МКТУ ───────────────────
// Источник: анализ популярных ОКВЭД и их типичного соответствия классам МКТУ.
// Не является официальным — это справочная информация.

interface OkvedMapping {
  code: string;
  title: string;
  classes: { id: number; note?: string }[];
}

const MAPPINGS: OkvedMapping[] = [
  // Сельское хозяйство
  { code: "01", title: "Растениеводство, животноводство", classes: [{ id: 31, note: "Сельхозпродукция" }, { id: 29, note: "Переработка" }] },
  { code: "01.1", title: "Выращивание однолетних культур", classes: [{ id: 31, note: "Сельхозпродукция" }] },
  { code: "01.2", title: "Выращивание многолетних культур", classes: [{ id: 31, note: "Сельхозпродукция" }, { id: 29, note: "Переработка фруктов" }] },
  { code: "01.3", title: "Выращивание рассады", classes: [{ id: 31 }] },
  { code: "01.4", title: "Животноводство", classes: [{ id: 29, note: "Мясо, молоко" }, { id: 31 }] },

  // Пищевое производство
  { code: "10", title: "Производство пищевых продуктов", classes: [{ id: 29, note: "Мясо, рыба, молочка" }, { id: 30, note: "Кофе, чай, хлеб, специи" }, { id: 32, note: "Напитки" }] },
  { code: "10.1", title: "Переработка мяса", classes: [{ id: 29 }] },
  { code: "10.2", title: "Переработка рыбы", classes: [{ id: 29 }] },
  { code: "10.3", title: "Овощи, фрукты (переработка)", classes: [{ id: 29, note: "Консервы" }, { id: 30, note: "Соки" }] },
  { code: "10.5", title: "Молочные продукты", classes: [{ id: 29 }] },
  { code: "10.6", title: "Мука, крупы, крахмал", classes: [{ id: 30 }] },
  { code: "10.7", title: "Хлебобулочные, кондитерские", classes: [{ id: 30 }] },
  { code: "10.8", title: "Сахар", classes: [{ id: 30 }] },
  { code: "10.9", title: "Кофе, чай, какао, специи", classes: [{ id: 30 }] },
  { code: "11", title: "Напитки (алкогольные)", classes: [{ id: 32, note: "Пиво" }, { id: 33, note: "Вино, крепкое" }] },
  { code: "11.0", title: "Безалкогольные напитки", classes: [{ id: 32 }] },

  // Текстиль и одежда
  { code: "13", title: "Текстильное производство", classes: [{ id: 22, note: "Веревки, канаты" }, { id: 23, note: "Текстиль" }, { id: 24 }] },
  { code: "14", title: "Одежда", classes: [{ id: 25, note: "Одежда, обувь" }] },
  { code: "15", title: "Кожа, изделия из кожи", classes: [{ id: 18, note: "Кожгалантерея" }, { id: 25 }] },
  { code: "16", title: "Деревообработка", classes: [{ id: 19, note: "Канцтовары" }, { id: 20, note: "Деревянные изделия" }] },
  { code: "17", title: "Бумага, картон", classes: [{ id: 16, note: "Бумага" }] },
  { code: "18", title: "Печать", classes: [{ id: 16, note: "Полиграфия" }] },

  // Химия и фарма
  { code: "20", title: "Химическое производство", classes: [{ id: 1, note: "Химреактивы" }, { id: 2, note: "Краски" }, { id: 3, note: "Косметика" }, { id: 4, note: "Масла" }] },
  { code: "21", title: "Фармацевтика", classes: [{ id: 5, note: "Лекарства" }] },
  { code: "22", title: "Резина, пластмассы", classes: [{ id: 17, note: "Резина" }] },

  // Металлургия и оборудование
  { code: "24", title: "Металлургия", classes: [{ id: 6, note: "Металлы" }] },
  { code: "25", title: "Готовые металлические изделия", classes: [{ id: 6, note: "Изделия" }, { id: 8, note: "Инструменты" }] },
  { code: "26", title: "Компьютеры, электроника", classes: [{ id: 9, note: "Электроника, ПО" }] },
  { code: "27", title: "Электрооборудование", classes: [{ id: 9, note: "Приборы" }, { id: 11, note: "Освещение" }] },
  { code: "28", title: "Машиностроение", classes: [{ id: 7, note: "Машины" }, { id: 12, note: "Транспорт" }] },
  { code: "29", title: "Автомобили", classes: [{ id: 12, note: "Транспорт" }] },
  { code: "30", title: "Прочий транспорт", classes: [{ id: 12 }] },
  { code: "31", title: "Мебель", classes: [{ id: 20, note: "Мебель" }] },
  { code: "32", title: "Прочие производства (украшения, спорт)", classes: [{ id: 28, note: "Спорт" }, { id: 14, note: "Драгоценности" }] },

  // IT и связь
  { code: "61", title: "Связь", classes: [{ id: 38, note: "Телекоммуникации" }] },
  { code: "62", title: "Разработка ПО", classes: [{ id: 9, note: "ПО" }, { id: 42, note: "IT-услуги" }] },
  { code: "63", title: "IT-услуги, обработка данных", classes: [{ id: 42, note: "SaaS, облако" }, { id: 35, note: "Если реклама" }] },

  // Торговля
  { code: "45", title: "Торговля автотранспортом", classes: [{ id: 12, note: "Авто" }, { id: 35, note: "Продажи" }] },
  { code: "46", title: "Оптовая торговля", classes: [{ id: 35, note: "Опт" }] },
  { code: "47", title: "Розничная торговля", classes: [{ id: 35, note: "Розница" }] },
  { code: "47.1", title: "Продукты в магазине", classes: [{ id: 35 }] },
  { code: "47.2", title: "Рыба, мясо, фрукты (розница)", classes: [{ id: 35 }] },
  { code: "47.4", title: "IT, компьютеры (розница)", classes: [{ id: 9, note: "Товары" }, { id: 35 }] },
  { code: "47.5", title: "Одежда, обувь (розница)", classes: [{ id: 25 }, { id: 35 }] },
  { code: "47.6", title: "Спорт, книги, игрушки (розница)", classes: [{ id: 28, note: "Игрушки" }, { id: 16, note: "Книги" }, { id: 35 }] },
  { code: "47.7", title: "Косметика, парфюмерия (розница)", classes: [{ id: 3 }, { id: 35 }] },
  { code: "47.8", title: "Рынки, палатки", classes: [{ id: 35 }] },
  { code: "47.9", title: "Торговля вне магазина (онлайн)", classes: [{ id: 35, note: "Маркетплейс, интернет-магазин" }] },

  // Транспорт и логистика
  { code: "49", title: "Сухопутный транспорт", classes: [{ id: 39, note: "Перевозки" }] },
  { code: "50", title: "Водный транспорт", classes: [{ id: 39 }] },
  { code: "51", title: "Воздушный транспорт", classes: [{ id: 39 }] },
  { code: "52", title: "Складирование, хранение", classes: [{ id: 39, note: "Склад" }] },
  { code: "53", title: "Почта, курьерская доставка", classes: [{ id: 39, note: "Доставка" }] },

  // Услуги
  { code: "55", title: "Гостиницы", classes: [{ id: 43, note: "Жильё" }] },
  { code: "56", title: "Общепит", classes: [{ id: 43, note: "Рестораны, кафе" }, { id: 35, note: "Если реклама" }] },
  { code: "58", title: "Издательство, медиа", classes: [{ id: 16, note: "Книги" }, { id: 41, note: "Развлечения" }] },
  { code: "59", title: "Кино, видео, музыка", classes: [{ id: 41, note: "Развлечения" }] },
  { code: "60", title: "ТВ, радио", classes: [{ id: 38, note: "Вещание" }] },
  { code: "69", title: "Юридические услуги", classes: [{ id: 45, note: "Юриспруденция" }] },
  { code: "70", title: "Консалтинг, управление", classes: [{ id: 35, note: "Бизнес-услуги" }] },
  { code: "71", title: "Инженерия, архитектура", classes: [{ id: 42, note: "Инжиниринг" }] },
  { code: "72", title: "Научные исследования", classes: [{ id: 42 }] },
  { code: "73", title: "Реклама, маркетинг", classes: [{ id: 35, note: "Реклама" }] },
  { code: "74", title: "Дизайн", classes: [{ id: 42, note: "Дизайн" }] },
  { code: "78", title: "HR, подбор персонала", classes: [{ id: 35, note: "Кадры" }] },
  { code: "79", title: "Туризм, путешествия", classes: [{ id: 39, note: "Туроператор" }] },
  { code: "80", title: "Охрана, безопасность", classes: [{ id: 45, note: "Охрана" }] },
  { code: "81", title: "Уборка, чистка", classes: [{ id: 37, note: "Ремонт" }] },
  { code: "82", title: "Офисные услуги", classes: [{ id: 35 }] },

  // Образование
  { code: "85", title: "Образование", classes: [{ id: 41, note: "Обучение" }, { id: 35, note: "Если реклама курсов" }] },

  // Здоровье
  { code: "86", title: "Медицинские услуги", classes: [{ id: 44, note: "Медицина" }, { id: 10, note: "Если оборудование" }] },
  { code: "87", title: "Социальные услуги", classes: [{ id: 44 }] },
  { code: "88", title: "Социальная помощь", classes: [{ id: 45 }] },

  // Искусство и спорт
  { code: "90", title: "Творчество, искусство", classes: [{ id: 41, note: "Искусство" }] },
  { code: "91", title: "Библиотеки, музеи", classes: [{ id: 41 }] },
  { code: "93", title: "Спорт, отдых", classes: [{ id: 41, note: "Спорт" }] },

  // Финансы
  { code: "64", title: "Финансы", classes: [{ id: 36, note: "Банки" }] },
  { code: "65", title: "Страхование", classes: [{ id: 36, note: "Страхование" }] },
  { code: "66", title: "Вспомогательные фин. услуги", classes: [{ id: 36 }] },

  // Недвижимость
  { code: "68", title: "Недвижимость", classes: [{ id: 36, note: "Аренда" }, { id: 45, note: "Управление" }] },

  // Энергетика
  { code: "35", title: "Электроэнергия, газ", classes: [{ id: 4, note: "Энергия" }, { id: 40, note: "Переработка" }] },

  // Строительство
  { code: "41", title: "Строительство зданий", classes: [{ id: 19, note: "Материалы" }, { id: 37, note: "Ремонт" }] },
  { code: "42", title: "Гражданское строительство", classes: [{ id: 37 }] },
  { code: "43", title: "Спецстроительные работы", classes: [{ id: 37, note: "Ремонт" }, { id: 1, note: "Если материалы" }] },
];

export function OkvedClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MAPPINGS;
    return MAPPINGS.filter(
      (m) =>
        m.code.includes(q) ||
        m.title.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3">
            📋 ОКВЭД → МКТУ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Конвертер кодов ОКВЭД в классы МКТУ
          </h1>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto">
            Знаете свой ОКВЭД? Введите код или название деятельности —
            покажем подходящие классы МКТУ для регистрации товарного знака.
          </p>
        </motion.div>

        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: 47.5 или «одежда»…"
            className="w-full rounded-md border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40"
            autoFocus
          />
        </div>

        {/* Дисклеймер */}
        <div className="flex gap-2 text-xs text-foreground/50 bg-muted/30 border border-border/50 rounded-md p-3 mb-6">
          <Info className="size-4 shrink-0 mt-0.5 text-foreground/40" />
          <p>
            Соответствия справочные — определены на основе типичной практики.
            Для точного определения класса рекомендуется консультация патентного поверенного,
            так как один ОКВЭД может соответствовать разным классам МКТУ в зависимости от
            конкретных товаров/услуг.
          </p>
        </div>

        {/* Результаты */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-foreground/50 text-sm">
              Ничего не найдено. Попробуйте{" "}
              <button
                onClick={() => router.push("/assistant")}
                className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
              >
                ИИ-помощник
              </button>
              .
            </div>
          ) : (
            filtered.map((m) => <OkvedRow key={m.code} mapping={m} onClassClick={(id) => router.push(`/class/${id}`)} />)
          )}
        </div>

        {/* Счётчик */}
        <div className="text-center text-xs text-foreground/40 mt-6">
          Показано {filtered.length} из {MAPPINGS.length} кодов
        </div>
      </div>
    </main>
  );
}

function OkvedRow({
  mapping,
  onClassClick,
}: {
  mapping: OkvedMapping;
  onClassClick: (id: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 hover:border-blue-500/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center min-w-16 px-2 py-1.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-semibold flex-shrink-0">
          {mapping.code}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground mb-1.5">{mapping.title}</div>
          <div className="flex flex-wrap gap-1.5">
            {mapping.classes.map((c) => (
              <button
                key={c.id}
                onClick={() => onClassClick(c.id)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-muted hover:bg-gold/10 text-foreground/70 hover:text-gold transition-colors group"
                title={c.note}
              >
                <span className="font-bold">Кл.{c.id}</span>
                {c.note && <span className="text-foreground/40 group-hover:text-gold/60">· {c.note}</span>}
                <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
