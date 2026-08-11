"use client";

import { useActionState } from "react";
import { triggerVendorSync } from "@/lib/actions/vendor-actions";

export default function SyncButton() {
  const [state, formAction, pending] = useActionState(
    async () => triggerVendorSync(),
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Syncing…" : "Sync now"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
    </form>
  );
}
