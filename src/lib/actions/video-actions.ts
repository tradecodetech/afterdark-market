"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVideoSessionProvider } from "@/lib/video";
import { ROLES, type Role } from "@/lib/constants";

export async function prepareVideoSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");

  const sessionId = String(formData.get("sessionId") ?? "");
  if (!sessionId) return { error: "Session ID is required." };

  const item = await prisma.videoSession.findUnique({ where: { id: sessionId } });
  if (!item) return { error: "Session not found." };
  if (item.customerId !== session.user.id && item.creatorId !== session.user.id) {
    return { error: "You are not a participant in this session." };
  }
  const allowedRoles: Role[] = [ROLES.CUSTOMER, ROLES.CREATOR];
  if (!allowedRoles.includes(session.user.role)) {
    return { error: "This account cannot join community sessions." };
  }
  if (item.status !== "SCHEDULED") return { error: "This session is not ready to start." };
  if (!item.scheduledAt || item.scheduledAt > new Date()) return { error: "The session is not open yet." };

  const provider = getVideoSessionProvider();
  if (item.providerSessionId && item.provider === provider.name) {
    revalidatePath(`/community/sessions/${item.id}`);
    return { success: true, provider: item.provider, providerSessionId: item.providerSessionId };
  }

  const room = await provider.createRoom({ sessionId: item.id, startsAt: item.scheduledAt });
  await prisma.videoSession.update({
    where: { id: item.id },
    data: { provider: room.provider, providerSessionId: room.providerSessionId, status: "ACTIVE", startedAt: new Date() },
  });

  revalidatePath(`/community/sessions/${item.id}`);
  return { success: true, provider: room.provider, providerSessionId: room.providerSessionId, joinUrl: room.joinUrl };
}

export async function finishVideoSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");

  const sessionId = String(formData.get("sessionId") ?? "");
  const item = await prisma.videoSession.findUnique({ where: { id: sessionId } });
  if (!item) return { error: "Session not found." };
  if (item.customerId !== session.user.id && item.creatorId !== session.user.id) {
    return { error: "You are not a participant in this session." };
  }
  if (item.status !== "ACTIVE") return { error: "Only active sessions can be completed." };

  const durationSeconds = item.startedAt
    ? Math.max(0, Math.round((Date.now() - item.startedAt.getTime()) / 1000))
    : 0;

  await prisma.videoSession.update({
    where: { id: item.id },
    data: { status: "COMPLETED", endedAt: new Date(), durationSeconds },
  });

  revalidatePath(`/community/sessions/${item.id}`);
  return { success: true };
}
