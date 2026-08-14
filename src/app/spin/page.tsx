import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/rewards";
import { getActiveRewards } from "@/lib/actions/reward-actions";
import SpinWheel from "./SpinWheel";

export default async function SpinPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/spin");

  const [alreadySpun, activeRewards] = await Promise.all([
    prisma.reward.findFirst({
      where: { userId: session.user.id, createdAt: { gte: startOfToday() } },
    }),
    getActiveRewards(session.user.id),
  ]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Spin & win</h1>
        <p className="mt-1 text-sm text-neutral-500">
          One free spin a day. Prizes are applied automatically at
          checkout.
        </p>
      </div>

      <SpinWheel alreadySpun={!!alreadySpun} />

      {activeRewards.length > 0 && (
        <div className="w-full rounded-xl border border-neutral-200 p-4 text-left text-sm dark:border-neutral-800">
          <h2 className="font-semibold">Your rewards</h2>
          <ul className="mt-2 flex flex-col gap-1 text-neutral-600 dark:text-neutral-400">
            {activeRewards.map((reward) => (
              <li key={reward.id} className="flex justify-between">
                <span>
                  {reward.kind === "PERCENT_OFF"
                    ? `${reward.value}% off`
                    : "Free shipping"}{" "}
                  — <span className="font-mono">{reward.code}</span>
                </span>
                <span className="text-xs text-neutral-400">
                  expires {new Date(reward.expiresAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
