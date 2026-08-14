"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PRIZES, pickPrizeIndex, generateRewardCode, startOfToday } from "@/lib/rewards";

export type SpinState =
  | { error?: string; prizeIndex?: number; label?: string; code?: string }
  | undefined;

const REWARD_TTL_DAYS = 7;

export async function spinWheel(): Promise<SpinState> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/spin");

  const alreadySpun = await prisma.reward.findFirst({
    where: { userId: session.user.id, createdAt: { gte: startOfToday() } },
  });
  if (alreadySpun) {
    return { error: "You've already spun today — come back tomorrow." };
  }

  const prizeIndex = pickPrizeIndex();
  const prize = PRIZES[prizeIndex];
  const code = generateRewardCode();

  await prisma.reward.create({
    data: {
      userId: session.user.id,
      kind: prize.kind,
      value: prize.value,
      code,
      expiresAt: new Date(Date.now() + REWARD_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { prizeIndex, label: prize.label, code };
}

export async function getActiveRewards(userId: string) {
  return prisma.reward.findMany({
    where: {
      userId,
      redeemed: false,
      kind: { not: "NONE" },
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
}
