import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

async function upsertCategory(name: string, slug: string) {
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
}

async function upsertUser(opts: {
  name: string;
  email: string;
  password: string;
  role: string;
  vendorId?: string;
}) {
  const passwordHash = await bcrypt.hash(opts.password, 12);
  return prisma.user.upsert({
    where: { email: opts.email },
    update: {},
    create: {
      name: opts.name,
      email: opts.email,
      passwordHash,
      role: opts.role,
      vendorId: opts.vendorId,
      dateOfBirth: new Date("1990-01-01"),
      ageVerified: true,
    },
  });
}

async function main() {
  const wellness = await upsertCategory("Wellness", "wellness");
  const couples = await upsertCategory("Couples", "couples");
  const bondage = await upsertCategory("Bondage & Restraint", "bondage");
  const apparel = await upsertCategory("Apparel", "apparel");
  const accessories = await upsertCategory("Accessories", "accessories");

  await upsertUser({
    name: "Admin",
    email: "admin@pikaboo.app",
    password: "Admin123!",
    role: "ADMIN",
  });

  await upsertUser({
    name: "Demo Customer",
    email: "customer@pikaboo.app",
    password: "Customer123!",
    role: "CUSTOMER",
  });

  // --- Manual vendor -----------------------------------------------------
  const velvet = await prisma.vendor.upsert({
    where: { slug: "velvet-manufacturing" },
    update: {},
    create: {
      name: "Velvet Manufacturing",
      slug: "velvet-manufacturing",
      contactEmail: "orders@velvetmfg.example",
      integrationType: "MANUAL",
      discreetLabel: "VM Home Goods",
    },
  });
  await upsertUser({
    name: "Velvet Manufacturing (vendor)",
    email: "velvet@pikaboo.app",
    password: "Vendor123!",
    role: "VENDOR",
    vendorId: velvet.id,
  });

  const velvetProducts = [
    {
      title: "Velvet Touch Massager",
      slug: "velvet-touch-massager",
      description: "Ergonomic full-body massager with 10 speed settings and a soft-touch finish.",
      price: 3999,
      stock: 50,
      sku: "VM-001",
      categoryId: wellness.id,
      imageUrl: "/placeholders/velvet-touch-massager.svg",
    },
    {
      title: "Midnight Bullet Vibe",
      slug: "midnight-bullet-vibe",
      description: "Compact, travel-friendly bullet vibe with quiet motor and USB charging.",
      price: 2499,
      stock: 80,
      sku: "VM-002",
      categoryId: wellness.id,
      imageUrl: "/placeholders/midnight-bullet-vibe.svg",
      groupBuyEnabled: true,
      groupBuyTarget: 3,
      groupBuyPrice: 1299,
    },
    {
      title: "Lace Bodysuit",
      slug: "lace-bodysuit",
      description: "Soft stretch-lace bodysuit, available in one size fits most.",
      price: 3499,
      stock: 30,
      sku: "VM-003",
      categoryId: apparel.id,
      imageUrl: "/placeholders/lace-bodysuit.svg",
    },
    {
      title: "Satin Blindfold",
      slug: "satin-blindfold",
      description: "Adjustable satin blindfold with a padded, light-blocking interior.",
      price: 1499,
      stock: 100,
      sku: "VM-004",
      categoryId: accessories.id,
      imageUrl: "/placeholders/satin-blindfold.svg",
    },
    {
      title: "Duo Pleasure Set",
      slug: "duo-pleasure-set",
      description: "Two-piece couples set designed for simultaneous use, whisper-quiet motors.",
      price: 5999,
      stock: 20,
      sku: "VM-005",
      categoryId: couples.id,
      imageUrl: "/placeholders/duo-pleasure-set.svg",
      groupBuyEnabled: true,
      groupBuyTarget: 2,
      groupBuyPrice: 4499,
    },
    {
      title: "Leather Cuffs",
      slug: "leather-cuffs",
      description: "Vegan-leather cuffs with quick-release buckles and soft lining.",
      price: 2999,
      stock: 40,
      sku: "VM-006",
      categoryId: bondage.id,
      imageUrl: "/placeholders/leather-cuffs.svg",
    },
  ];

  for (const product of velvetProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, vendorId: velvet.id, source: "MANUAL" },
    });
  }

  // --- API-integrated vendor ----------------------------------------------
  const pulse = await prisma.vendor.upsert({
    where: { slug: "pulse-novelties" },
    update: {},
    create: {
      name: "Pulse Novelties",
      slug: "pulse-novelties",
      contactEmail: "api@pulsenovelties.example",
      integrationType: "API",
      discreetLabel: "PN Distribution",
      apiBaseUrl: `${APP_URL}/api/mock-vendor-feed`,
    },
  });
  await upsertUser({
    name: "Pulse Novelties (vendor)",
    email: "pulse@pikaboo.app",
    password: "Vendor123!",
    role: "VENDOR",
    vendorId: pulse.id,
  });

  // Pre-seed the same items the mock feed serves, so the catalog isn't
  // empty before the dev server is running and a real sync can happen.
  // Once the app is running, use "Sync now" on /vendor/integrations (or
  // /admin) to pull this vendor's feed live via ApiVendorAdapter.
  const pulseFeedProducts = [
    {
      externalId: "PULSE-100",
      title: "Pulse Wand — Rechargeable",
      description: "Whisper-quiet rechargeable wand with 8 vibration patterns and a body-safe silicone head.",
      price: 4899,
      stock: 40,
      sku: "PULSE-100",
      categoryId: wellness.id,
      imageUrl: "/placeholders/pulse-100.svg",
    },
    {
      externalId: "PULSE-210",
      title: "Aria Couples Ring",
      description: "App-controllable couples ring with 6 intensity levels and 90-minute battery life.",
      price: 3299,
      stock: 65,
      sku: "PULSE-210",
      categoryId: couples.id,
      imageUrl: "/placeholders/pulse-210.svg",
    },
    {
      externalId: "PULSE-330",
      title: "Silk Restraint Set",
      description: "4-piece adjustable silk restraint kit with quick-release buckles.",
      price: 2799,
      stock: 25,
      sku: "PULSE-330",
      categoryId: bondage.id,
      imageUrl: "/placeholders/pulse-330.svg",
    },
  ];

  for (const product of pulseFeedProducts) {
    const slug = `pulse-novelties-${product.externalId}`.toLowerCase();
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        ...product,
        slug,
        vendorId: pulse.id,
        source: "API",
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin:    admin@pikaboo.app / Admin123!");
  console.log("Customer: customer@pikaboo.app / Customer123!");
  console.log("Vendor (manual): velvet@pikaboo.app / Vendor123!");
  console.log("Vendor (API):    pulse@pikaboo.app / Vendor123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
