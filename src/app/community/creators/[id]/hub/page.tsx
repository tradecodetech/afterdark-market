import Link from "next/link";
import { notFound } from "next/navigation";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCommunityAccess } from "@/lib/community-access";
import { RefreshChat } from "@/components/community/RefreshChat";
import { HubForm } from "@/components/community/HubForm";
import { Field, card } from "@/components/community/ui";

export default async function CreatorHub({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [creator, session] = await Promise.all([prisma.creatorProfile.findUnique({ where: { id } }), auth()]);
  if (!creator || !creator.isApproved || !creator.identityVerified || !creator.ageVerified) notFound();
  const userId = session?.user?.id;
  const demo = process.env.COMMUNITY_DEMO_PAYMENTS === "true";
  const membership = userId ? await prisma.creatorMembership.findUnique({ where: { creatorId_userId: { creatorId: id, userId } } }) : null;
  const access = hasCommunityAccess(creator.userId === userId, membership, demo);
  // Locked bodies never enter the rendered page or its client component props.
  const [posts, locked, messages, streams] = await Promise.all([
    prisma.creatorPost.findMany({ where: { creatorId: id, status: "PUBLISHED", ...(access ? {} : { membersOnly: false }) }, orderBy: { createdAt: "desc" }, take: 30 }),
    access ? [] : prisma.creatorPost.findMany({ where: { creatorId: id, status: "PUBLISHED", membersOnly: true }, select: { id: true, title: true }, take: 30, orderBy: { createdAt: "desc" } }),
    access ? prisma.communityMessage.findMany({ where: { creatorId: id, hidden: false }, orderBy: { createdAt: "desc" }, take: 50 }) : [],
    prisma.communityStream.findMany({ where: { creatorId: id, status: "SCHEDULED", scheduledAt: { gt: new Date() } }, orderBy: { scheduledAt: "asc" }, take: 10 }),
  ]);
  function report(targetId: string, targetType: string) {
    return userId ? <details className="mt-4 text-sm"><summary className="cursor-pointer text-neutral-500">Report content</summary><div className="mt-3"><HubForm op="report" creatorId={id} label="Submit report"><input type="hidden" name="targetId" value={targetId} /><input type="hidden" name="targetType" value={targetType} /><Field name="reason" label="What’s wrong?" maxLength={500} /></HubForm></div></details> : null;
  }
  return <main className="mx-auto max-w-6xl px-4 py-10">
    <Link href="/community/creators" className="text-sm text-brand-600">← Discover creators</Link>
    <header className="mt-6 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 p-8 text-white sm:p-12">
      <p className="text-xs uppercase tracking-widest text-violet-200">Creator community</p>
      <h1 className="mt-3 text-4xl font-semibold">{creator.displayName}</h1><p className="mt-4 max-w-2xl leading-7">{creator.bio || "Welcome to my community."}</p>
      <div className="mt-6 flex flex-wrap gap-5 text-sm"><a href="#posts">Posts</a><a href="#live">Upcoming live sessions</a><a href="#chat">Member chat</a>{creator.userId === userId && <Link href="/creator/studio">Open creator studio →</Link>}</div>
    </header>
    <p className="my-5 text-sm text-neutral-500">A space for non-explicit creative work, learning, and conversation. Report content that breaks these rules.</p>
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6"><section id="posts" className="space-y-4"><h2 className="text-2xl font-semibold">Latest posts</h2>
        {posts.length + locked.length === 0 && <p className={card}>No published posts yet. Check back for the creator’s first update.</p>}
        {posts.map(post => <article key={post.id} className={card}><p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{post.membersOnly ? "Members only" : "Public post"}</p><h3 className="mt-2 text-xl font-semibold">{post.title}</h3><p className="mt-4 whitespace-pre-wrap break-words leading-7">{post.body}</p>{report(post.id, "POST")}</article>)}
        {locked.map(post => <article key={post.id} className={card}><p className="text-xs font-semibold text-brand-600">MEMBERS ONLY</p><h3 className="mt-2 text-xl font-semibold">{post.title}</h3><p className="mt-3 text-sm text-neutral-500">Join this community to read this post.</p>{report(post.id, "POST")}</article>)}
      </section>
      <section id="live" className={card}><h2 className="text-xl font-semibold">Upcoming live sessions</h2><p className="mt-2 text-sm text-neutral-500">Schedule preview only. Live broadcasting is not connected.</p>{streams.length === 0 && <p className="mt-5">No sessions scheduled.</p>}{streams.map(stream => <div key={stream.id} className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-800"><h3 className="font-semibold">{stream.title}</h3><p className="mt-1 text-sm">{stream.scheduledAt.toLocaleString("en-US", { timeZone: "UTC" })} UTC</p><button disabled className="mt-3 rounded-lg border px-3 py-2 text-sm opacity-50">Broadcasting unavailable</button></div>)}</section>
      <section id="chat" className={card}><h2 className="text-xl font-semibold">Member chat</h2>{access ? <><p className="my-3 text-sm text-neutral-500">Latest 50 messages. Refresh to see new replies.</p><RefreshChat /><div className="my-5 space-y-4">{messages.length === 0 && <p>Start the conversation.</p>}{messages.toReversed().map(message => <article key={message.id} className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900"><strong className="text-sm">{message.authorName}</strong><p className="mt-1 whitespace-pre-wrap break-words text-sm">{message.body}</p>{report(message.id, "MESSAGE")}</article>)}</div><HubForm op="message" creatorId={id} label="Send message"><Field name="body" label="Your message" maxLength={1000} multiline /></HubForm></> : <p className="mt-3 text-neutral-500">Join this creator’s membership to read and send community messages.</p>}</section></div>
      <aside className="space-y-6"><section className={card}><h2 className="text-xl font-semibold">Become a member</h2><p className="mt-3 text-3xl font-semibold">${(creator.membershipPrice / 100).toFixed(2)}<span className="text-sm font-normal text-neutral-500"> / 30 days</span></p><p className="my-4 text-sm leading-6">Member-only posts and community chat.</p>{demo && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Demo only. No charges, automatic renewals, or real subscriptions.</p>}{!userId ? <Link href={`/auth/login?callbackUrl=/community/creators/${id}/hub`} className="text-brand-600">Sign in to join →</Link> : creator.userId === userId ? <p>You own this community.</p> : access ? <><p className="mb-3 text-sm">Access ends {membership!.expiresAt.toLocaleDateString("en-US", { timeZone: "UTC" })}.</p><HubForm op="cancel" creatorId={id} label="End demo membership now" /></> : demo ? <HubForm op="join" creatorId={id} label="Try demo membership" /> : <p>Membership checkout is not connected.</p>}</section>
      <section className={card}><h2 className="text-xl font-semibold">Support this creator</h2><p className="my-3 text-sm text-neutral-500">Demo tips only. No funds are transferred.</p>{demo && userId && creator.userId !== userId ? <HubForm op="tip" creatorId={id} label="Send demo tip"><input type="hidden" name="requestId" value={randomUUID()} /><Field name="amount" label="Amount in USD ($1–$500)" value="5" /></HubForm> : <p className="text-sm">{!userId ? "Sign in to try demo tipping." : "Tipping unavailable."}</p>}</section></aside>
    </div>
  </main>;
}
