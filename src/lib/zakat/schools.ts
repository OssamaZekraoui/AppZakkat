import type { ZakatSchool } from "./types";

export interface SchoolRules {
  goldJewelryZakatable: boolean;
}

export const SCHOOL_RULES: Record<ZakatSchool, SchoolRules> = {
  hanafi: {
    goldJewelryZakatable: true,
  },
  maliki: {
    goldJewelryZakatable: false,
  },
  shafiite: {
    goldJewelryZakatable: false,
  },
  hanbalite: {
    goldJewelryZakatable: false,
  },
};

export const NISAB_WEIGHTS = {
  gold: 85, // grams
  silver: 595, // grams
} as const;

export const LUNAR_YEAR_DAYS = 354;
export const ZAKAT_RATE = 0.025; // 2.5%
