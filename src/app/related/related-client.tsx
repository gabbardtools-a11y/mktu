"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Link2, Search } from "lucide-react";
import { mktuClasses } from "@/data/mktu-data";

// ─────────────────── Матрица связей классов ───────────────────
// Ключ — id класса, значение — массив связанных классов с пояснением.

interface RelatedRef {
  id: number;
  why: string;
  conditional?: string; // условие когда нужен
}

const RELATIONS: Record<number, RelatedRef[]> = {
  1: [
    { id: 2, why: "Краски, лаки — если химия для покрытий" },
    { id: 4, why: "Масла, топлива — если нефтехимия" },
    { id: 5, why: "Если среди веществ есть лекарственные" },
    { id: 17, why: "Резина/пластик — если полимеры" },
  ],
  3: [
    { id: 5, why: "Лечебная косметика (космецевтика)" },
    { id: 35, why: "Розничная продажа косметики", conditional: "если есть магазин" },
    { id: 44, why: "Услуги салонов красоты", conditional: "если салоны" },
  ],
  5: [
    { id: 10, why: "Медицинское оборудование", conditional: "если клиника" },
    { id: 44, why: "Медицинские услуги", conditional: "если клиника" },
  ],
  6: [
    { id: 8, why: "Ручные инструменты" },
    { id: 7, why: "Машины, станки" },
  ],
  7: [
    { id: 8, why: "Инструменты для обслуживания машин" },
    { id: 12, why: "Транспортные средства", conditional: "если машина связана с транспортом" },
  ],
  9: [
    { id: 35, why: "Реклама, продажа ПО", conditional: "если коммерческий продукт" },
    { id: 42, why: "IT-услуги, разработка, SaaS", conditional: "если услуга ПО" },
    { id: 38, why: "Телекоммуникации", conditional: "если связь" },
  ],
  12: [
    { id: 39, why: "Услуги перевозки", conditional: "если транспортная компания" },
    { id: 37, why: "Ремонт транспорта", conditional: "если СТО" },
  ],
  14: [
    { id: 18, why: "Кожаные изделия" },
    { id: 25, why: "Часы как аксессуар" },
  ],
  16: [
    { id: 41, why: "Издательские услуги", conditional: "если издательство" },
    { id: 35, why: "Розничная продажа печатной продукции" },
  ],
  18: [
    { id: 25, why: "Одежда — сумки часто идут в комплект" },
    { id: 14, why: "Драгоценности, ювелирка" },
    { id: 35, why: "Розничная продажа" },
  ],
  19: [
    { id: 20, why: "Мебель, деревянные изделия" },
    { id: 16, why: "Бумажные изделия" },
  ],
  20: [
    { id: 19, why: "Деревянные материалы" },
    { id: 40, why: "Обработка/производство на заказ", conditional: "если на заказ" },
    { id: 35, why: "Продажа мебели" },
  ],
  21: [
    { id: 20, why: "Домашняя утварь" },
    { id: 19, why: "Стекло для окон" },
  ],
  22: [
    { id: 23, why: "Текстиль" },
    { id: 24, why: "Ткани" },
  ],
  24: [
    { id: 25, why: "Одежда из тканей" },
    { id: 26, why: "Галантерея, ленты" },
  ],
  25: [
    { id: 18, why: "Сумки, чемоданы", conditional: "если аксессуары" },
    { id: 26, why: "Аксессуары: пуговицы, молнии" },
    { id: 35, why: "Розничная/онлайн продажа", conditional: "если есть магазин" },
  ],
  26: [
    { id: 25, why: "Одежда — для аксессуаров" },
    { id: 14, why: "Бижутерия" },
  ],
  28: [
    { id: 41, why: "Спортивные услуги", conditional: "если спортклуб" },
    { id: 25, why: "Спортивная одежда" },
  ],
  29: [
    { id: 30, why: "Кофе, чай, выпечка", conditional: "если полный ассортимент" },
    { id: 32, why: "Напитки", conditional: "если соки/воды" },
    { id: 35, why: "Розничная продажа" },
    { id: 43, why: "Общепит", conditional: "если ресторан" },
  ],
  30: [
    { id: 29, why: "Мясо, молочка", conditional: "если полный ассортимент" },
    { id: 32, why: "Напитки" },
    { id: 35, why: "Розничная продажа" },
    { id: 43, why: "Общепит", conditional: "если кофейня/пекарня" },
  ],
  32: [
    { id: 29, why: "Еда", conditional: "если полный ассортимент" },
    { id: 30, why: "Кофе, чай" },
    { id: 33, why: "Алкоголь", conditional: "если есть алкоголь" },
  ],
  35: [
    { id: 9, why: "ПО для продаж", conditional: "если интернет-магазин" },
    { id: 39, why: "Доставка", conditional: "если есть доставка" },
    { id: 42, why: "IT-услуги для маркетплейса", conditional: "если маркетплейс" },
  ],
  36: [
    { id: 35, why: "Реклама финансовых услуг" },
    { id: 45, why: "Юридические услуги", conditional: "если юр. сопровождение" },
  ],
  38: [
    { id: 9, why: "ПО для связи" },
    { id: 42, why: "IT-услуги", conditional: "если разработка" },
  ],
  39: [
    { id: 35, why: "Реклама, диспетчерские услуги" },
    { id: 40, why: "Складские услуги", conditional: "если склад" },
  ],
  40: [
    { id: 20, why: "Мебель на заказ", conditional: "если мебель" },
    { id: 37, why: "Ремонт, обработка" },
  ],
  41: [
    { id: 35, why: "Реклама услуг", conditional: "если продвигаете" },
    { id: 9, why: "Образовательное ПО, видео" },
    { id: 28, why: "Спорт", conditional: "если спорт. услуги" },
  ],
  42: [
    { id: 9, why: "ПО как продукт", conditional: "если есть ПО" },
    { id: 35, why: "Реклама IT-услуг" },
  ],
  43: [
    { id: 29, why: "Свои полуфабрикаты", conditional: "если продаёте" },
    { id: 30, why: "Кофе, чай, выпечка как товары" },
    { id: 39, why: "Доставка блюд", conditional: "если доставка" },
    { id: 35, why: "Реклама ресторана" },
  ],
  44: [
    { id: 3, why: "Косметика для салонов" },
    { id: 5, why: "Медицинские препараты", conditional: "если клиника" },
    { id: 35, why: "Реклама услуг" },
  ],
  45: [
    { id: 35, why: "Бизнес-услуги" },
    { id: 36, why: "Финансовые услуги", conditional: "если фин. юр." },
  ],
};

