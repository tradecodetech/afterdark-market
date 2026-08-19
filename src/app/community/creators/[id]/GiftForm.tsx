"use client";

import { useActionState } from "react";
import { sendCreatorGift } from "@/lib/actions/gift-actions";

export function GiftForm({ creatorProfileId, videoSessionId }: { creatorProfileId: string; videoSessionId?: string }) {
  const [state, action, pending] = useActionState(sendCreatorGift, undefined);

  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="creatorProfileId" value={creatorProfileId} />
      {videoSessionId && <input type="hidden" name="videoSessionId" value={videoSessionId} />}
      <div className="grid gap-3 sm:grid-cols-3">
        {[5, 10, 25].map((value) => (
          <label key={value} className="cursor-pointer rounded-xl border border-neutral-300 p-3 text-center text-sm has-[:checked]:border-black dark:border-neutral-700 dark:has-[:checked]:border-white">
            <input className="sr-only" type="radio" name="amount" value={value} defaultChecked={value === 10} />
            ${value}
          </label>
        ))}
      </div>
      <input name="label" placeholder="Gift message (optional)" maxLength={60} className="w-full rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm dark:border-neutral-700" />
      <input name="cardNumber" inputMode="numeric" autoComplete="off" placeholder="Demo card number" className="w-full rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm dark:border-neutral-700" required />
      <p className="text-xs text-neutral-500">Uses Pikaboo's mock payment provider. No real card is charged.</p>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">{state.success}</p>}
      <button type="submit" disabled={pending} className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">
        {pending ? "Sending…" : "Send gift"}
      </button>
    </form>
  );
}
