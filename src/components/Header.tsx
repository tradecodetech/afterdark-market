
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { SITE_NAME, ROLES } from "@/lib/constants";
import { getCartCount } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export default async function Header() {
  const session = await auth();

  const cartCount = session?.user
    ? await getCartCount(session.user.id)
    : 0;

  const phoneVerified = session?.user
    ? (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { phoneVerified: true },
        })
      )?.phoneVerified
    : true;

  const navLinks = [
    { href: "/community/creators", label: "Discover" },
    { href: "/products", label: "Shop" },
    { href: "/community", label: "Community" },
    { href: "/feed", label: "Feed" },
    { href: "/spin", label: "Spin & Win" },
    ...(session?.user?.role === ROLES.CREATOR
      ? [{ href: "/creator", label: "Creator Dashboard" }]
      : []),
    ...(session?.user?.role === ROLES.VENDOR
      ? [{ href: "/vendor", label: "Vendor Dashboard" }]
      : []),
    ...(session?.user?.role === ROLES.ADMIN
      ? [{ href: "/admin", label: "Admin" }]
      : []),
  ];

  const linkClass =
    "text-sm font-medium text-[#e9dac8]/80 transition hover:text-[#f0c98c]";

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#c69a62]/30 bg-[#100c0e]/95 text-[#f8f0e7] shadow-xl shadow-black/30 backdrop-blur-xl">
      {session?.user && !phoneVerified && (
        <div className="border-b border-[#c69a62]/30 bg-[#2b2119] px-4 py-2 text-center text-xs text-[#f0c98c]">
          <Link
            href="/auth/verify-phone"
            className="font-semibold underline underline-offset-2"
          >
            Verify your phone number
          </Link>{" "}
          to finish securing your account.
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="font-serif text-2xl tracking-[0.14em] text-[#f0c98c] sm:text-3xl">
            {SITE_NAME.toUpperCase()}
          </span>
          <span className="rounded-md border border-[#d5af79]/60 px-1.5 py-0.5 text-[10px] tracking-wide text-[#f0c98c]">
            18+
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <Link href="/cart" className={linkClass}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d5a765] px-1 text-xs font-semibold text-[#21160d]">
                {cartCount}
              </span>
            )}
          </Link>

          {session?.user ? (
            <>
              <Link href="/account" className={linkClass}>
                Account
              </Link>
              <form action={signOutAction}>
                <button type="submit" className={linkClass}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/register"
              className="rounded-full bg-gradient-to-r from-[#f7dba2] via-[#e8bf79] to-[#bd8c49] px-6 py-2.5 text-sm font-semibold text-[#21160d] transition hover:brightness-110"
            >
              Join Free
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/cart"
            className="relative text-sm text-[#e9dac8]"
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-[#d5a765] px-1.5 py-0.5 text-xs text-[#21160d]">
                {cartCount}
              </span>
            )}
          </Link>

          <details className="group relative">
            <summary
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[#d5af79]/50 text-[#f0c98c] [&::-webkit-details-marker]:hidden"
            >
              <span className="text-xl leading-none">☰</span>
            </summary>

            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-12 z-50 flex w-64 flex-col gap-1 rounded-xl border border-[#c69a62]/40 bg-[#171113] p-3 shadow-2xl shadow-black/60"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-[#e9dac8] hover:bg-[#d5af79]/10 hover:text-[#f0c98c]"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-1 border-t border-[#c69a62]/20" />

              {session?.user ? (
                <>
                  <Link
                    href="/account"
                    className="rounded-lg px-3 py-2.5 text-sm text-[#e9dac8]"
                  >
                    Account
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#e9dac8]"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="rounded-lg bg-[#d5a765] px-3 py-2.5 text-center text-sm font-semibold text-[#21160d]"
                  >
                    Join Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="rounded-lg px-3 py-2.5 text-center text-sm text-[#e9dac8]"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
