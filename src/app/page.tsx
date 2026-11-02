
import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

const goldButton =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f7dba2] via-[#e8bf79] to-[#bd8c49] px-7 py-3 text-sm font-semibold text-[#21160d] shadow-lg shadow-black/30 transition hover:brightness-110";

const outlineButton =
  "inline-flex items-center justify-center rounded-full border border-[#d4ae75]/50 bg-black/30 px-7 py-3 text-sm font-medium text-[#f5e8d4] transition hover:bg-[#d4ae75]/10";

export default async function HomePage() {
  const [categories, featured, creators] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    prisma.creatorProfile.findMany({
      where: {
        isApproved: true,
        ageVerified: true,
        identityVerified: true,
      },
      orderBy: [
        { isAvailable: "desc" },
        { createdAt: "desc" },
      ],
      take: 3,
    }),
  ]);

  return (
    <div className="bg-[#0c090a] text-[#f8f0e7]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[1.5rem] border border-[#c69a62]/60 bg-[#151012] shadow-2xl shadow-black/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_35%,rgba(156,83,70,0.35),transparent_45%),radial-gradient(ellipse_at_45%_90%,rgba(184,126,62,0.20),transparent_48%),linear-gradient(120deg,#0d0a0c,#23161a_65%,#100c0d)]" />

          <div className="relative grid min-h-[490px] items-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-24">
            <div className="max-w-2xl">
              <p className="mb-7 text-xs uppercase tracking-[0.25em] text-[#dfb981]">
                — A new world of discovery
              </p>

              <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Discover talent.
                <span className="mt-2 block text-[#e6c18a]">
                  Shop their world.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#e6d8cc]/80 sm:text-lg">
                Explore an exclusive creator community and discover
                a curated collection of products, experiences,
                and inspiration.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/community/creators" className={goldButton}>
                  Explore creators ↗
                </Link>
                <Link href="/products" className={outlineButton}>
                  Shop the collection
                </Link>
              </div>

              <p className="mt-8 text-xs text-[#d8c7b4]/60">
                18+ community · Product catalog in preview ·
                Secure checkout coming soon
              </p>
            </div>

            <div className="relative hidden min-h-[340px] items-center justify-center lg:flex">
              <div className="absolute h-[310px] w-[310px] rounded-full border border-[#d7aa71]/20" />
              <div className="absolute h-[245px] w-[245px] rounded-full border border-[#d7aa71]/25" />
              <div className="relative text-center">
                <div className="font-serif text-8xl tracking-[0.12em] text-[#e8c18a]">
                  P
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.6em] text-[#d4af79]">
                  PIKABOO
                </p>
                <p className="mt-5 text-xs tracking-[0.2em] text-[#e3d4c5]/50">
                  THE PRIVATE COLLECTION
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#cba36d]">
                The community
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Featured creators
              </h2>
              <p className="mt-3 text-sm text-[#d9c5b5]/70">
                A preview of the Pikaboo creator experience.
              </p>
            </div>

            <Link
              href="/community/creators"
              className="text-sm text-[#e1b982] hover:text-white"
            >
              Explore all ↗
            </Link>
          </div>

          {creators.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/community/creators/${creator.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#6f5140]/60 bg-[#1c1417] transition hover:-translate-y-1 hover:border-[#d4ae75]"
                >
                  <div className="relative h-72 overflow-hidden bg-[linear-gradient(145deg,#443039,#171114)]">
                    {creator.bannerUrl || creator.avatarUrl ? (
                      <img
                        src={creator.bannerUrl || creator.avatarUrl || ""}
                        alt={`${creator.displayName} profile artwork`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-7xl text-[#e6c18a]/60">
                        {creator.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="absolute bottom-4 left-4 rounded-full border border-[#e6c18a]/30 bg-black/70 px-3 py-1 text-xs text-[#f0c98c] backdrop-blur">
                      Creator preview
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-[#f5e6d6]">
                      {creator.displayName}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-[#d9c5b5]/70">
                      {creator.bio || "Discover this creator's profile and community."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#6f5140]/40 pt-4 text-sm">
                      <span className="text-[#e1b982]">
                        View profile
                      </span>
                      <span className="text-[#e1b982]">↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#6f5140]/60 bg-[#1c1417] px-6 py-14 text-center">
              <h3 className="font-serif text-2xl text-[#f0c98c]">
                Something exclusive is coming.
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#d9c5b5]/70">
                We're preparing the Pikaboo creator community.
                Featured profiles will appear here as onboarding
                and verification are completed.
              </p>
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#cba36d]">
                Curated selections
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Shop the collection
              </h2>
              <p className="mt-3 text-sm text-[#d6c3b3]/70">
                Preview products. Inventory and checkout are not yet available.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm text-[#e1b982] hover:text-white"
            >
              View collection ↗
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-[#5d4438] bg-[#21191a] p-2"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#5d4438] bg-[#171113] p-10 text-center text-[#d9c5b5]/70">
              Our collection is being curated. Check back soon.
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="rounded-full border border-[#795b45] px-4 py-2 text-xs text-[#e4cda9] transition hover:border-[#e3bd85] hover:bg-[#d7ad72]/10"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 overflow-hidden rounded-[1.5rem] border border-[#7a583d] bg-[linear-gradient(115deg,#281b1d,#100c0e)] px-6 py-12 sm:px-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#cba36d]">
                Beyond the storefront
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                A more personal experience.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d9c5b5]/75">
                Pikaboo brings discovery, shopping, and community
                together in one destination. Explore our creator
                community while we prepare more experiences for launch.
              </p>
            </div>
            <Link href="/community" className={goldButton}>
              Enter the community ↗
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
