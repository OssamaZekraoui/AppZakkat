import { NextRequest, NextResponse } from "next/server";
import { calculateZakat } from "@/lib/zakat/calculator";
import { parseZakatInput, ZakatValidationError } from "@/lib/zakat/validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = parseZakatInput(body);
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    input.nisabType = settings?.nisabType === "SILVER" ? "silver" : "gold";
    const result = calculateZakat(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZakatValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("Zakat calculation error:", error);
    return NextResponse.json(
      { error: "Calculation failed" },
      { status: 500 }
    );
  }
}
