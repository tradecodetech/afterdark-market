import Link from "next/link";
import { auth } from "@/lib/auth";

const steps = [
  {
    title: "Browse creators",
    text: "Discover approved adult creators, review their profiles, availability, and connection pricing.",
  },
  {
    title: "Request contact",
    text: "A customer can submit a paid connection request. The creator accepts or declines before a private session is created.",
  },
  {
    title: "Book a private session",
    text: "Accepted requests can lead to a scheduled 1:1 session. Video transport and payment-provider integrations will plug into this state model.",
  },
  {
    title: "Send gifts",
    text: "Customers can send creator gifts during eligible interactions. Earnings are tracked separately from marketplace orders.",
  },
];

export default async function CommunityPage() {
  const session = await auth();
  const communityHref = session?.user ? "/community/creators" : "/auth/login?callbackUrl=/community/creators";
  const communityLabel = session?.user ? "Discover creators" : "Sign in to discover creators";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Pikaboo Community</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Connect with creators. Request private time. Send gifts.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Discover approved creators, send paid connection requests, and continue into scheduled private sessions when accepted.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={communityHref} className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-80 dark:bg-white dark:text-black">
            {communityLabel}
          </Link>
          <Link href="/products" className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900">
            Continue shopping
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
            <div className="text-sm font-semibold text-neutral-400">0{index + 1}</div>
            <h2 className="mt-3 text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{step.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <strong>Community foundation:</strong> creator profiles, contact requests, session records, gifts, and creator earnings now have dedicated database models. Real payment processing, identity/age verification, moderation, payouts, and the video provider remain explicit integration steps before this becomes a live service.
      </section>
    </main>
  );
}
