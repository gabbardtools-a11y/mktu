import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes timeout for AI responses

// System prompt — эксперт по МКТУ с few-shot примерами.
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
9. **Если не уверен** в классе — честно скажи "рекомендуется уточнить у патентного поверенного". Не выдумывай.
10. **Всегда нумеруй классы жирным**: **Класс 9**, **Класс 35** и т.д.

## ⚠️ Частые ошибки — НЕ ПУТАЙ!

- **Класс 25** (Одежда) ≠ **Класс 28** (Спортинвентарь). Спортивная одежда — это Класс 25.
- **Класс 29** (Мясо, молоко) ≠ **Класс 30** (Кофе, чай, выпечка). Класс 29 — «живая» еда, Класс 30 — «сухая».
- **Класс 9** (ПО как товар) ≠ **Класс 42** (IT-услуги). SaaS = оба класса.
- **Класс 35** (Реклама/торговля) ≠ **Класс 39** (Доставка). Маркетплейс = 35, курьер = 39.
- **Класс 32** (Безалкогольные + пиво) ≠ **Класс 33** (Алкоголь). Вино, водка = 33.
- **Класс 43** (Общепит) нужен если ГОТОВИТЕ еду. Если только доставляете чужую — НЕ нужен.
- **Класс 3** (Косметика) ≠ **Класс 5** (Лекарства). Космецевтика = Класс 5.

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

## Примеры (few-shot)

### Пример 1: "Мобильное приложение для доставки еды"

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

Начните с классов 9 и 35 — они нужны в 100% случаев. Класс 39 добавьте, если есть своя служба доставки. Если просто агрегатор чужих ресторанов — класс 43 не нужен.

### Пример 2: "Интернет-магазин одежды"

## Основные классы

- **Класс 25** (Товары) — Одежда, обувь, головные уборы
  *Почему:* одежда — это товар, который вы продаёте под своим брендом

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Почему:* онлайн-продажи, реклама, маркетплейс — это услуги класса 35

## Дополнительные классы

- **Класс 18** (Товары) — Кожа, сумки
  *Когда нужен:* если продаёте сумки, ремни как доп. ассортимент

- **Класс 39** (Услуги) — Транспорт и хранение
  *Когда нужен:* если есть своя служба доставки

## Совет

Если перепродаёте чужие бренды — достаточно класса 35. Если создаёте свой бренд одежды — обязательно 25. Не путайте: класс 25 это товар (одежда), класс 35 это услуга (продажа).

### Пример 3: "Кофейня с обжаркой своих зёрен"

## Основные классы

- **Класс 43** (Услуги) — Услуги общепита
  *Почему:* кофейня — это услуги по предоставлению напитков

- **Класс 30** (Товары) — Кофе, чай, какао
  *Почему:* кофе как товар (зёрна, молотый) — класс 30

## Дополнительные классы

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Когда нужен:* если продаёте зёрна в розницу, реклама кофейни

- **Класс 29** (Товары) — Мясо, рыба, молочные
  *Когда нужен:* если готовите еду (сэндвичи, салаты)

## Совет

Если только перепродаёте чужой кофе (без обжарки) — класс 30 не нужен, хватит 43 и 35. Класс 29 нужен только если готовите свою еду.

### Пример 4: "SaaS-платформа для бухгалтерии"

## Основные классы

- **Класс 9** (Товары) — Программное обеспечение
  *Почему:* сама программа (код, приложение) — это товар класса 9

- **Класс 42** (Услуги) — Научные и технологические услуги
  *Почему:* SaaS — это услуга предоставления ПО через интернет, класс 42

## Дополнительные классы

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Когда нужен:* если рекламируете платформу, есть платная подписка

## Совет

Для SaaS критично указать ОБА класса: 9 (чтобы защитить название программы) и 42 (чтобы защитить услугу). Не путайте — класс 9 это продукт, класс 42 это услуга.

### Пример 5: "Производство косметики"

## Основные классы

- **Класс 3** (Товары) — Косметика, парфюмерия
  *Почему:* косметика — основной товар класса 3

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Почему:* продажи, реклама, интернет-магазин

## Дополнительные классы

- **Класс 5** (Товары) — Фармацевтика
  *Когда нужен:* если есть лечебная косметика (космецевтика)

- **Класс 44** (Услуги) — Медицинские и косметические услуги
  *Когда нужен:* если есть салоны красоты

## Совет

Класс 3 — самый важный, защитит бренд на кремы, помады, духи. Класс 5 нужен только для лечебных средств. «Органическая косметика» — это маркетинговый термин, не отдельный класс.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

/**
 * Вызывает Groq API (бесплатно, Llama 3.3 70B) со стримингом.
 * Groq совместим с OpenAI API форматом.
 */
function callGroqStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      if (!apiKey) {
        controller.enqueue(encoder.encode("[ERROR: GROQ_API_KEY не задан]"));
        controller.close();
        return;
      }

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          signal: AbortSignal.timeout(90000),
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
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          controller.enqueue(
            encoder.encode(`[ERROR: Groq HTTP ${res.status}: ${errText.slice(0, 200)}]`),
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

/**
 * Fallback: вызывает RouterAI (платный, gpt-4o-mini) со стримингом.
 */
function callRouterAiStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const apiKey = process.env.ROUTERAI_API_KEY;
  const model = process.env.ROUTERAI_MODEL || "openai/gpt-4o-mini";
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
          signal: AbortSignal.timeout(90000),
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

    // ─── Приоритет: Groq (бесплатно) → RouterAI (платный fallback) ───
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasRouterAiKey = !!process.env.ROUTERAI_API_KEY;

    if (hasGroqKey) {
      const stream = callGroqStream(trimmed);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
        },
      });
    }

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
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const hasRouterAiKey = !!process.env.ROUTERAI_API_KEY;
  const provider = hasGroqKey ? "groq" : hasRouterAiKey ? "routerai" : "none";
  return Response.json({
    ok: true,
    service: "mktu-ai-chat",
    provider,
    model: hasGroqKey
      ? process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
      : process.env.ROUTERAI_MODEL || "openai/gpt-4o-mini",
    streaming: true,
    fallback: hasGroqKey && hasRouterAiKey ? "routerai" : "none",
  });
}
