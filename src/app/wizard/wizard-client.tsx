"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RefreshCw, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────── Типы ───────────────────

type Step = "type" | "category" | "detail" | "sales" | "result";

interface Answer {
  type?: "goods" | "services" | "both";
  category?: string;
  detail?: string;
  sales?: "physical" | "online" | "both";
}

// ─────────────────── Категории ───────────────────

const CATEGORIES = [
  { id: "food", label: "Еда и напитки", icon: "🍞", hint: "Производство, продажа" },
  { id: "clothing", label: "Одежда и обувь", icon: "👕", hint: "Производство, бренд" },
  { id: "it", label: "IT и ПО", icon: "💻", hint: "Софт, приложения, SaaS" },
  { id: "beauty", label: "Косметика и красота", icon: "💄", hint: "Средства, салоны" },
  { id: "services", label: "Услуги", icon: "🤝", hint: "Консалтинг, сервис" },
  { id: "manufacturing", label: "Производство", icon: "🏭", hint: "Завод, цех" },
  { id: "retail", label: "Торговля", icon: "🛒", hint: "Магазин, маркетплейс" },
  { id: "education", label: "Образование", icon: "📚", hint: "Курсы, обучение" },
  { id: "finance", label: "Финансы", icon: "💰", hint: "Банки, инвестиции" },
  { id: "health", label: "Медицина", icon: "⚕️", hint: "Клиники, препараты" },
  { id: "transport", label: "Транспорт", icon: "🚚", hint: "Доставка, перевозки" },
  { id: "other", label: "Другое", icon: "✨", hint: "Опишу в свободной форме" },
];

// ─────────────────── Матрица категория → классы МКТУ ───────────────────
// Возвращает основные + дополнительные классы с пояснениями.

interface ClassSuggestion {
  id: number;
  role: "main" | "extra";
  why: string;
}

function suggestClasses(answer: Answer): ClassSuggestion[] {
  const result: ClassSuggestion[] = [];
  const cat = answer.category;
  const sales = answer.sales;

  // Если услуга или "both" — добавляем 35 (реклама/бизнес) почти всегда
  const isServices = answer.type === "services" || answer.type === "both";
  const isBoth = answer.type === "both";

  // ─── По категориям ───
  switch (cat) {
    case "food":
      // Производство еды
      result.push({ id: 29, role: "main", why: "Мясо, рыба, молочные продукты, консервы" });
      result.push({ id: 30, role: "main", why: "Кофе, чай, хлеб, кондитерка, специи" });
      result.push({ id: 32, role: "extra", why: "Если безалкогольные напитки, соки, воды" });
      if (sales === "physical" || sales === "both") {
        result.push({ id: 35, role: "main", why: "Розничная продажа продуктов" });
      }
      if (isServices) {
        result.push({ id: 43, role: "extra", why: "Если ресторан, кафе, общепит" });
      }
      break;

    case "clothing":
      result.push({ id: 25, role: "main", why: "Одежда, обувь, головные уборы" });
      result.push({ id: 26, role: "extra", why: "Аксессуары: пуговицы, молнии, галантерея" });
      result.push({ id: 18, role: "extra", why: "Сумки, рюкзаки, чемоданы" });
      if (sales === "online" || sales === "both") {
        result.push({ id: 35, role: "main", why: "Онлайн-продажи одежды" });
      }
      if (sales === "physical" || sales === "both") {
        result.push({ id: 35, role: "main", why: "Розничная торговля одеждой" });
      }
      break;

    case "it":
      result.push({ id: 9, role: "main", why: "Программное обеспечение, приложения, сайты" });
      result.push({ id: 42, role: "main", why: "IT-услуги, разработка, SaaS" });
      result.push({ id: 35, role: "extra", why: "Если есть реклама или онлайн-продажи" });
      break;

    case "beauty":
      result.push({ id: 3, role: "main", why: "Косметика, парфюмерия (препараты для ухода)" });
      if (isServices) {
        result.push({ id: 44, role: "main", why: "Услуги салонов красоты, парикмахерские" });
      }
      if (sales === "physical" || sales === "both") {
        result.push({ id: 35, role: "extra", why: "Розничная продажа косметики" });
      }
      break;

    case "services":
      result.push({ id: 35, role: "main", why: "Реклама, управление, консалтинг — базовый класс услуг" });
      result.push({ id: 41, role: "extra", why: "Если образовательные или развлекательные услуги" });
      result.push({ id: 42, role: "extra", why: "Если IT/технические услуги" });
      result.push({ id: 45, role: "extra", why: "Если юридические, охранные услуги" });
      break;

    case "manufacturing":
      // Универсально — нужен класс под конкретный продукт
      result.push({ id: 40, role: "main", why: "Обработка материалов, производство по заказу" });
      result.push({ id: 35, role: "extra", why: "Если продаёте через посредников/рекламу" });
      // Подсказка обратиться к ИИ
      break;

    case "retail":
      result.push({ id: 35, role: "main", why: "Розничная/оптовая торговля, маркетплейс" });
      result.push({ id: 39, role: "extra", why: "Если есть доставка" });
      break;

    case "education":
      result.push({ id: 41, role: "main", why: "Образование, тренинги, курсы" });
      result.push({ id: 35, role: "extra", why: "Если реклама курсов или франшиза" });
      break;

    case "finance":
      result.push({ id: 36, role: "main", why: "Финансы, страхование, инвестиции" });
      result.push({ id: 35, role: "extra", why: "Если реклама финансовых услуг" });
      break;

    case "health":
      result.push({ id: 5, role: "main", why: "Фармацевтика, медикаменты" });
      result.push({ id: 10, role: "extra", why: "Медицинское оборудование, приборы" });
      if (isServices) {
        result.push({ id: 44, role: "main", why: "Медицинские услуги, клиники" });
      }
      break;

    case "transport":
      result.push({ id: 39, role: "main", why: "Транспорт, доставка, хранение" });
      result.push({ id: 35, role: "extra", why: "Если реклама или диспетчерские услуги" });
      break;

    case "other":
      // Ничего не добавляем — отправим к ИИ
      break;
  }

  // Если "both" (товары и услуги) и не добавили ни одного товара — добавим универсальный 9
  if (isBoth && !result.some((r) => r.id <= 34 && r.role === "main")) {
    result.push({ id: 9, role: "extra", why: "Программное обеспечение или материалы" });
  }

  return result;
}

