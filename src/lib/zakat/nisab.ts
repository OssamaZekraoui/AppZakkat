import type { Currency, MetalPrices, NisabType } from "./types";
import { NISAB_WEIGHTS } from "./schools";

// Fallback prices (updated manually as safety net)
const FALLBACK_PRICES: MetalPrices = {
  goldPerGram: 85,
  silverPerGram: 1.05,
  currency: "EUR",
  updatedAt: new Date().toISOString(),
  source: "fallback",
};

// Default exchange rates vs EUR
const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  MAD: 10.8,
  USD: 1.08,
  GBP: 0.86,
};

export function getFallbackPrices(): MetalPrices {
  return { ...FALLBACK_PRICES };
}

export function getDefaultExchangeRates(): Record<Currency, number> {
  return { ...DEFAULT_EXCHANGE_RATES };
}

export function calculateNisabValue(
  nisabType: NisabType,
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  const weight = NISAB_WEIGHTS[nisabType];
  const pricePerGram =
    nisabType === "gold" ? metalPrices.goldPerGram : metalPrices.silverPerGram;

  // Prices are in EUR, convert to target currency
  const valueInEur = weight * pricePerGram;
  const rate = exchangeRates[currency] || 1;
  return valueInEur * rate;
}

export function getGoldNisabValue(
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  return calculateNisabValue("gold", metalPrices, currency, exchangeRates);
}

export function getSilverNisabValue(
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  return calculateNisabValue("silver", metalPrices, currency, exchangeRates);
}
