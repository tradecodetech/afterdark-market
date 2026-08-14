import { randomBytes } from "crypto";

export type PrizeKind = "PERCENT_OFF" | "FREE_SHIPPING" | "NONE";

export type Prize = {
  kind: PrizeKind;
  value: number; // percent for PERCENT_OFF, ignored otherwise
  weight: number; // relative odds
  label: string;
};

// One slice of the wheel per entry, in display order. Odds are driven by
// `weight`, independent of the (equal) visual slice size — same trick most
// spin-to-win widgets use.
export const PRIZES: Prize[] = [
  { kind: "PERCENT_OFF", value: 20, weight: 4, label: "20% off" },
  { kind: "FREE_SHIPPING", value: 0, weight: 15, label: "Free shipping" },
  { kind: "PERCENT_OFF", value: 10, weight: 16, label: "10% off" },
  { kind: "NONE", value: 0, weight: 35, label: "Try again tomorrow" },
  { kind: "PERCENT_OFF", value: 5, weight: 25, label: "5% off" },
  { kind: "FREE_SHIPPING", value: 0, weight: 5, label: "Free shipping" },
];

export function pickPrizeIndex(): number {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < PRIZES.length; i++) {
    roll -= PRIZES[i].weight;
    if (roll <= 0) return i;
  }
  return PRIZES.length - 1;
}

export function generateRewardCode(): string {
  return `SPIN-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
