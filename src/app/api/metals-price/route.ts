import { NextResponse } from "next/server";

// Fallback prices (safety net)
const FALLBACK_GOLD_EUR = 85;
const FALLBACK_SILVER_EUR = 1.05;

// In-memory cache
let cachedPrices: {
  goldPerGram: number;
  silverPerGram: number;
  updatedAt: string;
  expiresAt: number;
} | null = null;

const CACHE_TTL = 3600 * 1000; // 1 hour

async function fetchLivePrices(): Promise<{
  goldPerGram: number;
  silverPerGram: number;
} | null> {
  try {
    // Try goldapi.io if API key is available
    const apiKey = process.env.GOLD_API_KEY;
    if (apiKey) {
      const [goldRes, silverRes] = await Promise.all([
        fetch("https://www.goldapi.io/api/XAU/EUR", {
          headers: { "x-access-token": apiKey },
        }),
        fetch("https://www.goldapi.io/api/XAG/EUR", {
          headers: { "x-access-token": apiKey },
        }),
      ]);

      if (goldRes.ok && silverRes.ok) {
        const goldData = await goldRes.json();
        const silverData = await silverRes.json();
        return {
          goldPerGram: goldData.price_gram_24k,
          silverPerGram: silverData.price_gram_24k,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();

  // Check in-memory cache
  if (cachedPrices && cachedPrices.expiresAt > now) {
    return NextResponse.json({
      goldPerGram: cachedPrices.goldPerGram,
      silverPerGram: cachedPrices.silverPerGram,
      currency: "EUR",
      updatedAt: cachedPrices.updatedAt,
      source: "cached" as const,
      nextUpdateIn: Math.floor((cachedPrices.expiresAt - now) / 1000),
    });
  }

  // Try live fetch
  const live = await fetchLivePrices();

  if (live) {
    cachedPrices = {
      goldPerGram: live.goldPerGram,
      silverPerGram: live.silverPerGram,
      updatedAt: new Date().toISOString(),
      expiresAt: now + CACHE_TTL,
    };

    return NextResponse.json({
      goldPerGram: live.goldPerGram,
      silverPerGram: live.silverPerGram,
      currency: "EUR",
      updatedAt: cachedPrices.updatedAt,
      source: "live" as const,
      nextUpdateIn: CACHE_TTL / 1000,
    });
  }

  // Fallback
  return NextResponse.json({
    goldPerGram: FALLBACK_GOLD_EUR,
    silverPerGram: FALLBACK_SILVER_EUR,
    currency: "EUR",
    updatedAt: new Date().toISOString(),
    source: "fallback" as const,
    nextUpdateIn: 0,
  });
}
