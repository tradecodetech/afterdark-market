"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenSession } from "@/lib/group-buy";
import { getOrCreateCart } from "@/lib/cart";

export type JoinGroupBuyState =
  | { error?: string; joined?: number; target?: number; completed?: boolean }
  | undefined;

export async function joinGroupBuy(
  _prevState: JoinGroupBuyState,
  formData: FormData,
): Promise<JoinGroupBuyState> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = session.user.id;

  const productId = formData.get("productId") as string;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (
    !product ||
    !product.groupBuyEnabled ||
    !product.groupBuyTarget ||
    !product.groupBuyPrice
  ) {
    return { error: "Group buy is not available for this product." };
  }

  let groupSession = await getOpenSession(productId);
  if (!groupSession) {
    groupSession = await prisma.groupBuySession.create({
      data: {
        productId,
        targetCount: product.groupBuyTarget,
        expiresAt: new Date(Date.now() + product.groupBuyWindowHours * 60 * 60 * 1000),
      },
      include: { _count: { select: { participants: true } } },
    });
  }

  await prisma.groupBuyParticipant.upsert({
    where: { sessionId_userId: { sessionId: groupSession.id, userId } },
    create: { sessionId: groupSession.id, userId },
    update: {},
  });

  const participantCount = await prisma.groupBuyParticipant.count({
    where: { sessionId: groupSession.id },
  });

  let completed = false;
  if (participantCount >= groupSession.targetCount) {
    completed = true;
    const participants = await prisma.groupBuyParticipant.findMany({
      where: { sessionId: groupSession.id },
    });

    // Make sure every participant has a cart row before the atomic step —
    // getOrCreateCart does its own read/create, so it can't be part of the
    // $transaction array (that array must hold un-awaited PrismaPromises).
    const carts = await Promise.all(participants.map((p) => getOrCreateCart(p.userId)));

    await prisma.$transaction([
      prisma.groupBuySession.update({
        where: { id: groupSession.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
      ...participants.map((p, i) =>
        prisma.cartItem.upsert({
          where: { cartId_productId: { cartId: carts[i].id, productId } },
          create: {
            cartId: carts[i].id,
            productId,
            quantity: 1,
            unitPriceOverride: product.groupBuyPrice,
            groupBuySessionId: groupSession.id,
          },
          update: {
            unitPriceOverride: product.groupBuyPrice,
            groupBuySessionId: groupSession.id,
          },
        }),
      ),
    ]);
  }

  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/cart");

  return { joined: participantCount, target: groupSession.targetCount, completed };
}
