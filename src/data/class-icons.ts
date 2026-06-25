/**
 * Иконки для классов МКТУ.
 *
 * Каждому классу 1-45 сопоставлена иконка из lucide-react,
 * отражающая его тематику. Иконки используются в карточках классов,
 * на странице деталей класса, в результатах поиска и т.д.
 *
 * Чтобы добавить/изменить иконку — отредактируйте запись ниже.
 */

import {
  FlaskConical,
  Paintbrush,
  SprayCan,
  Flame,
  Pill,
  Anvil,
  Cog,
  Wrench,
  Smartphone,
  Stethoscope,
  Refrigerator,
  Car,
  Crosshair,
  Gem,
  Music,
  PenTool,
  CircleDot,
  Briefcase,
  Boxes,
  Sofa,
  Salad,
  Wine,
  UtensilsCrossed,
  Link2,
  Spool,
  Orbit,
  Shirt,
  Backpack,
  Grid3x3,
  Gamepad2,
  Beef,
  Coffee,
  Wheat,
  CupSoda,
  Wine as WineIcon,
  Cigarette,
  Megaphone,
  Landmark,
  HardHat,
  Radio,
  Truck,
  Factory,
  GraduationCap,
  Code,
  Utensils,
  HeartPulse,
  Scale,
  type LucideIcon,
} from "lucide-react";

interface ClassIcon {
  icon: LucideIcon;
  /** Краткое описание тематики класса для tooltip */
  label: string;
}

export const classIcons: Record<number, ClassIcon> = {
  // === Товары (классы 1-34) ===
  1: { icon: FlaskConical, label: "Химические вещества" },
  2: { icon: Paintbrush, label: "Краски, лаки" },
  3: { icon: SprayCan, label: "Парфюмерия, косметика" },
  4: { icon: Flame, label: "Горючее, освещение" },
  5: { icon: Pill, label: "Фармацевтика" },
  6: { icon: Anvil, label: "Металлы" },
  7: { icon: Cog, label: "Машины, станки" },
  8: { icon: Wrench, label: "Ручные инструменты" },
  9: { icon: Smartphone, label: "Электроника, оптика" },
  10: { icon: Stethoscope, label: "Медицинское оборудование" },
  11: { icon: Refrigerator, label: "Бытовая техника" },
  12: { icon: Car, label: "Транспорт" },
  13: { icon: Crosshair, label: "Оружие, боеприпасы" },
  14: { icon: Gem, label: "Ювелирные изделия" },
  15: { icon: Music, label: "Музыкальные инструменты" },
  16: { icon: PenTool, label: "Бумага, канцелярия" },
  17: { icon: CircleDot, label: "Резина, каучук" },
  18: { icon: Briefcase, label: "Кожа, чемоданы" },
  19: { icon: Boxes, label: "Стройматериалы" },
  20: { icon: Sofa, label: "Мебель, дерево" },
  21: { icon: Salad, label: "Посуда, стекло" },
  22: { icon: Link2, label: "Канаты, верёвки" },
  23: { icon: Spool, label: "Нити, пряжа" },
  24: { icon: Orbit, label: "Ткани" },
  25: { icon: Shirt, label: "Одежда, обувь" }, // тот же Shirt — отличается по теме
  26: { icon: Backpack, label: "Галантерея" },
  27: { icon: Grid3x3, label: "Напольные покрытия" },
  28: { icon: Gamepad2, label: "Игры, игрушки" },
  29: { icon: Beef, label: "Мясо, рыба" },
  30: { icon: Coffee, label: "Кофе, чай, кондитерка" },
  31: { icon: Wheat, label: "Сельхозпродукция" },
  32: { icon: CupSoda, label: "Напитки безалкогольные" },
  33: { icon: WineIcon, label: "Алкоголь" },
  34: { icon: Cigarette, label: "Табак, вейпы" },

  // === Услуги (классы 35-45) ===
  35: { icon: Megaphone, label: "Реклама, бизнес" },
  36: { icon: Landmark, label: "Финансы, страхование" },
  37: { icon: HardHat, label: "Строительство, ремонт" },
  38: { icon: Radio, label: "Телекоммуникации" },
  39: { icon: Truck, label: "Транспортные услуги" },
  40: { icon: Factory, label: "Обработка материалов" },
  41: { icon: GraduationCap, label: "Образование, развлечения" },
  42: { icon: Code, label: "IT, наука" },
  43: { icon: Utensils, label: "Общепит, гостиницы" },
  44: { icon: HeartPulse, label: "Медицинские услуги" },
  45: { icon: Scale, label: "Юридические услуги" },
};

/** Иконка по умолчанию (если класс не найден в карте) */
export const defaultClassIcon: ClassIcon = {
  icon: Boxes,
  label: "Класс МКТУ",
};

/** Получить иконку класса по его ID */
export function getClassIcon(classId: number): ClassIcon {
  return classIcons[classId] ?? defaultClassIcon;
}
