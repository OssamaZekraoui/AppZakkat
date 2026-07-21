import { NextRequest, NextResponse } from "next/server";
import { calculateZakat } from "@/lib/zakat/calculator";
import { ZakatValidationError } from "@/lib/zakat/validation";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = calculateZakat(body);

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
