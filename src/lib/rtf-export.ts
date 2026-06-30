import type { CartClass } from "@/hooks/use-favorites-cart";

/**
 * Скачивает RTF с классами и расчётом пошлин.
 * Использует server-side API route /api/export-rtf —
 * это позволяет не тащить mktu-data.json (1.4 MB) в клиентский бандл.
 */
export async function downloadRtf(
  cart: CartClass[],
  _allClasses?: unknown, // оставлено для обратной совместимости, не используется
  options?: { paperCert?: boolean },
): Promise<void> {
  if (cart.length === 0) return;
  const paperCert = options?.paperCert ?? false;

  try {
    const response = await fetch("/api/export-rtf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, paperCert }),
    });

    if (!response.ok) {
      console.error("RTF export failed:", response.status, await response.text());
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mktu-klassy.rtf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("RTF export error:", error);
  }
}
