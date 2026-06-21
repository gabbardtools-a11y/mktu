"use client";

import { motion } from "framer-motion";
import { Package, BookOpen, Briefcase } from "lucide-react";

const stats = [
  {
    value: "34",
    label: "Классов товаров",
    color: "text-gold",
    bg: "bg-gold/10",
    Icon: Package,
  },
  {
    value: "11",
    label: "Классов услуг",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    Icon: Briefcase,
  },
  {
    value: "13-я",
    label: "Редакция МКТУ",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    Icon: BookOpen,
  },
];

export function Hero() {
  const scrollToSearch = () => {
    document
      .getElementById("class-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-16"
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/2 rounded-full blur-[150px]" />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const left = `${(i * 5.2) % 100}%`;
          const top = `${(i * 7.7) % 100}%`;
          const delay = (i * 0.3) % 3;
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/30"
              style={{ left, top }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-block"
        >
          <span className="px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs sm:text-sm font-medium tracking-wide">
            13-я редакция • 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            МКТУ-13
          </span>
          <span className="text-foreground/40 text-lg sm:text-xl md:text-2xl font-light">
            {" "}
            2026
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-foreground/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Международная классификация товаров и услуг для регистрации товарных
          знаков. Полный справочник всех 45 классов МКТУ.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-foreground/50 text-sm sm:text-base md:text-lg tracking-widest uppercase mb-10 font-light"
        >
          Без рекламы. Навсегда.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12"
        >
          {stats.map(({ value, label, color, bg, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${bg}`}
              >
                <Icon className={`size-5 ${color}`} />
              </div>
              <div className="text-left">
                <div className={`text-xl sm:text-2xl font-bold ${color}`}>
                  {value}
                </div>
                <div className="text-foreground/50 text-xs sm:text-sm">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={scrollToSearch}
          className="bg-gold text-background hover:bg-gold-dark font-semibold text-base px-8 h-12 rounded-lg shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all"
        >
          Найти классы
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-foreground/40 text-xs tracking-widest mb-1">
          Прокрутите вниз
        </span>
        <div className="flex flex-col items-center gap-0">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.25 * i,
                times: [0, 0.5, 1],
              }}
              className="w-1 h-3 bg-gold/60 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
