"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/user-actions";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className={labelClass()}>
        Email
        <input type="email" name="email" required className={fieldClass()} />
      </label>
      <label className={labelClass()}>
        Password
        <input type="password" name="password" required className={fieldClass()} />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} size="lg" className="mt-1 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
