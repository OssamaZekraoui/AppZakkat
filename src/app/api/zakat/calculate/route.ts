import { NextRequest, NextResponse } from "next/server";
import { calculateZakat } from "@/lib/zakat/calculator";
import type { ZakatInput } from "@/lib/zakat/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ZakatInput;

    // Validate required fields
    if (!body.assets || !body.currency || !body.school || !body.hawlStart || !body.metalPrices) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = calculateZakat(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Zakat calculation error:", error);
    return NextResponse.json(
      { error: "Calculation failed" },
      { status: 500 }
    );
  }
}
