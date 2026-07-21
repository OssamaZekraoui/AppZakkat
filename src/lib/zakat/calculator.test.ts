import { describe, expect, it } from "vitest";
import { calculateZakat, quickZakatCalc } from "./calculator";
import { DEFAULT_ASSETS, type ZakatInput, type ZakatSchool } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function afterDays(start: string, days: number): string {
  return new Date(new Date(start).getTime() + days * DAY_MS).toISOString();
}

function input(overrides: Partial<ZakatInput> = {}): ZakatInput {
  return {
    assets: { ...DEFAULT_ASSETS, cash: 8_500, ...overrides.assets },
    currency: "EUR",
    nisabType: "gold",
    school: "maliki",
    hawlStart: "2025-01-01",
    metalPrices: {
      goldPerGram: 100,
      silverPerGram: 1,
      currency: "EUR",
      updatedAt: "2025-12-21T00:00:00.000Z",
      source: "live",
    },
    exchangeRates: { EUR: 1, MAD: 10, USD: 2, GBP: 0.8 },
    ...overrides,
  };
}

const completedHawl = { asOf: afterDays("2025-01-01", 354) };

describe("calculateZakat", () => {
  it("charges 2.5% on the full net amount at the exact gold nisab", () => {
    const result = calculateZakat(input(), completedHawl);

    expect(result.nisabThreshold).toBe(8_500);
    expect(result.nisabMet).toBe(true);
    expect(result.zakatDue).toBe(true);
    expect(result.zakatAmount).toBe(212.5);
  });

  it("does not charge below the selected nisab", () => {
    const result = calculateZakat(
      input({ assets: { ...DEFAULT_ASSETS, cash: 8_499.99 } }),
      completedHawl
    );

    expect(result.nisabMet).toBe(false);
    expect(result.zakatAmount).toBe(0);
  });

  it("uses the explicit silver nisab independently of the school", () => {
    const result = calculateZakat(
      input({
        nisabType: "silver",
        school: "maliki",
        assets: { ...DEFAULT_ASSETS, cash: 595 },
      }),
      completedHawl
    );

    expect(result.nisabThreshold).toBe(595);
    expect(result.zakatAmount).toBe(14.88);
  });

  it.each([
    ["hanafi", 250],
    ["maliki", 0],
    ["shafiite", 0],
    ["hanbalite", 0],
  ] satisfies Array<[ZakatSchool, number]>) (
    "applies the personal-use jewelry rule for the %s school",
    (school, expected) => {
      const result = calculateZakat(
        input({
          school,
          assets: { ...DEFAULT_ASSETS, goldJewelryGrams: 100 },
        }),
        completedHawl
      );
      expect(result.zakatAmount).toBe(expected);
    }
  );

  it("deducts only the entered current liabilities before testing nisab", () => {
    const result = calculateZakat(
      input({
        assets: {
          ...DEFAULT_ASSETS,
          cash: 10_000,
          shortTermDebts: 1_000,
          essentialExpenses: 500,
        },
      }),
      completedHawl
    );

    expect(result.totalDeductions).toBe(1_500);
    expect(result.netZakatableAssets).toBe(8_500);
    expect(result.zakatAmount).toBe(212.5);
  });

  it("never returns a negative net amount or Zakat", () => {
    const result = calculateZakat(
      input({
        assets: { ...DEFAULT_ASSETS, cash: 100, shortTermDebts: 1_000 },
      }),
      completedHawl
    );

    expect(result.netZakatableAssets).toBe(0);
    expect(result.zakatAmount).toBe(0);
  });

  it("does not mix agricultural Zakat into the wealth calculation", () => {
    const result = calculateZakat(
      input({
        assets: { ...DEFAULT_ASSETS, agriculturalOutput: 100_000 },
      }),
      completedHawl
    );

    expect(result.netZakatableAssets).toBe(0);
    expect(result.zakatAmount).toBe(0);
    expect(result.warnings).toContain("agriculture_not_included");
  });

  it("waits until all 354 days of the configured Hawl have elapsed", () => {
    const before = calculateZakat(input(), {
      asOf: afterDays("2025-01-01", 353),
    });
    const due = calculateZakat(input(), completedHawl);

    expect(before.hawlCompleted).toBe(false);
    expect(before.daysUntilHawl).toBe(1);
    expect(before.zakatAmount).toBe(0);
    expect(due.hawlCompleted).toBe(true);
    expect(due.daysUntilHawl).toBeUndefined();
  });

  it("rejects a future Hawl start date", () => {
    expect(() =>
      calculateZakat(input({ hawlStart: "2026-01-01" }), {
        asOf: "2025-12-31T12:00:00.000Z",
      })
    ).toThrow(/future/i);
  });

  it("rejects negative, infinite, and invalid monetary inputs", () => {
    expect(() =>
      calculateZakat(input({ assets: { ...DEFAULT_ASSETS, cash: -1 } }), completedHawl)
    ).toThrow();
    expect(() =>
      calculateZakat(input({ assets: { ...DEFAULT_ASSETS, cash: Infinity } }), completedHawl)
    ).toThrow();
    expect(() =>
      calculateZakat(
        input({ exchangeRates: { EUR: 1, MAD: 0, USD: 2, GBP: 0.8 } }),
        completedHawl
      )
    ).toThrow();
  });

  it("converts prices from their declared source currency", () => {
    const result = calculateZakat(
      input({
        assets: { ...DEFAULT_ASSETS, cash: 4_250 },
        metalPrices: {
          goldPerGram: 100,
          silverPerGram: 2,
          currency: "USD",
          updatedAt: "2025-12-21T00:00:00.000Z",
          source: "live",
        },
      }),
      completedHawl
    );

    expect(result.nisabThreshold).toBe(4_250);
    expect(result.zakatAmount).toBe(106.25);
  });

  it("rounds currency half-up to two decimal places", () => {
    const result = calculateZakat(
      input({ assets: { ...DEFAULT_ASSETS, cash: 8_500.3 } }),
      completedHawl
    );

    expect(result.zakatAmount).toBe(212.51);
  });

  it("marks fallback prices and complex investments for review", () => {
    const result = calculateZakat(
      input({
        metalPrices: {
          goldPerGram: 100,
          silverPerGram: 1,
          currency: "EUR",
          updatedAt: "2025-12-21T00:00:00.000Z",
          source: "fallback",
        },
        assets: { ...DEFAULT_ASSETS, cash: 8_500, halalStocks: 1, cryptoHalal: 1 },
      }),
      completedHawl
    );

    expect(result.warnings).toEqual([
      "fallback_metal_prices",
      "investment_method_review",
      "crypto_review",
    ]);
  });
});

describe("quickZakatCalc", () => {
  it("uses the same exact rate and gold nisab boundary", () => {
    expect(quickZakatCalc(8_500, 0, 0, 100, 1)).toBe(212.5);
    expect(quickZakatCalc(8_499.99, 0, 0, 100, 1)).toBe(0);
  });

  it("rejects missing or invalid prices", () => {
    expect(() => quickZakatCalc(1, 0, 0, 0, 1)).toThrow();
    expect(() => quickZakatCalc(1, -1, 0, 100, 1)).toThrow();
  });
});
