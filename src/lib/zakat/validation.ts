import { z } from "zod";
import type { ZakatInput } from "./types";

const MAX_INPUT = 1_000_000_000_000_000;
const nonNegativeAmount = z.number().finite().min(0).max(MAX_INPUT);
const positiveAmount = z.number().finite().positive().max(MAX_INPUT);

const assetsSchema = z
  .object({
    cash: nonNegativeAmount,
    bankAccounts: nonNegativeAmount,
    savings: nonNegativeAmount,
    goldGrams: nonNegativeAmount,
    silverGrams: nonNegativeAmount,
    goldJewelryGrams: nonNegativeAmount,
    halalStocks: nonNegativeAmount,
    islamicFunds: nonNegativeAmount,
    dividends: nonNegativeAmount,
    cryptoHalal: nonNegativeAmount,
    businessInventory: nonNegativeAmount,
    businessReceivables: nonNegativeAmount,
    loansGiven: nonNegativeAmount,
    rentalIncome: nonNegativeAmount,
    agriculturalOutput: nonNegativeAmount,
    shortTermDebts: nonNegativeAmount,
    essentialExpenses: nonNegativeAmount,
  })
  .strict();

const dateSchema = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value.slice(0, 10)
  );
}, "Invalid UTC or date-only value");

export const zakatInputSchema = z
  .object({
    assets: assetsSchema,
    currency: z.enum(["MAD", "EUR", "USD", "GBP"]),
    nisabType: z.enum(["gold", "silver"]),
    school: z.enum(["hanafi", "maliki", "shafiite", "hanbalite"]),
    hawlStart: dateSchema,
    metalPrices: z
      .object({
        goldPerGram: positiveAmount,
        silverPerGram: positiveAmount,
        currency: z.enum(["MAD", "EUR", "USD", "GBP"]),
        updatedAt: dateSchema,
        source: z.enum(["live", "cached", "manual", "fallback"]),
      })
      .strict(),
    exchangeRates: z
      .object({
        MAD: positiveAmount,
        EUR: positiveAmount,
        USD: positiveAmount,
        GBP: positiveAmount,
      })
      .strict(),
  })
  .strict();

export class ZakatValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZakatValidationError";
  }
}

export function parseZakatInput(value: unknown): ZakatInput {
  const parsed = zakatInputSchema.safeParse(value);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
      .join("; ");
    throw new ZakatValidationError(message);
  }
  return parsed.data;
}
