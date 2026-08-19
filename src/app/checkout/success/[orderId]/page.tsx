import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import ButtonLink from "@/components/ui/ButtonLink";

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
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/40">
        ✓
      </div>
      <h1 className="mt-5 font-display text-2xl tracking-tight">Order confirmed</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Order #{order.id.slice(-8).toUpperCase()} — total{" "}
        {formatCents(order.total)}
      </p>
      <p className="mt-4 text-sm text-neutral-500">
        It will ship in plain packaging. Your billing statement will read
        &ldquo;{order.billingDescriptor}&rdquo;.
      </p>
      <ButtonLink href="/account" size="lg" className="mt-8">
        View your orders
      </ButtonLink>
    </div>
  );
}
