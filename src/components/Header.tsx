import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { SITE_NAME, ROLES } from "@/lib/constants";
import { getCartCount } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export default async function Header() {
  const session = await auth();
  const cartCount = session?.user ? await getCartCount(session.user.id) : 0;
  const phoneVerified = session?.user
    ? (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { phoneVerified: true },
        })
      )?.phoneVerified
    : true;

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/feed", label: "Feed" },
    { href: "/spin", label: "Spin & Win" },
    ...(session?.user?.role === ROLES.VENDOR
      ? [{ href: "/vendor", label: "Vendor Dashboard" }]
      : []),
    ...(session?.user?.role === ROLES.ADMIN ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const linkClass =
    "text-sm font-medium text-neutral-600 transition hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/85">
      {session?.user && !phoneVerified && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
          <Link href="/auth/verify-phone" className="underline underline-offset-2">
            Verify your phone number
          </Link>{" "}
          to finish securing your account.
        </div>
      )}

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm">
            👀
          </span>
          <span className="font-display text-lg tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/cart" className={`${linkClass} relative`}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {session?.user ? (
            <>
              <Link href="/account" className={linkClass}>
                Account
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className={linkClass}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile: cart + CSS-only hamburger toggle, no client JS needed */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/cart" className="relative text-sm font-medium">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <label
            htmlFor="mobile-nav-toggle"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700"
            aria-label="Open menu"
          >
            ☰
          </label>
        </div>
      </div>

      <input type="checkbox" id="mobile-nav-toggle" className="peer hidden" />
      <nav className="hidden flex-col gap-1 border-t border-neutral-200 px-4 py-3 peer-checked:flex dark:border-neutral-800 md:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-lg px-2 py-2.5 text-sm font-medium">
            {link.label}
          </Link>
        ))}
        {session?.user ? (
          <>
            <Link href="/account" className="rounded-lg px-2 py-2.5 text-sm font-medium">
              Account
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="w-full rounded-lg px-2 py-2.5 text-left text-sm font-medium">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link href="/auth/login" className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-600 dark:text-brand-400">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
