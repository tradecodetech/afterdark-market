
import Link from "next/link";
import { auth } from "@/lib/auth";

const features = [
  {
    number: "01",
    title: "Discover creators",
    description:
      "Explore creator profiles, discover their stories, and preview the communities taking shape on Pikaboo.",
  },
  {
    number: "02",
    title: "Explore community posts",
    description:
      "Browse available public posts and get a first look at the creator community experience.",
  },
  {
    number: "03",
    title: "A space for connection",
    description:
      "Pikaboo is building a community centered on creativity, conversation, and respectful interaction.",
  },
  {
    number: "04",
    title: "More experiences ahead",
    description:
      "Memberships, creator support, private contact, and live experiences are planned for a future launch phase.",
  },
];

export default async function CommunityPage() {
  const session = await auth();

  const communityHref = session?.user
    ? "/community/creators"
    : "/auth/login?callbackUrl=/community/creators";

  const communityLabel = session?.user
    ? "Discover creators"
    : "Sign in to discover creators";

  return (
    <main className="min-h-screen bg-[#090909] text-[#f6f0e6]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="relative overflow-hidden rounded-3xl border border-[#a98b58]/30 bg-[#11100e] px-7 py-14 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#b9965e]/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c7a76e]">
              The Pikaboo Community
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Discover creators.
              <span className="block text-[#d4b47b]">
                Explore their world.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#c7c1b6]">
              A new destination for creator discovery, creative
              expression, and community connection. Explore
              profiles and public posts as we prepare for
              the next chapter of Pikaboo.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={communityHref}
                className="inline-flex rounded-xl bg-[#c7a76e] px-6 py-3 font-semibold text-[#100d09] transition hover:bg-[#e0c18a]"
              >
                {communityLabel}
              </Link>

              <Link
                href="/products"
                className="inline-flex rounded-xl border border-[#a98b58]/50 px-6 py-3 font-semibold text-[#ead4ad] transition hover:bg-[#a98b58]/10"
              >
                Explore the marketplace
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c7a76e]">
              The Experience
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A community built around creators
            </h2>

            <p className="mt-4 leading-7 text-[#bcb5a9]">
              Discover what is available during preview
              and what we're preparing for the future.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-2xl border border-[#a98b58]/25 bg-[#11100e] p-7"
              >
                <span className="text-sm font-semibold text-[#c7a76e]">
                  {feature.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold text-[#f6f0e6]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#bcb5a9]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-[#a98b58]/30 bg-[#17130e] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c7a76e]">
            Prelaunch Preview
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            We're preparing something special.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c7c1b6]">
            Pikaboo is currently operating in preview mode.
            Creator memberships, tips, gifts, private contact
            requests, live broadcasting, and online checkout
            are not available at this time. No payments are
            collected through these features.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c7c1b6]">
            Public community content is intended to be
            non-explicit and subject to moderation. Additional
            features will be introduced only after the
            necessary technical, payment, and compliance
            requirements are satisfied.
          </p>
        </section>
      </div>
    </main>
  );
}
