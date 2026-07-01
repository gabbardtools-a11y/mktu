"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";

// ─────────────────── Кейсы ───────────────────

interface ClassRef {
  id: number;
  reason: string;
  required: "always" | "sometimes";
}

interface CaseItem {
  id: string;
  emoji: string;
  question: string;
  shortAnswer: string;
  classes: ClassRef[];
  tip?: string;
  warning?: string;
}

const CASES: CaseItem[] = [
  {
    id: "online-store",
    emoji: "🛒",
    question: "Интернет-магазин одежды",
    shortAnswer: "Класс 25 (одежда) + 35 (онлайн-продажи). Если своя марка — только 25+35.",
    classes: [
      { id: 25, reason: "Одежда, обувь — сам товар", required: "always" },
      { id: 35, reason: "Онлайн-продажи, реклама, маркетплейс", required: "always" },
      { id: 18, reason: "Сумки, ремни как доп. ассортимент", required: "sometimes" },
      { id: 26, reason: "Аксессуары: пуговицы, бижутерия", required: "sometimes" },
      { id: 39, reason: "Если есть своя служба доставки", required: "sometimes" },
    ],
    tip: "Если перепродаёте чужие бренды — достаточно класса 35. Если создаёте свой бренд одежды — обязательно 25.",
    warning: "Не путайте: класс 25 это товар (одежда), класс 35 это услуга (продажа). Для интернет-магазина обычно нужны оба.",
  },
  {
    id: "it-startup",
    emoji: "💻",
    question: "IT-стартап (SaaS, веб-сервис)",
    shortAnswer: "Класс 9 (ПО) + 42 (IT-услуги). Если есть платная подписка — добавьте 35.",
    classes: [
      { id: 9, reason: "Программное обеспечение как продукт", required: "always" },
      { id: 42, reason: "SaaS, разработка, техподдержка — услуги", required: "always" },
      { id: 35, reason: "Если реклама, платная подписка, маркетплейс", required: "sometimes" },
      { id: 38, reason: "Если телеком-услуги, передача данных", required: "sometimes" },
    ],
    tip: "Для SaaS критично указать оба класса: 9 (чтобы защитить название ПО) и 42 (чтобы защитить услугу).",
    warning: "Если ваш сервис мобильный — класс 9 покрывает приложение. Не нужен отдельный класс для «мобильного ПО».",
  },
  {
    id: "coffee-shop",
    emoji: "☕",
    question: "Кофейня с собственным производством зёрен",
    shortAnswer: "Класс 43 (общепит) + 30 (кофе) + 35 (если продаёте зёрна в розницу).",
    classes: [
      { id: 43, reason: "Услуги общепита — основная деятельность", required: "always" },
      { id: 30, reason: "Кофе, чай, выпечка как товары", required: "always" },
      { id: 35, reason: "Розничная продажа зёрен, merchandise", required: "sometimes" },
      { id: 29, reason: "Если готовите еду (сэндвичи, салаты)", required: "sometimes" },
    ],
    tip: "Если только перепродаёте чужой кофе (без обжарки) — класс 30 не нужен, хватит 43 и 35.",
    warning: "Открываете сеть? Зарегистрируйте ТЗ на название сейчас — до того, как кто-то скопирует.",
  },
  {
    id: "mobile-app",
    emoji: "📱",
    question: "Мобильное приложение для доставки еды",
    shortAnswer: "Класс 9 (приложение) + 35 (сервис) + 39 (доставка). Если готовите — 43.",
    classes: [
      { id: 9, reason: "Само мобильное приложение (ПО)", required: "always" },
      { id: 35, reason: "Реклама, агрегация ресторанов", required: "always" },
      { id: 39, reason: "Транспортные услуги — доставка", required: "always" },
      { id: 43, reason: "Если готовите еду сами", required: "sometimes" },
      { id: 42, reason: "Если есть SaaS-компонент для ресторанов", required: "sometimes" },
    ],
    tip: "Начните с 9, 35 и 39 — это ядро. Класс 43 добавьте только если у вас своё производство еды.",
    warning: "Если просто агрегатор (как Delivery Club) — класс 43 НЕ нужен, вы не готовите еду.",
  },
  {
    id: "cosmetics-brand",
    emoji: "💄",
    question: "Собственный бренд косметики",
    shortAnswer: "Класс 3 (косметика) — основной. Для продаж добавьте 35.",
    classes: [
      { id: 3, reason: "Косметика, парфюмерия — основной товар", required: "always" },
      { id: 35, reason: "Продажи, реклама, интернет-магазин", required: "always" },
      { id: 5, reason: "Если есть лечебная косметика (космецевтика)", required: "sometimes" },
      { id: 44, reason: "Если услуги салонов красоты", required: "sometimes" },
    ],
    tip: "Класс 3 — самый важный. Защитит бренд на кремы, помады, духи. Класс 5 нужен только для лечебных средств.",
    warning: "«Органическая косметика» — это маркетинговый термин, не отдельный класс. Всю косметику регистрируют в классе 3.",
  },
  {
    id: "fitness",
    emoji: "💪",
    question: "Фитнес-клуб с онлайн-тренировками",
    shortAnswer: "Класс 41 (услуги) + 9 (видео/ПО) + 35 (реклама). Для мерча — 25.",
    classes: [
      { id: 41, reason: "Услуги фитнеса, тренировки — основная деятельность", required: "always" },
      { id: 9, reason: "Видео-курсы, приложение, ПО", required: "always" },
      { id: 35, reason: "Реклама, продвижение клуба", required: "sometimes" },
      { id: 25, reason: "Брендовая одежда (футболки, шорты)", required: "sometimes" },
      { id: 28, reason: "Спортинвентарь под брендом", required: "sometimes" },
    ],
    tip: "Онлайн-тренировки = класс 41 (услуга обучения). Видео как таковое — класс 9. Зависит от модели.",
    warning: "Если только онлайн — без физического клуба — класс 41 всё равно подходит, это «образовательные услуги».",
  },
  {
    id: "marketplace",
    emoji: "🏪",
    question: "Маркетплейс handmade-товаров",
    shortAnswer: "Класс 35 (платформа) — основной. IT-часть — класс 42.",
    classes: [
      { id: 35, reason: "Платформа для продаж, реклама, посредничество", required: "always" },
      { id: 42, reason: "IT-инфраструктура, разработка платформы", required: "always" },
      { id: 9, reason: "Приложение маркетплейса", required: "sometimes" },
      { id: 39, reason: "Если есть логистика для продавцов", required: "sometimes" },
      { id: 45, reason: "Юридическое сопровождение сделок", required: "sometimes" },
    ],
    tip: "Маркетплейс не продаёт товары сам — он предоставляет услугу площадки. Поэтому класс 35 (услуга), а не товары.",
    warning: "Не пытайтесь зарегистрировать ТЗ на категории товаров продавцов — только на бренд самого маркетплейса.",
  },
  {
    id: "furniture",
    emoji: "🪑",
    question: "Производство мебели на заказ",
    shortAnswer: "Класс 20 (мебель) — основной. Для услуг — 40 (обработка).",
    classes: [
      { id: 20, reason: "Мебель, зеркала — основная продукция", required: "always" },
      { id: 40, reason: "Услуги обработки материалов по заказу", required: "always" },
      { id: 35, reason: "Если есть реклама, каталог", required: "sometimes" },
      { id: 19, reason: "Деревянные материалы (если продаёте)", required: "sometimes" },
    ],
    tip: "Класс 20 — для самой мебели (товар). Класс 40 — для услуги «изготовление на заказ».",
    warning: "Мебель на заказ — это и товар, и услуга. Рекомендуем оба класса для полной защиты.",
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    question: "Ресторан с доставкой",
    shortAnswer: "Класс 43 (общепит) + 39 (доставка). Если свои продукты — 29/30.",
    classes: [
      { id: 43, reason: "Услуги ресторана — основная деятельность", required: "always" },
      { id: 39, reason: "Доставка блюд", required: "always" },
      { id: 35, reason: "Реклама, маркетинг", required: "sometimes" },
      { id: 29, reason: "Если продаёте свои полуфабрикаты, соусы", required: "sometimes" },
      { id: 30, reason: "Если продаёте кофе, чай, выпечку как товар", required: "sometimes" },
    ],
    tip: "Если доставляете чужую еду (агрегатор) — класс 43 не нужен, вы не готовите. Нужен 35 и 39.",
    warning: "Ресторан = приготовление + обслуживание = класс 43. Просто доставка готовой еды = класс 39.",
  },
  {
    id: "consulting",
    emoji: "💼",
    question: "Консалтинговая компания",
    shortAnswer: "Класс 35 (бизнес-услуги) — основной. Для узких специализаций — 41/42/45.",
    classes: [
      { id: 35, reason: "Бизнес-консалтинг, управление — базовый", required: "always" },
      { id: 41, reason: "Если тренинги, обучение сотрудников", required: "sometimes" },
      { id: 42, reason: "Если технический/IT-консалтинг", required: "sometimes" },
      { id: 45, reason: "Если юридический консалтинг", required: "sometimes" },
    ],
    tip: "Начните с класса 35 — он покрывает большинство консалтинговых услуг. Добавьте спецкласс под вашу нишу.",
    warning: "«Аудит» — это класс 35. «Бухгалтерские услуги» — тоже 35. Не ищите отдельный класс.",
  },
];

