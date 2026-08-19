"use client";

import { useActionState } from "react";
import { requestPhoneCode } from "@/lib/actions/phone-actions";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function RequestCodeForm({
  defaultPhone,
}: {
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState(
    requestPhoneCode,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className={labelClass()}>
        Phone number
        <input
          type="tel"
          name="phone"
          required
          defaultValue={defaultPhone}
          className={fieldClass()}
        />
      </label>
      <Button type="submit" variant="secondary" disabled={pending} className="self-start">
        {pending ? "Sending…" : "Send code"}
      </Button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">{state.success}</p>
      )}
      {state?.devCode && (
        <p className="rounded-xl border border-dashed border-brand-300 bg-brand-50 px-3 py-2 text-sm dark:border-brand-700 dark:bg-brand-950/40">
          Demo code: <span className="font-mono font-semibold">{state.devCode}</span>
        </p>
      )}
    </form>
  );
}
