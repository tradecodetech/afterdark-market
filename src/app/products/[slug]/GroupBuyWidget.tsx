"use client";

import { useActionState } from "react";
import { joinGroupBuy } from "@/lib/actions/group-buy-actions";
import { formatCents } from "@/lib/constants";
import Button from "@/components/ui/Button";

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
    <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950/40">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-brand-900 dark:text-brand-200">
          🤝 Group buy: {formatCents(groupPrice)}
        </span>
        <span className="text-xs text-brand-700 line-through dark:text-brand-400">
          {formatCents(regularPrice)}
        </span>
      </div>
      <p className="mt-1 text-xs text-brand-700 dark:text-brand-400">
        Unlocks at {targetCount} buyers
        {expiresAt && !completed
          ? ` · ends ${new Date(expiresAt).toLocaleString()}`
          : ""}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-200 dark:bg-brand-900">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-brand-700 dark:text-brand-400">
        {joined}/{targetCount} joined
      </p>

      {completed ? (
        <p className="mt-3 text-sm font-medium text-brand-900 dark:text-brand-200">
          Group complete! The discounted price was added to your cart.
        </p>
      ) : (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="productId" value={productId} />
          <Button type="submit" disabled={pending} size="sm">
            {pending ? "Joining…" : "Join group buy"}
          </Button>
        </form>
      )}

      {state?.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
    </div>
  );
}
