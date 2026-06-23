"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getNotes } from "@/data/mktu-notes";

interface ClassNotesProps {
  classId: number;
  /**
   * Внешнее управление раскрытием.
   * - true  → раскрыть все доступные разделы
   * - false → скрыть все (только заголовки-аккордеоны)
   * - undefined → поведение по умолчанию (первый раздел открыт)
   */
  expanded?: boolean;
}

export function ClassNotes({ classId, expanded }: ClassNotesProps) {
  const notes = getNotes(classId);
  // По умолчанию все секции закрыты — пользователь сам открывает нужные
  const [openSection, setOpenSection] = useState<
    "explanation" | "includes" | "excludes" | null
  >(null);

  // Внешний флаг expanded управляет только видимостью всего блока
  // (обрабатывается родителем через AnimatePresence).
  // При скрытии (expanded=false) сбрасываем все открытые секции.
  useEffect(() => {
    if (expanded === false) {
      setOpenSection(null);
    }
  }, [expanded]);

  if (!notes) return null;

  if (!notes.explanation && notes.includes.length === 0 && notes.excludes.length === 0) {
    return null;
  }

  const toggle = (section: "explanation" | "includes" | "excludes") => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections: {
    key: "explanation" | "includes" | "excludes";
    title: string;
    icon: typeof Info;
    iconColor: string;
    iconBg: string;
    hasContent: boolean;
    badge?: string;
  }[] = [
    {
      key: "explanation",
      title: "Пояснения",
      icon: Info,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      hasContent: !!notes.explanation,
    },
    {
      key: "includes",
      title: "К классу относятся, в частности",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      hasContent: notes.includes.length > 0,
      badge: `${notes.includes.length}`,
    },
    {
      key: "excludes",
      title: "К классу не относятся, в частности",
      icon: XCircle,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/10",
      hasContent: notes.excludes.length > 0,
      badge: `${notes.excludes.length}`,
    },
  ];

  const visibleSections = sections.filter((s) => s.hasContent);

  if (visibleSections.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visibleSections.map(({ key, title, icon: Icon, iconColor, iconBg, badge }) => {
        const isOpen = openSection === key;
        return (
          <div
            key={key}
            className={`rounded-lg border overflow-hidden transition-colors ${
              isOpen
                ? "bg-card border-gold/30"
                : "bg-card/50 border-border hover:border-border/80"
            }`}
          >
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-muted/30"
              aria-expanded={isOpen}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 ${iconBg}`}>
                <Icon className={`size-4 ${iconColor}`} />
              </div>
              <span className="flex-1 font-medium text-foreground text-sm">
                {title}
                {badge && (
                  <span className="ml-2 text-xs text-foreground/40 font-normal">
                    ({badge})
                  </span>
                )}
              </span>
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 transition-colors ${
                  isOpen
                    ? "bg-gold/10 text-gold"
                    : "text-foreground/40 hover:text-foreground hover:bg-muted"
                }`}
              >
                {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 pt-1">
                    {key === "explanation" && (
                      <div className="px-11">
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {notes.explanation}
                        </p>
                      </div>
                    )}
                    {key === "includes" && (
                      <ul className="px-11 space-y-1.5">
                        {notes.includes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-foreground/70 leading-relaxed"
                          >
                            <span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {key === "excludes" && (
                      <ul className="px-11 space-y-1.5">
                        {notes.excludes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-foreground/70 leading-relaxed"
                          >
                            <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
