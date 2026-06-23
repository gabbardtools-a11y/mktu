import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes timeout for AI responses

// System prompt that focuses the assistant on MKTU classification.
const SYSTEM_PROMPT = `Ты — эксперт по Международной классификации товаров и услуг (МКТУ, Ниццкая классификация) 13-й редакции 2026 года.

Твоя задача — помочь пользователю определить подходящие классы МКТУ для регистрации товарного знака.

Правила ответа:
1. Отвечай на русском языке.
2. Если назван товар или услуга — назови подходящий класс(ы) МКТУ с номером (1–45).
3. Укажи, к товарам (классы 1–34) или услугам (классы 35–45) относится каждый класс.
4. Если уместно — предложи соседние классы, которые тоже могут подойти.
5. Будь краток и по делу: заголовок класса + 1–2 предложения пояснения.
6. Если запрос не связан с МКТУ — вежливо верни пользователя к теме классификации.

Пример ответа:
Для «кофе» подходит:
- Класс 30 (Товары) — кофе, чай, какао и заменители кофе; хлебобулочные и кондитерские изделия.
Дополнительно стоит рассмотреть:
- Класс 43 (Услуги) — услуги по предоставлению продовольствия и напитков (если открываете кофейню).`;

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
