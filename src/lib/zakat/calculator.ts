import Decimal from "decimal.js";
import type {
  Currency,
  MetalPrices,
  NisabType,
  ZakatAssets,
  ZakatBreakdown,
  ZakatInput,
  ZakatResult,
  ZakatSchool,
  ZakatWarning,
} from "./types";
import { SCHOOL_RULES, NISAB_WEIGHTS, ZAKAT_RATE } from "./schools";
import {
  convertPriceToCurrency,
  getGoldNisabValue,
  getSilverNisabValue,
} from "./nisab";
import { getHawlStatus } from "./hawl";
import { parseZakatInput, ZakatValidationError } from "./validation";

type CalculationOptions = {
  asOf?: string | Date;
};

function decimal(value: number): Decimal {
  return new Decimal(value);
}

function roundMoney(value: Decimal): number {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}

function convertMetalToValue(
  grams: number,
  metalType: "gold" | "silver",
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  const sourcePrice =
    metalType === "gold" ? metalPrices.goldPerGram : metalPrices.silverPerGram;
  const targetPrice = convertPriceToCurrency(
    sourcePrice,
    metalPrices.currency,
    currency,
    exchangeRates
  );
  return decimal(grams).mul(targetPrice).toNumber();
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

  return [
    { category: "Cash", categoryAr: "نقد", amount: assets.cash, isZakatable: true },
    {
      category: "Bank accounts",
      categoryAr: "حسابات بنكية",
      amount: assets.bankAccounts,
      isZakatable: true,
    },
    { category: "Savings", categoryAr: "توفير", amount: assets.savings, isZakatable: true },
    { category: "Gold", categoryAr: "ذهب", amount: goldValue, isZakatable: true },
    { category: "Silver", categoryAr: "فضة", amount: silverValue, isZakatable: true },
    {
      category: "Personal-use gold jewelry",
      categoryAr: "حلي ذهبية للاستعمال الشخصي",
      amount: jewelryValue,
      isZakatable: rules.goldJewelryZakatable,
      note: rules.goldJewelryZakatable
        ? undefined
        : "Personal-use jewelry is excluded for this school; jewelry held for trade must be entered as business inventory.",
    },
    {
      category: "Zakatable portion of stocks",
      categoryAr: "الجزء الخاضع للزكاة من الأسهم",
      amount: assets.halalStocks,
      isZakatable: true,
    },
    {
      category: "Zakatable portion of Islamic funds",
      categoryAr: "الجزء الخاضع للزكاة من الصناديق الإسلامية",
      amount: assets.islamicFunds,
      isZakatable: true,
    },
    { category: "Dividends held", categoryAr: "أرباح محتفظ بها", amount: assets.dividends, isZakatable: true },
    {
      category: "Crypto treated as zakatable",
      categoryAr: "عملات رقمية محتسبة للزكاة",
      amount: assets.cryptoHalal,
      isZakatable: true,
    },
    {
      category: "Business inventory for resale",
      categoryAr: "مخزون تجاري معد للبيع",
      amount: assets.businessInventory,
      isZakatable: true,
    },
    {
      category: "Recoverable business receivables",
      categoryAr: "ديون تجارية مرجوة السداد",
      amount: assets.businessReceivables,
      isZakatable: true,
    },
    {
      category: "Recoverable loans given",
      categoryAr: "قروض مرجوة السداد",
      amount: assets.loansGiven,
      isZakatable: true,
    },
    {
      category: "Accumulated rental income",
      categoryAr: "إيرادات إيجارية متراكمة",
      amount: assets.rentalIncome,
      isZakatable: true,
    },
    {
      category: "Debts due within 12 months",
      categoryAr: "ديون مستحقة خلال اثني عشر شهرا",
      amount: -assets.shortTermDebts,
      isZakatable: true,
    },
    {
      category: "Immediate essential outgoings",
      categoryAr: "مصاريف أساسية مستحقة فورا",
      amount: -assets.essentialExpenses,
      isZakatable: true,
    },
  ];
}

function sumBreakdown(
  breakdown: ZakatBreakdown[],
  predicate: (item: ZakatBreakdown) => boolean
): Decimal {
  return breakdown.reduce(
    (sum, item) => (predicate(item) ? sum.plus(item.amount) : sum),
    new Decimal(0)
  );
}

function nisabValue(
  nisabType: NisabType,
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>
): number {
  return nisabType === "gold"
    ? getGoldNisabValue(metalPrices, currency, exchangeRates)
    : getSilverNisabValue(metalPrices, currency, exchangeRates);
}

