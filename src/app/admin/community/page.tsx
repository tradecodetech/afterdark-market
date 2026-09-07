import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HubForm } from "@/components/community/HubForm";
import { card } from "@/components/community/ui";

export default async function CommunityModeration() {
  const session = await auth();
  const user = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  if (user?.role !== "ADMIN") redirect("/");
  const [posts, reports] = await Promise.all([
    prisma.creatorPost.findMany({ where: { status: "PENDING" }, include: { creator: { select: { displayName: true } } }, orderBy: { createdAt: "asc" }, take: 100 }),
    prisma.communityReport.findMany({ where: { resolved: false }, orderBy: { createdAt: "asc" }, take: 100 }),
  ]);
  const [reportedPosts, reportedMessages] = await Promise.all([
    prisma.creatorPost.findMany({ where: { id: { in: reports.filter(r => r.targetType === "POST").map(r => r.targetId) } } }),
    prisma.communityMessage.findMany({ where: { id: { in: reports.filter(r => r.targetType === "MESSAGE").map(r => r.targetId) } } }),
  ]);
  const bodies = new Map([...reportedPosts, ...reportedMessages].map(item => [item.id, item.body]));
  function controls(id: string, type: string, review: boolean) {
    return <HubForm op="moderate" label="Apply decision"><input type="hidden" name="targetId" value={id} /><input type="hidden" name="targetType" value={type} /><label className="block text-sm">Decision<select name="decision" className="ml-3 rounded border bg-transparent p-2">{review && <option value="APPROVE">Approve</option>}<option value="HIDE">Hide content</option>{!review && <option value="DISMISS">Dismiss report</option>}</select></label></HubForm>;
  }
  return <section className="space-y-6"><h2 className="text-2xl font-semibold">Community moderation</h2><p className="text-neutral-500">Approve non-explicit posts and review member reports. Up to 100 oldest items are shown in each queue.</p><h3 className="text-xl font-semibold">Pending posts ({posts.length})</h3>{!posts.length && <p>No posts awaiting review.</p>}{posts.map(post => <article key={post.id} className={card}><p className="text-sm text-neutral-500">{post.creator.displayName} · {post.membersOnly ? "Members only" : "Public"}</p><h4 className="mt-2 font-semibold">{post.title}</h4><p className="my-4 whitespace-pre-wrap break-words">{post.body}</p>{controls(post.id, "POST", true)}</article>)}<h3 className="text-xl font-semibold">Reports ({reports.length})</h3>{!reports.length && <p>No open reports.</p>}{reports.map(report => <article key={report.id} className={card}><p className="text-xs text-neutral-500">{report.targetType}</p><p className="mt-2 font-semibold">{report.reason}</p><blockquote className="my-4 whitespace-pre-wrap break-words border-l-2 pl-4">{bodies.get(report.targetId) || "Content no longer available."}</blockquote>{controls(report.targetId, report.targetType, false)}</article>)}</section>;
}
