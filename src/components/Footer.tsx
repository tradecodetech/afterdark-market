
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
    <footer className="border-t border-[#c69a62]/30 bg-[#100c0e] text-[#f8f0e7]">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-serif text-3xl tracking-[0.14em] text-[#f0c98c]">
                {SITE_NAME.toUpperCase()}
              </span>
              <span className="rounded-md border border-[#d5af79]/60 px-1.5 py-0.5 text-[10px] text-[#f0c98c]">
                18+
              </span>
            </Link>

            <p className="mt-5 font-serif text-lg text-[#f2dfc4]">
              Discover a world of possibilities.
            </p>

            <p className="mt-3 text-sm leading-7 text-[#d9c5b5]/70">
              An adult-oriented marketplace and creator community
              designed around discovery, privacy, and responsible
              participation.
            </p>

            <div className="mt-6 space-y-2 text-sm text-[#d9c5b5]/80">
              <p>
                Operated by{" "}
                <span className="font-semibold text-[#f0c98c]">
                  Velvet Vault
                </span>
              </p>

              <p>
                <a
                  href="mailto:info@pikabooxo.com"
                  className="transition hover:text-[#f0c98c]"
                >
                  info@pikabooxo.com
                </a>
              </p>

              <p>
                <a
                  href="tel:+18066427818"
                  className="transition hover:text-[#f0c98c]"
                >
                  806-642-7818
                </a>
              </p>
            </div>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="font-serif text-lg text-[#f0c98c]">
                {section.title}
              </h2>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#d9c5b5]/70 transition hover:text-[#f0c98c]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-[#c69a62]/20 bg-[#201719]/60 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-6 text-[#d9c5b5]/75">
              Product listings are currently previews. Online
              checkout is temporarily unavailable while secure
              payment processing is being configured.
            </p>

            <span className="rounded-full border border-[#c69a62]/40 px-3 py-1 text-xs text-[#f0c98c]">
              Prelaunch
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-[#c69a62]/25 pt-6 text-xs text-[#d9c5b5]/50 sm:flex-row">
          <p>
            {"\u00A9"} {new Date().getFullYear()} {SITE_NAME}.
            Operated by Velvet Vault.
          </p>

          <p>
            Intended for adults {MINIMUM_AGE} and older.
          </p>
        </div>
      </div>
    </footer>
  );
}
