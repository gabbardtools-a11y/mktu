"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Search,
  Package,
  Briefcase,
  FlaskConical,
  Wrench,
  Cpu,
  Home,
  Shirt,
  UtensilsCrossed,
  Cigarette,
  BriefcaseBusiness,
  Building2,
  Truck,
  GraduationCap,
  HeartPulse,
  Music,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { mktuClasses } from "@/data/mktu-data";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { tItems, tMapStats, type TranslationKey,
  type Lang } from "@/lib/i18n/translations";

// ─────────────────── Категории для визуальной карты ───────────────────

interface Category {
  id: string;
  title: string;
  icon: typeof FlaskConical;
  color: "blue" | "gold" | "amber" | "green" | "purple";
  classIds: number[];
  hint: string;
}

const CATEGORIES: Category[] = [
  {
    id: "materials",
    title: "mp.cat1",
    icon: FlaskConical,
    color: "purple",
    classIds: [1, 2, 4, 16, 17],
    hint: "mp.cat1h",
  },
  {
    id: "tools",
    title: "mp.cat2",
    icon: Wrench,
    color: "gold",
    classIds: [6, 7, 8],
    hint: "mp.cat2h",
  },
  {
    id: "tech",
    title: "mp.cat3",
    icon: Cpu,
    color: "blue",
    classIds: [9, 10, 11, 12, 13, 14],
    hint: "mp.cat3h",
  },
  {
    id: "beauty",
    title: "mp.cat4",
    icon: HeartPulse,
    color: "amber",
    classIds: [3, 5],
    hint: "mp.cat4h",
  },
  {
    id: "art",
    title: "mp.cat5",
    icon: Music,
    color: "purple",
    classIds: [15, 28],
    hint: "mp.cat5h",
  },
  {
    id: "home",
    title: "mp.cat6",
    icon: Home,
    color: "amber",
    classIds: [19, 20, 21, 27],
    hint: "mp.cat6h",
  },
  {
    id: "textile",
    title: "mp.cat7",
    icon: Shirt,
    color: "gold",
    classIds: [22, 23, 24, 25, 26],
    hint: "mp.cat7h",
  },
  {
    id: "accessories",
    title: "mp.cat8",
    icon: Briefcase,
    color: "gold",
    classIds: [18],
    hint: "mp.cat8h",
  },
  {
    id: "food",
    title: "mp.cat9",
    icon: UtensilsCrossed,
    color: "amber",
    classIds: [29, 30, 31, 32, 33],
    hint: "mp.cat9h",
  },
  {
    id: "tobacco",
    title: "mp.cat10",
    icon: Cigarette,
    color: "gold",
    classIds: [34],
    hint: "mp.cat10h",
  },
  {
    id: "business",
    title: "mp.cat11",
    icon: BriefcaseBusiness,
    color: "blue",
    classIds: [35, 36],
    hint: "mp.cat11h",
  },
  {
    id: "construction",
    title: "mp.cat12",
    icon: Building2,
    color: "gold",
    classIds: [37],
    hint: "mp.cat12h",
  },
  {
    id: "transport",
    title: "mp.cat13",
    icon: Truck,
    color: "blue",
    classIds: [38, 39, 40],
    hint: "mp.cat13h",
  },
  {
    id: "education",
    title: "mp.cat14",
    icon: GraduationCap,
    color: "green",
    classIds: [41, 42],
    hint: "mp.cat14h",
  },
  {
    id: "people",
    title: "mp.cat15",
    icon: HeartHandshake,
    color: "amber",
    classIds: [43, 44, 45],
    hint: "mp.cat15h",
  },
];

const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    hoverBorder: "hover:border-blue-500/60",
    dot: "bg-blue-500",
  },
  gold: {
    bg: "bg-gold/10",
    border: "border-gold/30",
    text: "text-gold",
    hoverBorder: "hover:border-gold/60",
    dot: "bg-gold",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-500/60",
    dot: "bg-amber-500",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    hoverBorder: "hover:border-green-500/60",
    dot: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    hoverBorder: "hover:border-purple-500/60",
    dot: "bg-purple-500",
  },
};

