import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { SITE_NAME } from "@/lib/constants";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-neutral-950 px-8 py-14 text-white">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {SITE_NAME}
        </h1>
        <p className="mt-3 max-w-md text-neutral-300">
          Curated adult products from trusted manufacturers, shipped in
          plain packaging with discreet billing — always.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-neutral-200"
        >
          Shop all products
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Shop by category</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New arrivals</h2>
          <Link href="/products" className="text-sm underline">
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
