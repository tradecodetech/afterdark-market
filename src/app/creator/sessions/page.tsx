import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";
import { ScheduleSessionForm } from "./ScheduleSessionForm";

export default async function CreatorSessionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/sessions");
  if (session.user.role !== ROLES.CREATOR) redirect("/");

  const sessions = await prisma.videoSession.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Creator dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Private sessions</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Schedule accepted requests and use the session page as the future launch point for live video.</p>
        </div>
        <Link href="/creator" className="text-sm text-neutral-500 hover:underline">Back to dashboard</Link>
      </div>

      <div className="mt-8 space-y-4">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">No accepted sessions yet.</div>
        ) : sessions.map((item) => (
          <article key={item.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Private session</p>
                <p className="mt-1 text-xs text-neutral-500">Created {item.createdAt.toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">{item.status}</span>
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div><span className="text-neutral-500">Rate</span><div className="mt-1 font-semibold">${(item.rate / 100).toFixed(2)}</div></div>
              <div><span className="text-neutral-500">Creator amount</span><div className="mt-1 font-semibold">${(item.creatorAmount / 100).toFixed(2)}</div></div>
              <div><span className="text-neutral-500">Scheduled</span><div className="mt-1 font-medium">{item.scheduledAt ? item.scheduledAt.toLocaleString() : "Not scheduled"}</div></div>
            </div>
            {item.status === "SCHEDULED" && (
              <ScheduleSessionForm sessionId={item.id} current={item.scheduledAt} />
            )}
            <div className="mt-4">
              <Link href={`/community/sessions/${item.id}`} className="text-sm font-medium hover:underline">Open session page →</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
