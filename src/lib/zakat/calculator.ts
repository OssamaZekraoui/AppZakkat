import type {
  ZakatInput,
  ZakatResult,
  ZakatBreakdown,
  ZakatSchool,
  ZakatAssets,
  MetalPrices,
  Currency,
} from "./types";
import { SCHOOL_RULES, NISAB_WEIGHTS, LUNAR_YEAR_DAYS, ZAKAT_RATE } from "./schools";
import { getGoldNisabValue, getSilverNisabValue } from "./nisab";

function convertMetalToValue(
  grams: number,
  metalType: "gold" | "silver",
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  const priceEur =
    metalType === "gold" ? metalPrices.goldPerGram : metalPrices.silverPerGram;
  const rate = exchangeRates[currency] || 1;
  return grams * priceEur * rate;
}

function computeBreakdown(
  assets: ZakatAssets,
  school: ZakatSchool,
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): ZakatBreakdown[] {
  const rules = SCHOOL_RULES[school];

  const goldValue = convertMetalToValue(
    assets.goldGrams,
    "gold",
    metalPrices,
    currency,
    exchangeRates
  );
  const silverValue = convertMetalToValue(
    assets.silverGrams,
    "silver",
    metalPrices,
    currency,
    exchangeRates
  );
  const jewelryValue = convertMetalToValue(
    assets.goldJewelryGrams,
    "gold",
    metalPrices,
    currency,
    exchangeRates
  );

  const breakdown: ZakatBreakdown[] = [
    // Cash
    { category: "Cash", categoryAr: "نقد", amount: assets.cash, isZakatable: true },
    {
      category: "Bank accounts",
      categoryAr: "حسابات بنكية",
      amount: assets.bankAccounts,
      isZakatable: true,
    },
    {
      category: "Savings",
      categoryAr: "توفير",
      amount: assets.savings,
      isZakatable: true,
    },
    // Metals
    {
      category: "Gold",
      categoryAr: "ذهب",
      amount: goldValue,
      isZakatable: true,
    },
    {
      category: "Silver",
      categoryAr: "فضة",
      amount: silverValue,
      isZakatable: true,
    },
    {
      category: "Gold jewelry",
      categoryAr: "حلي ذهبية",
      amount: jewelryValue,
      isZakatable: rules.goldJewelryZakatable,
      note: rules.goldJewelryZakatable
        ? undefined
        : "Non zakatable selon cette école",
    },
    // Investments
    {
      category: "Halal stocks",
      categoryAr: "أسهم حلال",
      amount: assets.halalStocks,
      isZakatable: true,
    },
    {
      category: "Islamic funds",
      categoryAr: "صناديق إسلامية",
      amount: assets.islamicFunds,
      isZakatable: true,
    },
    {
      category: "Dividends",
      categoryAr: "أرباح",
      amount: assets.dividends,
      isZakatable: true,
    },
    {
      category: "Crypto (halal)",
      categoryAr: "عملات رقمية",
      amount: assets.cryptoHalal,
      isZakatable: true,
      note: "اختلف العلماء في حكم زكاة العملات الرقمية",
    },
    // Business
    {
      category: "Business inventory",
      categoryAr: "عروض تجارة",
      amount: assets.businessInventory,
      isZakatable: true,
    },
    {
      category: "Business receivables",
      categoryAr: "ديون تجارية مستحقة",
      amount: assets.businessReceivables,
      isZakatable: true,
    },
    // Other income
    {
      category: "Loans given",
      categoryAr: "قروض حسنة",
      amount: assets.loansGiven,
      isZakatable: true,
    },
    {
      category: "Rental income",
      categoryAr: "إيرادات إيجارية",
      amount: assets.rentalIncome,
      isZakatable: true,
    },
    // Deductions
    {
      category: "Short-term debts",
      categoryAr: "ديون قصيرة الأجل",
      amount: -assets.shortTermDebts,
      isZakatable: true,
    },
    {
      category: "Essential expenses",
      categoryAr: "مصاريف أساسية",
      amount: -assets.essentialExpenses,
      isZakatable: true,
    },
  ];

  return breakdown;
}

