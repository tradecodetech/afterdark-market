"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { importProductsFromCsv } from "@/lib/vendors/csv-import";
import { syncVendorFromApi } from "@/lib/vendors/sync";
import { ROLES } from "@/lib/constants";

async function requireVendorId(): Promise<string> {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/vendor");
  if (session.user.role === ROLES.ADMIN) {
    // Admins may not have a vendorId; vendor-scoped actions require one.
    if (!session.user.vendorId) redirect("/admin/vendors");
  }
  if (!session.user.vendorId) redirect("/");
  return session.user.vendorId;
}

export type ActionState = { error?: string; success?: string } | undefined;

export async function createManualProduct(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const vendorId = await requireVendorId();
  const vendor = await prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } });

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const sku = formData.get("sku") as string;
  const imageUrl = (formData.get("imageUrl") as string) || "/placeholders/default.svg";
  const categorySlug = formData.get("categorySlug") as string;

  if (!title || !price || !sku || !categorySlug) {
    return { error: "Please fill in title, price, SKU, and category." };
  }

  const category = await prisma.category.findFirst({ where: { slug: categorySlug } });
  if (!category) return { error: "Unknown category." };

  const priceCents = Math.round(parseFloat(price) * 100);
  if (Number.isNaN(priceCents)) return { error: "Invalid price." };

  await prisma.product.create({
    data: {
      vendorId,
      categoryId: category.id,
      title,
      slug: slugify(`${vendor.slug}-${sku}-${Date.now()}`),
      description: description ?? "",
      price: priceCents,
      stock: Number(stock) || 0,
      sku,
      imageUrl,
      source: "MANUAL",
    },
  });

  revalidatePath("/vendor/products");
  return { success: "Product created." };
}

export async function toggleProductActive(formData: FormData) {
  const vendorId = await requireVendorId();
  const productId = formData.get("productId") as string;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.vendorId !== vendorId) return;

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });
  revalidatePath("/vendor/products");
}

export async function deleteVendorProduct(formData: FormData) {
  const vendorId = await requireVendorId();
  const productId = formData.get("productId") as string;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.vendorId !== vendorId) return;

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/vendor/products");
}

export async function importCsvAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const vendorId = await requireVendorId();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose a CSV file first." };

  const text = await file.text();
  const result = await importProductsFromCsv(vendorId, text);

  revalidatePath("/vendor/products");
  if (result.errors.length > 0) {
    return {
      error: `Imported ${result.count}. Errors: ${result.errors.slice(0, 3).join(" ")}`,
    };
  }
  return { success: `Imported ${result.count} products.` };
}

export async function triggerVendorSync(): Promise<ActionState> {
  const vendorId = await requireVendorId();
  const result = await syncVendorFromApi(vendorId);
  revalidatePath("/vendor/products");
  revalidatePath("/vendor/integrations");
  return result.success
    ? { success: `Synced ${result.itemsSynced} products.` }
    : { error: result.message };
}

export async function markOrderItemShipped(formData: FormData) {
  const vendorId = await requireVendorId();
  const orderItemId = formData.get("orderItemId") as string;
  const trackingNumber = formData.get("trackingNumber") as string;

  const item = await prisma.orderItem.findUnique({ where: { id: orderItemId } });
  if (!item || item.vendorId !== vendorId) return;

  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      fulfillmentStatus: "SHIPPED",
      trackingNumber: trackingNumber || null,
      shippedAt: new Date(),
    },
  });
  revalidatePath("/vendor/orders");
}
