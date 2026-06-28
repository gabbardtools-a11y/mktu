"use client";

import { useState, useMemo, useEffect } from "react";
import { Calculator as CalcIcon, Info, FileText, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  FEES,
  calculateFees,
  fmtRub,
  pluralClasses,
  pluralItems,
} from "@/lib/fees";

// ─────────────────── Чтение query-параметров для предзаполнения ───────────────────
// Поддерживаемые: ?classes=N&items=M&paper=0|1
// Используется когда пользователь переходит «Подробнее» из корзины.
function readInitialFromQuery() {
  if (typeof window === "undefined") {
    return { classes: 1, items: 1, paperCert: false };
  }
  const params = new URLSearchParams(window.location.search);
  const classes = Math.max(1, Math.min(45, Number(params.get("classes")) || 1));
  const items = Math.max(0, Math.min(999, Number(params.get("items")) || 1));
  const paperParam = params.get("paper");
  const paperCert = paperParam === "1" || paperParam === "true";
  return { classes, items, paperCert };
}

export default function CalculatorPage() {
  const [classes, setClasses] = useState(1);
  const [items, setItems] = useState(1);
  const [paperCert, setPaperCert] = useState(false);

  // Прочитать query-параметры один раз при монтировании
  useEffect(() => {
    const init = readInitialFromQuery();
    setClasses(init.classes);
    setItems(init.items);
    setPaperCert(init.paperCert);
  }, []);

  const result = useMemo(() => {
    const cls = Math.max(1, Math.floor(classes) || 1);
    const itm = Math.max(0, Math.floor(items) || 0);

    // Калькулятор принимает только общее число позиций.
    // Распределяем равномерно по классам — это упрощение.
    // Для точного расчёта по распределению используйте корзину.
    const perClass = Math.floor(itm / cls);
    const remainder = itm - perClass * cls;
    const itemsPerClass = Array.from({ length: cls }, (_, i) =>
      perClass + (i < remainder ? 1 : 0),
    );

    const fees = calculateFees(itemsPerClass, paperCert);

    return {
      cls,
      itm,
      ...fees,
    };
  }, [classes, items, paperCert]);

  return (
    <main className="container max-w-4xl mx-auto px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Заголовок */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <CalcIcon className="size-6" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Калькулятор пошлин Роспатента
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Расчёт государственных пошлин за регистрацию товарного знака
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
            Базовые пошлины за 1 класс МКТУ по Положению о патентных и иных пошлинах
            (актуально на 2026 год). Источник:{" "}
            <a
              href="https://rospatent.gov.ru/ru/activities/dues/table"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
            >
              rospatent.gov.ru
            </a>
            .
          </p>
        </header>

        {/* Ввод данных */}
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Введите параметры заявки
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label
                htmlFor="classes"
                className="block text-sm font-medium text-foreground"
              >
                Количество классов МКТУ
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClasses((c) => Math.max(1, c - 1))}
                  className="size-10 shrink-0 rounded-md border border-border bg-background hover:bg-accent text-foreground text-lg font-medium transition-colors"
                  aria-label="Уменьшить"
                >
                  −
                </button>
                <input
                  id="classes"
                  type="number"
                  min={1}
                  max={45}
                  value={classes}
                  onChange={(e) => setClasses(Number(e.target.value))}
                  className="flex-1 min-w-0 rounded-md border border-border bg-background px-3 py-2 text-center text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setClasses((c) => Math.min(45, c + 1))}
                  className="size-10 shrink-0 rounded-md border border-border bg-background hover:bg-accent text-foreground text-lg font-medium transition-colors"
                  aria-label="Увеличить"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-foreground/50">
                от 1 до 45 (товары: 1–34, услуги: 35–45)
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="items"
                className="block text-sm font-medium text-foreground"
              >
                Товаров и услуг в перечне (всего)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItems((c) => Math.max(0, c - 1))}
                  className="size-10 shrink-0 rounded-md border border-border bg-background hover:bg-accent text-foreground text-lg font-medium transition-colors"
                  aria-label="Уменьшить"
                >
                  −
                </button>
                <input
                  id="items"
                  type="number"
                  min={0}
                  max={999}
                  value={items}
                  onChange={(e) => setItems(Number(e.target.value))}
                  className="flex-1 min-w-0 rounded-md border border-border bg-background px-3 py-2 text-center text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setItems((c) => Math.min(999, c + 1))}
                  className="size-10 shrink-0 rounded-md border border-border bg-background hover:bg-accent text-foreground text-lg font-medium transition-colors"
                  aria-label="Увеличить"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-foreground/50">
                пошлина 2.4: +500 ₽ за каждую позицию свыше 10 в классе
              </p>
            </div>
          </div>

          {result.p24ItemsOver > 0 && (
            <div className="flex gap-2 text-xs text-foreground/60 bg-muted/40 border border-border/60 rounded-md p-3">
              <Info className="size-4 shrink-0 mt-0.5 text-blue-500" />
              <p>
                Позиций сверх лимита: <strong className="text-foreground">{result.p24ItemsOver}</strong>{" "}
                (бесплатно {FEES.p24.itemsFreePerClass} × {result.cls} классов ={" "}
                {FEES.p24.itemsFreePerClass * result.cls}, всего в перечне {result.itm}).
                Доплата: <strong className="text-foreground">{fmtRub(result.p24ExtraItems)}</strong>
              </p>
            </div>
          )}

          {/* Опция: бумажное свидетельство */}
          <label className="flex items-start gap-3 cursor-pointer rounded-md border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3">
            <input
              type="checkbox"
              checked={paperCert}
              onChange={(e) => setPaperCert(e.target.checked)}
              className="mt-0.5 size-4 accent-blue-500 cursor-pointer"
            />
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="text-sm font-medium text-foreground flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center justify-center min-w-9 h-5 px-1.5 rounded bg-muted text-[10px] font-bold text-foreground/70">
                  2.14
                </span>
                Бумажное свидетельство (+3 000 ₽)
              </div>
              <p className="text-xs text-foreground/50">
                Опционально — по умолчанию выдаётся электронное (п. 2.11). Бумажное можно
                запросить по ходатайству правообладателя.
              </p>
            </div>
          </label>
        </section>

        {/* Результат: при подаче заявки */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Clock className="size-5 text-blue-500" />
            <h2 className="font-semibold text-foreground">
              При подаче заявки
            </h2>
            <span className="ml-auto text-xs text-foreground/50">
              в течение 2 месяцев с даты подачи
            </span>
          </div>

          <div className="divide-y divide-border/60">
            <FeeRow
              code={FEES.p21.code}
              title={FEES.p21.title}
              base={FEES.p21.base}
              extra={result.p21ExtraClasses}
              total={result.p21Total}
              hint={`база 4 000 ₽ + ${Math.max(0, result.cls - 1)} × 1 000 ₽ за доп. класс`}
            />
            <FeeRow
              code={FEES.p24.code}
              title={FEES.p24.title}
              base={FEES.p24.base}
              extra={result.p24ExtraClasses + result.p24ExtraItems}
              total={result.p24Total}
              hint={
                `база 13 000 ₽ + ${Math.max(0, result.cls - 1)} × 2 500 ₽ за доп. класс` +
                (result.p24ExtraItems > 0
                  ? ` + ${result.p24ItemsOver} × 500 ₽ за доп. позиции`
                  : "")
              }
            />
          </div>

          <div className="px-5 sm:px-6 py-4 bg-blue-500/5 border-t border-blue-500/20 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Итого при подаче заявки
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-500 dark:text-blue-400">
              {fmtRub(result.totalAtFiling)}
            </span>
          </div>
        </section>

        {/* Результат: после решения о регистрации */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-500" />
            <h2 className="font-semibold text-foreground">
              После решения о регистрации
            </h2>
            <span className="ml-auto text-xs text-foreground/50">
              продлевает знак на 10 лет
            </span>
          </div>

          <div className="divide-y divide-border/60">
            <FeeRow
              code={FEES.p211.code}
              title={FEES.p211.title}
              base={FEES.p211.base}
              extra={result.p211ExtraClasses}
              total={result.p211Total}
              hint={`база 18 000 ₽ + ${Math.max(0, result.cls - 5)} × 2 000 ₽ за класс свыше 5`}
            />
            {paperCert && (
              <FeeRow
                code={FEES.p214.code}
                title={FEES.p214.title}
                base={FEES.p214.base}
                extra={0}
                total={FEES.p214.base}
                hint="по ходатайству правообладателя · фиксированная пошлина, не зависит от числа классов"
              />
            )}
          </div>

          <div className="px-5 sm:px-6 py-4 bg-green-500/5 border-t border-green-500/20 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Итого за регистрацию{paperCert ? " (с бумажным свидетельством)" : ""}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {fmtRub(result.totalRegistration)}
            </span>
          </div>
        </section>

        {/* Итоговая сумма */}
        <section className="rounded-xl border-2 border-gold/40 bg-gradient-to-br from-gold/5 to-transparent p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-foreground/50 font-medium">
                Всего за весь процесс регистрации
              </div>
              <div className="text-sm text-foreground/70">
                {result.cls} {pluralClasses(result.cls)} · {result.itm} {pluralItems(result.itm)} в перечне
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-gold">
              {fmtRub(result.totalProject)}
            </div>
          </div>
        </section>

        {/* Сноски */}
        <section className="rounded-lg bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-3 text-xs sm:text-sm text-foreground/70">
          <div className="flex gap-2">
            <FileText className="size-4 shrink-0 mt-0.5 text-foreground/40" />
            <div className="space-y-2">
              <p>
                <strong className="text-foreground">2.1 + 2.4 платятся одновременно</strong> —
                в течение 2 месяцев с даты подачи заявки на регистрацию товарного знака.
                Это базовые пошлины за 1 класс МКТУ; сверху начисляется доплата за каждый
                дополнительный класс и за позиции свыше 10 в одном классе (только для 2.4).
              </p>
              <p>
                <strong className="text-foreground">2.11 платится после решения о регистрации</strong> —
                пошлина за регистрацию товарного знака и выдачу свидетельства в форме
                электронного документа. Свидетельство действует 10 лет с даты подачи заявки,
                после чего может быть продлено (п. 2.22 — отдельная пошлина).
              </p>
              <p>
                <strong className="text-foreground">2.14 — опциональная бумажная выдача</strong> —
                если нужно свидетельство на бумажном носителе (в дополнение к электронному),
                подаётся отдельное ходатайство с уплатой 3 000 ₽. Большинству заявителей
                достаточно электронного свидетельства — оно имеет ту же юридическую силу.
              </p>
              <p>
                <strong className="text-foreground">Льготных категорий для товарных знаков нет</strong> —
                в отличие от патентов на изобретения, для регистрации ТЗ пошлины не
                уменьшаются для каких-либо категорий заявителей.
              </p>
              <p>
                <strong className="text-foreground">Допущено упрощение:</strong> на этой
                странице позиции распределяются равномерно по классам. Если распределение
                неравномерное (например, 25 в одном классе и 5 в другом), фактическая
                пошлина может быть выше. <strong className="text-foreground">Для точного
                расчёта по вашему перечню — добавьте классы в корзину,</strong> там
                калькулятор считает по каждому классу отдельно.
              </p>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-foreground/40 pt-2">
          Данные актуальны на 2026 год · Положение о патентных и иных пошлинах, утв.
          Постановлением Правительства РФ
        </p>
      </motion.div>
    </main>
  );
}

// ─────────────────── Вспомогательные компоненты ───────────────────

function FeeRow({
  code,
  title,
  base,
  extra,
  total,
  hint,
}: {
  code: string;
  title: string;
  base: number;
  extra: number;
  total: number;
  hint: string;
}) {
  return (
    <div className="px-5 sm:px-6 py-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5 inline-flex items-center justify-center min-w-9 h-6 px-2 rounded bg-muted text-xs font-bold text-foreground/70">
          {code}
        </span>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-sm sm:text-base font-medium text-foreground">
            {title}
          </div>
          <div className="text-xs text-foreground/50">{hint}</div>
          {extra > 0 && (
            <div className="text-xs text-foreground/40">
              база {fmtRub(base)} + доплата {fmtRub(extra)}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-base sm:text-lg font-semibold text-foreground tabular-nums">
            {fmtRub(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
