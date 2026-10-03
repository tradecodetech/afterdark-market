import Link from "next/link";
import { notFound } from "next/navigation";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCommunityAccess } from "@/lib/community-access";
import { RefreshChat } from "@/components/community/RefreshChat";
import { HubForm } from "@/components/community/HubForm";
import { Field } from "@/components/community/ui";

const panel = "rounded-2xl border border-white/10 bg-[#171820] p-5 shadow-sm";
const avatarFallback = "flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-violet-700 text-2xl font-bold text-white";

export default async function CreatorHub({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [creator, session] = await Promise.all([
    prisma.creatorProfile.findUnique({ where: { id } }),
    auth(),
  ]);
  if (!creator || !creator.isApproved || !creator.identityVerified || !creator.ageVerified) notFound();

  const userId = session?.user?.id;
  const demo = process.env.COMMUNITY_DEMO_PAYMENTS === "true";
  const membership = userId
    ? await prisma.creatorMembership.findUnique({ where: { creatorId_userId: { creatorId: id, userId } } })
    : null;
  const access = hasCommunityAccess(creator.userId === userId, membership, demo);

  const [posts, locked, messages, streams, memberCount, postCount] = await Promise.all([
    prisma.creatorPost.findMany({
      where: { creatorId: id, status: "PUBLISHED", ...(access ? {} : { membersOnly: false }) },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    access ? [] : prisma.creatorPost.findMany({
      where: { creatorId: id, status: "PUBLISHED", membersOnly: true },
      select: { id: true, title: true },
      take: 30,
      orderBy: { createdAt: "desc" },
    }),
    access ? prisma.communityMessage.findMany({
      where: { creatorId: id, hidden: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    }) : [],
    prisma.communityStream.findMany({
      where: { creatorId: id, status: "SCHEDULED", scheduledAt: { gt: new Date() } },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    }),
    prisma.creatorMembership.count({ where: { creatorId: id, cancelled: false, expiresAt: { gt: new Date() } } }),
    prisma.creatorPost.count({ where: { creatorId: id, status: "PUBLISHED" } }),
  ]);

  function report(targetId: string, targetType: string) {
    return userId ? (
      <details className="mt-4 text-sm text-neutral-400">
        <summary className="cursor-pointer">Report content</summary>
        <div className="mt-3">
          <HubForm op="report" creatorId={id} label="Submit report">
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="targetType" value={targetType} />
            <Field name="reason" label="What's wrong?" maxLength={500} />
          </HubForm>
        </div>
      </details>
    ) : null;
  }

  const initials = creator.displayName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#0d0e13] text-white">
      <div className="relative h-52 overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#35104f] via-[#7c2bbd] to-[#ec4899] sm:h-72">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.18),transparent_35%)]" />
        <div className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[.25em] text-white/70 sm:left-[max(2rem,calc((100%-1180px)/2))]">Pikaboo creator</div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-16">
        <section className="relative border-b border-white/10 pb-6">
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
            {creator.avatarUrl ? (
              <img src={creator.avatarUrl} alt={creator.displayName} className="h-32 w-32 rounded-full border-4 border-[#0d0e13] object-cover shadow-xl" />
            ) : (
              <div className={`h-32 w-32 rounded-full border-4 border-[#0d0e13] shadow-xl ${avatarFallback}`}>{initials}</div>
            )}
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{creator.displayName}</h1>
                <span title="Verified creator" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-xs">✓</span>
              </div>
              <p className="mt-1 text-sm text-neutral-400">@{creator.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "")} · <span className="text-emerald-400">Verified creator</span></p>
              <p className="mt-4 max-w-2xl text-neutral-200">{creator.bio || "Welcome to my Pikaboo."}</p>
              <div className="mt-5 flex gap-8 text-sm">
                <div><strong className="block text-xl">{memberCount}</strong><span className="text-neutral-400">Members</span></div>
                <div><strong className="block text-xl">{postCount}</strong><span className="text-neutral-400">Posts</span></div>
                <div><strong className="block text-xl">{streams.length}</strong><span className="text-neutral-400">Upcoming live</span></div>
              </div>
            </div>
          </div>
          <nav className="mt-7 flex gap-8 text-sm font-semibold">
            <a href="#posts" className="border-b-2 border-fuchsia-500 pb-3">Posts</a>
            <a href="#live" className="pb-3 text-neutral-400 hover:text-white">Live sessions</a>
            <a href="#chat" className="pb-3 text-neutral-400 hover:text-white">Member chat</a>
            {creator.userId === userId && <Link href="/creator/studio" className="pb-3 text-fuchsia-400">Creator studio</Link>}
          </nav>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-5">
            <section id="posts" className="space-y-5">
              {posts.length + locked.length === 0 && (
                <div className={panel}>
                  <h2 className="text-xl font-semibold">Latest posts</h2>
                  <p className="mt-3 text-neutral-400">No published posts yet. Check back for {creator.displayName}'s first update.</p>
                </div>
              )}

              {posts.map(post => (
                <article key={post.id} className={panel}>
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full ${avatarFallback}`}>{initials}</div>
                    <div>
                      <p className="font-semibold">{creator.displayName} <span className="text-fuchsia-400">✓</span></p>
                      <p className="text-xs text-neutral-500">{post.membersOnly ? "Members only" : "Public post"} · {post.createdAt.toLocaleDateString("en-US")}</p>
                    </div>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{post.title}</h2>
                  <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-neutral-200">{post.body}</p>
                  <div className="mt-5 flex gap-6 border-t border-white/10 pt-4 text-sm text-neutral-400">
                    <span>♡ Like</span><span>◯ Comment</span><span>↗ Share</span>
                  </div>
                  {report(post.id, "POST")}
                </article>
              ))}

              {locked.map(post => (
                <article key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#171820]">
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-full ${avatarFallback}`}>{initials}</div>
                      <div><p className="font-semibold">{creator.displayName} <span className="text-fuchsia-400">✓</span></p><p className="text-xs text-neutral-500">Members only</p></div>
                    </div>
                    <h2 className="mt-5 text-xl font-semibold">{post.title}</h2>
                  </div>
                  <div className="flex min-h-64 flex-col items-center justify-center bg-gradient-to-br from-[#40214d] via-[#241b2e] to-[#15151c] p-8 text-center">
                    <div className="mb-3 text-4xl">🔒</div>
                    <h3 className="text-xl font-semibold">Members only content</h3>
                    <p className="mt-2 max-w-sm text-sm text-neutral-300">Join {creator.displayName}'s membership to unlock this post and exclusive creator content.</p>
                    <a href="#membership" className="mt-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-5 py-3 text-sm font-semibold">View membership options</a>
                  </div>
                  <div className="flex gap-6 p-4 text-sm text-neutral-400"><span>♡ Like</span><span>◯ Comment</span><span>↗ Share</span></div>
                </article>
              ))}
            </section>

            <section id="chat" className={panel}>
              <h2 className="text-xl font-semibold">Member chat</h2>
              {access ? (
                <>
                  <p className="my-3 text-sm text-neutral-400">Latest 50 messages. Refresh to see new replies.</p>
                  <RefreshChat />
                  <div className="my-5 space-y-3">
                    {messages.length === 0 && <p className="text-neutral-400">Start the conversation.</p>}
                    {messages.toReversed().map(message => (
                      <article key={message.id} className="rounded-xl bg-white/5 p-4">
                        <strong className="text-sm">{message.authorName}</strong>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-200">{message.body}</p>
                        {report(message.id, "MESSAGE")}
                      </article>
                    ))}
                  </div>
                  <HubForm op="message" creatorId={id} label="Send message"><Field name="body" label="Your message" maxLength={1000} multiline /></HubForm>
                </>
              ) : <p className="mt-3 text-neutral-400">Join this creator's membership to read and send community messages.</p>}
            </section>
          </div>

          <aside className="space-y-5">
            <section id="membership" className={panel}>
              <p className="text-3xl font-bold">${(creator.membershipPrice / 100).toFixed(2)} <span className="text-sm font-normal text-neutral-400">/ 30 days</span></p>
              <p className="my-4 text-sm text-neutral-300">Member-only posts and community chat.</p>
              {demo && <p className="mb-4 rounded-xl bg-amber-400/10 p-3 text-xs text-amber-200">Demo only. No charges, renewals, or real subscriptions.</p>}
              {!userId ? (
                <Link href={`/auth/login?callbackUrl=/community/creators/${id}/hub`} className="block rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-center font-semibold">Sign in to join</Link>
              ) : creator.userId === userId ? <p className="text-sm text-neutral-300">You own this community.</p>
              : access ? (
                <><div className="mb-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-center font-semibold">✓ Subscribed</div><p className="mb-3 text-xs text-neutral-400">Access ends {membership!.expiresAt.toLocaleDateString("en-US", { timeZone: "UTC" })}.</p><HubForm op="cancel" creatorId={id} label="End demo membership" /></>
              ) : demo ? <HubForm op="join" creatorId={id} label="Join membership" /> : <p className="text-sm text-neutral-400">Membership checkout is not connected.</p>}
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">About {creator.displayName}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">{creator.bio || "Welcome to my Pikaboo community."}</p>
              <div className="mt-4 space-y-2 text-sm text-neutral-400"><p>✓ Age verified</p><p>✓ Identity verified</p><p>● Creator approved</p></div>
            </section>

            <section id="live" className={panel}>
              <h2 className="text-lg font-semibold">Upcoming live sessions</h2>
              {streams.length === 0 && <p className="mt-3 text-sm text-neutral-400">No sessions scheduled.</p>}
              {streams.map(stream => <div key={stream.id} className="mt-4 rounded-xl bg-gradient-to-br from-violet-900/70 to-fuchsia-900/50 p-4"><h3 className="font-semibold">{stream.title}</h3><p className="mt-2 text-xs text-neutral-300">{stream.scheduledAt.toLocaleString("en-US", { timeZone: "UTC" })} UTC</p><button disabled className="mt-4 w-full rounded-lg bg-white/10 px-3 py-2 text-sm opacity-60">Broadcasting coming soon</button></div>)}
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">Perks for members</h2>
              <div className="mt-4 space-y-3 text-sm text-neutral-300"><p>✦ Exclusive posts and media</p><p>◫ Member-only live sessions</p><p>◯ Community chat access</p><p>◷ Early access to new content</p></div>
            </section>

            <section className={panel}>
              <h2 className="text-lg font-semibold">Support this creator</h2>
              <p className="my-3 text-sm text-neutral-400">Demo tips only. No funds are transferred.</p>
              {demo && userId && creator.userId !== userId ? <HubForm op="tip" creatorId={id} label="Tip creator"><input type="hidden" name="requestId" value={randomUUID()} /><Field name="amount" label="Amount in USD ($1–$500)" value="5" /></HubForm> : <p className="text-sm text-neutral-400">{!userId ? "Sign in to try demo tipping." : "Tipping unavailable."}</p>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
