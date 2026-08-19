"use client";

import { useActionState } from "react";
import { verifyPhoneCode } from "@/lib/actions/phone-actions";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function VerifyCodeForm() {
  const [state, formAction, pending] = useActionState(
    verifyPhoneCode,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className={labelClass()}>
        6-digit code
        <input
          name="code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          className={fieldClass("tracking-widest")}
        />
      </label>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Verifying…" : "Verify"}
      </Button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
