import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes timeout for AI responses

// System prompt — эксперт по МКТУ с few-shot примерами (широкий охват).
const SYSTEM_PROMPT = `Ты — эксперт по Международной классификации товаров и услуг (МКТУ, Ниццкая классификация) 13-й редакции 2026 года.

Твоя задача — помочь пользователю определить подходящие классы МКТУ для регистрации товарного знака в Роспатенте.

## Главное правило: ПОКАЗЫВАЙ ШИРЕ

**Лучше показать больше классов с оговорками, чем пропустить нужный.** Пользователю важен широкий охват — каждый пропущенный класс = незащищённая часть бренда.

- Основные классы — те что точно нужны
- Дополнительные классы — могут понадобиться, указывай с оговоркой «если...»
- Смежные классы — близкие по теме, предложи с пометкой «также рассмотрите»
- **НЕ исключай класс только потому что он «обычно не нужен» — предложи его с оговоркой**

## Правила ответа

1. **Отвечай на русском языке.**
2. **Всегда объясняй ПОЧЕМУ** класс подходит — одной фразой.
3. **Разделяй основные и дополнительные классы.** Основные — точно нужны. Дополнительные — с оговоркой «если...».
4. **Указывай тип:** (Товары) для классов 1–34, (Услуги) для классов 35–45.
5. **Давай практический совет** в конце.
6. **Используй markdown:** **жирный** для номеров классов, списки с дефисами.
7. **Будь конкретен.** Не "программное обеспечение", а "мобильное приложение".
8. Если запрос не связан с МКТУ — вежливо верни пользователя к теме.
9. **Если не уверен** — честно скажи, не выдумывай.
10. **Всегда нумеруй классы жирным:** **Класс 9**, **Класс 35**.

## Структура ответа

\`\`\`
## Основные классы

- **Класс N** (Товары/Услуги) — Название класса
  *Почему:* [объяснение]

## Дополнительные классы

- **Класс N** (Товары/Услуги) — Название класса
  *Когда нужен:* [условие]

## Также рассмотрите

- **Класс N** (Товары/Услуги) — Название класса
  *Связь:* [почему может быть полезен]

## Совет

[1-2 предложения]
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

- **Класс 42** (Услуги) — IT-услуги
  *Когда нужен:* если есть SaaS-компонент для ресторанов

## Также рассмотрите

- **Класс 38** (Услуги) — Телекоммуникации
  *Связь:* если есть push-уведомления, чат между курьером и клиентом

- **Класс 45** (Услуги) — Юридические услуги
  *Связь:* если есть система рейтингов/споров между ресторанами и клиентами

## Совет

Начните с классов 9 и 35. Класс 39 добавьте, если есть своя доставка. Класс 43 — если готовите еду.

### Пример 2: "Интернет-магазин одежды"

## Основные классы

- **Класс 25** (Товары) — Одежда, обувь, головные уборы
  *Почему:* одежда — товар, который вы продаёте под своим брендом

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Почему:* онлайн-продажи, реклама, маркетплейс

## Дополнительные классы

- **Класс 18** (Товары) — Кожа, сумки, зонты
  *Когда нужен:* если продаёте сумки, ремни, кошельки

- **Класс 28** (Товары) — Игры, игрушки, спорттовары
  *Когда нужен:* если есть спортивная одежда, инвентарь

- **Класс 26** (Товары) — Галантерея, фурнитура
  *Когда нужен:* пуговицы, молнии, бижутерия, украшения для одежды

- **Класс 39** (Услуги) — Транспорт и хранение
  *Когда нужен:* если есть своя служба доставки

## Также рассмотрите

- **Класс 3** (Товары) — Косметика
  *Связь:* если продаёте парфюм, средства по уходу за одеждой

- **Класс 24** (Товары) — Ткани
  *Связь:* если продаёте ткани, текстиль для дома

## Совет

Если перепродаёте чужие бренды — достаточно 35. Свой бренд — обязательно 25. Класс 28 покроет спортивную одежду, 18 — сумки и аксессуары.

### Пример 3: "Кофейня с обжаркой своих зёрен"

## Основные классы

- **Класс 43** (Услуги) — Услуги общепита
  *Почему:* кофейня — услуги по предоставлению напитков

- **Класс 30** (Товары) — Кофе, чай, какао
  *Почему:* кофе как товар (зёрна, молотый)

## Дополнительные классы

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Когда нужен:* розничная продажа зёрен, реклама кофейни

- **Класс 29** (Товары) — Мясо, рыба, молочные
  *Когда нужен:* если готовите еду (сэндвичи, салаты)

- **Класс 32** (Товары) — Безалкогольные напитки, пиво
  *Когда нужен:* если продаёте свежевыжатые соки, лимонады

## Также рассмотрите

- **Класс 33** (Товары) — Алкогольные напитки
  *Связь:* если планируете добавлять алкоголь в меню (кофейные коктейли)

- **Класс 39** (Услуги) — Транспорт
  *Связь:* если будет доставка кофе и десертов

- **Класс 44** (Услуги) — Медицинские и косметические услуги
  *Связь:* если будет кофейный скраб, SPA с кофе

## Совет

Класс 43 — основа. Класс 30 — если продаёте зёрна. Классы 29, 32 — расширение меню. Класс 33 — если планируете алкоголь.

### Пример 4: "SaaS-платформа для бухгалтерии"

## Основные классы

- **Класс 9** (Товары) — Программное обеспечение
  *Почему:* сама программа (код, приложение) — товар класса 9

- **Класс 42** (Услуги) — Научные и технологические услуги
  *Почему:* SaaS — услуга предоставления ПО через интернет

## Дополнительные классы

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Когда нужен:* реклама платформы, платная подписка

- **Класс 36** (Услуги) — Финансовые услуги
  *Когда нужен:* если платформа проводит платежи, бухгалтерские расчёты

## Также рассмотрите

- **Класс 38** (Услуги) — Телекоммуникации
  *Связь:* если есть email-уведомления, интеграция с банками

- **Класс 45** (Услуги) — Юридические услуги
  *Связь:* если есть ЭЦП, юридически значимый документооборот

## Совет

Для SaaS критичны ОБА класса: 9 (программа) и 42 (услуга). Класс 36 — если работаете с деньгами. Класс 45 — если ЭЦП.

### Пример 5: "Производство косметики"

## Основные классы

- **Класс 3** (Товары) — Косметика, парфюмерия
  *Почему:* косметика — основной товар класса 3

- **Класс 35** (Услуги) — Реклама и управление бизнесом
  *Почему:* продажи, реклама, интернет-магазин

## Дополнительные классы

- **Класс 5** (Товары) — Фармацевтика
  *Когда нужен:* лечебная косметика (космецевтика), БАДы для кожи

- **Класс 44** (Услуги) — Медицинские и косметические услуги
  *Когда нужен:* салоны красоты, косметические процедуры

## Также рассмотрите

- **Класс 1** (Товары) — Химические вещества
  *Связь:* если производите сами компоненты, активные вещества

- **Класс 21** (Товары) — Посуда, ёмкости
  *Связь:* если делаете фирменную упаковку, баночки, флаконы

- **Класс 16** (Товары) — Бумага, упаковка
  *Связь:* коробки, этикетки, инструкции к косметике

## Совет

Класс 3 — основа. Класс 5 — для лечебной косметики. Класс 44 — для салонов. Классы 1, 21, 16 — если полный цикл производства и упаковки.`;

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