export function MapClient({ initialLang = "ru" }: { initialLang?: Lang }) {
  const { lang, t } = useLanguage(initialLang);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [expandedGoods, setExpandedGoods] = useState(true);
  const [expandedServices, setExpandedServices] = useState(true);

  const filteredClasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null; // null = нет фильтра, показать всё
    return new Set(
      mktuClasses
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            String(c.id).includes(q),
        )
        .map((c) => c.id),
    );
  }, [query]);

  // Категории с классами, отфильтрованные
  const categoriesWithClasses = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const classes = cat.classIds
        .map((id) => mktuClasses.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .filter((c) => !filteredClasses || filteredClasses.has(c.id));
      return { ...cat, classes };
    }).filter((cat) => cat.classes.length > 0);
  }, [filteredClasses]);

  const goodsCats = categoriesWithClasses.filter((c) =>
    c.classIds.some((id) => id <= 34),
  );
  const servicesCats = categoriesWithClasses.filter((c) =>
    c.classIds.some((id) => id >= 35),
  );

  function toggleCat(id: string) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpandedCats(new Set(CATEGORIES.map((c) => c.id)));
    setExpandedGoods(true);
    setExpandedServices(true);
  }

  function collapseAll() {
    setExpandedCats(new Set());
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium mb-3">
            <Sparkles className="size-3.5" />
            {t("mp.title")}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("mp.sub")}
          </h1>
          <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
            {t("mp.desc")}
          </p>
        </motion.div>

        {/* Поиск + кнопки */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("mp.searchPh")}
              className="w-full rounded-md border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <button
            onClick={expandAll}
            className="text-xs px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/40 text-foreground/70 transition-colors whitespace-nowrap"
          >
            {t("mp.expandAll")}
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/40 text-foreground/70 transition-colors whitespace-nowrap"
          >
            {t("mp.collapseAll")}
          </button>
        </div>

        {/* Дерево */}
        <div className="space-y-4">
          {/* ТОВАРЫ (1-34) */}
          {goodsCats.length > 0 && (
            <div className="rounded-xl border border-gold/20 bg-card overflow-hidden">
              <button
                onClick={() => setExpandedGoods(!expandedGoods)}
                className="w-full flex items-center gap-2 p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <Package className="size-5 text-gold flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-foreground">{t("common.goods")}</div>
                  <div className="text-xs text-foreground/50">
                    {tMapStats(lang, "1–34", goodsCats.reduce((acc, c) => acc + c.classes.length, 0), goodsCats.length)}
                  </div>
                </div>
                <ChevronRight
                  className={`size-5 text-foreground/40 transition-transform ${
                    expandedGoods ? "rotate-90" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {expandedGoods && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-2">
                      {goodsCats.map((cat) => (
                        <CategoryNode
                          key={cat.id}
                          category={cat}
                          expanded={expandedCats.has(cat.id) || !!filteredClasses}
                          onToggle={() => toggleCat(cat.id)}
                          onClassClick={(id) => router.push(`/class/${id}`)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* УСЛУГИ (35-45) */}
          {servicesCats.length > 0 && (
            <div className="rounded-xl border border-blue-500/20 bg-card overflow-hidden">
              <button
                onClick={() => setExpandedServices(!expandedServices)}
                className="w-full flex items-center gap-2 p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <Briefcase className="size-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-foreground">{t("common.services")}</div>
                  <div className="text-xs text-foreground/50">
                    {tMapStats(lang, "35–45", servicesCats.reduce((acc, c) => acc + c.classes.length, 0), servicesCats.length)}
                  </div>
                </div>
                <ChevronRight
                  className={`size-5 text-foreground/40 transition-transform ${
                    expandedServices ? "rotate-90" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {expandedServices && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-2">
                      {servicesCats.map((cat) => (
                        <CategoryNode
                          key={cat.id}
                          category={cat}
                          expanded={expandedCats.has(cat.id) || !!filteredClasses}
                          onToggle={() => toggleCat(cat.id)}
                          onClassClick={(id) => router.push(`/class/${id}`)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {categoriesWithClasses.length === 0 && (
            <div className="text-center py-12 text-foreground/50 text-sm">
              {t("mp.empty")}
            </div>
          )}
        </div>

        {/* Подсказка */}
        <div className="mt-8 text-center text-xs text-foreground/40">
          {t("mp.hint")}
        </div>
      </div>
    </main>
  );
}

// ─────────────────── Узел категории ───────────────────

function CategoryNode({
  category,
  expanded,
  onToggle,
  onClassClick,
}: {
  category: Category & { classes: typeof mktuClasses };
  expanded: boolean;
  onToggle: () => void;
  onClassClick: (id: number) => void;
}) {
  const { lang, t } = useLanguage();
  const colors = COLOR_STYLES[category.color];
  const Icon = category.icon;

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Заголовок категории */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-foreground/5 transition-colors text-left"
      >
        <div
          className={`flex items-center justify-center size-8 rounded-md ${colors.bg} ${colors.text} flex-shrink-0`}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">{t(category.title as TranslationKey)}</div>
          <div className="text-[11px] text-foreground/50 truncate">{t(category.hint as TranslationKey)}</div>
        </div>
        <span className="text-[10px] text-foreground/40 mr-1">
          {category.classes.length}
        </span>
        <ChevronRight
          className={`size-4 text-foreground/40 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {/* Список классов */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="p-2 pl-12 space-y-1">
              {category.classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => onClassClick(cls.id)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-md hover:bg-foreground/5 transition-colors text-left group"
                >
                  <span
                    className={`flex items-center justify-center size-8 rounded text-xs font-bold flex-shrink-0 ${colors.bg} ${colors.text} group-hover:scale-105 transition-transform`}
                  >
                    {cls.id}
                  </span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="text-sm font-medium text-foreground group-hover:text-gold transition-colors truncate">
                      {cls.name}
                    </div>
                    <div className="text-[11px] text-foreground/50 line-clamp-1">
                      {cls.description}
                    </div>
                  </div>
                  <div className="text-[10px] text-foreground/40 flex-shrink-0 pt-1">
                    {tItems(lang, cls.itemsCount)}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
