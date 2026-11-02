
"use server";

import { prisma } from "@/lib/prisma";

/**
 * PIKABOO PRELAUNCH
 *
 * Reward issuance is disabled until checkout,
 * discount redemption, and promotion rules
 * are ready for production.
 *
 * No reward codes or database records are
 * created by the spin action.
 */

export type SpinState =
  | {
      error?: string;
      prizeIndex?: number;
      label?: string;
      code?: string;
    }
  | undefined;

export async function spinWheel(): Promise<SpinState> {
  return {
    error:
      "The Pikaboo rewards wheel is coming soon. Rewards are not being issued during prelaunch.",
  };
}

/**
 * Preserve the existing rewards lookup for
 * compatibility with account-related pages.
 *
 * This function is read-only.
 */
export async function getActiveRewards(userId: string) {
  return prisma.reward.findMany({
    where: {
      userId,
      redeemed: false,
      kind: { not: "NONE" },
      expiresAt: { gt: new Date() },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