// ─────────────────── Компонент ───────────────────

export function WizardClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [answer, setAnswer] = useState<Answer>({});

  const steps: Step[] = ["type", "category", "detail", "sales", "result"];
  const currentIdx = steps.indexOf(step);
  const progress = ((currentIdx + 1) / steps.length) * 100;

  const suggestions = step === "result" ? suggestClasses(answer) : [];

  function reset() {
    setAnswer({});
    setStep("type");
  }

  function next(newAnswer: Partial<Answer>, nextStep?: Step) {
    const updated = { ...answer, ...newAnswer };
    setAnswer(updated);

    // Если выбрали "other" на категории — пропускаем detail и идём сразу к результату с подсказкой ИИ
    if (newAnswer.category === "other" && step === "category") {
      setStep("sales");
      return;
    }

    // Логика перехода
    if (nextStep) {
      setStep(nextStep);
    } else if (step === "type") {
      setStep("category");
    } else if (step === "category") {
      setStep("detail");
    } else if (step === "detail") {
      setStep("sales");
    } else if (step === "sales") {
      setStep("result");
    }
  }

  function back() {
    if (step === "category") setStep("type");
    else if (step === "detail") setStep("category");
    else if (step === "sales") setStep("detail");
    else if (step === "result") setStep("sales");
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-3">
            🧭 Мастер
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Определение класса МКТУ
          </h1>
          <p className="text-sm text-foreground/60">
            Ответьте на 4 коротких вопроса — получите список классов с пояснениями
          </p>
        </div>

        {/* Прогресс */}
        {step !== "result" && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-foreground/40 mb-1.5">
              <span>Шаг {currentIdx + 1} из {steps.length - 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Карточка вопроса */}
        <div className="rounded-xl border border-border bg-card p-6 min-h-[300px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* Шаг 1: Тип */}
            {step === "type" && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Что регистрируем?</h2>
                <p className="text-xs text-foreground/50 mb-4">Товар — это физический продукт. Услуга — деятельность.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <button
                    onClick={() => next({ type: "goods" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left group"
                  >
                    <div className="text-3xl mb-2">📦</div>
                    <div className="font-medium text-foreground mb-1">Товары</div>
                    <div className="text-xs text-foreground/50">Физический продукт</div>
                  </button>
                  <button
                    onClick={() => next({ type: "services" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left group"
                  >
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="font-medium text-foreground mb-1">Услуги</div>
                    <div className="text-xs text-foreground/50">Деятельность, сервис</div>
                  </button>
                  <button
                    onClick={() => next({ type: "both" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left group"
                  >
                    <div className="text-3xl mb-2">📦🤝</div>
                    <div className="font-medium text-foreground mb-1">И то и другое</div>
                    <div className="text-xs text-foreground/50">Например, товар + доставка</div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Шаг 2: Категория */}
            {step === "category" && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">К какой категории относится?</h2>
                <p className="text-xs text-foreground/50 mb-4">Выберите ближайшую — это сузит список классов</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => next({ category: c.id })}
                      className={`rounded-lg border p-3 hover:border-gold/40 hover:bg-gold/5 transition-all text-left ${
                        answer.category === c.id ? "border-gold bg-gold/10" : "border-border bg-background"
                      }`}
                    >
                      <div className="text-2xl mb-1">{c.icon}</div>
                      <div className="text-sm font-medium text-foreground">{c.label}</div>
                      <div className="text-[10px] text-foreground/40">{c.hint}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Шаг 3: Детали */}
            {step === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Опишите подробнее</h2>
                <p className="text-xs text-foreground/50 mb-4">1-3 слова о конкретном продукте/услуге</p>
                <textarea
                  autoFocus
                  value={answer.detail ?? ""}
                  onChange={(e) => setAnswer({ ...answer, detail: e.target.value })}
                  placeholder="Например: кофе, мобильное приложение, одежда для детей…"
                  rows={3}
                  className="flex-1 min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={back} className="text-xs">
                    <ArrowLeft className="size-3.5 mr-1" />
                    Назад
                  </Button>
                  <Button
                    onClick={() => next({})}
                    size="sm"
                    className="bg-gold text-background hover:bg-gold-dark text-xs ml-auto"
                  >
                    Далее
                    <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Шаг 4: Канал продаж */}
            {step === "sales" && (
              <motion.div
                key="sales"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Как продаёте?</h2>
                <p className="text-xs text-foreground/50 mb-4">От этого зависит нужен ли класс 35 (реклама/продажи)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <button
                    onClick={() => next({ sales: "physical" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">🏪</div>
                    <div className="font-medium text-foreground mb-1">Физически</div>
                    <div className="text-xs text-foreground/50">Магазин, точка</div>
                  </button>
                  <button
                    onClick={() => next({ sales: "online" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">💻</div>
                    <div className="font-medium text-foreground mb-1">Онлайн</div>
                    <div className="text-xs text-foreground/50">Сайт, маркетплейс</div>
                  </button>
                  <button
                    onClick={() => next({ sales: "both" })}
                    className="rounded-lg border border-border bg-background p-5 hover:border-gold/40 hover:bg-gold/5 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">🏪💻</div>
                    <div className="font-medium text-foreground mb-1">Оба</div>
                    <div className="text-xs text-foreground/50">Офлайн + онлайн</div>
                  </button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={back} className="text-xs">
                    <ArrowLeft className="size-3.5 mr-1" />
                    Назад
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Результат */}
            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-foreground mb-1">Рекомендуемые классы</h2>
                <p className="text-xs text-foreground/50 mb-4">
                  На основе: {answer.type === "goods" ? "товары" : answer.type === "services" ? "услуги" : "товары+услуги"}
                  {answer.category && ` · ${CATEGORIES.find((c) => c.id === answer.category)?.label}`}
                  {answer.detail && ` · ${answer.detail}`}
                </p>

                {suggestions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <div className="text-4xl mb-3">🤔</div>
                    <p className="text-foreground/70 text-sm mb-4">
                      Не получилось определить автоматически. Попробуйте ИИ-помощник —
                      он справится с любым описанием.
                    </p>
                    <Button
                      onClick={() => router.push("/assistant")}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      <Sparkles className="size-4 mr-1.5" />
                      Открыть ИИ-помощник
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Основные классы */}
                    {suggestions.filter((s) => s.role === "main").length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-foreground/40 font-medium mb-2">
                          Основные
                        </h3>
                        <div className="space-y-2">
                          {suggestions.filter((s) => s.role === "main").map((s) => (
                            <ClassCard key={s.id} suggestion={s} onOpen={(id) => router.push(`/class/${id}`)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Дополнительные классы */}
                    {suggestions.filter((s) => s.role === "extra").length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-foreground/40 font-medium mb-2">
                          Дополнительные (если применимо)
                        </h3>
                        <div className="space-y-2">
                          {suggestions.filter((s) => s.role === "extra").map((s) => (
                            <ClassCard key={s.id} suggestion={s} onOpen={(id) => router.push(`/class/${id}`)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Подсказка ИИ */}
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-foreground/70">
                        💡 Хотите точнее?{" "}
                        <button
                          onClick={() => router.push("/assistant")}
                          className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
                        >
                          Спросите ИИ-помощника
                        </button>{" "}
                        — он учтёт все нюансы.
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={reset} className="text-xs">
                    <RefreshCw className="size-3.5 mr-1" />
                    Начать заново
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                    size="sm"
                    className="bg-gold text-background hover:bg-gold-dark text-xs ml-auto"
                  >
                    На главную
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

// ─────────────────── Карточка класса в результате ───────────────────

function ClassCard({
  suggestion,
  onOpen,
}: {
  suggestion: ClassSuggestion;
  onOpen: (id: number) => void;
}) {
  const isGoods = suggestion.id <= 34;
  return (
    <div className="rounded-lg border border-border bg-background p-3 hover:border-gold/30 transition-colors">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onOpen(suggestion.id)}
          className={`flex items-center justify-center size-10 rounded-md font-bold text-sm flex-shrink-0 ${
            isGoods ? "bg-gold/10 text-gold" : "bg-blue-500/10 text-blue-400"
          } hover:scale-105 transition-transform`}
          title="Открыть класс"
        >
          {suggestion.id}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase tracking-wider text-foreground/40">
              {isGoods ? "Товары" : "Услуги"}
            </span>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed">{suggestion.why}</p>
        </div>
      </div>
    </div>
  );
}
