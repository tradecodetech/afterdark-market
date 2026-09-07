import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HubForm } from "@/components/community/HubForm";
import { Field, card } from "@/components/community/ui";

export default async function Studio() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/studio");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "CREATOR") redirect("/");
  const creator = await prisma.creatorProfile.findUnique({ where: { userId: user.id }, include: { posts: { take: 30, orderBy: { createdAt: "desc" } }, streams: { take: 20, orderBy: { scheduledAt: "desc" } } } });
  if (!creator || !creator.isApproved || !creator.identityVerified || !creator.ageVerified) return <main className="mx-auto max-w-4xl p-8"><h1 className="text-3xl font-semibold">Creator studio</h1><p className="mt-4">An approved and verified creator profile is required. Contact your administrator to finish setup.</p></main>;
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-10"><header><Link href="/creator" className="text-brand-600">← Creator dashboard</Link><h1 className="mt-4 text-3xl font-semibold">Your creator studio</h1><p className="mt-3 text-neutral-500">Share your work, grow your membership, and plan your next session.</p><Link href={`/community/creators/${creator.id}/hub`} className="mt-3 inline-block text-brand-600">View your community →</Link></header>
    <div className="grid gap-6 md:grid-cols-2"><section className={card}><h2 className="mb-5 text-xl font-semibold">Edit profile</h2><HubForm op="profile" creatorId={creator.id} label="Save profile"><Field name="displayName" label="Display name" value={creator.displayName} maxLength={60} /><Field name="bio" label="About your community" value={creator.bio || ""} maxLength={1200} multiline /><Field name="price" label="Membership price in USD / 30 days" value={(creator.membershipPrice / 100).toFixed(2)} /></HubForm></section>
    <section className={card}><h2 className="mb-5 text-xl font-semibold">Write a post</h2><HubForm op="post" creatorId={creator.id} label="Submit for review"><Field name="title" label="Title" /><Field name="body" label="Post" maxLength={10000} multiline /><label className="block text-sm"><input type="checkbox" name="membersOnly" className="mr-2" />Members only</label><label className="block text-sm"><input type="checkbox" name="guidelines" required className="mr-2" />This post is non-explicit and follows the community rules.</label></HubForm></section></div>
    <section className={card}><h2 className="mb-5 text-xl font-semibold">Plan a live session</h2><p className="mb-4 text-sm text-neutral-500">Scheduling is available. Broadcasting remains disabled until a video provider is connected.</p><HubForm op="schedule" creatorId={creator.id} label="Schedule session"><Field name="title" label="Session title" /><Field name="scheduledAt" label="Date and time with timezone (example: 2026-10-01T18:00-05:00)" /></HubForm>{creator.streams.map(stream => <div key={stream.id} className="mt-5 border-t pt-4"><p className="mb-3">{stream.title} · {stream.scheduledAt.toISOString()} · {stream.status}</p>{stream.status === "SCHEDULED" && <HubForm op="cancelStream" creatorId={creator.id} label="Cancel session"><input type="hidden" name="streamId" value={stream.id} /></HubForm>}</div>)}</section>
    <section className={card}><h2 className="text-xl font-semibold">Your posts</h2>{!creator.posts.length && <p className="mt-4 text-neutral-500">Your first post starts here.</p>}{creator.posts.map(post => <div key={post.id} className="mt-4 flex justify-between gap-4 border-t pt-4"><span>{post.title}</span><span className="text-sm text-brand-600">{post.status}</span></div>)}</section>
  </main>;
}
