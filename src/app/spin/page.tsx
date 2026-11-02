
import Link from "next/link";

export default function SpinPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-5 py-16 text-[#f6f0e6] sm:py-24">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#a98b58]/30 bg-[#11100e] px-7 py-14 text-center sm:px-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c7a76e]/40 bg-[#c7a76e]/10 text-4xl">
          ✦
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#c7a76e]">
          Pikaboo Rewards
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Something rewarding
          <span className="block text-[#d4b47b]">
            is coming.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#c7c1b6]">
          We're preparing a new rewards experience for the
          Pikaboo community. The spin wheel and promotional
          rewards will become available in a future launch phase.
        </p>

        <div className="mt-8 rounded-2xl border border-[#a98b58]/20 bg-[#19150f] p-5">
          <p className="text-sm leading-7 text-[#c7c1b6]">
            Rewards are not currently being issued or redeemed.
            Online checkout is also unavailable during prelaunch.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-xl bg-[#c7a76e] px-6 py-3 font-semibold text-[#100d09] transition hover:bg-[#e0c18a]"
          >
            Explore products
          </Link>

          <Link
            href="/community"
            className="rounded-xl border border-[#a98b58]/50 px-6 py-3 font-semibold text-[#ead4ad] transition hover:bg-[#a98b58]/10"
          >
            Explore community
          </Link>
        </div>
      </section>
    </main>
  );
}
