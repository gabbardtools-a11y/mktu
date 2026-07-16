"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faqItems } from "@/data/faq-data";

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FaqDialog({ open, onOpenChange }: FaqDialogProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 bg-background border-gold/20"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Часто задаваемые вопросы
          </DialogTitle>
          <DialogDescription className="text-foreground/60 text-sm mt-1">
            Ответы на основные вопросы о МКТУ, выборе классов и использовании
            справочника.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-3 pt-4 pb-6">
            {faqItems.map((item, idx) => {
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

            <div className="mt-6 p-5 rounded-xl bg-gold/5 border border-gold/20 text-center">
              <p className="text-foreground/60 text-sm">
                Не нашли ответ на свой вопрос?
              </p>
              <p className="text-foreground/40 text-xs mt-1">
                Используйте поиск по классам на главной странице — он
                автоматически найдёт подходящие позиции по ключевым словам.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
