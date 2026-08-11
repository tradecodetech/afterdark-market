import { confirmAgeGate } from "@/lib/actions/age-gate";
import { SITE_NAME, MINIMUM_AGE } from "@/lib/constants";

export default function AgeGate({ redirectTo = "/" }: { redirectTo?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center shadow-xl">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          {SITE_NAME}
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          This site contains products intended for adults only. You must be
          {" "}
          {MINIMUM_AGE}+ to enter. Shipping is discreet and billing
          statements never reveal item contents.
        </p>
        <form action={confirmAgeGate} className="mt-6 flex flex-col gap-2">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            I am {MINIMUM_AGE} or older — Enter
          </button>
          <a
            href="https://www.google.com"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900"
          >
            Exit
          </a>
        </form>
        <p className="mt-4 text-xs text-neutral-600">
          By entering, you confirm you meet the minimum age in your
          jurisdiction to view adult products.
        </p>
      </div>
    </div>
  );
}
