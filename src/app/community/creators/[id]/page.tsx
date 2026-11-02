
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const creator = await prisma.creatorProfile.findUnique({
    where: { id },
  });

  if (
    !creator ||
    !creator.isApproved ||
    !creator.ageVerified ||
    !creator.identityVerified
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#090909] text-[#f6f0e6]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/community/creators"
          className="text-sm text-[#c9b58c] transition hover:text-white"
        >
          ← Back to creators
        </Link>

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#8e754b]/30 bg-[#11100e]">
          <div className="relative h-36 bg-gradient-to-r from-[#302417] via-[#17130e] to-[#090909] sm:h-52">
            {creator.bannerUrl && (
              <img
                src={creator.bannerUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="px-6 pb-9 sm:px-10">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={`${creator.displayName} profile`}
                  className="relative h-28 w-28 shrink-0 rounded-2xl border-4 border-[#11100e] object-cover shadow-xl sm:h-32 sm:w-32"
                />
              ) : (
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-[#11100e] bg-[#302417] text-4xl font-semibold text-[#e5c88d] sm:h-32 sm:w-32">
                  {creator.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="relative pb-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c7a76e]">
                  Featured creator
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {creator.displayName}
                </h1>
              </div>
            </div>

            <div className="mt-8 max-w-3xl">
              <h2 className="text-lg font-semibold text-[#ead4ad]">
                About this creator
              </h2>

              <p className="mt-3 whitespace-pre-line leading-8 text-[#c7c1b6]">
                {creator.bio || "More from this creator is coming soon."}
              </p>
            </div>

            <div className="mt-9 border-t border-[#8e754b]/25 pt-8">
              <h2 className="text-xl font-semibold">
                Explore the community
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[#bcb5a9]">
                Discover creator posts and get a preview of the
                Pikaboo community experience. Paid memberships,
                private contact requests, gifts, and sessions
                are not available during prelaunch.
              </p>

              <Link
                href={`/community/creators/${creator.id}/hub`}
                className="mt-6 inline-flex rounded-xl border border-[#c7a76e] bg-[#b9965e] px-6 py-3 font-semibold text-[#100d09] transition hover:bg-[#d6b77f]"
              >
                Explore creator posts →
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-6 text-[#938b7e]">
          Pikaboo is currently in preview mode. Creator
          participation and transactional features are subject
          to launch readiness and applicable verification requirements.
        </p>
      </div>
    </main>
  );
}
