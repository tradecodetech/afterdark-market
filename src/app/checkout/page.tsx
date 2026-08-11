import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/lib/cart";
import { formatCents } from "@/lib/constants";
import CheckoutForm from "./CheckoutForm";

const FLAT_SHIPPING_CENTS = 599;

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/checkout");

  const cart = await getOrCreateCart(session.user.id);
  if (cart.items.length === 0) redirect("/cart");

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + FLAT_SHIPPING_CENTS;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Shipping is discreet. Your billing statement will read{" "}
        <span className="font-medium">&ldquo;ADM* RETAIL&rdquo;</span>.
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <CheckoutForm />

        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <ul className="mt-3 divide-y divide-neutral-200 text-sm dark:divide-neutral-800">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between py-2">
                <span>
                  {item.product.title} × {item.quantity}
                </span>
                <span>{formatCents(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-sm text-neutral-500">
            <span>Subtotal</span>
            <span>{formatCents(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Shipping</span>
            <span>{formatCents(FLAT_SHIPPING_CENTS)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold dark:border-neutral-800">
            <span>Total</span>
            <span>{formatCents(total)}</span>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            Test mode — use any card number except{" "}
            <code>4000000000000002</code> to simulate a successful payment.{" "}
            <Link href="/cart" className="underline">
              Edit cart
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
