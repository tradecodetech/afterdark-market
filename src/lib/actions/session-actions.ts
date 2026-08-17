"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export type SessionActionState = { error?: string; success?: string } | undefined;

export async function scheduleVideoSession(
  _prevState: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/sessions");
  if (session.user.role !== ROLES.CREATOR) return { error: "Only creators can schedule sessions." };

  const sessionId = String(formData.get("sessionId") ?? "");
  const scheduledAtValue = String(formData.get("scheduledAt") ?? "");
  if (!sessionId || !scheduledAtValue) return { error: "Choose a session time." };

  const scheduledAt = new Date(scheduledAtValue);
  if (Number.isNaN(scheduledAt.getTime())) return { error: "Invalid session time." };
  if (scheduledAt <= new Date()) return { error: "Session time must be in the future." };

  const videoSession = await prisma.videoSession.findUnique({ where: { id: sessionId } });
  if (!videoSession || videoSession.creatorId !== session.user.id) return { error: "Session not found." };
  if (videoSession.status !== "SCHEDULED") return { error: "This session is no longer schedulable." };

  await prisma.videoSession.update({ where: { id: sessionId }, data: { scheduledAt } });
  revalidatePath("/creator/sessions");
  revalidatePath(`/community/sessions/${sessionId}`);
  revalidatePath("/community/requests");
  return { success: "Session scheduled." };
}

export async function cancelVideoSession(formData: FormData): Promise<SessionActionState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/sessions");

  const sessionId = String(formData.get("sessionId") ?? "");
  const videoSession = await prisma.videoSession.findUnique({ where: { id: sessionId } });
  if (!videoSession || (videoSession.creatorId !== session.user.id && videoSession.customerId !== session.user.id)) {
    return { error: "Session not found." };
  }
  if (!["SCHEDULED", "ACTIVE"].includes(videoSession.status)) return { error: "This session cannot be cancelled." };

  await prisma.videoSession.update({ where: { id: sessionId }, data: { status: "CANCELLED", endedAt: new Date() } });
  revalidatePath("/creator/sessions");
  revalidatePath(`/community/sessions/${sessionId}`);
  return { success: "Session cancelled." };
}
