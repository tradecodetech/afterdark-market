import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your orders</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Signed in as {session.user.email}
      </p>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Order #{order.id.slice(-8).toUpperCase()}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium dark:bg-neutral-900">
                  {order.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                {order.items.length} item(s) · {formatCents(order.total)}
              </p>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.titleSnapshot} × {item.quantity}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {item.fulfillmentStatus}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
