import { NextRequest, NextResponse } from "next/server";
import { getFullClassById } from "@/data/mktu-data-full";

/**
 * GET /api/classes?id=1,2,3
 * Возвращает полные данные классов (с items[]) по списку id.
 * Используется корзиной/избранным — чтобы не тащить весь mktu-data.json в браузер.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const idsParam = searchParams.get("id") ?? "";

  if (!idsParam) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const ids = idsParam
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 45);

  if (ids.length === 0) {
    return NextResponse.json({ error: "No valid ids" }, { status: 400 });
  }

  const classes = ids
    .map((id) => getFullClassById(id))
    .filter((c) => c !== null);

  return NextResponse.json({ classes });
}
