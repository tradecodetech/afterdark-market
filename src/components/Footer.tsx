import { SITE_NAME, MINIMUM_AGE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50/60 py-10 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs">
            👀
          </span>
          <span className="font-display text-base tracking-tight">{SITE_NAME}</span>
        </div>
        <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Discreet by default
        </p>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Every order ships in plain, unmarked packaging with a neutral
          return address, and billing statements never mention item
          contents.
        </p>
        <p className="mt-6 text-xs text-neutral-400">
          © {new Date().getFullYear()} {SITE_NAME}. All products restricted
          to customers {MINIMUM_AGE}+.
        </p>
      </div>
    </footer>
  );
}
