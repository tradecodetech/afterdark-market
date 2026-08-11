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

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/cart");

  const cart = await getOrCreateCart(session.user.id);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your cart</h1>

      {cart.items.length === 0 ? (
        <div className="mt-8 text-sm text-neutral-500">
          Your cart is empty.{" "}
          <Link href="/products" className="underline">
            Browse products
          </Link>
          .
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
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
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatCents(item.product.price)}
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
                      className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    />
                    <button
                      type="submit"
                      className="text-xs underline text-neutral-500"
                    >
                      Update
                    </button>
                  </form>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium">
                    {formatCents(item.product.price * item.quantity)}
                  </span>
                  <form action={removeCartItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 underline"
                    >
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

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-md bg-black py-3 text-center text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </div>
  );
}
