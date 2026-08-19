"use client";

import { useActionState } from "react";
import { registerUser } from "@/lib/actions/user-actions";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className={labelClass()}>
        Name
        <input name="name" required className={fieldClass()} />
      </label>
      <label className={labelClass()}>
        Email
        <input type="email" name="email" required className={fieldClass()} />
      </label>
      <label className={labelClass()}>
        Phone number
        <input
          type="tel"
          name="phone"
          required
          placeholder="+1 555 000 0000"
          className={fieldClass()}
        />
      </label>
      <label className={labelClass()}>
        Date of birth
        <input type="date" name="dateOfBirth" required className={fieldClass()} />
      </label>
      <label className={labelClass()}>
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className={fieldClass()}
        />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} size="lg" className="mt-1 w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
