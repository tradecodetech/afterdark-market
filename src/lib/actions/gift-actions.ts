"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { PAYMENT_STATUS, ROLES } from "@/lib/constants";

export type GiftActionState = { error?: string; success?: string } | undefined;

export async function sendCreatorGift(
  _prevState: GiftActionState,
  formData: FormData,
): Promise<GiftActionState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");
  if (session.user.role !== ROLES.CUSTOMER) return { error: "Only customer accounts can send gifts." };

  const creatorProfileId = String(formData.get("creatorProfileId") ?? "");
  const videoSessionId = String(formData.get("videoSessionId") ?? "") || null;
  const label = String(formData.get("label") ?? "Gift").trim() || "Gift";
  const rawAmount = Number(formData.get("amount") ?? 0);
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const amount = Math.round(rawAmount * 100);

  if (!creatorProfileId || !Number.isFinite(amount) || amount < 100 || amount > 50000) {
    return { error: "Choose a gift amount between $1 and $500." };
  }
  if (!cardNumber) return { error: "Enter the demo card number to test the gift flow." };

  const creator = await prisma.creatorProfile.findUnique({ where: { id: creatorProfileId } });
  if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) {
    return { error: "This creator is not currently eligible to receive gifts." };
  }

  if (videoSessionId) {
    const videoSession = await prisma.videoSession.findUnique({ where: { id: videoSessionId } });
    if (!videoSession || videoSession.customerId !== session.user.id || videoSession.creatorId !== creator.userId) {
      return { error: "This gift is not associated with an eligible session." };
    }
    if (!["SCHEDULED", "ACTIVE", "COMPLETED"].includes(videoSession.status)) {
      return { error: "Gifts are not available for this session state." };
    }
  }

  const payment = await getPaymentProvider().charge({
    orderId: `gift_${creatorProfileId}_${session.user.id}_${randomUUID()}`,
    amountCents: amount,
    currency: "USD",
    cardNumber,
    cardExpiry: "12/30",
    cardCvc: "123",
  });

  if (!payment.success || payment.status !== PAYMENT_STATUS.CAPTURED) {
    return { error: payment.message ?? "Gift payment failed." };
  }

  const gift = await prisma.gift.create({
    data: {
      senderId: session.user.id,
      recipientId: creator.userId,
      creatorProfileId: creator.id,
      videoSessionId,
      amount,
      label,
      status: "CAPTURED",
      providerRef: payment.providerRef,
    },
  });

  const platformFee = Math.round(amount * 0.2);
  await prisma.creatorEarning.create({
    data: {
      creatorId: creator.userId,
      creatorProfileId: creator.id,
      videoSessionId,
      giftId: gift.id,
      grossAmount: amount,
      platformFee,
      netAmount: amount - platformFee,
      status: "AVAILABLE",
      availableAt: new Date(),
    },
  });

  revalidatePath(`/community/creators/${creatorProfileId}`);
  if (videoSessionId) revalidatePath(`/community/sessions/${videoSessionId}`);
  revalidatePath("/creator");
  revalidatePath("/creator/earnings");

  return { success: `Gift sent successfully. Creator earnings recorded at $${((amount - platformFee) / 100).toFixed(2)} after platform fee.` };
}
