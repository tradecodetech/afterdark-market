import { prisma } from "@/lib/prisma";

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (existing) return existing;

  return prisma.cart.create({
    data: { userId },
    include: { items: { include: { product: true } } },
  });
}

export async function getCartCount(userId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
