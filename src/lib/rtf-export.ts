import type { MktuClass } from "@/data/mktu-data";
import type { CartClass } from "@/hooks/use-favorites-cart";

interface RtfOptions {
  bold?: boolean;
  size?: number;
  align?: "left" | "center" | "right";
  color?: 1 | 2;
  spaceBefore?: number;
  spaceAfter?: number;
  indent?: number;
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

  const escaped = text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/[\x00-\x1f]/g, "");

  return `${open.join("")}${escaped}${close.join("")}`;
}

function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function downloadRtf(cart: CartClass[], allClasses: MktuClass[]): void {
  if (cart.length === 0) return;

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
  );
  parts.push(
    rtfParagraph(`Дата формирования: ${dateStr}`, {
      size: 22,
      align: "center",
      color: 2,
      spaceAfter: 200,
    }),
  );

  let totalItems = 0;

  for (const entry of cart) {
    const cls = allClasses.find((c) => c.id === entry.classId);
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

  const body = parts.join("");

  const rtf = `{\\rtf1\\ansi\\ansicpg1251\\deff0
{\\fonttbl{\\f0\\fswiss\\fcharset204 Calibri;}{\\f1\\froman\\fcharset204 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red100\\green100\\blue100;}
\\paperw11906\\paperh16838\\margl1440\\margr1440\\margt1440\\margb1440
\\f0\\fs24\\cf1
${body}
}`;

  const blob = new Blob([rtf], { type: "application/rtf;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mktu-klassy.rtf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
