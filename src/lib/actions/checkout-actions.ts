"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { ORDER_STATUS } from "@/lib/constants";

const FLAT_SHIPPING_CENTS = 599;

export type CheckoutState = { error?: string } | undefined;

export async function placeOrder(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/checkout");
  const userId = session.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: { include: { vendor: true } } } } },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      return { error: `${item.product.title} only has ${item.product.stock} in stock.` };
    }
  }

  const shippingLine1 = formData.get("shippingLine1") as string;
  const shippingLine2 = (formData.get("shippingLine2") as string) || null;
  const shippingCity = formData.get("shippingCity") as string;
  const shippingState = formData.get("shippingState") as string;
  const shippingPostal = formData.get("shippingPostal") as string;
  const cardNumber = formData.get("cardNumber") as string;
  const cardExpiry = formData.get("cardExpiry") as string;
  const cardCvc = formData.get("cardCvc") as string;
  const rewardId = (formData.get("rewardId") as string) || null;

  if (!shippingLine1 || !shippingCity || !shippingState || !shippingPostal) {
    return { error: "Please complete your shipping address." };
  }
  if (!cardNumber || !cardExpiry || !cardCvc) {
    return { error: "Please complete your payment details." };
  }

  const unitPrice = (item: (typeof cart.items)[number]) =>
    item.unitPriceOverride ?? item.product.price;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0,
  );
  const shippingTotal = FLAT_SHIPPING_CENTS;

  let reward: Awaited<ReturnType<typeof prisma.reward.findUnique>> = null;
  let discountTotal = 0;
  if (rewardId) {
    reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (
      !reward ||
      reward.userId !== userId ||
      reward.redeemed ||
      reward.expiresAt < new Date() ||
      reward.kind === "NONE"
    ) {
      return { error: "That reward is no longer valid." };
    }
    discountTotal =
      reward.kind === "PERCENT_OFF"
        ? Math.round((subtotal * reward.value) / 100)
        : reward.kind === "FREE_SHIPPING"
          ? shippingTotal
          : 0;
  }

  const total = subtotal + shippingTotal - discountTotal;

  // Discreet, generic statement descriptor — never reveals product contents.
  const billingDescriptor = "PKB* RETAIL";

  const order = await prisma.order.create({
    data: {
      userId,
      status: ORDER_STATUS.PENDING,
      subtotal,
      discountTotal,
      appliedRewardId: reward?.id,
      shippingTotal,
      total,
      shippingLine1,
      shippingLine2,
      shippingCity,
      shippingState,
      shippingPostal,
      billingDescriptor,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          vendorId: item.product.vendorId,
          titleSnapshot: item.product.title,
          priceSnapshot: unitPrice(item),
          quantity: item.quantity,
        })),
      },
    },
  });

  const provider = getPaymentProvider();
  const result = await provider.charge({
    orderId: order.id,
    amountCents: total,
    cardNumber,
    cardExpiry,
    cardCvc,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: provider.name,
      providerRef: result.providerRef,
      status: result.status,
      amount: total,
    },
  });

  if (!result.success) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: ORDER_STATUS.FAILED },
    });
    return { error: result.message ?? "Payment failed. Please try again." };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: ORDER_STATUS.PAID },
    }),
    ...cart.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }),
    ),
    prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ...(reward
      ? [
          prisma.reward.update({
            where: { id: reward.id },
            data: { redeemed: true, redeemedAt: new Date() },
          }),
        ]
      : []),
  ]);

  redirect(`/checkout/success/${order.id}`);
}
