import { confirmAgeGate } from "@/lib/actions/age-gate";
import { SITE_NAME, MINIMUM_AGE } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function AgeGate({ redirectTo = "/" }: { redirectTo?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, var(--color-brand-700) 0%, transparent 45%), radial-gradient(circle at 80% 75%, var(--color-accent-600) 0%, transparent 45%)",
        }}
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-950/80 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl">
          👀
        </div>
        <h1 className="mt-4 font-display text-2xl tracking-tight text-white">
          {SITE_NAME}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          This site contains products intended for adults only. You must be{" "}
          {MINIMUM_AGE}+ to enter. Shipping is discreet and billing
          statements never reveal item contents.
        </p>
        <form action={confirmAgeGate} className="mt-7 flex flex-col gap-2.5">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" size="lg" className="w-full">
            I am {MINIMUM_AGE} or older — Enter
          </Button>
          <a
            href="https://www.google.com"
            className="rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-neutral-300 transition hover:bg-white/5"
          >
            Exit
          </a>
        </form>
        <p className="mt-5 text-xs text-neutral-600">
          By entering, you confirm you meet the minimum age in your
          jurisdiction to view adult products.
        </p>
      </div>
    </div>
  );
}
