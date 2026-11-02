
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
import { textLinkClass } from "@/components/ui/button-styles";
import Badge from "@/components/ui/Badge";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/cart");
  }

  const cart = await getOrCreateCart(session.user.id);

  const unitPrice = (item: (typeof cart.items)[number]) =>
    item.unitPriceOverride ?? item.product.price;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-12 text-[#f6f0e6] sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c7a76e]">
          Pikaboo Marketplace
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Your cart
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c7c1b6]">
          Explore your selections while we prepare the Pikaboo
          marketplace for launch.
        </p>

        <div className="mt-8 rounded-2xl border border-[#c7a76e]/30 bg-[#17130e] p-5">
          <h2 className="font-semibold text-[#e5c58e]">
            Checkout coming soon
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#c7c1b6]">
            Online purchases are not currently available.
            Products and pricing are displayed for preview
            purposes. Adding items to your cart does not
            reserve inventory or place an order.
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#a98b58]/25 bg-[#11100e] px-6 py-16 text-center">
            <div className="text-4xl text-[#c7a76e]">
              ✦
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-[#c7c1b6]">
              Discover what's coming to the Pikaboo marketplace.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex rounded-xl bg-[#c7a76e] px-6 py-3 font-semibold text-[#100d09] transition hover:bg-[#e0c18a]"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-10 divide-y divide-[#a98b58]/20 rounded-3xl border border-[#a98b58]/25 bg-[#11100e] px-5 sm:px-8">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-start gap-4 py-6 sm:flex-nowrap"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#201c17]">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-[#f6f0e6] hover:text-[#d4b47b]"
                    >
                      {item.product.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#c7c1b6]">
                      <span>
                        {formatCents(unitPrice(item))}
                      </span>

                      {item.unitPriceOverride != null && (
                        <Badge tone="brand">
                          Group buy price
                        </Badge>
                      )}
                    </div>

                    <form
                      action={updateCartItemQuantity}
                      className="mt-4 flex items-center gap-3"
                    >
                      <input
                        type="hidden"
                        name="itemId"
                        value={item.id}
                      />

                      <label
                        htmlFor={`quantity-${item.id}`}
                        className="text-xs text-[#c7c1b6]"
                      >
                        Qty
                      </label>

                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        name="quantity"
                        defaultValue={item.quantity}
                        min={0}
                        max={item.product.stock}
                        className={`${fieldClass("w-20 px-2 py-1")} text-neutral-900`}
                      />

                      <button
                        type="submit"
                        className="text-sm font-semibold text-[#d4b47b] hover:underline"
                      >
                        Update
                      </button>
                    </form>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className="font-semibold text-[#f6f0e6]">
                      {formatCents(
                        unitPrice(item) * item.quantity,
                      )}
                    </span>

                    <form action={removeCartItem}>
                      <input
                        type="hidden"
                        name="itemId"
                        value={item.id}
                      />

                      <button
                        type="submit"
                        className={textLinkClass("danger")}
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#a98b58]/25 bg-[#11100e] p-6">
              <span className="text-[#c7c1b6]">
                Preview subtotal
              </span>

              <span className="text-2xl font-semibold text-[#e5c58e]">
                {formatCents(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-center text-sm text-[#c7c1b6]">
              Checkout is unavailable during prelaunch.
              No payment will be collected.
            </p>

            <Link
              href="/products"
              className="mt-6 flex w-full justify-center rounded-xl border border-[#c7a76e]/50 px-6 py-3 font-semibold text-[#ead4ad] transition hover:bg-[#c7a76e]/10"
            >
              Continue exploring products
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
