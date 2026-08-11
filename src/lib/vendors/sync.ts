import { prisma } from "@/lib/prisma";
import { ApiVendorAdapter } from "@/lib/vendors/api-adapter";
import { slugify } from "@/lib/slugify";

export async function syncVendorFromApi(vendorId: string) {
  const vendor = await prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } });

  const log = await prisma.vendorSyncLog.create({
    data: { vendorId, status: "RUNNING" },
  });

  try {
    const adapter = new ApiVendorAdapter();
    const products = await adapter.fetchProducts(vendor);

    let count = 0;
    for (const item of products) {
      const category = await prisma.category.findFirst({
        where: { slug: item.categorySlug },
      });
      if (!category) continue;

      const slug = slugify(`${vendor.slug}-${item.externalId}`);

      await prisma.product.upsert({
        where: { slug },
        create: {
          vendorId: vendor.id,
          categoryId: category.id,
          title: item.title,
          slug,
          description: item.description,
          price: item.price,
          sku: item.sku,
          stock: item.stock,
          imageUrl: item.imageUrl,
          source: "API",
          externalId: item.externalId,
        },
        update: {
          title: item.title,
          description: item.description,
          price: item.price,
          stock: item.stock,
          imageUrl: item.imageUrl,
        },
      });
      count += 1;
    }

    await prisma.vendorSyncLog.update({
      where: { id: log.id },
      data: { status: "SUCCESS", itemsSynced: count, finishedAt: new Date() },
    });

    return { success: true, itemsSynced: count };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await prisma.vendorSyncLog.update({
      where: { id: log.id },
      data: { status: "ERROR", errorMessage: message, finishedAt: new Date() },
    });
    return { success: false, message };
  }
}
