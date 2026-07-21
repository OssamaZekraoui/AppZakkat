import { NextResponse } from "next/server";
import type { Currency } from "@/lib/zakat/types";
import { getDefaultExchangeRates } from "@/lib/zakat/nisab";

// Fallback prices (safety net)
const FALLBACK_GOLD_EUR = 85;
const FALLBACK_SILVER_EUR = 1.05;

// In-memory cache
let cachedPrices: {
  goldPerGram: number;
  silverPerGram: number;
  updatedAt: string;
  expiresAt: number;
  exchangeRates: Record<Currency, number>;
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

async function fetchExchangeRates(): Promise<Record<Currency, number> | null> {
  try {
    const response = await fetch(
      "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=MAD,USD,GBP",
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as Array<{
      quote: Currency;
      rate: number;
    }>;
    const rates = { ...getDefaultExchangeRates(), EUR: 1 };
    for (const item of data) {
      if (
        (item.quote === "MAD" || item.quote === "USD" || item.quote === "GBP") &&
        Number.isFinite(item.rate) &&
        item.rate > 0
      ) {
        rates[item.quote] = item.rate;
      }
    }
    return rates;
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
      exchangeRates: cachedPrices.exchangeRates,
      nextUpdateIn: Math.floor((cachedPrices.expiresAt - now) / 1000),
    });
  }

  // Try live fetch
  const [live, liveExchangeRates] = await Promise.all([
    fetchLivePrices(),
    fetchExchangeRates(),
  ]);
  const exchangeRates = liveExchangeRates ?? getDefaultExchangeRates();

  if (live) {
    cachedPrices = {
      goldPerGram: live.goldPerGram,
      silverPerGram: live.silverPerGram,
      updatedAt: new Date().toISOString(),
      expiresAt: now + CACHE_TTL,
      exchangeRates,
    };

    return NextResponse.json({
      goldPerGram: live.goldPerGram,
      silverPerGram: live.silverPerGram,
      currency: "EUR",
      updatedAt: cachedPrices.updatedAt,
      source: "live" as const,
      exchangeRates,
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
    exchangeRates,
    nextUpdateIn: 0,
  });
}
