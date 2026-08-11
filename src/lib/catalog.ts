import { prisma } from "@/lib/prisma";

export function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
}

export function getProducts(options?: { categorySlug?: string; search?: string }) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: options?.categorySlug
        ? { slug: options.categorySlug }
        : undefined,
      title: options?.search
        ? { contains: options.search }
        : undefined,
    },
    include: { category: true, vendor: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, vendor: true },
  });
}

export function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, vendor: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
