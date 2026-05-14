export const UNIT_PRICE = 0.75;
export const PROMO_7 = 4.75;
export const PROMO_14 = 9.5;

export type CartMap = Record<string, number>;

export function totalUnits(cart: CartMap): number {
  return Object.values(cart).reduce((s, n) => s + n, 0);
}

export const MAX_UNITS = 30;
/**
 * Best combination using packs of 14 ($9.50), 7 ($4.75), and singles ($0.75).
 */
export function calculatePrice(units: number): {
  total: number;
  packs14: number;
  packs7: number;
  singles: number;
  savings: number;
} {
  
  const safeUnits = Math.max(0, Math.min(units, MAX_UNITS));
  if (safeUnits <= 0)
    return { total: 0, packs14: 0, packs7: 0, singles: 0, savings: 0 };

  const packs14 = Math.floor(units / 14);
  let rem = units - packs14 * 14;
  const packs7 = Math.floor(rem / 7);
  rem = rem - packs7 * 7;

  // Compare singles vs upgrading to a full 7-pack if singles >= ~7 units price-wise
  // If singles cost more than $4.75, it's better to add another 7-pack
  let singles = rem;
  let extraPack7 = 0;
  if (singles * UNIT_PRICE > PROMO_7) {
    extraPack7 = 1;
    singles = 0;
  }

  const total =
    packs14 * PROMO_14 + (packs7 + extraPack7) * PROMO_7 + singles * UNIT_PRICE;
  const savings = Math.max(0, units * UNIT_PRICE - total);

  return {
    total: Math.round(total * 100) / 100,
    packs14,
    packs7: packs7 + extraPack7,
    singles,
    savings: Math.round(savings * 100) / 100,
  };
}

export function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}