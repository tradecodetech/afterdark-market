"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const CODE_TTL_MINUTES = 10;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// No real SMS gateway credentials are available in this project, so this
// "sends" a code by creating the row and handing the code back to the
// caller to display — same transparent-mock approach as the payment
// provider. Swap in Twilio/Vonage/etc. here for production; nothing else
// in the verification flow needs to change.
export async function createPhoneVerificationCode(userId: string, phone: string) {
  const code = generateCode();
  await prisma.phoneVerificationCode.create({
    data: {
      userId,
      phone,
      code,
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000),
    },
  });
  return code;
}

export type PhoneActionState =
  | { error?: string; success?: string; devCode?: string }
  | undefined;

export async function requestPhoneCode(
  _prevState: PhoneActionState,
  formData: FormData,
): Promise<PhoneActionState> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const phone = (formData.get("phone") as string)?.trim();
  if (!phone || phone.length < 7) {
    return { error: "Enter a valid phone number." };
  }

  const code = await createPhoneVerificationCode(session.user.id, phone);

  return {
    success: `Code sent to ${phone}.`,
    devCode: code,
  };
}

export async function verifyPhoneCode(
  _prevState: PhoneActionState,
  formData: FormData,
): Promise<PhoneActionState> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const code = (formData.get("code") as string)?.trim();
  if (!code) return { error: "Enter the code." };

  const record = await prisma.phoneVerificationCode.findFirst({
    where: { userId: session.user.id, code, consumed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return { error: "That code is invalid or expired." };
  }

  await prisma.$transaction([
    prisma.phoneVerificationCode.update({
      where: { id: record.id },
      data: { consumed: true },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { phone: record.phone, phoneVerified: true },
    }),
  ]);

  redirect("/?verified=1");
}
