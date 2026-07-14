/**
 * Русская плюрализация.
 *
 * @example
 * plural(1, ["класс", "класса", "классов"])  // → "класс"
 * plural(3, ["класс", "класса", "классов"])  // → "класса"
 * plural(5, ["класс", "класса", "классов"])  // → "классов"
 */
export function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Частые случаи для МКТУ — чтобы не повторять массивы форм. */
export const pluralClasses = (n: number) => pluralRu(n, ["класс", "класса", "классов"]);
export const pluralItems = (n: number) => pluralRu(n, ["позиция", "позиции", "позиций"]);
