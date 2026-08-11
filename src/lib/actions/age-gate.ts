"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AGE_GATE_COOKIE } from "@/lib/constants";

export async function confirmAgeGate(formData: FormData) {
  const cookieStore = await cookies();
  cookieStore.set(AGE_GATE_COOKIE, "1", {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  const redirectTo = (formData.get("redirectTo") as string) || "/";
  redirect(redirectTo);
}
