"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Send, Trash2, Lightbulb, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Примеры запросов — кликабельны, помогают новичкам начать
const EXAMPLES = [
  "Мобильное приложение для доставки еды",
  "Интернет-магазин одежды",
  "Кофейня с собственным производством зёрен",
  "SaaS-платформа для бухгалтерии",
  "Производство косметики",
  "Фитнес-клуб с онлайн-тренировками",
  "Маркетплейс handmade-товаров",
  "Производство мебели на заказ",
];

export function AssistantClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Прокрутка вниз при новом сообщении
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Авто-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  async function send(text?: string) {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setInput("");
    setError(null);
    const userMsg: Message = { role: "user", content: query };
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Нет потока ответа");

      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }

      if (!acc) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "Извините, не удалось получить ответ. Попробуйте переформулировать вопрос.",
          };
          return next;
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message);
      setMessages((prev) => prev.slice(0, -1)); // убрать пустое assistant сообщение
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function clear() {
    setMessages([]);
    setError(null);
  }

  function useExample(ex: string) {
    send(ex);
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3">
            <Sparkles className="size-3.5" />
            ИИ-помощник
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Определите классы МКТУ с ИИ
          </h1>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto">
            Опишите ваш товар или услугу — ИИ подберёт подходящие классы,
            объяснит почему и даст практический совет.
          </p>
        </motion.div>

        {/* Чат */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col h-[60vh] min-h-[400px]">
          {/* Сообщения */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="size-8 text-blue-400" />
                </div>
                <p className="text-foreground/70 text-sm mb-1">
                  Опишите, что хотите зарегистрировать
                </p>
                <p className="text-foreground/40 text-xs mb-6">
                  Например: «мобильное приложение для доставки еды»
                </p>

                {/* Примеры */}
                <div className="w-full max-w-md space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50 mb-2 justify-center">
                    <Lightbulb className="size-3.5" />
                    Попробуйте примеры:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EXAMPLES.slice(0, 6).map((ex) => (
                      <button
                        key={ex}
                        onClick={() => useExample(ex)}
                        className="text-left text-xs px-3 py-2 rounded-md border border-border bg-background hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors text-foreground/70"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} onClassClick={(id) => router.push(`/class/${id}`)} />
              ))
            )}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="flex items-center gap-2 text-xs text-foreground/40 pl-1">
                <Bot className="size-3.5" />
                <span className="animate-pulse">ИИ думает…</span>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                Ошибка: {error}
              </div>
            )}
          </div>

          {/* Ввод */}
          <div className="border-t border-border p-3 bg-background">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Опишите товар или услугу…"
                rows={1}
                className="flex-1 min-w-0 resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40"
                disabled={loading}
              />
              {loading ? (
                <Button
                  onClick={stop}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
                >
                  Стоп
                </Button>
              ) : (
                <Button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white h-9 px-3"
                  title="Отправить (Enter)"
                >
                  <Send className="size-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-foreground/40">
              <span>Enter — отправить · Shift+Enter — новая строка</span>
              {messages.length > 0 && (
                <button
                  onClick={clear}
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="size-3" />
                  Очистить
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Подсказка про другие инструменты */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => router.push("/wizard")}
            className="text-left p-3 rounded-lg border border-border bg-card hover:border-blue-500/30 transition-colors"
          >
            <div className="font-medium text-foreground mb-1">🧭 Мастер определения</div>
            <div className="text-foreground/50">Пошаговый опросник для новичков</div>
          </button>
          <button
            onClick={() => router.push("/okved")}
            className="text-left p-3 rounded-lg border border-border bg-card hover:border-blue-500/30 transition-colors"
          >
            <div className="font-medium text-foreground mb-1">📋 Из ОКВЭД в МКТУ</div>
            <div className="text-foreground/50">Знаете ОКВЭД? Найдём классы МКТУ</div>
          </button>
          <button
            onClick={() => router.push("/faq-cases")}
            className="text-left p-3 rounded-lg border border-border bg-card hover:border-blue-500/30 transition-colors"
          >
            <div className="font-medium text-foreground mb-1">💡 Частые кейсы</div>
            <div className="text-foreground/50">IT, общепит, производство — готовые ответы</div>
          </button>
        </div>
      </div>
    </main>
  );
}

// ─────────────────── Пузырь сообщения ───────────────────

function MessageBubble({
  msg,
  onClassClick,
}: {
  msg: Message;
  onClassClick: (id: number) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-foreground/10" : "bg-blue-500/15"
        }`}
      >
        {isUser ? (
          <User className="size-4 text-foreground/50" />
        ) : (
          <Bot className="size-4 text-blue-400" />
        )}
      </div>
      <div
        className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-foreground/5 text-foreground"
            : "bg-blue-500/5 text-foreground border border-blue-500/10"
        }`}
      >
        <FormattedContent content={msg.content} onClassClick={onClassClick} />
      </div>
    </div>
  );
}

// ─────────────────── Простой markdown-рендерер ───────────────────

function FormattedContent({
  content,
  onClassClick,
}: {
  content: string;
  onClassClick: (id: number) => void;
}) {
  // Разбить на строки и отрендерить с минимальным markdown
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Заголовки ## ###
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="font-semibold text-foreground mt-3 mb-1 text-sm">
          {renderInline(line.slice(4))}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="font-semibold text-foreground mt-3 mb-1.5 text-sm">
          {renderInline(line.slice(3))}
        </h3>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // Список — находим подряд идущие
      elements.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-foreground/40">•</span>
          <div className="flex-1">{renderInlineWithClasses(line.slice(2), onClassClick)}</div>
        </div>,
      );
    } else if (line.startsWith("  *")) {
      // Под-пункт (начинается с пробелов + *)
      elements.push(
        <div key={i} className="pl-4 text-xs text-foreground/60 my-0.5 italic">
          {renderInline(line.trim().replace(/^\*/, ""))}
        </div>,
      );
    } else if (line.startsWith("```")) {
      // code fence — пропускаем
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(
        <p key={i} className="my-0.5 leading-relaxed">
          {renderInline(line)}
        </p>,
      );
    }
  });

  return <>{elements}</>;
}

// Рендеринг **жирного** и *курсива* + кликабельные номера классов
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Сначала **жирный**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  boldParts.forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      parts.push(<strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>);
    } else {
      // *курсив*
      const italicParts = part.split(/(\*[^*]+\*)/g);
      italicParts.forEach((ip, j) => {
        if (ip.startsWith("*") && ip.endsWith("*")) {
          parts.push(<em key={`${i}-${j}`} className="text-foreground/70">{ip.slice(1, -1)}</em>);
        } else {
          parts.push(<span key={`${i}-${j}`}>{ip}</span>);
        }
      });
    }
  });
  return parts;
}

// То же + делает "Класс N" кликабельным
function renderInlineWithClasses(text: string, onClassClick: (id: number) => void): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Сначала **жирный**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  boldParts.forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      // Если это "Класс N" — делаем кликабельным
      const match = inner.match(/^Класс\s+(\d+)$/i);
      if (match) {
        parts.push(
          <button
            key={i}
            onClick={() => onClassClick(Number(match[1]))}
            className="font-semibold text-blue-500 hover:text-blue-400 hover:underline"
          >
            {inner}
          </button>,
        );
      } else {
        parts.push(<strong key={i} className="font-semibold text-foreground">{inner}</strong>);
      }
    } else {
      parts.push(<span key={i}>{part}</span>);
    }
  });
  return parts;
}
