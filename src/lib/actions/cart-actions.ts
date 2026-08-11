"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/products");
  return session.user.id;
}

export async function addToCart(formData: FormData) {
  const userId = await requireUserId();
  const productId = formData.get("productId") as string;
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) return;

  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  revalidatePath("/cart");
}

export async function updateCartItemQuantity(formData: FormData) {
  const userId = await requireUserId();
  const itemId = formData.get("itemId") as string;
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 1));

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item || item.cart.userId !== userId) return;

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const userId = await requireUserId();
  const itemId = formData.get("itemId") as string;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item || item.cart.userId !== userId) return;

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}
