"use client";

import { useActionState } from "react";
import { requestPhoneCode } from "@/lib/actions/phone-actions";

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
    <form action={formAction} className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-sm">
        Phone number
        <input
          type="tel"
          name="phone"
          required
          defaultValue={defaultPhone}
          className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-neutral-700"
      >
        {pending ? "Sending…" : "Send code"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">{state.success}</p>
      )}
      {state?.devCode && (
        <p className="rounded-md border border-dashed border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700">
          Demo code: <span className="font-mono font-semibold">{state.devCode}</span>
        </p>
      )}
    </form>
  );
}
