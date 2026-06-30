// ─────────────────────────────────────────────────────────────────────────────
// Тарифы Роспатента для регистрации товарного знака.
// Источник: https://rospatent.gov.ru/ru/activities/dues/table
// Положение о патентных и иных пошлинах (актуально на 2026 год).
// ─────────────────────────────────────────────────────────────────────────────

export const FEES = {
  // п.2.1 — Регистрация заявки на товарный знак + формальная экспертиза.
  // Платится в течение 2 мес после подачи заявки (одновременно с 2.4).
  p21: {
    code: "2.1",
    title: "Регистрация заявки + формальная экспертиза",
    base: 4000,
    perClassOver: 1, // +1000 за каждый класс свыше 1
    perClassOverRate: 1000,
  },
  // п.2.4 — Экспертиза обозначения по существу.
  // Платится одновременно с 2.1 (в течение 2 мес после подачи).
  p24: {
    code: "2.4",
    title: "Экспертиза обозначения по существу",
    base: 13000,
    perClassOver: 1, // +2500 за класс свыше 1
    perClassOverRate: 2500,
    // +500 за каждую позицию свыше 10 в одном классе
    itemsFreePerClass: 10,
    perItemOverRate: 500,
  },
  // п.2.11 — Регистрация товарного знака + выдача свидетельства (электронное).
  // Платится ПОСЛЕ решения о регистрации. Продлевает знак на 10 лет.
  p211: {
    code: "2.11",
    title: "Регистрация товарного знака + выдача свидетельства (электронное)",
    base: 18000,
    perClassOver: 5, // +2000 за класс свыше 5
    perClassOverRate: 2000,
  },
  // п.2.14 — Выдача свидетельства на бумажном носителе (ОПЦИОНАЛЬНО).
  // Только по ходатайству правообладателя. Большинству достаточно электронного.
  p214: {
    code: "2.14",
    title: "Выдача свидетельства на бумажном носителе (опционально)",
    base: 3000,
  },
} as const;

// ─────────────────── Типы ───────────────────

export interface FeeBreakdown {
  /** Количество классов (1..45). */
  classes: number;
  /** Сколько позиций выбрано в каждом классе. Длина = classes. */
  itemsPerClass: number[];
  /** Запрошено ли бумажное свидетельство (п.2.14). */
  paperCert: boolean;

  // п.2.1
  p21Base: number;
  p21ExtraClasses: number; // доплата за доп. классы
  p21Total: number;

  // п.2.4
  p24Base: number;
  p24ExtraClasses: number; // доплата за доп. классы
  p24ExtraItems: number; // доплата за позиции свыше 10 в классе
  p24ItemsOver: number; // сколько позиций сверх лимита
  p24Total: number;

  // п.2.11
  p211Base: number;
  p211ExtraClasses: number;
  p211Total: number;

  // п.2.14
  p214Total: number;

  // Итоги
  totalAtFiling: number; // 2.1 + 2.4 (платятся одновременно при подаче)
  totalRegistration: number; // 2.11 + 2.14 (платятся после решения)
  totalProject: number; // всё вместе
}

// ─────────────────── Функция расчёта ───────────────────

/**
 * Считает пошлины Роспатента за регистрацию товарного знака.
 *
 * @param itemsPerClass массив, где каждый элемент — число позиций в соответствующем классе.
 *                      Длина массива = количество классов.
 *                      Для класса без позиций передать 0.
 * @param paperCert запрошено ли бумажное свидетельство (п.2.14)
 *
 * @example
 * // 2 класса, в первом 8 позиций, во втором 15 (5 сверх лимита)
 * calculateFees([8, 15], false)
 * // → p24ExtraItems = 5 × 500 = 2500
 */
export function calculateFees(
  itemsPerClass: number[],
  paperCert: boolean,
): FeeBreakdown {
  const classes = Math.max(0, itemsPerClass.length);
  const itemsArr = itemsPerClass.map((n) => Math.max(0, Math.floor(n) || 0));

  // 2.1: 4000 + 1000 × max(0, classes - 1)
  const p21Base = FEES.p21.base;
  const p21ExtraClasses =
    Math.max(0, classes - FEES.p21.perClassOver) * FEES.p21.perClassOverRate;
  const p21Total = p21Base + p21ExtraClasses;

  // 2.4: 13000 + 2500 × max(0, classes - 1) + 500 × sum(max(0, itemsInClass - 10))
  const p24Base = FEES.p24.base;
  const p24ExtraClasses =
    Math.max(0, classes - FEES.p24.perClassOver) * FEES.p24.perClassOverRate;
  const p24ItemsOver = itemsArr.reduce(
    (acc, n) => acc + Math.max(0, n - FEES.p24.itemsFreePerClass),
    0,
  );
  const p24ExtraItems = p24ItemsOver * FEES.p24.perItemOverRate;
  const p24Total = p24Base + p24ExtraClasses + p24ExtraItems;

  // 2.11: 18000 + 2000 × max(0, classes - 5)
  const p211Base = FEES.p211.base;
  const p211ExtraClasses =
    Math.max(0, classes - FEES.p211.perClassOver) * FEES.p211.perClassOverRate;
  const p211Total = p211Base + p211ExtraClasses;

  // 2.14: 3000 × (paperCert ? 1 : 0)
  const p214Total = paperCert ? FEES.p214.base : 0;

  const totalAtFiling = p21Total + p24Total;
  const totalRegistration = p211Total + p214Total;
  const totalProject = totalAtFiling + totalRegistration;

  return {
    classes,
    itemsPerClass: itemsArr,
    paperCert,
    p21Base,
    p21ExtraClasses,
    p21Total,
    p24Base,
    p24ExtraClasses,
    p24ExtraItems,
    p24ItemsOver,
    p24Total,
    p211Base,
    p211ExtraClasses,
    p211Total,
    p214Total,
    totalAtFiling,
    totalRegistration,
    totalProject,
  };
}

// ─────────────────── Хелперы ───────────────────

export const fmtRub = (n: number) => n.toLocaleString("ru-RU") + " ₽";

// pluralClasses / pluralItems — переиспользуем из общего plural.ts
export { pluralClasses, pluralItems } from "@/lib/plural";
