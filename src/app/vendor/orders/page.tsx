import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import { markOrderItemShipped } from "@/lib/actions/vendor-actions";

export default async function VendorOrdersPage() {
  const session = await auth();
  const vendorId = session!.user.vendorId!;

  const items = await prisma.orderItem.findMany({
    where: { vendorId, order: { status: "PAID" } },
    include: { order: true },
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h2 className="text-sm font-semibold">Orders to fulfill ({items.length})</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {item.titleSnapshot} × {item.quantity}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium dark:bg-neutral-900">
                {item.fulfillmentStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Order #{item.orderId.slice(-8).toUpperCase()} ·{" "}
              {formatCents(item.priceSnapshot * item.quantity)} · ship to{" "}
              {item.order.shippingCity}, {item.order.shippingState}
            </p>

            {item.fulfillmentStatus === "UNFULFILLED" ? (
              <form
                action={markOrderItemShipped}
                className="mt-3 flex items-center gap-2"
              >
                <input type="hidden" name="orderItemId" value={item.id} />
                <input
                  name="trackingNumber"
                  placeholder="Tracking number (optional)"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
                <button
                  type="submit"
                  className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-black"
                >
                  Mark shipped
                </button>
              </form>
            ) : (
              <p className="mt-3 text-xs text-neutral-500">
                Shipped{item.trackingNumber ? ` — tracking ${item.trackingNumber}` : ""}
              </p>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No orders yet.</p>
        )}
      </ul>
    </div>
  );
}
