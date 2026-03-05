// Zakat calculation utilities

export const ZAKAT_RATE = 0.025; // 2.5%

/**
 * Calculate the total zakat amount based on assets
 * Zakat is due on assets that exceed the nisab threshold
 */
export function calculateZakat(
  totalAssets: number,
  nisabValue: number
): number {
  if (totalAssets < nisabValue) return 0;
  return totalAssets * ZAKAT_RATE;
}

/**
 * Calculate total assets
 */
export function calculateTotalAssets(assets: {
  goldValue: number;
  silverValue: number;
  cashValue: number;
  stocksValue: number;
}): number {
  return (
    assets.goldValue +
    assets.silverValue +
    assets.cashValue +
    assets.stocksValue
  );
}

/**
 * Check if assets meet the nisab threshold
 */
export function meetsNisab(totalAssets: number, nisabValue: number): boolean {
  return totalAssets >= nisabValue;
}
