import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContactRequestForm } from "./ContactRequestForm";

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await prisma.creatorProfile.findUnique({ where: { id } });

  if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/community/creators" className="text-sm text-neutral-500 hover:underline">← Back to creators</Link>
      <section className="mt-6 rounded-3xl border border-neutral-200 p-6 dark:border-neutral-800 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} alt="" className="h-28 w-28 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-4xl font-semibold dark:bg-neutral-800">
              {creator.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">{creator.displayName}</h1>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs dark:bg-neutral-800">18+ verified</span>
            </div>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">{creator.bio || "Creator profile coming soon."}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-neutral-200 px-3 py-1.5 dark:border-neutral-700">Contact: ${(creator.contactFee / 100).toFixed(2)}</span>
              <span className="rounded-full border border-neutral-200 px-3 py-1.5 dark:border-neutral-700">Session: ${(creator.sessionRate / 100).toFixed(2)}</span>
              <span className="rounded-full border border-neutral-200 px-3 py-1.5 dark:border-neutral-700">{creator.isAvailable ? "Available" : "Unavailable"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">Request contact</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            The request fee is charged before the creator decides whether to accept. An accepted request can later be used to schedule an eligible private session.
          </p>
          <ContactRequestForm creatorProfileId={creator.id} fee={creator.contactFee} />
        </div>
      </section>
    </main>
  );
}