function computeForSchool(
  assets: ZakatAssets,
  school: ZakatSchool,
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>,
  hawlCompleted: boolean
): number {
  const rules = SCHOOL_RULES[school];
  const breakdown = computeBreakdown(assets, school, metalPrices, currency, exchangeRates);

  const totalZakatable = breakdown
    .filter((b) => b.isZakatable)
    .reduce((sum, b) => sum + b.amount, 0);

  // Agricultural output uses different rate and doesn't require hawl
  const agriculturalZakat = assets.agriculturalOutput * rules.agriculturalRate.natural;

  const nisabType = rules.nisabReference;
  const nisabValue =
    nisabType === "gold"
      ? getGoldNisabValue(metalPrices, currency, exchangeRates)
      : getSilverNisabValue(metalPrices, currency, exchangeRates);

  const netAssets = totalZakatable;
  const nisabMet = netAssets >= nisabValue;

  let zakatAmount = 0;
  if (nisabMet && hawlCompleted) {
    zakatAmount = netAssets * ZAKAT_RATE;
  }

  // Agricultural zakat is independent of hawl
  zakatAmount += agriculturalZakat;

  return Math.max(0, Math.round(zakatAmount * 100) / 100);
}

export function calculateZakat(input: ZakatInput): ZakatResult {
  const { assets, currency, school, hawlStart, metalPrices, exchangeRates } = input;
  const rules = SCHOOL_RULES[school];

  // Hawl calculation
  const hawlStartDate = new Date(hawlStart);
  const today = new Date();
  const diffMs = today.getTime() - hawlStartDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hawlCompleted = diffDays >= LUNAR_YEAR_DAYS;
  const daysUntilHawl = hawlCompleted ? 0 : LUNAR_YEAR_DAYS - diffDays;

  const hawlEndDate = new Date(hawlStartDate);
  hawlEndDate.setDate(hawlEndDate.getDate() + LUNAR_YEAR_DAYS);

  // Breakdown for chosen school
  const breakdown = computeBreakdown(assets, school, metalPrices, currency, exchangeRates);

  const totalGross = breakdown
    .filter((b) => b.amount > 0)
    .reduce((sum, b) => sum + b.amount, 0);

  const totalDeductions = assets.shortTermDebts + assets.essentialExpenses;

  const netZakatableAssets = breakdown
    .filter((b) => b.isZakatable)
    .reduce((sum, b) => sum + b.amount, 0);

  // Nisab
  const nisabType = rules.nisabReference;
  const goldNisabValue = getGoldNisabValue(metalPrices, currency, exchangeRates);
  const silverNisabValue = getSilverNisabValue(metalPrices, currency, exchangeRates);
  const nisabThreshold =
    nisabType === "gold" ? goldNisabValue : silverNisabValue;
  const nisabMet = netZakatableAssets >= nisabThreshold;

  // Main zakat
  let zakatAmount = 0;
  if (nisabMet && hawlCompleted) {
    zakatAmount = netZakatableAssets * ZAKAT_RATE;
  }

  // Agricultural zakat (independent of hawl)
  const agriculturalZakat =
    assets.agriculturalOutput * rules.agriculturalRate.natural;
  zakatAmount += agriculturalZakat;
  zakatAmount = Math.max(0, Math.round(zakatAmount * 100) / 100);

  const zakatDue = zakatAmount > 0;

  // School comparison
  const schools: ZakatSchool[] = ["hanafi", "maliki", "shafiite", "hanbalite"];
  const schoolComparison = {} as Record<ZakatSchool, number>;
  for (const s of schools) {
    schoolComparison[s] = computeForSchool(
      assets,
      s,
      metalPrices,
      currency,
      exchangeRates,
      hawlCompleted
    );
  }

  return {
    totalGrossAssets: Math.round(totalGross * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netZakatableAssets: Math.round(netZakatableAssets * 100) / 100,
    nisabThreshold: Math.round(nisabThreshold * 100) / 100,
    nisabMet,
    nisabType,
    goldNisabValue: Math.round(goldNisabValue * 100) / 100,
    silverNisabValue: Math.round(silverNisabValue * 100) / 100,
    hawlStart: hawlStartDate.toISOString(),
    hawlEnd: hawlEndDate.toISOString(),
    hawlCompleted,
    daysUntilHawl: hawlCompleted ? undefined : daysUntilHawl,
    zakatDue,
    zakatAmount,
    zakatRate: ZAKAT_RATE,
    breakdown,
    schoolComparison,
    school,
    currency,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Quick calculation for the teaser widget (simplified)
 */
export function quickZakatCalc(
  cash: number,
  goldGrams: number,
  silverGrams: number,
  goldPricePerGram: number,
  silverPricePerGram: number
): number {
  const total =
    cash + goldGrams * goldPricePerGram + silverGrams * silverPricePerGram;
  const nisab = NISAB_WEIGHTS.gold * goldPricePerGram;
  if (total < nisab) return 0;
  return Math.round(total * ZAKAT_RATE * 100) / 100;
}
