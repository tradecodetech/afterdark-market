"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { PAYMENT_STATUS, ROLES } from "@/lib/constants";

export type CommunityActionState = { error?: string; success?: string } | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");
  return session.user;
}

export async function requestCreatorContact(
  _prevState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const user = await requireUser();
  if (user.role !== ROLES.CUSTOMER) return { error: "Only customer accounts can request creator contact." };

  const creatorProfileId = String(formData.get("creatorProfileId") ?? "");
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const cardExpiry = String(formData.get("cardExpiry") ?? "12/30").trim();
  const cardCvc = String(formData.get("cardCvc") ?? "123").trim();

  if (!creatorProfileId) return { error: "Creator profile is required." };
  if (!cardNumber) return { error: "Enter the demo card number to test the paid request flow." };

  const creator = await prisma.creatorProfile.findUnique({ where: { id: creatorProfileId } });
  if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) {
    return { error: "This creator is not currently available for requests." };
  }
  if (creator.userId === user.id) return { error: "You cannot request contact with your own creator profile." };
  if (creator.contactFee <= 0) return { error: "This creator does not have a paid contact fee configured yet." };

  const existing = await prisma.contactRequest.findFirst({
    where: { requesterId: user.id, creatorId: creator.userId, status: { in: ["PENDING", "ACCEPTED"] } },
  });
  if (existing) return { error: "You already have an active request with this creator." };

  const payment = await getPaymentProvider().charge({
    orderId: `community_contact_${creatorProfileId}_${user.id}`,
    amountCents: creator.contactFee,
    currency: "USD",
    cardNumber,
    cardExpiry,
    cardCvc,
  });

  if (!payment.success || payment.status !== PAYMENT_STATUS.CAPTURED) {
    return { error: payment.message ?? "Payment failed." };
  }

  await prisma.contactRequest.create({
    data: {
      requesterId: user.id,
      creatorId: creator.userId,
      creatorProfileId: creator.id,
      fee: creator.contactFee,
      status: "PENDING",
      paymentRef: payment.providerRef,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    },
  });

  revalidatePath(`/community/creators/${creatorProfileId}`);
  revalidatePath("/community/creators");
  revalidatePath("/community/requests");
  return { success: "Paid contact request sent. The creator can now accept or decline it." };
}

export async function respondToContactRequest(formData: FormData): Promise<CommunityActionState> {
  const user = await requireUser();
  if (user.role !== ROLES.CREATOR) return { error: "Only creator accounts can respond to contact requests." };

  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!requestId || !["ACCEPTED", "DECLINED"].includes(decision)) return { error: "Invalid request response." };

  const creator = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
  if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) {
    return { error: "Your creator profile is not approved for community requests." };
  }

  const request = await prisma.contactRequest.findUnique({ where: { id: requestId } });
  if (!request || request.creatorId !== user.id || request.status !== "PENDING") {
    return { error: "This request is no longer available." };
  }
  if (request.expiresAt && request.expiresAt < new Date()) {
    await prisma.contactRequest.update({ where: { id: request.id }, data: { status: "EXPIRED" } });
    revalidatePath("/creator/requests");
    return { error: "This request has expired." };
  }

  await prisma.contactRequest.update({ where: { id: request.id }, data: { status: decision } });

  if (decision === "ACCEPTED") {
    const platformFee = Math.round(creator.sessionRate * 0.2);
    await prisma.videoSession.create({
      data: {
        contactRequestId: request.id,
        customerId: request.requesterId,
        creatorId: user.id,
        creatorProfileId: creator.id,
        status: "SCHEDULED",
        rate: creator.sessionRate,
        platformFee,
        creatorAmount: Math.max(0, creator.sessionRate - platformFee),
      },
    });
  }

  revalidatePath("/creator/requests");
  revalidatePath("/community/requests");
  return { success: decision === "ACCEPTED" ? "Request accepted. A private session record was created." : "Request declined." };
}
