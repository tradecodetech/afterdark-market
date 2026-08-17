// Normalized product shape every vendor adapter must produce, regardless
// of what the vendor's own feed/API looks like.
export type VendorProductInput = {
  externalId: string;
  title: string;
  description: string;
  price: number; // cents
  stock: number;
  sku: string;
  imageUrl: string;
  categorySlug: string;
};

export const VENDOR_FEED_FIELDS = [
  "externalId",
  "title",
  "description",
  "price",
  "stock",
  "sku",
  "imageUrl",
  "categorySlug",
] as const satisfies readonly (keyof VendorProductInput)[];

export interface VendorAdapter {
  fetchProducts(vendor: {
    id: string;
    apiBaseUrl: string | null;
    apiKey: string | null;
    fieldMapping: string | null;
  }): Promise<VendorProductInput[]>;
}
