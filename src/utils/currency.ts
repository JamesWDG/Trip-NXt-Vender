/** Display ride fares in USD. Backend stores amounts in PKR (Rs). */
export const RS_PER_USD = 280;

/** amountInRs can be number or string (e.g. API sometimes returns decimal as string). */
export function formatUsd(amountInRs: number | string): string {
  const n = typeof amountInRs === 'string' ? parseFloat(amountInRs) : Number(amountInRs);
  if (!Number.isFinite(n)) return '$0.00';
  const usd = n / RS_PER_USD;
  return `$${usd.toFixed(2)}`;
}
