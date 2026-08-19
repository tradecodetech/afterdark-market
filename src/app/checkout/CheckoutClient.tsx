"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useActionState } from "react";
import { placeOrder } from "@/lib/actions/checkout-actions";
import { formatCents } from "@/lib/constants";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type RewardOption = {
  id: string;
  code: string;
  label: string;
  kind: string;
  value: number;
};

type Props = {
  items: { id: string; title: string; quantity: number; unitPrice: number }[];
  shippingFlat: number;
  rewards: RewardOption[];
};

export default function CheckoutClient({ items, shippingFlat, rewards }: Props) {
  const [state, formAction, pending] = useActionState(placeOrder, undefined);
  const [rewardId, setRewardId] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const selectedReward = rewards.find((r) => r.id === rewardId);
  const discount = useMemo(() => {
    if (!selectedReward) return 0;
    if (selectedReward.kind === "PERCENT_OFF") {
      return Math.round((subtotal * selectedReward.value) / 100);
    }
    if (selectedReward.kind === "FREE_SHIPPING") {
      return shippingFlat;
    }
    return 0;
  }, [selectedReward, subtotal, shippingFlat]);
  const total = subtotal + shippingFlat - discount;

  return (
    <form action={formAction} className="mt-6 grid gap-10 md:grid-cols-2">
      <input type="hidden" name="rewardId" value={rewardId} />

      <div className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-semibold">Shipping address</legend>
          <input name="shippingLine1" placeholder="Address line 1" required className={fieldClass()} />
          <input name="shippingLine2" placeholder="Address line 2 (optional)" className={fieldClass()} />
          <div className="grid grid-cols-3 gap-2">
            <input name="shippingCity" placeholder="City" required className={fieldClass()} />
            <input name="shippingState" placeholder="State" required className={fieldClass()} />
            <input name="shippingPostal" placeholder="ZIP" required className={fieldClass()} />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-semibold">Payment</legend>
          <input name="cardNumber" placeholder="Card number" required className={fieldClass()} />
          <div className="grid grid-cols-2 gap-2">
            <input name="cardExpiry" placeholder="MM/YY" required className={fieldClass()} />
            <input name="cardCvc" placeholder="CVC" required className={fieldClass()} />
          </div>
        </fieldset>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Placing order…" : "Place order"}
        </Button>
      </div>

      <Card>
        <h2 className="text-sm font-semibold">Order summary</h2>
        <ul className="mt-3 divide-y divide-neutral-200 text-sm dark:divide-neutral-800">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatCents(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        {rewards.length > 0 && (
          <label className={`mt-3 ${labelClass()}`}>
            Apply a reward
            <select
              value={rewardId}
              onChange={(e) => setRewardId(e.target.value)}
              className={fieldClass()}
            >
              <option value="">None</option>
              {rewards.map((reward) => (
                <option key={reward.id} value={reward.id}>
                  {reward.label} ({reward.code})
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-3 flex justify-between text-sm text-neutral-500">
          <span>Subtotal</span>
          <span>{formatCents(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-500">
          <span>Shipping</span>
          <span>{formatCents(shippingFlat)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Reward discount</span>
            <span>-{formatCents(discount)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold dark:border-neutral-800">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Test mode — use any card number except <code>4000000000000002</code>{" "}
          to simulate a successful payment.{" "}
          <Link href="/cart" className="underline">
            Edit cart
          </Link>
        </p>
      </Card>
    </form>
  );
}
