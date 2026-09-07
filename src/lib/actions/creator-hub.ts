"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCommunityAccess, validAmount } from "@/lib/community-access";
import { revalidatePath } from "next/cache";

export type HubState = { error?: string; success?: string };

export async function hubAction(_: HubState, form: FormData): Promise<HubState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sign in to continue." };
  // Read current roles from the database, rather than relying on an old session.
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Account unavailable." };
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const op = text("op");
  const demo = process.env.COMMUNITY_DEMO_PAYMENTS === "true";
  try {
    if (op === "moderate") {
      if (user.role !== "ADMIN") return { error: "Administrator access required." };
      const type = text("targetType"), id = text("targetId"), decision = text("decision");
      if (!["APPROVE", "HIDE", "DISMISS"].includes(decision)) return { error: "Invalid decision." };
      await prisma.$transaction(async tx => {
        if (type === "POST" && decision !== "DISMISS") await tx.creatorPost.update({ where: { id }, data: { status: decision === "APPROVE" ? "PUBLISHED" : "HIDDEN" } });
        else if (type === "MESSAGE" && decision === "HIDE") await tx.communityMessage.update({ where: { id }, data: { hidden: true } });
        else if (decision !== "DISMISS") throw new Error("Invalid moderation target");
        await tx.communityReport.updateMany({ where: { targetId: id, targetType: type }, data: { resolved: true } });
      });
    } else {
      const creator = await prisma.creatorProfile.findUnique({ where: { id: text("creatorId") } });
      if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) return { error: "This creator is unavailable." };
      const owner = creator.userId === user.id;
      const membership = await prisma.creatorMembership.findUnique({ where: { creatorId_userId: { creatorId: creator.id, userId: user.id } } });
      const access = hasCommunityAccess(owner, membership, demo);
      if (["profile", "post", "schedule", "cancelStream"].includes(op) && (!owner || user.role !== "CREATOR")) return { error: "Only this creator can make that change." };
      if (op === "profile") {
        const displayName = text("displayName"), bio = text("bio"), amount = validAmount(text("price"));
        if (!displayName || displayName.length > 60 || bio.length > 1200 || amount === null) return { error: "Use a name up to 60 characters, a bio up to 1,200, and a price from $1 to $500." };
        await prisma.creatorProfile.update({ where: { id: creator.id }, data: { displayName, bio, membershipPrice: amount } });
      } else if (op === "post") {
        const title = text("title"), body = text("body");
        if (!title || title.length > 120 || !body || body.length > 10000 || text("guidelines") !== "on") return { error: "Add a title (120 characters max), a post (10,000 max), and accept the community rules." };
        await prisma.creatorPost.create({ data: { creatorId: creator.id, title, body, membersOnly: text("membersOnly") === "on" } });
      } else if (op === "join") {
        if (!demo) return { error: "Membership checkout is not connected yet." };
        if (owner) return { error: "You already have access to your own community." };
        if (access) return { error: "Your membership is already active." };
        const data = { expiresAt: new Date(Date.now() + 30 * 86400000), cancelled: false, isDemo: true, amount: creator.membershipPrice };
        await prisma.creatorMembership.upsert({ where: { creatorId_userId: { creatorId: creator.id, userId: user.id } }, create: { creatorId: creator.id, userId: user.id, ...data }, update: data });
      } else if (op === "cancel") {
        await prisma.creatorMembership.updateMany({ where: { creatorId: creator.id, userId: user.id }, data: { cancelled: true } });
      } else if (op === "tip") {
        if (!demo) return { error: "Tipping is not connected yet." };
        if (owner) return { error: "You cannot tip yourself." };
        const amount = validAmount(text("amount")), id = text("requestId");
        if (amount === null || !/^[a-f0-9-]{36}$/i.test(id)) return { error: "Enter a tip from $1 to $500." };
        // The form's unique ID makes duplicate submissions harmless. Demo tips
        // never enter the real earnings or payout tables.
        await prisma.communityTip.upsert({ where: { id }, create: { id, creatorId: creator.id, userId: user.id, amount }, update: {} });
      } else if (op === "message") {
        if (!access) return { error: "An active membership is required to chat." };
        const body = text("body");
        if (!body || body.length > 1000) return { error: "Messages must contain 1–1,000 characters." };
        const recent = await prisma.communityMessage.findFirst({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 5000) } } });
        if (recent) return { error: "Please wait a few seconds before sending again." };
        await prisma.communityMessage.create({ data: { creatorId: creator.id, userId: user.id, authorName: user.name, body } });
      } else if (op === "report") {
        const type = text("targetType"), id = text("targetId"), reason = text("reason");
        if (!reason || reason.length > 500) return { error: "Describe the issue in 1–500 characters." };
        const target = type === "POST" ? await prisma.creatorPost.findFirst({ where: { id, creatorId: creator.id, status: "PUBLISHED" } }) : type === "MESSAGE" && access ? await prisma.communityMessage.findFirst({ where: { id, creatorId: creator.id, hidden: false } }) : null;
        if (!target) return { error: "Content unavailable." };
        await prisma.communityReport.upsert({ where: { reporterId_targetId_targetType: { reporterId: user.id, targetId: id, targetType: type } }, create: { reporterId: user.id, targetId: id, targetType: type, reason }, update: { reason, resolved: false } });
      } else if (op === "schedule") {
        const title = text("title"), scheduledAt = new Date(text("scheduledAt"));
        if (!title || title.length > 120 || !Number.isFinite(scheduledAt.getTime()) || scheduledAt <= new Date()) return { error: "Add a title and a future date/time with a timezone, such as 2026-10-01T18:00-05:00." };
        await prisma.communityStream.create({ data: { creatorId: creator.id, title, scheduledAt } });
      } else if (op === "cancelStream") {
        await prisma.communityStream.updateMany({ where: { id: text("streamId"), creatorId: creator.id }, data: { status: "CANCELLED" } });
      } else return { error: "Unknown action." };
    }
    revalidatePath("/community", "layout");
    revalidatePath("/creator/studio");
    revalidatePath("/admin/community");
    return { success: op === "post" ? "Post submitted for moderator review." : op === "join" ? "Demo membership activated for 30 days. No payment taken or renewal scheduled." : op === "tip" ? "Demo tip recorded. No money was charged." : "Saved." };
  } catch {
    return { error: "We couldn’t save that change. Please try again." };
  }
}
