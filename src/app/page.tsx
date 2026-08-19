import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import ButtonLink from "@/components/ui/ButtonLink";
import { SITE_NAME } from "@/lib/constants";

const perks = [
  { emoji: "📦", title: "Discreet shipping", desc: "Plain packaging, neutral billing", href: "/products" },
  { emoji: "🎡", title: "Spin & win", desc: "One free spin a day", href: "/spin" },
  { emoji: "🤝", title: "Group buy deals", desc: "Prices drop as friends join", href: "/products" },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl bg-neutral-950 px-8 py-16 text-white sm:px-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, var(--color-brand-700) 0%, transparent 50%), radial-gradient(circle at 85% 80%, var(--color-accent-600) 0%, transparent 50%)",
          }}
        />
        <div className="relative">
          <h1 className="max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-md text-neutral-300">
            Curated adult products from trusted manufacturers, shipped in
            plain packaging with discreet billing — always.
          </p>
          <ButtonLink href="/products" size="lg" className="mt-7">
            Shop all products
          </ButtonLink>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {perks.map((perk) => (
          <Link
            key={perk.title}
            href={perk.href}
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand-700"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg dark:bg-brand-900/30">
              {perk.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold">{perk.title}</p>
              <p className="text-xs text-neutral-500">{perk.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Shop by category</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-neutral-700 dark:hover:border-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New arrivals</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
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
