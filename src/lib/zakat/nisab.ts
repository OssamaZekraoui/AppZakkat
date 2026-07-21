import type { Currency, MetalPrices, NisabType } from "./types";
import { NISAB_WEIGHTS } from "./schools";
import Decimal from "decimal.js";
import { ZakatValidationError } from "./validation";

// Fallback prices (updated manually as safety net)
const FALLBACK_PRICES: MetalPrices = {
  goldPerGram: 85,
  silverPerGram: 1.05,
  currency: "EUR",
  updatedAt: "2026-07-18T00:00:00.000Z",
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

  return new Decimal(weight)
    .mul(convertPriceToCurrency(pricePerGram, metalPrices.currency, currency, exchangeRates))
    .toNumber();
}

export function convertPriceToCurrency(
  value: number,
  sourceCurrency: Currency,
  targetCurrency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new ZakatValidationError("Price must be a finite non-negative number");
  }
  if (sourceCurrency === targetCurrency) return value;

  const sourceRate = exchangeRates[sourceCurrency];
  const targetRate = exchangeRates[targetCurrency];
  if (!Number.isFinite(sourceRate) || sourceRate <= 0 || !Number.isFinite(targetRate) || targetRate <= 0) {
    throw new ZakatValidationError("Exchange rates must be finite positive numbers");
  }

  return new Decimal(value).div(sourceRate).mul(targetRate).toNumber();
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
