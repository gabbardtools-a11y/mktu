"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ChevronDown,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import type { CartClass } from "@/hooks/use-favorites-cart";
import { calculateFees, fmtRub } from "@/lib/fees";

interface CartFeesCalculatorProps {
  cart: CartClass[];
  paperCert: boolean;
  onPaperCertChange: (v: boolean) => void;
}

export function CartFeesCalculator({
  cart,
  paperCert,
  onPaperCertChange,
}: CartFeesCalculatorProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const result = useMemo(() => {
    // Сортируем классы по id — стабильный порядок
    const sorted = [...cart].sort((a, b) => a.classId - b.classId);
    const itemsPerClass = sorted.map((c) => c.selectedItems.length);
    return calculateFees(itemsPerClass, paperCert);
  }, [cart, paperCert]);

  if (cart.length === 0) return null;

  // Готовим query для перехода на /calculator
  const totalItems = cart.reduce((acc, c) => acc + c.selectedItems.length, 0);
  const query = new URLSearchParams({
    classes: String(cart.length),
    items: String(totalItems),
    paper: paperCert ? "1" : "0",
  }).toString();

  return (
    <div className="rounded-lg border border-gold/30 bg-card overflow-hidden">
      {/* Заголовок — кликабельный */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 p-3 hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <Calculator className="size-4 text-gold shrink-0" />
        <span className="text-sm font-medium text-foreground flex-1 text-left">
          Пошлины Роспатента
        </span>
        <span className="text-sm font-bold text-gold tabular-nums">
          {fmtRub(result.totalProject)}
        </span>
        <ChevronDown
          className={`size-4 text-foreground/40 transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-border/50 space-y-3 pt-3">
              {/* При подаче */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                  <Clock className="size-3 text-blue-500" />
                  <span>При подаче (2.1 + 2.4)</span>
                </div>
                <FeeLine code="2.1" total={result.p21Total} />
                <FeeLine
                  code="2.4"
                  total={result.p24Total}
                  sub={
                    result.p24ExtraItems > 0
                      ? `вкл. ${result.p24ItemsOver} × 500 ₽ за позиции свыше 10`
                      : undefined
                  }
                />
                <div className="flex items-baseline justify-between pl-1 pt-0.5">
                  <span className="text-xs text-foreground/60">Итого при подаче</span>
                  <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 tabular-nums">
                    {fmtRub(result.totalAtFiling)}
                  </span>
                </div>
              </div>

              {/* После решения */}
              <div className="space-y-1.5 pt-2 border-t border-border/30">
                <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                  <CheckCircle2 className="size-3 text-green-500" />
                  <span>Регистрация (2.11)</span>
                </div>
                <FeeLine code="2.11" total={result.p211Total} />

                {/* Чекбокс 2.14 */}
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paperCert}
                    onChange={(e) => onPaperCertChange(e.target.checked)}
                    className="size-3.5 accent-blue-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="flex-1 text-xs text-foreground/60">
                    <span className="font-mono text-foreground/70">2.14</span> бумажное
                    свидетельство (+3 000 ₽)
                  </span>
                </label>

                <div className="flex items-baseline justify-between pl-1 pt-0.5">
                  <span className="text-xs text-foreground/60">
                    Итого за регистрацию{paperCert ? " (с бумагой)" : ""}
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400 tabular-nums">
                    {fmtRub(result.totalRegistration)}
                  </span>
                </div>
              </div>

              {/* Итог + ссылка на калькулятор */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-foreground/50 font-medium">
                    Всего
                  </span>
                  <span className="text-base font-bold text-gold tabular-nums">
                    {fmtRub(result.totalProject)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/calculator?${query}`)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors py-1"
                >
                  Подробнее на калькуляторе
                  <ArrowUpRight className="size-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────── Вспомогательный компонент ───────────────────

function FeeLine({
  code,
  total,
  sub,
}: {
  code: string;
  total: number;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline gap-2 pl-1">
      <span className="inline-flex items-center justify-center min-w-7 h-4 px-1 rounded bg-muted text-[10px] font-bold text-foreground/60 shrink-0">
        {code}
      </span>
      <span className="flex-1 text-xs text-foreground/60">
        {sub ?? "\u00A0"}
      </span>
      <span className="text-xs font-medium text-foreground tabular-nums">
        {fmtRub(total)}
      </span>
    </div>
  );
}
