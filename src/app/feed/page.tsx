import { getProducts } from "@/lib/catalog";
import FeedClient from "./FeedClient";

export default async function FeedPage() {
  const products = await getProducts();

  return (
    <FeedClient
      products={products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        vendorName: p.vendor.name,
        categoryName: p.category.name,
        stock: p.stock,
      }))}
    />
  );
}
