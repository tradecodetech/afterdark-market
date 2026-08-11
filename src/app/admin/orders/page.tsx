import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { vendor: true } }, user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h2 className="text-sm font-semibold">Orders ({orders.length})</h2>
      <ul className="mt-3 flex flex-col gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                #{order.id.slice(-8).toUpperCase()} — {order.user.email}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium dark:bg-neutral-900">
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {new Date(order.createdAt).toLocaleString()} ·{" "}
              {formatCents(order.total)}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-xs text-neutral-500">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.titleSnapshot} × {item.quantity} — {item.vendor.name} (
                  {item.fulfillmentStatus})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
