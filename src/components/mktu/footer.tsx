"use client";

import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold/10">
                <BookOpen className="size-4 text-gold" />
              </div>
              <span className="text-gold font-bold tracking-wider">
                МКТУ-13 <span className="text-foreground/40">2026</span>
              </span>
            </div>
            <p className="text-foreground/50 text-sm leading-relaxed">
              Международная (Ниццкая) классификация товаров и услуг для
              регистрации товарных знаков, используемая Всемирной организацией
              интеллектуальной собственности (ВОИС).
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">О системе</h3>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li>45 классов: 34 товара и 11 услуг</li>
              <li>Принята Ниццким соглашением 1957 года</li>
              <li>Действует в более чем 80 странах</li>
              <li>Периодически обновляется ВОИС</li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Редакции</h3>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                13-я редакция — 2026 (актуальная)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                12-я редакция — 2023
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                11-я редакция — 2019
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                10-я редакция — 2014
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-foreground/40 text-xs">
            МКТУ 13-я редакция 2026 • Справочное издание
          </p>
          <p className="text-foreground/30 text-xs mt-1">
            Данные носят информационный характер. Для официальной регистрации
            обратитесь к Роспатенту.
          </p>
        </div>
      </div>
    </footer>
  );
}
