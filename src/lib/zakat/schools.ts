import type { NisabType, ZakatSchool } from "./types";

export interface SchoolRules {
  nisabReference: NisabType;
  goldJewelryZakatable: boolean;
  businessStockMethod: "market_value" | "cost_or_market";
  agriculturalRate: { irrigated: number; natural: number };
}

export const SCHOOL_RULES: Record<ZakatSchool, SchoolRules> = {
  hanafi: {
    nisabReference: "silver",
    goldJewelryZakatable: false,
    businessStockMethod: "market_value",
    agriculturalRate: { irrigated: 0.05, natural: 0.1 },
  },
  maliki: {
    nisabReference: "gold",
    goldJewelryZakatable: true,
    businessStockMethod: "market_value",
    agriculturalRate: { irrigated: 0.05, natural: 0.1 },
  },
  shafiite: {
    nisabReference: "gold",
    goldJewelryZakatable: false,
    businessStockMethod: "cost_or_market",
    agriculturalRate: { irrigated: 0.05, natural: 0.1 },
  },
  hanbalite: {
    nisabReference: "gold",
    goldJewelryZakatable: true,
    businessStockMethod: "market_value",
    agriculturalRate: { irrigated: 0.05, natural: 0.1 },
  },
};

export const NISAB_WEIGHTS = {
  gold: 85, // grams
  silver: 595, // grams
} as const;

export const LUNAR_YEAR_DAYS = 354;
export const ZAKAT_RATE = 0.025; // 2.5%
