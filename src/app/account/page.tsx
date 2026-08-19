import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const STATUS_TONE = {
  PAID: "success",
  PENDING: "neutral",
  FAILED: "danger",
  CANCELLED: "danger",
} as const;

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
      <h1 className="font-display text-2xl tracking-tight">Your orders</h1>
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
            <li key={order.id}>
              <Card className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <Badge tone={STATUS_TONE[order.status as keyof typeof STATUS_TONE] ?? "neutral"}>
                    {order.status}
                  </Badge>
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
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
