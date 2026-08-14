import { prisma } from "@/lib/prisma";

// Lazily expires stale OPEN sessions (no cron needed — checked whenever a
// session is read or joined) and returns the current OPEN session for a
// product, if any.
export async function getOpenSession(productId: string) {
  const session = await prisma.groupBuySession.findFirst({
    where: { productId, status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participants: true } } },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.groupBuySession.update({
      where: { id: session.id },
      data: { status: "EXPIRED" },
    });
    return null;
  }

  return session;
}
