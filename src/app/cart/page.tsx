import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/lib/cart";
import {
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/actions/cart-actions";
import { formatCents } from "@/lib/constants";
import { fieldClass } from "@/components/ui/field";
import { textLinkClass } from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import ButtonLink from "@/components/ui/ButtonLink";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/cart");

  const cart = await getOrCreateCart(session.user.id);
  const unitPrice = (item: (typeof cart.items)[number]) =>
    item.unitPriceOverride ?? item.product.price;
  const subtotal = cart.items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-2xl tracking-tight">Your cart</h1>

      {cart.items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <span className="text-3xl">🛒</span>
          <p className="text-sm text-neutral-500">Your cart is empty.</p>
          <ButtonLink href="/products" variant="secondary">
            Browse products
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {item.product.title}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                    {formatCents(unitPrice(item))}
                    {item.unitPriceOverride && <Badge tone="brand">Group buy price</Badge>}
                  </p>
                  <form
                    action={updateCartItemQuantity}
                    className="mt-2 flex items-center gap-2"
                  >
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={item.quantity}
                      min={0}
                      max={item.product.stock}
                      className={fieldClass("w-16 px-2 py-1")}
                    />
                    <button type="submit" className={textLinkClass()}>
                      Update
                    </button>
                  </form>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium">
                    {formatCents(unitPrice(item) * item.quantity)}
                  </span>
                  <form action={removeCartItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className={textLinkClass("danger")}>
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <span className="text-sm text-neutral-500">Subtotal</span>
            <span className="text-lg font-semibold">
              {formatCents(subtotal)}
            </span>
          </div>

          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to checkout
          </ButtonLink>
        </>
      )}
    </div>
  );
}
