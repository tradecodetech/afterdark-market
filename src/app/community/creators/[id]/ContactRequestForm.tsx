"use client";

import { useActionState } from "react";
import { requestCreatorContact } from "@/lib/actions/community-actions";

export function ContactRequestForm({ creatorProfileId, fee }: { creatorProfileId: string; fee: number }) {
  const [state, action, pending] = useActionState(requestCreatorContact, undefined);
  return (
    <form action={action} className="mt-5 max-w-md space-y-4">
      <input type="hidden" name="creatorProfileId" value={creatorProfileId} />
      <div>
        <label htmlFor="cardNumber" className="text-sm font-medium">Demo card number</label>
        <input id="cardNumber" name="cardNumber" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm outline-none dark:border-neutral-700" required />
        <p className="mt-1.5 text-xs text-neutral-500">Uses the mock payment provider. No real card is charged.</p>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">{state.success}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">
        {pending ? "Sending request…" : `Pay $${(fee / 100).toFixed(2)} & request contact`}
      </button>
    </form>
  );
}
