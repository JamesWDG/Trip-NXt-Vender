/** Display ride fares in PKR. Backend stores in whole Rs (or minor units: stored/100 = display). */
export const RS_PER_USD = 280;

/** Format amount as PKR (e.g. 12500 → "125.00 PKR" if stored in minor units; 125 → "125.00 PKR" if whole). */
export function formatPkr(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (!Number.isFinite(n)) return '0.00 PKR';
  return `${n.toFixed(2)} PKR`;
}

/** amountInRs can be number or string (e.g. API sometimes returns decimal as string). Kept for backward compat. */
export function formatUsd(amountInRs: number | string): string {
  const n = typeof amountInRs === 'string' ? parseFloat(amountInRs) : Number(amountInRs);
  if (!Number.isFinite(n)) return '$0.00';
  const usd = n / RS_PER_USD;
  return `$${usd.toFixed(2)}`;
}
