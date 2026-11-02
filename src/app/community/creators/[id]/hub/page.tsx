
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCommunityAccess } from "@/lib/community-access";
import { RefreshChat } from "@/components/community/RefreshChat";
import { HubForm } from "@/components/community/HubForm";
import { Field } from "@/components/community/ui";

const panel =
  "rounded-2xl border border-white/10 bg-[#171820] p-5 shadow-sm";

const avatarFallback =
  "flex items-center justify-center bg-gradient-to-br from-[#80653e] to-[#34271b] text-2xl font-bold text-white";

export default async function CreatorHub({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [creator, session] = await Promise.all([
    prisma.creatorProfile.findUnique({
      where: { id },
    }),
    auth(),
  ]);

  if (
    !creator ||
    !creator.isApproved ||
    !creator.identityVerified ||
    !creator.ageVerified
  ) {
    notFound();
  }

  const userId = session?.user?.id;
  const owner = Boolean(userId && creator.userId === userId);

  // Prelaunch: demo membership access is disabled.
  const demo = false;

  const membership = userId
    ? await prisma.creatorMembership.findUnique({
        where: {
          creatorId_userId: {
            creatorId: id,
            userId,
          },
        },
      })
    : null;

  const access = hasCommunityAccess(
    owner,
    membership,
    demo,
  );

  const [posts, locked, messages, streams, postCount] =
    await Promise.all([
      prisma.creatorPost.findMany({
        where: {
          creatorId: id,
          status: "PUBLISHED",
          ...(access
            ? {}
            : { membersOnly: false }),
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),

      access
        ? []
        : prisma.creatorPost.findMany({
            where: {
              creatorId: id,
              status: "PUBLISHED",
              membersOnly: true,
            },
            select: {
              id: true,
              title: true,
            },
            orderBy: { createdAt: "desc" },
            take: 30,
          }),

      access
        ? prisma.communityMessage.findMany({
            where: {
              creatorId: id,
              hidden: false,
            },
            orderBy: { createdAt: "desc" },
            take: 50,
          })
        : [],

      prisma.communityStream.findMany({
        where: {
          creatorId: id,
          status: "SCHEDULED",
          scheduledAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          scheduledAt: "asc",
        },
        take: 10,
      }),

      prisma.creatorPost.count({
        where: {
          creatorId: id,
          status: "PUBLISHED",
        },
      }),
    ]);

  function report(
    targetId: string,
    targetType: string,
  ) {
    if (!userId) return null;

    return (
      <details className="mt-4 text-sm text-neutral-400">
        <summary className="cursor-pointer">
          Report content
        </summary>

        <div className="mt-3">
          <HubForm
            op="report"
            creatorId={id}
            label="Submit report"
          >
            <input
              type="hidden"
              name="targetId"
              value={targetId}
            />

            <input
              type="hidden"
              name="targetType"
              value={targetType}
            />

            <Field
              name="reason"
              label="What's wrong?"
              maxLength={500}
            />
          </HubForm>
        </div>
      </details>
    );
  }

  const initials = creator.displayName
    .slice(0, 1)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#0d0e13] text-white">
      {/* Creator banner */}
      <div className="relative h-52 overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#29231c] via-[#665133] to-[#b79a68] sm:h-72">
        {creator.bannerUrl && (
          <img
            src={creator.bannerUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        <div className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[.25em] text-white/80 sm:left-8">
          Pikaboo Creator Community
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-16">
        {/* Creator profile */}
        <section className="relative border-b border-white/10 pb-6">
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="h-32 w-32 rounded-full border-4 border-[#0d0e13] object-cover shadow-xl"
              />
            ) : (
              <div
                className={`h-32 w-32 rounded-full border-4 border-[#0d0e13] shadow-xl ${avatarFallback}`}
              >
                {initials}
              </div>
            )}

            <div className="flex-1 pb-1">
              <h1 className="text-3xl font-bold">
                {creator.displayName}
              </h1>

              <p className="mt-1 text-sm text-[#c7ab78]">
                Pikaboo creator profile
              </p>

              <p className="mt-4 max-w-2xl text-neutral-200">
                {creator.bio ||
                  "Welcome to my Pikaboo community."}
              </p>

              <div className="mt-5 flex gap-8 text-sm">
                <div>
                  <strong className="block text-xl">
                    {postCount}
                  </strong>
                  <span className="text-neutral-400">
                    Published posts
                  </span>
                </div>

                <div>
                  <strong className="block text-xl">
                    {streams.length}
                  </strong>
                  <span className="text-neutral-400">
                    Upcoming sessions
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-7 flex flex-wrap gap-7 text-sm font-semibold">
            <a
              href="#posts"
              className="border-b-2 border-[#c7ab78] pb-3"
            >
              Posts
            </a>

            <a
              href="#live"
              className="pb-3 text-neutral-400 hover:text-white"
            >
              Upcoming sessions
            </a>

            <a
              href="#chat"
              className="pb-3 text-neutral-400 hover:text-white"
            >
              Community chat
            </a>

            {owner && (
              <Link
                href="/creator/studio"
                className="pb-3 text-[#c7ab78]"
              >
                Creator studio
              </Link>
            )}
          </nav>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-5">
            {/* Published posts */}
            <section
              id="posts"
              className="space-y-5"
            >
              {posts.length + locked.length === 0 && (
                <div className={panel}>
                  <h2 className="text-xl font-semibold">
                    Latest posts
                  </h2>

                  <p className="mt-3 text-neutral-400">
                    No published posts yet. Check back
                    for updates.
                  </p>
                </div>
              )}

              {posts.map((post) => (
                <article
                  key={post.id}
                  className={panel}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-full ${avatarFallback}`}
                    >
                      {initials}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {creator.displayName}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {post.membersOnly
                          ? "Members-only post"
                          : "Public post"}
                        {" · "}
                        {post.createdAt.toLocaleDateString(
                          "en-US",
                        )}
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    {post.title}
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-neutral-200">
                    {post.body}
                  </p>

                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt=""
                      className="mt-5 max-h-[560px] w-full rounded-xl object-cover"
                    />
                  )}

                  {report(post.id, "POST")}
                </article>
              ))}

              {/* Locked posts */}
              {locked.map((post) => (
                <article
                  key={post.id}
                  className={panel}
                >
                  <h2 className="text-xl font-semibold">
                    {post.title}
                  </h2>

                  <div className="mt-5 rounded-xl bg-white/5 p-8 text-center">
                    <p className="text-lg font-semibold">
                      Members-only content
                    </p>

                    <p className="mt-3 text-sm text-neutral-400">
                      This content is not available
                      during the Pikaboo prelaunch.
                    </p>
                  </div>
                </article>
              ))}
            </section>

            {/* Community chat */}
            <section
              id="chat"
              className={panel}
            >
              <h2 className="text-xl font-semibold">
                Community chat
              </h2>

              {access ? (
                <>
                  <p className="my-3 text-sm text-neutral-400">
                    Latest 50 messages. Refresh to
                    check for replies.
                  </p>

                  <RefreshChat />

                  <div className="my-5 space-y-3">
                    {messages.length === 0 && (
                      <p className="text-neutral-400">
                        Start the conversation.
                      </p>
                    )}

                    {messages
                      .slice()
                      .reverse()
                      .map((message) => (
                        <article
                          key={message.id}
                          className="rounded-xl bg-white/5 p-4"
                        >
                          <strong className="text-sm">
                            {message.authorName}
                          </strong>

                          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-200">
                            {message.body}
                          </p>

                          {report(
                            message.id,
                            "MESSAGE",
                          )}
                        </article>
                      ))}
                  </div>

                  <HubForm
                    op="message"
                    creatorId={id}
                    label="Send message"
                  >
                    <Field
                      name="body"
                      label="Your message"
                      maxLength={1000}
                      multiline
                    />
                  </HubForm>
                </>
              ) : (
                <p className="mt-3 text-neutral-400">
                  Member chat will become available
                  after community memberships launch.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <section
              id="membership"
              className={panel}
            >
              <h2 className="text-lg font-semibold">
                Creator memberships
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Exclusive content and community
                memberships are being prepared
                for launch.
              </p>

              <p className="mt-4 rounded-xl border border-[#c7ab78]/30 bg-[#c7ab78]/10 p-3 text-sm text-[#e0c99e]">
                Coming soon. No subscriptions,
                charges, or automatic renewals
                are available.
              </p>
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">
                About {creator.displayName}
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {creator.bio ||
                  "Welcome to my Pikaboo community."}
              </p>
            </section>

            {/* Upcoming sessions */}
            <section
              id="live"
              className={panel}
            >
              <h2 className="text-lg font-semibold">
                Upcoming sessions
              </h2>

              {streams.length === 0 && (
                <p className="mt-3 text-neutral-400">
                  No sessions scheduled.
                </p>
              )}

              {streams.map((stream) => (
                <div
                  key={stream.id}
                  className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <h3 className="font-semibold">
                    {stream.title}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-300">
                    {stream.scheduledAt.toLocaleString(
                      "en-US",
                      { timeZone: "UTC" },
                    )}
                    {" UTC"}
                  </p>

                  <button
                    disabled
                    className="mt-4 w-full rounded-lg bg-white/10 px-3 py-2 text-sm opacity-60"
                  >
                    Broadcasting coming soon
                  </button>
                </div>
              ))}
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">
                Community features
              </h2>

              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                <p>Exclusive creator posts</p>
                <p>Member community chat</p>
                <p>Scheduled creator sessions</p>
                <p>Creator support and tipping</p>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                These features are in development
                and are not available for purchase.
              </p>
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">
                Support this creator
              </h2>

              <p className="mt-3 text-sm text-neutral-400">
                Creator tipping is temporarily
                unavailable while Pikaboo prepares
                its payment infrastructure.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
