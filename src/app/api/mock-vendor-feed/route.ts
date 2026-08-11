import { NextResponse } from "next/server";

// Stands in for a real vendor's external product API so the API-based
// vendor-integration path (src/lib/vendors/api-adapter.ts) can be
// exercised end-to-end without real vendor credentials. A real vendor
// would replace vendor.apiBaseUrl with their own feed URL.
export async function GET() {
  const products = [
    {
      externalId: "PULSE-100",
      title: "Pulse Wand — Rechargeable",
      description:
        "Whisper-quiet rechargeable wand with 8 vibration patterns and a body-safe silicone head.",
      price: 4899,
      stock: 40,
      sku: "PULSE-100",
      imageUrl: "/placeholders/pulse-100.svg",
      categorySlug: "wellness",
    },
    {
      externalId: "PULSE-210",
      title: "Aria Couples Ring",
      description:
        "App-controllable couples ring with 6 intensity levels and 90-minute battery life.",
      price: 3299,
      stock: 65,
      sku: "PULSE-210",
      imageUrl: "/placeholders/pulse-210.svg",
      categorySlug: "couples",
    },
    {
      externalId: "PULSE-330",
      title: "Silk Restraint Set",
      description:
        "4-piece adjustable silk restraint kit with quick-release buckles.",
      price: 2799,
      stock: 25,
      sku: "PULSE-330",
      imageUrl: "/placeholders/pulse-330.svg",
      categorySlug: "bondage",
    },
  ];

  return NextResponse.json(products);
}
