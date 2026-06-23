"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/data/faq-data";

export default function FaqClient() {
  const router = useRouter();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header (page-local, sticky) */}
      <div className="pt-20 pb-4 border-b border-border bg-background/95 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-foreground/60 hover:text-foreground hover:bg-muted"
              title="На главную"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline ml-1.5">Главная</span>
            </Button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Часто задаваемые вопросы
          </h1>
          <p className="text-foreground/60 text-sm">
            Ответы на основные вопросы о МКТУ, выборе классов и использовании
            справочника.
          </p>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/30 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по вопросам..."
              className="pl-10 pr-10 bg-card border-border"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overscroll-contain">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-16">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground/40 text-lg mb-2">
                Ничего не найдено
              </p>
              <p className="text-foreground/30 text-sm">
                Попробуйте изменить запрос
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const idx = faqItems.indexOf(item);
                const isOpen = openIdx === idx;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border border-border rounded-xl overflow-hidden transition-colors hover:border-gold/20"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-gold/5"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 shrink-0">
                        <Icon className="size-5 text-gold" />
                      </div>
                      <span className="flex-1 font-medium text-foreground text-sm sm:text-base">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="size-5 text-foreground/40" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-[4.5rem]">
                            {item.multiline ? (
                              <div className="text-foreground/60 text-sm leading-relaxed whitespace-pre-line">
                                {item.answer}
                              </div>
                            ) : (
                              <p className="text-foreground/60 text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-5 rounded-xl bg-gold/5 border border-gold/20 text-center">
            <p className="text-foreground/60 text-sm">
              Не нашли ответ на свой вопрос?
            </p>
            <p className="text-foreground/40 text-xs mt-1">
              Используйте поиск по классам на главной странице — он автоматически
              найдёт подходящие позиции по ключевым словам, либо нажмите «ИИ» в
              строке поиска.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 bg-gold text-background hover:bg-gold-dark"
            >
              Перейти к поиску
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
