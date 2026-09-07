"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { syncVendorFromApi } from "@/lib/vendors/sync";
import { VENDOR_FEED_FIELDS } from "@/lib/vendors/types";
import { ROLES, VENDOR_INTEGRATION } from "@/lib/constants";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    redirect("/");
  }
  return session.user;
}

export type ActionState = { error?: string; success?: string } | undefined;

export async function createAdminUser(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? ROLES.CUSTOMER);
  const ageVerified = formData.get("ageVerified") === "on";

  if (!name || !email || password.length < 8) {
    redirect("/admin/users?error=Name%2C+email%2C+and+a+password+of+at+least+8+characters+are+required.");
  }
  if (![ROLES.CUSTOMER, ROLES.CREATOR, ROLES.ADMIN].includes(role as typeof ROLES.CUSTOMER)) {
    redirect("/admin/users?error=Invalid+user+role.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/admin/users?error=That+email+is+already+in+use.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      dateOfBirth: new Date("1990-01-01"),
      ageVerified,
      phoneVerified: true,
    },
  });

  if (role === ROLES.CREATOR) {
    const contactFee = Math.max(0, Math.round(Number(formData.get("contactFee") ?? 10) * 100));
    const sessionRate = Math.max(0, Math.round(Number(formData.get("sessionRate") ?? 50) * 100));
    await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        displayName: name,
        bio: "Creator profile created by Pikaboo admin.",
        contactFee,
        sessionRate,
        isAvailable: true,
        isApproved: true,
        identityVerified: ageVerified,
        ageVerified,
      },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/community/creators");
  redirect("/admin/users?success=User+created.");
}

export async function deleteAdminUser(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) redirect("/admin/users?error=Missing+user+ID.");
  if (userId === admin.id) redirect("/admin/users?error=You+cannot+delete+your+own+admin+account.");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { orders: true } } },
  });
  if (!user) redirect("/admin/users?error=User+not+found.");
  if (user._count.orders > 0) {
    redirect("/admin/users?error=This+user+has+existing+orders+and+cannot+be+deleted.+Disable+or+anonymize+them+instead.");
  }

  if (user.role === ROLES.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: ROLES.ADMIN } });
    if (adminCount <= 1) redirect("/admin/users?error=The+last+admin+account+cannot+be+deleted.");
  }

  await prisma.$transaction([
    prisma.creatorEarning.deleteMany({ where: { creatorId: userId } }),
    prisma.gift.deleteMany({ where: { OR: [{ senderId: userId }, { recipientId: userId }] } }),
    prisma.videoSession.deleteMany({ where: { OR: [{ customerId: userId }, { creatorId: userId }] } }),
    prisma.contactRequest.deleteMany({ where: { OR: [{ requesterId: userId }, { creatorId: userId }] } }),
    prisma.creatorProfile.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath("/community/creators");
  redirect("/admin/users?success=User+removed.");
}

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

export async function updateVendor(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const vendorId = formData.get("vendorId") as string;
  const name = formData.get("name") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const integrationType = formData.get("integrationType") as string;
  const discreetLabel = (formData.get("discreetLabel") as string) || "Plain Box Co.";
  const apiBaseUrl = (formData.get("apiBaseUrl") as string) || null;
  const apiKey = (formData.get("apiKey") as string) || null;

  if (!vendorId || !name || !contactEmail) {
    return { error: "Vendor name and contact email are required." };
  }
  if (integrationType === VENDOR_INTEGRATION.API && !apiBaseUrl) {
    return { error: "API-integrated vendors need a feed URL." };
  }

  const mapping: Record<string, string> = {};
  for (const field of VENDOR_FEED_FIELDS) {
    const value = (formData.get(`map_${field}`) as string)?.trim();
    if (value && value !== field) mapping[field] = value;
  }
  const fieldMapping = Object.keys(mapping).length > 0 ? JSON.stringify(mapping) : null;

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      name,
      contactEmail,
      integrationType,
      discreetLabel,
      apiBaseUrl: integrationType === VENDOR_INTEGRATION.API ? apiBaseUrl : null,
      apiKey: integrationType === VENDOR_INTEGRATION.API ? apiKey : null,
      fieldMapping: integrationType === VENDOR_INTEGRATION.API ? fieldMapping : null,
    },
  });

  revalidatePath(`/admin/vendors/${vendorId}`);
  revalidatePath("/admin/vendors");
  return { success: "Vendor updated." };
}

export async function adminTriggerSync(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const vendorId = formData.get("vendorId") as string;

  const result = await syncVendorFromApi(vendorId);

  revalidatePath(`/admin/vendors/${vendorId}`);
  return result.success
    ? { success: `Synced ${result.itemsSynced} products.` }
    : { error: result.message };
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
