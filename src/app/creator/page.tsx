import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export default async function CreatorDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator");
  if (session.user.role !== ROLES.CREATOR) redirect("/");

  const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.user.id } });
  const pendingCount = await prisma.contactRequest.count({ where: { creatorId: session.user.id, status: "PENDING" } });
  const acceptedCount = await prisma.contactRequest.count({ where: { creatorId: session.user.id, status: "ACCEPTED" } });
  const scheduledCount = await prisma.videoSession.count({ where: { creatorId: session.user.id, status: "SCHEDULED" } });
  const earnings = await prisma.creatorEarning.aggregate({
    where: { creatorId: session.user.id, status: { in: ["PENDING", "AVAILABLE"] } },
    _sum: { netAmount: true },
  });

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Creator dashboard</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Your creator profile has not been configured yet.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Creator dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {profile.displayName}</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage requests and scheduled private sessions from one place.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/creator/requests" className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium dark:border-neutral-700">Requests</Link>
          <Link href="/creator/sessions" className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium dark:border-neutral-700">Sessions</Link>
          <Link href="/creator/earnings" className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black">Earnings</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Pending requests</div><div className="mt-2 text-3xl font-semibold">{pendingCount}</div></div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Accepted requests</div><div className="mt-2 text-3xl font-semibold">{acceptedCount}</div></div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Scheduled sessions</div><div className="mt-2 text-3xl font-semibold">{scheduledCount}</div></div>
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"><div className="text-xs text-neutral-500">Tracked earnings</div><div className="mt-2 text-3xl font-semibold">${((earnings._sum.netAmount ?? 0) / 100).toFixed(2)}</div></div>
      </div>

      <section className="mt-8 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Profile status</h2>
            <p className="mt-1 text-sm text-neutral-500">Your profile must remain approved and verified to receive new requests.</p>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">{profile.isAvailable ? "Available" : "Unavailable"}</span>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div><span className="text-neutral-500">Contact fee</span><div className="mt-1 font-semibold">${(profile.contactFee / 100).toFixed(2)}</div></div>
          <div><span className="text-neutral-500">Session rate</span><div className="mt-1 font-semibold">${(profile.sessionRate / 100).toFixed(2)}</div></div>
          <div><span className="text-neutral-500">Verification</span><div className="mt-1 font-semibold">18+ / identity verified</div></div>
        </div>
      </section>
    </main>
  );
}
