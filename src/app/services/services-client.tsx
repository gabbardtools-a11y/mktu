"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  FileSearch,
  Link2,
  Lightbulb,
  Calculator,
  Search,
  Grid3x3,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface ServiceCard {
  href: string;
  icon: typeof Sparkles;
  emoji: string;
  title: string;
  description: string;
  color: "blue" | "gold" | "amber" | "green";
  badge?: string;
}

const SERVICES: ServiceCard[] = [
  {
    href: "/assistant",
    icon: Sparkles,
    emoji: "✨",
    title: "ИИ-помощник",
    description:
      "Опишите товар или услугу — ИИ подберёт классы, объяснит почему и даст практический совет.",
    color: "blue",
    badge: "Рекомендуем",
  },
  {
    href: "/wizard",
    icon: Compass,
    emoji: "🧭",
    title: "Мастер определения",
    description:
      "Пошаговый опросник: 4 простых вопроса — получите список классов с пояснениями.",
    color: "gold",
  },
  {
    href: "/okved",
    icon: FileSearch,
    emoji: "📋",
    title: "ОКВЭД → МКТУ",
    description:
      "Знаете свой ОКВЭД? Введите код — увидите подходящие классы МКТУ. 80+ соответствий.",
    color: "blue",
  },
  {
    href: "/faq-cases",
    icon: Lightbulb,
    emoji: "💡",
    title: "Частые кейсы",
    description:
      "Готовые решения для популярных бизнесов: интернет-магазин, IT, кофейня, производство.",
    color: "amber",
  },
  {
    href: "/related",
    icon: Link2,
    emoji: "🔗",
    title: "Связанные классы",
    description:
      "Выбрали класс? Посмотрите какие классы часто идут вместе — не пропустите важное.",
    color: "gold",
  },
  {
    href: "/calculator",
    icon: Calculator,
    emoji: "🧮",
    title: "Калькулятор пошлин",
    description:
      "Расчёт государственных пошлин Роспатента: 2.1 + 2.4 + 2.11 + опц. 2.14.",
    color: "green",
  },
  {
    href: "/search",
    icon: Search,
    emoji: "🔍",
    title: "Поиск по позициям",
    description:
      "Глубокий поиск по всем позициям всех 45 классов МКТУ. Найдёт даже по части слова.",
    color: "blue",
  },
  {
    href: "/",
    icon: Grid3x3,
    emoji: "🗂️",
    title: "Все 45 классов",
    description:
      "Полный каталог классов МКТУ 13-й редакции 2026: товары (1–34) и услуги (35–45).",
    color: "gold",
  },
  {
    href: "/faq",
    icon: HelpCircle,
    emoji: "❓",
    title: "Вопросы и ответы",
    description:
      "Что такое МКТУ, как зарегистрировать товарный знак, отличие товаров от услуг.",
    color: "amber",
  },
];

const COLOR_STYLES = {
  blue: {
    icon: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    glow: "from-blue-500/10",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  gold: {
    icon: "bg-gold/15 text-gold border-gold/30",
    glow: "from-gold/10",
    badge: "bg-gold/15 text-gold border-gold/30",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    glow: "from-amber-500/10",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  green: {
    icon: "bg-green-500/15 text-green-400 border-green-500/30",
    glow: "from-green-500/10",
    badge: "bg-green-500/15 text-green-400 border-green-500/30",
  },
};

export function ServicesClient() {
  const router = useRouter();

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            Все сервисы МКТУ
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
            Инструменты для определения класса, расчёта пошлин и подготовки заявки
            на регистрацию товарного знака. Выберите подходящий.
          </p>
        </motion.div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SERVICES.map((s, i) => {
            const colors = COLOR_STYLES[s.color];
            return (
              <motion.button
                key={s.href}
                onClick={() => router.push(s.href)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className={`group relative text-left rounded-xl border border-border bg-card p-5 hover:border-${s.color === "gold" ? "gold" : s.color + "-500"}/40 transition-all overflow-hidden`}
              >
                {/* Glow при hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                <div className="relative">
                  {/* Иконка + бейдж */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex items-center justify-center size-12 rounded-xl border ${colors.icon} text-2xl`}
                    >
                      <span className="leading-none">{s.emoji}</span>
                    </div>
                    {s.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${colors.badge}`}
                      >
                        {s.badge}
                      </span>
                    )}
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-gold transition-colors">
                    {s.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-xs text-foreground/60 leading-relaxed mb-3">
                    {s.description}
                  </p>

                  {/* Ссылка-стрелка */}
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground/50 group-hover:text-gold transition-colors">
                    Открыть
                    <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Подсказка внизу */}
        <div className="mt-8 text-center text-xs text-foreground/40">
          Все сервисы бесплатны · без регистрации · без рекламы
        </div>
      </div>
    </main>
  );
}
