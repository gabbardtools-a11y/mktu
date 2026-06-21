"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag, ArrowRight, Package, Briefcase } from "lucide-react";
import type { MktuClass } from "@/data/mktu-data";

interface ClassCardProps {
  cls: MktuClass;
  index: number;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (classId: number) => void;
  onAddToCart: (classId: number) => void;
  onOpenDetail: (classId: number) => void;
}

export function ClassCard({
  cls,
  index,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  onOpenDetail,
}: ClassCardProps) {
  const isGoods = cls.type === "goods";
  const Icon = isGoods ? Package : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.4) }}
      className={`group relative rounded-xl border ${
        isFavorite
          ? "bg-gold/5 border-gold/30 hover:border-gold/50"
          : "bg-card border-border hover:border-gold/20"
      } p-5 transition-all hover:shadow-lg hover:shadow-foreground/5 cursor-pointer overflow-hidden`}
      onClick={() => onOpenDetail(cls.id)}
    >
      {/* Hover corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-0 h-0 border-l-[32px] border-l-transparent border-t-[32px] transition-colors ${
            isFavorite
              ? "border-t-gold/40"
              : "border-t-gold/0 group-hover:border-t-gold/20"
          }`}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              isGoods ? "bg-gold/10" : "bg-blue-500/10"
            }`}
          >
            <Icon
              className={`size-5 ${isGoods ? "text-gold" : "text-blue-400"}`}
            />
          </div>
          <div>
            <div className="font-bold text-foreground text-base leading-tight">
              {cls.name}
            </div>
            <div
              className={`text-[10px] uppercase tracking-wider font-medium ${
                isGoods ? "text-gold/70" : "text-blue-400/70"
              }`}
            >
              {isGoods ? "Товары" : "Услуги"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(cls.id);
            }}
            className={`p-1.5 rounded-md transition-colors ${
              isFavorite
                ? "text-gold hover:bg-gold/10"
                : "text-foreground/30 hover:text-gold hover:bg-gold/5"
            }`}
            title={isFavorite ? "Убрать из избранного" : "В избранное"}
          >
            <Star className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart) onAddToCart(cls.id);
            }}
            className={`p-1.5 rounded-md transition-colors ${
              isInCart
                ? "text-gold hover:bg-gold/10"
                : "text-foreground/30 hover:text-gold hover:bg-gold/5"
            }`}
            title={isInCart ? "В корзине" : "В корзину"}
          >
            <ShoppingBag
              className={`size-4 ${isInCart ? "fill-current" : ""}`}
            />
          </motion.button>
        </div>
      </div>

      <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 min-h-[3.5rem]">
        {cls.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-xs text-foreground/40">
          <span className="text-gold font-medium">{cls.items.length}</span>{" "}
          позиций
        </span>
        <span
          className={`text-xs font-medium transition-colors flex items-center gap-1 ${
            isFavorite
              ? "text-gold group-hover:text-gold-light"
              : "text-[#d4af37]/60 group-hover:text-[#d4af37]/80"
          }`}
        >
          Подробнее →
          <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </span>
      </div>
    </motion.div>
  );
}
