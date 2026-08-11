"use client";

import { useActionState } from "react";
import { placeOrder } from "@/lib/actions/checkout-actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">
          Shipping address
        </legend>
        <input
          name="shippingLine1"
          placeholder="Address line 1"
          required
          className={inputClass}
        />
        <input
          name="shippingLine2"
          placeholder="Address line 2 (optional)"
          className={inputClass}
        />
        <div className="grid grid-cols-3 gap-2">
          <input name="shippingCity" placeholder="City" required className={inputClass} />
          <input name="shippingState" placeholder="State" required className={inputClass} />
          <input name="shippingPostal" placeholder="ZIP" required className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Payment</legend>
        <input
          name="cardNumber"
          placeholder="Card number"
          required
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="cardExpiry"
            placeholder="MM/YY"
            required
            className={inputClass}
          />
          <input name="cardCvc" placeholder="CVC" required className={inputClass} />
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