// ─────────────────── Компонент ───────────────────

export function RelatedClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filteredClasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mktuClasses;
    return mktuClasses.filter(
      (c) => c.name.toLowerCase().includes(q) || String(c.id).includes(q),
    );
  }, [query]);

  const related = selected ? RELATIONS[selected] ?? [] : [];

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-3">
            <Link2 className="size-3.5" />
            Связанные классы
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Что ещё нужно вместе с этим классом
          </h1>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto">
            Выберите класс — увидите какие классы часто идут вместе.
            Это поможет собрать полную заявку и не пропустить важное.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Левая колонка: выбор класса */}
          <div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск класса…"
                className="w-full rounded-md border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden max-h-[500px] overflow-y-auto">
              {filteredClasses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`w-full flex items-center gap-2 p-2.5 text-left border-b border-border/30 last:border-b-0 transition-colors ${
                    selected === c.id ? "bg-gold/10" : "hover:bg-muted/30"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center size-8 rounded text-xs font-bold flex-shrink-0 ${
                      c.type === "goods" ? "bg-gold/10 text-gold" : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {c.id}
                  </span>
                  <span className="text-xs text-foreground/70 truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Правая колонка: связанные классы */}
          <div>
            {!selected ? (
              <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-3 opacity-50">👈</div>
                <p className="text-sm text-foreground/50">
                  Выберите класс слева — увидите связанные
                </p>
              </div>
            ) : related.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-sm text-foreground/70 mb-2">
                  {mktuClasses.find((c) => c.id === selected)?.name}
                </div>
                <p className="text-xs text-foreground/50">
                  Для этого класса нет типичных пар. Скорее всего, он самодостаточен.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider text-foreground/40 font-medium mb-3">
                  Вместе с классом {selected}
                </div>
                <div className="space-y-2">
                  {related.map((r) => {
                    const cls = mktuClasses.find((c) => c.id === r.id);
                    if (!cls) return null;
                    return (
                      <div
                        key={r.id}
                        className="rounded-md border border-border/60 bg-background p-2.5 hover:border-gold/30 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => router.push(`/class/${r.id}`)}
                            className={`flex items-center justify-center size-8 rounded text-xs font-bold flex-shrink-0 hover:scale-105 transition-transform ${
                              r.id <= 34 ? "bg-gold/10 text-gold" : "bg-blue-500/10 text-blue-400"
                            }`}
                            title="Открыть класс"
                          >
                            {r.id}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-foreground mb-0.5">
                              {cls.name}
                            </div>
                            <p className="text-[11px] text-foreground/60 leading-relaxed">
                              {r.why}
                            </p>
                            {r.conditional && (
                              <p className="text-[10px] text-foreground/40 italic mt-1">
                                {r.conditional}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
