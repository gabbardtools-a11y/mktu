"use client";

import { useState, useMemo, useEffect } from "react";
import { Calculator as CalcIcon, Info, FileText, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { tClassesCount, tItems } from "@/lib/i18n/translations";
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
  const { lang, t } = useLanguage();
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
              {t("ca.title")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("ca.sub")}
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
            {t("ca.basis")}{" "}
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
            {t("ca.input")}
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label
                htmlFor="classes"
                className="block text-sm font-medium text-foreground"
              >
                {t("ca.classes")}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClasses((c) => Math.max(1, c - 1))}
                  className="size-10 shrink-0 rounded-md border border-border bg-background hover:bg-accent text-foreground text-lg font-medium transition-colors"
                  aria-label={t("ca.dec")}
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
                  aria-label={t("ca.inc")}
                >
                  +
                </button>
              </div>
              <p className="text-xs text-foreground/50">
                {t("ca.range")}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="items"
                className="block text-sm font-medium text-foreground"
              >
                {t("ca.items")}
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
                {t("ca.fee24hint")}
              </p>
            </div>
          </div>

          {result.p24ItemsOver > 0 && (
            <div className="flex gap-2 text-xs text-foreground/60 bg-muted/40 border border-border/60 rounded-md p-3">
              <Info className="size-4 shrink-0 mt-0.5 text-blue-500" />
              <p>
                {t("ca.overLine")} <strong className="text-foreground">{result.p24ItemsOver}</strong>{" "}
                ({t("ca.freeA")} {FEES.p24.itemsFreePerClass} {t("ca.freeB")}{" "}
                {FEES.p24.itemsFreePerClass * result.cls}, {t("ca.freeC")} {result.itm}).
                {t("ca.extra")} <strong className="text-foreground">{fmtRub(result.p24ExtraItems)}</strong>
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
                {t("ca.paper")}
              </div>
              <p className="text-xs text-foreground/50">
                {t("ca.paperHint")}
              </p>
            </div>
          </label>
        </section>

        {/* Результат: при подаче заявки */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Clock className="size-5 text-blue-500" />
            <h2 className="font-semibold text-foreground">
              {t("ca.filing")}
            </h2>
            <span className="ml-auto text-xs text-foreground/50">
              {t("ca.filingWhen")}
            </span>
          </div>

          <div className="divide-y divide-border/60">
            <FeeRow
              code={FEES.p21.code}
              title={FEES.p21.title}
              base={FEES.p21.base}
              extra={result.p21ExtraClasses}
              total={result.p21Total}
              hint={`${t("ca.base")} 4 000 ₽ + ${Math.max(0, result.cls - 1)} × 1 000 ₽ ${t("ca.perExtraClass")}`}
            />
            <FeeRow
              code={FEES.p24.code}
              title={FEES.p24.title}
              base={FEES.p24.base}
              extra={result.p24ExtraClasses + result.p24ExtraItems}
              total={result.p24Total}
              hint={
                `${t("ca.base")} 13 000 ₽ + ${Math.max(0, result.cls - 1)} × 2 500 ₽ ${t("ca.perExtraClass")}` +
                (result.p24ExtraItems > 0
                  ? ` + ${result.p24ItemsOver} × 500 ₽ ${t("ca.perExtraItems")}`
                  : "")
              }
            />
          </div>

          <div className="px-5 sm:px-6 py-4 bg-blue-500/5 border-t border-blue-500/20 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              {t("ca.filingTotal")}
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
              {t("ca.reg")}
            </h2>
            <span className="ml-auto text-xs text-foreground/50">
              {t("ca.regWhen")}
            </span>
          </div>

          <div className="divide-y divide-border/60">
            <FeeRow
              code={FEES.p211.code}
              title={FEES.p211.title}
              base={FEES.p211.base}
              extra={result.p211ExtraClasses}
              total={result.p211Total}
              hint={`${t("ca.base")} 18 000 ₽ + ${Math.max(0, result.cls - 5)} × 2 000 ₽ ${t("ca.perClassOver5")}`}
            />
            {paperCert && (
              <FeeRow
                code={FEES.p214.code}
                title={FEES.p214.title}
                base={FEES.p214.base}
                extra={0}
                total={FEES.p214.base}
                hint={t("ca.hint214")}
              />
            )}
          </div>

          <div className="px-5 sm:px-6 py-4 bg-green-500/5 border-t border-green-500/20 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              {t("ca.regTotal")}{paperCert ? t("ca.withPaper") : ""}
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
                {t("ca.grand")}
              </div>
              <div className="text-sm text-foreground/70">
                {tClassesCount(lang, result.cls)} · {tItems(lang, result.itm)} {t("ca.inList")}
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
                {t("ca.n1")}
              </p>
              <p>
                {t("ca.n2")}
              </p>
              <p>
                {t("ca.n3")}
              </p>
              <p>
                {t("ca.n4")}
              </p>
              <p>
                {t("ca.n5")}
              </p>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-foreground/40 pt-2">
          {t("ca.footer")}
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
  const { t } = useLanguage();
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
              {t("ca.base")} {fmtRub(base)} + {fmtRub(extra)}
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
