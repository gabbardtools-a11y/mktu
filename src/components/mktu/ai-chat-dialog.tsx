"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, X, Send, Loader2, AlertCircle, ExternalLink, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AiMessage { role: "user" | "assistant"; content: string; }
interface ExternalChat { name: string; url: string; description: string; }

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt: string;
  onOpenClass?: (classId: number) => void;
}

const SUGGESTIONS = ["Класс 30 — кофе", "Класс 9 — программное обеспечение", "Класс 25 — одежда", "Класс 35 — реклама"];

const DEFAULT_EXTERNAL_CHATS: ExternalChat[] = [
  { name: "RouterAI", url: "https://routerai.ru", description: "Доступ к Z.ai GLM с оплатой из РФ" },
  { name: "DuckDuckGo AI Chat", url: "https://duck.ai", description: "Бесплатно, без регистрации" },
  { name: "Z.ai Chat", url: "https://chat.z.ai", description: "Бесплатно, без регистрации" },
];

function parseClassMentions(text: string) {
  const pattern = /(?:(?:класс|классы|class)\s*№?\s*(\d{1,2}))|(?:кл\.\s*(\d{1,2}))|(?:(\d{1,2})\s*(?:-й|-я)?\s*(?:класс|class))/gi;
  const segments: Array<{type: "text"; value: string} | {type: "class"; value: number}> = [];
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const numStr = match[1] ?? match[2] ?? match[3];
    if (!numStr) continue;
    const num = parseInt(numStr, 10);
    if (num < 1 || num > 45) continue;
    if (match.index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    segments.push({ type: "class", value: num });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", value: text.slice(lastIndex) });
  return segments;
}

function renderMessageContent(content: string, onOpenClass?: (classId: number) => void) {
  const segments = parseClassMentions(content);
  if (segments.length === 0) return [content];
  return segments.map((seg, i) => {
    if (seg.type === "text") return <span key={i}>{seg.value}</span>;
    return (
      <button key={i} type="button" onClick={() => onOpenClass?.(seg.value)}
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 transition-colors font-medium text-[0.85em] leading-none"
        title={`Открыть класс ${seg.value}`}>
        Класс {seg.value}
        <ExternalLink className="size-3 opacity-70" />
      </button>
    );
  });
}

export function AiChatDialog({ open, onOpenChange, initialPrompt, onOpenClass }: AiChatDialogProps) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [externalChats, setExternalChats] = useState<ExternalChat[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentInitialRef = useRef<string | null>(null);
  const messagesRef = useRef<AiMessage[]>([]);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, streamingContent]);

  const copyPrompt = useCallback(async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    setExternalChats(null);
    setStreamingContent("");
    const userMsg: AiMessage = { role: "user", content: trimmed };
    const nextMessages = [...messagesRef.current, userMsg];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const contentType = res.headers.get("Content-Type") || "";
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        if (errBody?.error === "ai_not_configured") {
          setMessages((prev) => prev.slice(0, -1));
          setExternalChats(errBody.external_chats || DEFAULT_EXTERNAL_CHATS);
          setLoading(false);
          return;
        }
        throw new Error(errBody?.detail || errBody?.error || `HTTP ${res.status}`);
      }

      if (contentType.includes("text/plain")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("no body");
        const decoder = new TextDecoder();
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setStreamingContent(accumulated);
        }
        if (accumulated.startsWith("[ERROR:")) throw new Error(accumulated);
        setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
        setStreamingContent("");
      } else {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.content || "" }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
      setStreamingContent("");
    }
  }, []);

  useEffect(() => {
    if (!open) { sentInitialRef.current = null; return; }
    if (initialPrompt && sentInitialRef.current !== initialPrompt) {
      sentInitialRef.current = initialPrompt;
      setMessages([]); setInput(""); setError(null);
      const t = setTimeout(() => sendMessage(initialPrompt), 300);
      return () => clearTimeout(t);
    }
  }, [open, initialPrompt, sendMessage]);

  const handleClassClick = useCallback((classId: number) => {
    onOpenChange(false);
    setTimeout(() => onOpenClass?.(classId), 50);
  }, [onOpenChange, onOpenClass]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !max-h-none !rounded-none !translate-x-0 !translate-y-0 !left-0 !top-0 flex flex-col p-0 gap-0 bg-background border-gold/20"
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 flex-shrink-0">
                <Sparkles className="size-5 text-blue-400" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">ИИ-ассистент по МКТУ</DialogTitle>
                <div className="text-xs text-foreground/50 mt-0.5">На базе Z.ai · GLM-5-Turbo · Streaming</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-foreground/60 hover:text-foreground flex-shrink-0" title="Закрыть">
              <X className="size-5" />
            </Button>
          </div>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 py-4 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && !loading && !error && !externalChats && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 mb-4">
                  <Sparkles className="size-8 text-blue-400" strokeWidth={2} />
                </div>
                <p className="text-foreground/60 text-sm">Задайте вопрос — ИИ определит подходящие классы МКТУ</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-card/50 text-foreground/70 hover:border-gold/40 hover:text-foreground transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {externalChats && (
              <div className="py-6">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-2">Встроенный ИИ-чат недоступен</h3>
                  <p className="text-xs text-foreground/60 mb-4">Используйте внешний сервис — промпт скопирован.</p>
                  <div className="mb-4 rounded-lg bg-card border border-border p-3">
                    <code className="text-sm text-foreground/80 break-all">{initialPrompt}</code>
                    <button onClick={() => copyPrompt(initialPrompt)} className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-gold/15 border border-gold/30 text-gold hover:bg-gold/25 transition-colors">
                      {copied ? <><Check className="size-3.5" /> Скопировано!</> : <><Copy className="size-3.5" /> Копировать</>}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {externalChats.map((chat) => (
                      <a key={chat.url} href={chat.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-lg bg-card border border-border hover:border-gold/40 transition-colors group">
                        <div><div className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{chat.name}</div><div className="text-xs text-foreground/50 mt-0.5">{chat.description}</div></div>
                        <ExternalLink className="size-4 text-foreground/40 group-hover:text-gold flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                  <button onClick={() => setExternalChats(null)} className="mt-4 text-xs text-foreground/50 hover:text-foreground underline">Попробовать снова</button>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-gold text-background rounded-br-md font-medium" : "bg-card border border-border text-foreground rounded-bl-md"
                }`}>
                  {msg.role === "assistant" ? renderMessageContent(msg.content, handleClassClick) : msg.content}
                </div>
              </motion.div>
            ))}

            {loading && streamingContent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 bg-card border border-border text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {renderMessageContent(streamingContent, handleClassClick)}
                  <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5" />
                </div>
              </motion.div>
            )}

            {loading && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-foreground/60 text-sm">
                  <Loader2 className="size-4 animate-spin" /><span>ИИ думает…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Не удалось получить ответ</div>
                    <div className="text-xs text-red-400/80">{error}</div>
                    <button onClick={() => { const last = messages[messages.length - 1]; if (last?.role === "user") { setMessages((p) => p.slice(0, -1)); setTimeout(() => sendMessage(last.content), 50); } }} className="mt-2 text-xs underline hover:no-underline">Повторить</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border px-4 sm:px-6 py-3 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Спросите про класс МКТУ…" rows={1} disabled={loading}
                className="flex-1 resize-none max-h-32 min-h-[44px] px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 disabled:opacity-50 text-sm" />
              <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
                className="bg-gold text-background hover:bg-gold-dark flex-shrink-0 h-11 w-11 p-0" title="Отправить (Enter)">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
            <div className="mt-1.5 text-[10px] text-foreground/30 text-center">Enter — отправить · Shift+Enter — новая строка</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
