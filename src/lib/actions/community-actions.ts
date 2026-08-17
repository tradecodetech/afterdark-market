"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { PAYMENT_STATUS, ROLES } from "@/lib/constants";

export type CommunityActionState = { error?: string; success?: string } | undefined;

export async function requestCreatorContact(
  _prevState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/community");
  if (session.user.role !== ROLES.CUSTOMER) return { error: "Only customer accounts can request creator contact." };

  const creatorProfileId = String(formData.get("creatorProfileId") ?? "");
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();

  if (!creatorProfileId) return { error: "Creator profile is required." };

  const creator = await prisma.creatorProfile.findUnique({ where: { id: creatorProfileId } });
  if (!creator || !creator.isApproved || !creator.ageVerified || !creator.identityVerified) {
    return { error: "This creator is not currently available for requests." };
  }
  if (creator.userId === session.user.id) return { error: "You cannot request contact with your own creator profile." };
  if (creator.contactFee <= 0) return { error: "This creator does not have a paid contact fee configured yet." };
  if (!cardNumber) return { error: "Enter the demo card number to test the paid request flow." };

  const existing = await prisma.contactRequest.findFirst({
    where: {
      requesterId: session.user.id,
      creatorId: creator.userId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  });
  if (existing) return { error: "You already have an active request with this creator." };

  const payment = await getPaymentProvider().charge({
    amount: creator.contactFee,
    currency: "USD",
    cardNumber,
    description: `Pikaboo creator contact request ${creator.displayName}`,
  });

  if (!payment.success || payment.status !== PAYMENT_STATUS.CAPTURED) {
    return { error: payment.message ?? "Payment failed." };
  }

  await prisma.contactRequest.create({
    data: {
      requesterId: session.user.id,
      creatorId: creator.userId,
      creatorProfileId: creator.id,
      fee: creator.contactFee,
      status: "PENDING",
      paymentRef: payment.providerRef,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    },
  });

  revalidatePath(`/community/creators/${creatorProfileId}`);
  revalidatePath("/community");
  void randomUUID();
  return { success: "Paid contact request sent. The creator can now accept or decline it." };
}
