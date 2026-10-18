
import Link from "next/link";
import { SITE_NAME, MINIMUM_AGE } from "@/lib/constants";

const footerSections = [
  {
    title: "Customer Care",
    links: [
      { label: "Contact & Support", href: "/contact" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Refunds", href: "/refund-policy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community Guidelines", href: "/community-guidelines" },
      { label: "Explore Creators", href: "/community/creators" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50/60 py-10 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs">
                👀
              </span>
              <span className="font-display text-base tracking-tight">
                {SITE_NAME}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Discreet by default
            </p>

            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Explore an adult-oriented marketplace and creator
              community built around privacy, discovery, and
              responsible participation.
            </p>

            <p className="mt-3 text-xs text-neutral-500">
              Online checkout is temporarily unavailable while
              secure payment processing is being configured.
            </p>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="text-sm font-semibold">
                {section.title}
              </h2>

              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {SITE_NAME}.
            Intended for adults {MINIMUM_AGE} and older.
          </p>
        </div>
      </div>
    </footer>
  );
}
