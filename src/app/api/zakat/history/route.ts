import { NextResponse } from "next/server";

export async function GET() {
  // Placeholder — requires auth middleware
  return NextResponse.json({ calculations: [] });
}
