"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { MINIMUM_AGE, ROLES } from "@/lib/constants";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Enter a valid date",
  }),
});

function isAtLeastAge(dob: Date, age: number): boolean {
  const today = new Date();
  const cutoff = new Date(
    today.getFullYear() - age,
    today.getMonth(),
    today.getDate(),
  );
  return dob <= cutoff;
}

export type FormState = { error?: string } | undefined;

export async function registerUser(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, phone, dateOfBirth } = parsed.data;
  const dob = new Date(dateOfBirth);

  if (!isAtLeastAge(dob, MINIMUM_AGE)) {
    return { error: `You must be at least ${MINIMUM_AGE} to register.` };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      dateOfBirth: dob,
      ageVerified: true,
      role: ROLES.CUSTOMER,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/auth/verify-phone",
  });
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }
}

export async function logoutAndRedirect() {
  redirect("/");
}
