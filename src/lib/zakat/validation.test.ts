import { describe, expect, it } from "vitest";
import { DEFAULT_ASSETS } from "./types";
import { parseZakatInput } from "./validation";

const validInput = {
  assets: DEFAULT_ASSETS,
  currency: "MAD",
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
  exchangeRates: { MAD: 10, EUR: 1, USD: 2, GBP: 0.8 },
};

describe("parseZakatInput", () => {
  it("accepts a complete strict input", () => {
    expect(parseZakatInput(validInput)).toEqual(validInput);
  });

  it("rejects impossible calendar dates", () => {
    expect(() =>
      parseZakatInput({ ...validInput, hawlStart: "2025-02-31" })
    ).toThrow(/hawlStart/);
  });

  it("rejects unknown fields instead of silently ignoring them", () => {
    expect(() => parseZakatInput({ ...validInput, unexpected: true })).toThrow();
  });
});
