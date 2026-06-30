import { NextRequest, NextResponse } from "next/server";
import { getFullClassById } from "@/data/mktu-data-full";
import type { CartClass } from "@/hooks/use-favorites-cart";
import { calculateFees, FEES, fmtRub } from "@/lib/fees";
import { pluralRu } from "@/lib/plural";

interface RtfOptions {
  bold?: boolean;
  size?: number;
  align?: "left" | "center" | "right";
  color?: 1 | 2;
  spaceBefore?: number;
  spaceAfter?: number;
  indent?: number;
}

function rtfEscapeText(text: string): string {
  let result = "";
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code > 127) {
      const signed = code > 32767 ? code - 65536 : code;
      result += `\\u${signed}?`;
    } else if (char === "\\") {
      result += "\\\\";
    } else if (char === "{") {
      result += "\\{";
    } else if (char === "}") {
      result += "\\}";
    } else if (code < 32) {
      // skip
    } else {
      result += char;
    }
  }
  return result;
}

function rtfParagraph(text: string, opts: RtfOptions = {}): string {
  const open: string[] = ["\\pard"];
  if (opts.align) {
    open.push(`\\q${opts.align === "center" ? "c" : opts.align === "right" ? "r" : "l"}`);
  }
  if (opts.spaceBefore) open.push(`\\sb${opts.spaceBefore}`);
  if (opts.spaceAfter) open.push(`\\sa${opts.spaceAfter}`);
  if (opts.indent) open.push(`\\li${opts.indent}`);
  if (opts.bold) open.push("\\b");
  if (opts.size) open.push(`\\fs${opts.size}`);
  if (opts.color) open.push(`\\cf${opts.color}`);
  open.push(" ");

  const close: string[] = [];
  if (opts.bold) close.push("\\b0");
  if (opts.size) close.push("\\fs24");
  if (opts.color) close.push("\\cf1");
  close.push("\\par");

  return `${open.join("")}${rtfEscapeText(text)}${close.join("")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cart: CartClass[] = body.cart ?? [];
    const paperCert: boolean = body.paperCert ?? false;

    if (cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const dateStr = new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const parts: string[] = [];
    parts.push(
      rtfParagraph("МКТУ-13 2026 — Классы для регистрации товарного знака", {
        bold: true,
        size: 32,
        align: "center",
        spaceAfter: 120,
      }),
      rtfParagraph(`Дата формирования: ${dateStr}`, {
        size: 22,
        align: "center",
        color: 2,
        spaceAfter: 200,
      }),
    );

    let totalItems = 0;
    const sortedCart = [...cart].sort((a, b) => a.classId - b.classId);

    for (const entry of sortedCart) {
      const cls = getFullClassById(entry.classId);
      if (!cls) continue;
      const items =
        entry.selectedItems.length > 0 ? entry.selectedItems : cls.items;
      totalItems += items.length;

      parts.push(
        rtfParagraph(`${cls.name} — ${cls.description}`, {
          bold: true,
          size: 24,
          spaceBefore: 200,
          spaceAfter: 80,
        }),
      );

      for (let i = 0; i < items.length; i++) {
        parts.push(
          rtfParagraph(`${i + 1}. ${items[i]}`, {
            size: 22,
            indent: 200,
            spaceAfter: 20,
          }),
        );
      }

      parts.push(rtfParagraph("", { spaceAfter: 80 }));
    }

    parts.push(
      rtfParagraph(
        `Итого: ${cart.length} ${pluralRu(cart.length, ["класс", "класса", "классов"])}, ${totalItems} ${pluralRu(totalItems, ["позиция", "позиции", "позиций"])}`,
        { bold: true, size: 24, spaceBefore: 200 },
      ),
    );

    // ─── Расчёт пошлин ───
    const itemsPerClass = sortedCart.map((c) => c.selectedItems.length);
    const fees = calculateFees(itemsPerClass, paperCert);

    parts.push(
      rtfParagraph("Расчёт государственных пошлин Роспатента", {
        bold: true,
        size: 26,
        align: "center",
        spaceBefore: 400,
        spaceAfter: 120,
      }),
      rtfParagraph("Положение о патентных и иных пошлинах, актуально на 2026 год", {
        size: 20,
        align: "center",
        color: 2,
        spaceAfter: 200,
      }),
      rtfParagraph("При подаче заявки (в течение 2 месяцев)", {
        bold: true,
        size: 24,
        spaceBefore: 120,
        spaceAfter: 60,
      }),
      rtfParagraph(
        `п. 2.1  Регистрация заявки + формальная экспертиза  —  ${fmtRub(fees.p21Total)}`,
        { size: 22, indent: 200, spaceAfter: 30 },
      ),
      rtfParagraph(
        `п. 2.4  Экспертиза обозначения по существу  —  ${fmtRub(fees.p24Total)}`,
        { size: 22, indent: 200, spaceAfter: 30 },
      ),
      rtfParagraph(
        `Итого при подаче:  ${fmtRub(fees.totalAtFiling)}`,
        { bold: true, size: 22, indent: 200, spaceBefore: 60, spaceAfter: 120 },
      ),
      rtfParagraph("После решения о регистрации (продление на 10 лет)", {
        bold: true,
        size: 24,
        spaceBefore: 120,
        spaceAfter: 60,
      }),
      rtfParagraph(
        `п. 2.11  Регистрация ТЗ + выдача свидетельства (электронное)  —  ${fmtRub(fees.p211Total)}`,
        { size: 22, indent: 200, spaceAfter: 30 },
      ),
    );

    if (paperCert) {
      parts.push(
        rtfParagraph(
          `п. 2.14  Выдача свидетельства на бумажном носителе  —  ${fmtRub(FEES.p214.base)}`,
          { size: 22, indent: 200, spaceAfter: 30 },
        ),
      );
    }

    parts.push(
      rtfParagraph(
        `Итого за регистрацию:  ${fmtRub(fees.totalRegistration)}`,
        { bold: true, size: 22, indent: 200, spaceBefore: 60, spaceAfter: 200 },
      ),
      rtfParagraph(
        `ВСЕГО за весь процесс регистрации:  ${fmtRub(fees.totalProject)}`,
        { bold: true, size: 26, align: "center", spaceBefore: 200, spaceAfter: 80 },
      ),
      rtfParagraph(
        `Из них: при подаче ${fmtRub(fees.totalAtFiling)} + после решения ${fmtRub(fees.totalRegistration)}`,
        { size: 20, align: "center", color: 2, spaceAfter: 200 },
      ),
      rtfParagraph(
        "Расчёт является справочным. Точный размер пошлин рекомендуется согласовать с патентным поверенным.",
        { size: 20, color: 2, align: "center", spaceBefore: 100 },
      ),
    );

    const body_rtf = parts.join("");
    const rtf = `{\\rtf1\\ansi\\ansicpg1251\\uc1\\deff0
{\\fonttbl{\\f0\\fswiss\\fcharset204 Calibri;}{\\f1\\froman\\fcharset204 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red100\\green100\\blue100;}
\\paperw11906\\paperh16838\\margl1440\\margr1440\\margt1440\\margb1440
\\f0\\fs24\\cf1
${body_rtf}
}`;

    return new NextResponse(rtf, {
      headers: {
        "Content-Type": "application/rtf; charset=utf-8",
        "Content-Disposition": 'attachment; filename="mktu-klassy.rtf"',
      },
    });
  } catch (error) {
    console.error("RTF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate RTF" },
      { status: 500 },
    );
  }
}
