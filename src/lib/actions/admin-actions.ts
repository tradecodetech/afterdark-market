"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { ROLES, VENDOR_INTEGRATION } from "@/lib/constants";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    redirect("/");
  }
}

export type ActionState = { error?: string; success?: string } | undefined;

export async function createVendor(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const integrationType = formData.get("integrationType") as string;
  const discreetLabel = (formData.get("discreetLabel") as string) || "Plain Box Co.";
  const apiBaseUrl = (formData.get("apiBaseUrl") as string) || null;
  const apiKey = (formData.get("apiKey") as string) || null;
  const loginEmail = formData.get("loginEmail") as string;
  const loginPassword = formData.get("loginPassword") as string;

  if (!name || !contactEmail) {
    return { error: "Vendor name and contact email are required." };
  }
  if (integrationType === VENDOR_INTEGRATION.API && !apiBaseUrl) {
    return { error: "API-integrated vendors need a feed URL." };
  }

  const vendor = await prisma.vendor.create({
    data: {
      name,
      slug: slugify(`${name}-${Date.now()}`),
      contactEmail,
      integrationType,
      discreetLabel,
      apiBaseUrl,
      apiKey,
    },
  });

  if (loginEmail && loginPassword) {
    const existing = await prisma.user.findUnique({ where: { email: loginEmail } });
    if (existing) {
      return { error: "Vendor created, but that login email is already taken." };
    }
    const passwordHash = await bcrypt.hash(loginPassword, 12);
    await prisma.user.create({
      data: {
        name: `${name} (vendor)`,
        email: loginEmail,
        passwordHash,
        role: ROLES.VENDOR,
        vendorId: vendor.id,
        dateOfBirth: new Date("1990-01-01"),
        ageVerified: true,
      },
    });
  }

  revalidatePath("/admin/vendors");
  return { success: `Vendor "${name}" created.` };
}

export async function toggleVendorApproved(formData: FormData) {
  await requireAdmin();
  const vendorId = formData.get("vendorId") as string;
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) return;
  await prisma.vendor.update({
    where: { id: vendorId },
    data: { approved: !vendor.approved },
  });
  revalidatePath("/admin/vendors");
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const name = formData.get("name") as string;
  if (!name) return { error: "Category name is required." };

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "A category with that name already exists." };

  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: `Category "${name}" created.` };
}

export async function adminToggleProductActive(formData: FormData) {
  await requireAdmin();
  const productId = formData.get("productId") as string;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return;
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });
  revalidatePath("/admin/products");
}
