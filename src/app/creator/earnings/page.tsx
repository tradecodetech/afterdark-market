import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export default async function CreatorEarningsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/earnings");
  if (session.user.role !== ROLES.CREATOR) redirect("/");

  const earnings = await prisma.creatorEarning.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const totals = await prisma.creatorEarning.aggregate({
    where: { creatorId: session.user.id },
    _sum: { grossAmount: true, platformFee: true, netAmount: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Creator dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Earnings</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Every community earning is recorded separately from marketplace orders.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Gross</div><div className="mt-2 text-2xl font-semibold">${((totals._sum.grossAmount ?? 0) / 100).toFixed(2)}</div></div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Platform fees</div><div className="mt-2 text-2xl font-semibold">${((totals._sum.platformFee ?? 0) / 100).toFixed(2)}</div></div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Creator net</div><div className="mt-2 text-2xl font-semibold">${((totals._sum.netAmount ?? 0) / 100).toFixed(2)}</div></div>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="border-b border-neutral-200 px-5 py-4 font-semibold dark:border-neutral-800">Recent earnings</div>
        {earnings.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">No earnings recorded yet.</div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {earnings.map((earning) => (
              <div key={earning.id} className="grid gap-2 px-5 py-4 sm:grid-cols-4 sm:items-center">
                <div><div className="text-sm font-medium">${(earning.grossAmount / 100).toFixed(2)} gross</div><div className="text-xs text-neutral-500">{earning.createdAt.toLocaleString()}</div></div>
                <div className="text-sm text-neutral-500">Fee ${(earning.platformFee / 100).toFixed(2)}</div>
                <div className="text-sm font-semibold">Net ${(earning.netAmount / 100).toFixed(2)}</div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">{earning.status}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        Payout processing is intentionally not connected yet. The ledger is ready for a future compliant payout provider and can distinguish available, paid, and reversed earnings.
      </div>
    </main>
  );
}