function computeForSchool(
  assets: ZakatAssets,
  school: ZakatSchool,
  nisabType: NisabType,
  metalPrices: MetalPrices,
  currency: Currency,
  exchangeRates: Record<Currency, number>,
  hawlCompleted: boolean
): number {
  const breakdown = computeBreakdown(assets, school, metalPrices, currency, exchangeRates);
  const netAssets = Decimal.max(
    0,
    sumBreakdown(breakdown, (item) => item.isZakatable)
  );
  const threshold = decimal(
    nisabValue(nisabType, metalPrices, currency, exchangeRates)
  );

  if (!hawlCompleted || netAssets.lessThan(threshold)) return 0;
  return roundMoney(netAssets.mul(ZAKAT_RATE));
}

function collectWarnings(input: ZakatInput): ZakatWarning[] {
  const warnings: ZakatWarning[] = [];
  if (input.metalPrices.source === "fallback") warnings.push("fallback_metal_prices");
  if (input.assets.agriculturalOutput > 0) warnings.push("agriculture_not_included");
  if (input.assets.halalStocks > 0 || input.assets.islamicFunds > 0) {
    warnings.push("investment_method_review");
  }
  if (input.assets.cryptoHalal > 0) warnings.push("crypto_review");
  return warnings;
}

export function calculateZakat(
  rawInput: unknown,
  options: CalculationOptions = {}
): ZakatResult {
  const input = parseZakatInput(rawInput);
  const { assets, currency, school, nisabType, metalPrices, exchangeRates } = input;
  const asOf = options.asOf ?? new Date();
  const hawl = getHawlStatus(input.hawlStart, asOf);
  const breakdown = computeBreakdown(assets, school, metalPrices, currency, exchangeRates);

  const totalGross = sumBreakdown(breakdown, (item) => item.amount > 0);
  const totalDeductions = decimal(assets.shortTermDebts).plus(assets.essentialExpenses);
  const netZakatable = Decimal.max(
    0,
    sumBreakdown(breakdown, (item) => item.isZakatable)
  );

  const goldNisabValue = decimal(
    getGoldNisabValue(metalPrices, currency, exchangeRates)
  );
  const silverNisabValue = decimal(
    getSilverNisabValue(metalPrices, currency, exchangeRates)
  );
  const threshold = nisabType === "gold" ? goldNisabValue : silverNisabValue;
  const nisabMet = netZakatable.greaterThanOrEqualTo(threshold);
  const zakatDue = nisabMet && hawl.completed;
  const zakatAmount = zakatDue ? roundMoney(netZakatable.mul(ZAKAT_RATE)) : 0;

  const schools: ZakatSchool[] = ["hanafi", "maliki", "shafiite", "hanbalite"];
  const schoolComparison = {} as Record<ZakatSchool, number>;
  for (const comparisonSchool of schools) {
    schoolComparison[comparisonSchool] = computeForSchool(
      assets,
      comparisonSchool,
      nisabType,
      metalPrices,
      currency,
      exchangeRates,
      hawl.completed
    );
  }

  const calculationDate = new Date(asOf);
  if (!Number.isFinite(calculationDate.getTime())) {
    throw new ZakatValidationError("Invalid calculation date");
  }

  return {
    totalGrossAssets: roundMoney(totalGross),
    totalDeductions: roundMoney(totalDeductions),
    netZakatableAssets: roundMoney(netZakatable),
    nisabThreshold: roundMoney(threshold),
    nisabMet,
    nisabType,
    goldNisabValue: roundMoney(goldNisabValue),
    silverNisabValue: roundMoney(silverNisabValue),
    hawlStart: hawl.start.toISOString(),
    hawlEnd: hawl.end.toISOString(),
    hawlCompleted: hawl.completed,
    daysUntilHawl: hawl.completed ? undefined : hawl.daysUntilCompletion,
    zakatDue,
    zakatAmount,
    zakatRate: ZAKAT_RATE,
    breakdown: breakdown.map((item) => ({ ...item, amount: roundMoney(decimal(item.amount)) })),
    schoolComparison,
    school,
    currency,
    calculatedAt: calculationDate.toISOString(),
    warnings: collectWarnings(input),
  };
}

export function quickZakatCalc(
  cash: number,
  goldGrams: number,
  silverGrams: number,
  goldPricePerGram: number,
  silverPricePerGram: number
): number {
  const values = [cash, goldGrams, silverGrams, goldPricePerGram, silverPricePerGram];
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new ZakatValidationError("Quick calculator values must be finite and non-negative");
  }
  if (goldPricePerGram === 0 || silverPricePerGram === 0) {
    throw new ZakatValidationError("Metal prices must be greater than zero");
  }

  const total = decimal(cash)
    .plus(decimal(goldGrams).mul(goldPricePerGram))
    .plus(decimal(silverGrams).mul(silverPricePerGram));
  const threshold = decimal(NISAB_WEIGHTS.gold).mul(goldPricePerGram);
  if (total.lessThan(threshold)) return 0;
  return roundMoney(total.mul(ZAKAT_RATE));
}
