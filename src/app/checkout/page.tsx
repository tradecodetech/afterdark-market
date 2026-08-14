import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/lib/cart";
import { getActiveRewards } from "@/lib/actions/reward-actions";
import CheckoutClient from "./CheckoutClient";

const FLAT_SHIPPING_CENTS = 599;

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/checkout");

  const [cart, rewards] = await Promise.all([
    getOrCreateCart(session.user.id),
    getActiveRewards(session.user.id),
  ]);
  if (cart.items.length === 0) redirect("/cart");

  const items = cart.items.map((item) => ({
    id: item.id,
    title: item.product.title,
    quantity: item.quantity,
    unitPrice: item.unitPriceOverride ?? item.product.price,
  }));

  const rewardOptions = rewards.map((reward) => ({
    id: reward.id,
    code: reward.code,
    label: reward.kind === "PERCENT_OFF" ? `${reward.value}% off` : "Free shipping",
    kind: reward.kind,
    value: reward.value,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Shipping is discreet. Your billing statement will read{" "}
        <span className="font-medium">&ldquo;PKB* RETAIL&rdquo;</span>.
      </p>

      <CheckoutClient
        items={items}
        shippingFlat={FLAT_SHIPPING_CENTS}
        rewards={rewardOptions}
      />
    </div>
  );
}
