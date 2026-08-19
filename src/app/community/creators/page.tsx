import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CreatorsPage() {
  const creators = await prisma.creatorProfile.findMany({
    where: { isApproved: true, ageVerified: true, identityVerified: true },
    orderBy: [{ isAvailable: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Pikaboo Community</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Discover creators</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Browse approved creators, review their connection pricing, and send a paid request when you are ready to connect.
        </p>
      </div>

      {creators.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="font-medium">No creators are available yet.</p>
          <p className="mt-2 text-sm text-neutral-500">Approved creator profiles will appear here when onboarding is complete.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/community/creators/${creator.id}`}
              className="group rounded-2xl border border-neutral-200 p-5 transition hover:-translate-y-0.5 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <div className="flex items-center gap-4">
                {creator.avatarUrl ? (
                  <img src={creator.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-xl font-semibold dark:bg-neutral-800">
                    {creator.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="truncate font-semibold group-hover:underline">{creator.displayName}</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    {creator.isAvailable ? "Available" : "Currently unavailable"}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {creator.bio || "Creator profile coming soon."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
                <span>Contact request</span>
                <span className="font-semibold">${(creator.contactFee / 100).toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
