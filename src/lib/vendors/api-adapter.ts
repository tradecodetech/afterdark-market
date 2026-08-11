import type { VendorAdapter, VendorProductInput } from "@/lib/vendors/types";

const NORMALIZED_FIELDS: (keyof VendorProductInput)[] = [
  "externalId",
  "title",
  "description",
  "price",
  "stock",
  "sku",
  "imageUrl",
  "categorySlug",
];

// Generic adapter for vendors that expose a JSON product feed. Vendors
// rarely use our exact field names, so `fieldMapping` on the Vendor record
// (JSON string) remaps { ourField: "theirJsonKey" }. Unmapped fields fall
// back to same-name lookup.
export class ApiVendorAdapter implements VendorAdapter {
  async fetchProducts(vendor: {
    id: string;
    apiBaseUrl: string | null;
    apiKey: string | null;
    fieldMapping: string | null;
  }): Promise<VendorProductInput[]> {
    if (!vendor.apiBaseUrl) {
      throw new Error("Vendor has no apiBaseUrl configured.");
    }

    const mapping: Record<string, string> = vendor.fieldMapping
      ? JSON.parse(vendor.fieldMapping)
      : {};

    const res = await fetch(vendor.apiBaseUrl, {
      headers: vendor.apiKey ? { Authorization: `Bearer ${vendor.apiKey}` } : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Vendor feed request failed: ${res.status}`);
    }

    const raw = (await res.json()) as Record<string, unknown>[];

    return raw.map((entry) => {
      const product = {} as VendorProductInput;
      for (const field of NORMALIZED_FIELDS) {
        const sourceKey = mapping[field] ?? field;
        (product[field] as unknown) = entry[sourceKey];
      }
      product.price = Number(product.price);
      product.stock = Number(product.stock);
      product.externalId = String(product.externalId);
      return product;
    });
  }
}
