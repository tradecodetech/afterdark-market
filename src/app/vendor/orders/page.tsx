import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import { markOrderItemShipped } from "@/lib/actions/vendor-actions";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { fieldClass } from "@/components/ui/field";

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
          <li key={item.id}>
            <Card className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {item.titleSnapshot} × {item.quantity}
                </span>
                <Badge tone={item.fulfillmentStatus === "UNFULFILLED" ? "neutral" : "success"}>
                  {item.fulfillmentStatus}
                </Badge>
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
                    className={fieldClass("py-1.5")}
                  />
                  <Button type="submit" size="sm">
                    Mark shipped
                  </Button>
                </form>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">
                  Shipped{item.trackingNumber ? ` — tracking ${item.trackingNumber}` : ""}
                </p>
              )}
            </Card>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No orders yet.</p>
        )}
      </ul>
    </div>
  );
}
