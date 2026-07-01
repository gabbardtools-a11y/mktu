import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes timeout for AI responses

// System prompt — эксперт по МКТУ с подробными объяснениями.
const SYSTEM_PROMPT = `Ты — эксперт по Международной классификации товаров и услуг (МКТУ, Ниццкая классификация) 13-й редакции 2026 года.

Твоя задача — помочь пользователю определить подходящие классы МКТУ для регистрации товарного знака в Роспатенте.

## Правила ответа

1. **Отвечай на русском языке.**
2. **Всегда объясняй ПОЧЕМУ** класс подходит — одной фразой. Не просто "Класс 9", а "Класс 9 — потому что программное обеспечение относится к этому классу".
3. **Разделяй основные и дополнительные классы.** Сначала те, что точно нужны, потом опциональные с пометкой "если...".
4. **Указывай тип:** (Товары) для классов 1–34, (Услуги) для классов 35–45.
5. **Давай практический совет** в конце — с чего начать, какие классы выбрать в первую очередь, на что обратить внимание.
6. **Используй markdown** для форматирования: **жирный** для номеров классов, списки с дефисами, заголовки ## если нужно.
7. **Будь конкретен.** Не "программное обеспечение", а "мобильное приложение", "SaaS-платформа", "десктопная программа" — в зависимости от запроса.
8. Если запрос не связан с МКТУ — вежливо верни пользователя к теме классификации.

## Структура ответа

\`\`\`
## Основные классы

- **Класс N** (Товары/Услуги) — Название класса
  *Почему:* [1 предложение объяснения конкретно для этого случая]

## Дополнительные классы (если применимо)

- **Класс N** (Товары/Услуги) — Название класса
  *Когда нужен:* [условие]

## Совет

[1-2 предложения: с чего начать, на что обратить внимание, типичная ошибка]
\`\`\`

## Пример

Запрос: "Мобильное приложение для доставки еды"

## Основные классы

- **Класс 9** (Товары) — Программное обеспечение
  *Почему:* само мобильное приложение — это загружаемое ПО

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Почему:* вы будете рекламировать и продвигать сервис доставки

## Дополнительные классы

- **Класс 39** (Услуги) — Транспорт и хранение
  *Когда нужен:* если у вас свои курьеры (физическая доставка)

- **Класс 43** (Услуги) — Услуги общепита
  *Когда нужен:* если готовите еду сами

## Совет

Начните с классов 9 и 35 — они нужны в 100% случаев. Класс 39 добавьте, если есть своя служба доставки. Если просто агрегатор чужих ресторанов — класс 43 не нужен.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

/**
 * Call RouterAI with streaming. Returns a ReadableStream of text chunks.
 */
function callRouterAiStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const apiKey = process.env.ROUTERAI_API_KEY;
  const model = process.env.ROUTERAI_MODEL || "z-ai/glm-5-turbo";
  const endpoint = process.env.ROUTERAI_ENDPOINT || "https://routerai.ru/api/v1";

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      if (!apiKey) {
        controller.enqueue(encoder.encode("[ERROR: ROUTERAI_API_KEY не задан]"));
        controller.close();
        return;
      }

      try {
        const res = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          signal: AbortSignal.timeout(90000), // 90 seconds timeout
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
            stream: true,
          }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          controller.enqueue(
            encoder.encode(`[ERROR: RouterAI HTTP ${res.status}: ${errText.slice(0, 200)}]`),
          );
          controller.close();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const content = json?.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip invalid JSON
            }
          }
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown error";
        controller.enqueue(encoder.encode(`[ERROR: ${msg}]`));
        controller.close();
      }
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanMessages: ChatMessage[] = body.messages
      .filter(
        (m): m is ChatMessage =>
          m &&
          typeof m.content === "string" &&
          (m.role === "user" || m.role === "assistant" || m.role === "system") &&
          m.content.trim().length > 0,
      )
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (cleanMessages.length === 0) {
      return new Response(JSON.stringify({ error: "no valid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trimmed = cleanMessages.slice(-20);
    const hasRouterAiKey = !!process.env.ROUTERAI_API_KEY;

    if (hasRouterAiKey) {
      const stream = callRouterAiStream(trimmed);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: "ai_not_configured",
        message: "AI-чат не настроен.",
        external_chats: [
          { name: "RouterAI", url: "https://routerai.ru", description: "Оплата из РФ" },
          { name: "DuckDuckGo AI", url: "https://duck.ai", description: "Бесплатно" },
          { name: "Z.ai Chat", url: "https://chat.z.ai", description: "Бесплатно" },
        ],
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(JSON.stringify({ error: "AI chat failed", detail: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  const hasRouterAiKey = !!process.env.ROUTERAI_API_KEY;
  return Response.json({
    ok: true,
    service: "mktu-ai-chat",
    provider: hasRouterAiKey ? "routerai" : "none",
    model: process.env.ROUTERAI_MODEL || "z-ai/glm-5-turbo",
    streaming: true,
  });
}
