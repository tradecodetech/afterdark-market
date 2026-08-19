import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, search }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl tracking-tight">Shop</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !categorySlug
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-neutral-300 hover:border-brand-400 dark:border-neutral-700"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              categorySlug === category.slug
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-neutral-300 hover:border-brand-400 dark:border-neutral-700"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-500">
          No products found in this category yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
