"use client";

import { useActionState } from "react";
import { triggerVendorSync } from "@/lib/actions/vendor-actions";
import Button from "@/components/ui/Button";

export default function SyncButton() {
  const [state, formAction, pending] = useActionState(
    async () => triggerVendorSync(),
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Syncing…" : "Sync now"}
      </Button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
    </form>
  );
}