// ─────────────────── Компонент ───────────────────

export function FaqCasesClient() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(CASES[0].id);

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-3">
            💡 Частые кейсы
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Классы МКТУ для популярных бизнесов
          </h1>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto">
            Готовые решения с пояснениями. Найдите свой кейс — увидите какие классы
            нужны и почему. Разворачивайте карточки для деталей.
          </p>
        </motion.div>

        {/* Список кейсов */}
        <div className="space-y-2">
          {CASES.map((item) => (
            <CaseCard
              key={item.id}
              item={item}
              isOpen={open === item.id}
              onToggle={() => setOpen(open === item.id ? null : item.id)}
              onClassClick={(id) => router.push(`/class/${id}`)}
            />
          ))}
        </div>

        {/* Подсказка про ИИ */}
        <div className="mt-8 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-blue-400 mb-1">
            <Sparkles className="size-4" />
            Не нашли свой кейс?
          </div>
          <p className="text-xs text-foreground/60 mb-3">
            Спросите ИИ-помощника — он определит классы для любого бизнеса
          </p>
          <button
            onClick={() => router.push("/assistant")}
            className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 font-medium"
          >
            Открыть ИИ-помощник
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

// ─────────────────── Карточка кейса ───────────────────

function CaseCard({
  item,
  isOpen,
  onToggle,
  onClassClick,
}: {
  item: CaseItem;
  isOpen: boolean;
  onToggle: () => void;
  onClassClick: (id: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors flex items-center gap-3"
        aria-expanded={isOpen}
      >
        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground text-sm sm:text-base">{item.question}</div>
          {!isOpen && (
            <div className="text-xs text-foreground/50 mt-0.5 truncate">{item.shortAnswer}</div>
          )}
        </div>
        <ChevronDown
          className={`size-4 text-foreground/40 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/50 space-y-3">
              {/* Классы */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-foreground/40 font-medium mb-2 mt-2">
                  Рекомендуемые классы
                </h3>
                <div className="space-y-1.5">
                  {item.classes.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <button
                        onClick={() => onClassClick(c.id)}
                        className={`flex items-center justify-center size-9 rounded-md font-bold text-xs flex-shrink-0 hover:scale-105 transition-transform ${
                          c.id <= 34 ? "bg-gold/10 text-gold" : "bg-blue-500/10 text-blue-400"
                        }`}
                        title="Открыть класс"
                      >
                        {c.id}
                      </button>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                            {c.id <= 34 ? "Товары" : "Услуги"}
                          </span>
                          {c.required === "sometimes" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50">
                              опционально
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{c.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Совет */}
              {item.tip && (
                <div className="flex gap-2 text-xs text-foreground/70 bg-green-500/5 border border-green-500/20 rounded-md p-2.5">
                  <span className="text-green-500 font-bold flex-shrink-0">💡 Совет:</span>
                  <p className="leading-relaxed">{item.tip}</p>
                </div>
              )}

              {/* Предупреждение */}
              {item.warning && (
                <div className="flex gap-2 text-xs text-foreground/70 bg-amber-500/5 border border-amber-500/20 rounded-md p-2.5">
                  <span className="text-amber-500 font-bold flex-shrink-0">⚠ Важно:</span>
                  <p className="leading-relaxed">{item.warning}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
