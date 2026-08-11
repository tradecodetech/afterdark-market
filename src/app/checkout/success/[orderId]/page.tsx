import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";

export default async function CheckoutSuccessPage({
  params,
}: PageProps<"/checkout/success/[orderId]">) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Order confirmed</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Order #{order.id.slice(-8).toUpperCase()} — total{" "}
        {formatCents(order.total)}
      </p>
      <p className="mt-4 text-sm text-neutral-500">
        It will ship in plain packaging. Your billing statement will read
        &ldquo;{order.billingDescriptor}&rdquo;.
      </p>
      <Link
        href="/account"
        className="mt-8 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        View your orders
      </Link>
    </div>
  );
}
