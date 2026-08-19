import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 px-6 py-16 text-white shadow-2xl shadow-violet-950/10 sm:px-10 sm:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full pikaboo-gradient" />
            Discreet shopping + private creator community
          </div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            <span className="pikaboo-text-gradient">{SITE_NAME}</span>
            <span className="block text-white">made a little more exciting.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Shop curated adult products from trusted vendors, discover creators, and keep your experience discreet from checkout to community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full pikaboo-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition hover:scale-[1.02]">
              Shop the collection
            </Link>
            <Link href="/community" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
              Explore Community
            </Link>
          </div>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 text-xs text-white/60 sm:text-sm">
            <div><div className="font-semibold text-white">18+</div><div className="mt-1">Age-gated</div></div>
            <div><div className="font-semibold text-white">Discreet</div><div className="mt-1">Packaging & billing</div></div>
            <div><div className="font-semibold text-white">Private</div><div className="mt-1">Creator sessions</div></div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {perks.map((perk) => (
          <Link
            key={perk.title}
            href={perk.href}
            className="pikaboo-card flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
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
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Browse</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Shop by category</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white">View all →</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} className="pikaboo-card rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-sm font-medium backdrop-blur hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-600">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Fresh picks</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">New arrivals</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <div key={product.id} className="pikaboo-card rounded-2xl">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-neutral-200 bg-white/70 p-7 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-9">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Pikaboo Community</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">More than a storefront.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Discover approved creators, send a paid connection request, and continue into private sessions when accepted. The marketplace and community stay connected without sharing one checkout flow.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <Link href="/community" className="rounded-full pikaboo-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/10 transition hover:scale-[1.02]">
              Enter the community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
