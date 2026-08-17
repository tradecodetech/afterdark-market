import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export default async function CommunitySessionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");

  const { id } = await params;
  const item = await prisma.videoSession.findUnique({ where: { id } });
  if (!item) notFound();
  if (item.customerId !== session.user.id && item.creatorId !== session.user.id) notFound();

  const isCreator = session.user.role === ROLES.CREATOR;
  const scheduled = item.scheduledAt;
  const ready = item.status === "SCHEDULED" && !!scheduled && scheduled <= new Date();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={isCreator ? "/creator/sessions" : "/community/requests"} className="text-sm text-neutral-500 hover:underline">← Back</Link>
      <section className="mt-6 rounded-3xl border border-neutral-200 p-6 dark:border-neutral-800 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Private session</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">1:1 session</h1>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">{item.status}</span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"><div className="text-xs text-neutral-500">Rate</div><div className="mt-1 font-semibold">${(item.rate / 100).toFixed(2)}</div></div>
          <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"><div className="text-xs text-neutral-500">Scheduled</div><div className="mt-1 font-semibold">{scheduled ? scheduled.toLocaleString() : "Not scheduled"}</div></div>
          <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"><div className="text-xs text-neutral-500">Provider</div><div className="mt-1 font-semibold">{item.provider ?? "Not connected"}</div></div>
        </div>

        <div className="mt-8 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
          <h2 className="font-semibold">Video room</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            The session is structurally ready for a video provider. Live camera transport, access tokens, recording controls, moderation, and provider webhooks will be attached here before production use.
          </p>
          <button disabled={!ready} className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black">
            {item.status !== "SCHEDULED" ? "Session unavailable" : ready ? "Join video room (provider pending)" : "Room opens at scheduled time"}
          </button>
        </div>
      </section>
    </main>
  );
}
