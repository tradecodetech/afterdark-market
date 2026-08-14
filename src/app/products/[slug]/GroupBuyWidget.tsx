"use client";

import { useActionState } from "react";
import { joinGroupBuy } from "@/lib/actions/group-buy-actions";
import { formatCents } from "@/lib/constants";

type Props = {
  productId: string;
  regularPrice: number;
  groupPrice: number;
  target: number;
  currentCount: number;
  expiresAt: string | null;
};

export default function GroupBuyWidget({
  productId,
  regularPrice,
  groupPrice,
  target,
  currentCount,
  expiresAt,
}: Props) {
  const [state, formAction, pending] = useActionState(joinGroupBuy, undefined);

  const joined = state?.joined ?? currentCount;
  const targetCount = state?.target ?? target;
  const pct = Math.min(100, Math.round((joined / targetCount) * 100));
  const completed = state?.completed ?? false;

  return (
    <div className="mt-4 rounded-lg border border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          Group buy: {formatCents(groupPrice)}
        </span>
        <span className="text-xs text-violet-700 line-through dark:text-violet-400">
          {formatCents(regularPrice)}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-700 dark:text-violet-400">
        Unlocks at {targetCount} buyers
        {expiresAt && !completed
          ? ` · ends ${new Date(expiresAt).toLocaleString()}`
          : ""}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-violet-200 dark:bg-violet-900">
        <div
          className="h-full bg-violet-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-violet-700 dark:text-violet-400">
        {joined}/{targetCount} joined
      </p>

      {completed ? (
        <p className="mt-3 text-sm font-medium text-violet-900 dark:text-violet-200">
          Group complete! The discounted price was added to your cart.
        </p>
      ) : (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="productId" value={productId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {pending ? "Joining…" : "Join group buy"}
          </button>
        </form>
      )}

      {state?.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
    </div>
  );
}
