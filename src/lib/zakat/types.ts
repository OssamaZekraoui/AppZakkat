export type Currency = "MAD" | "EUR" | "USD" | "GBP";
export type NisabType = "gold" | "silver";
export type ZakatSchool = "hanafi" | "maliki" | "shafiite" | "hanbalite";

export interface MetalPrices {
  goldPerGram: number;
  silverPerGram: number;
  currency: string;
  updatedAt: string;
  source: "live" | "cached" | "fallback";
}

export interface ZakatAssets {
  // Step 1 — Cash
  cash: number;
  bankAccounts: number;
  savings: number;

  // Step 2 — Precious metals
  goldGrams: number;
  silverGrams: number;
  goldJewelryGrams: number;

  // Step 3 — Investments
  halalStocks: number;
  islamicFunds: number;
  dividends: number;
  cryptoHalal: number;

  // Step 4 — Business stock
  businessInventory: number;
  businessReceivables: number;

  // Step 5 — Other income
  loansGiven: number;
  rentalIncome: number;
  agriculturalOutput: number;

  // Step 6 — Deductions
  shortTermDebts: number;
  essentialExpenses: number;
}

export interface ZakatInput {
  assets: ZakatAssets;
  currency: Currency;
  nisabType: NisabType;
  school: ZakatSchool;
  hawlStart: string; // ISO date string
  metalPrices: MetalPrices;
  exchangeRates: Record<Currency, number>;
}

export interface ZakatBreakdown {
  category: string;
  categoryAr: string;
  amount: number;
  isZakatable: boolean;
  note?: string;
}

export interface ZakatResult {
  totalGrossAssets: number;
  totalDeductions: number;
  netZakatableAssets: number;

  nisabThreshold: number;
  nisabMet: boolean;
  nisabType: NisabType;
  goldNisabValue: number;
  silverNisabValue: number;

  hawlStart: string;
  hawlEnd: string;
  hawlCompleted: boolean;
  daysUntilHawl?: number;

  zakatDue: boolean;
  zakatAmount: number;
  zakatRate: number;

  breakdown: ZakatBreakdown[];

  schoolComparison: Record<ZakatSchool, number>;

  school: ZakatSchool;
  currency: Currency;
  calculatedAt: string;
}

export const DEFAULT_ASSETS: ZakatAssets = {
  cash: 0,
  bankAccounts: 0,
  savings: 0,
  goldGrams: 0,
  silverGrams: 0,
  goldJewelryGrams: 0,
  halalStocks: 0,
  islamicFunds: 0,
  dividends: 0,
  cryptoHalal: 0,
  businessInventory: 0,
  businessReceivables: 0,
  loansGiven: 0,
  rentalIncome: 0,
  agriculturalOutput: 0,
  shortTermDebts: 0,
  essentialExpenses: 0,
};
