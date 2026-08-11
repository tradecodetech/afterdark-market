import { SITE_NAME, MINIMUM_AGE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 py-8 text-sm text-neutral-500 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-medium text-neutral-700 dark:text-neutral-300">
          Discreet by default
        </p>
        <p className="mt-1 max-w-2xl">
          Every order ships in plain, unmarked packaging with a neutral
          return address, and billing statements never mention item
          contents.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} {SITE_NAME}. All products restricted
          to customers {MINIMUM_AGE}+.
        </p>
      </div>
    </footer>
  );
}
