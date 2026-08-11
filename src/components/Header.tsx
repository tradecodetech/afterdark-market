import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { SITE_NAME, ROLES } from "@/lib/constants";
import { getCartCount } from "@/lib/cart";

export default async function Header() {
  const session = await auth();
  const cartCount = session?.user ? await getCartCount(session.user.id) : 0;

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/products" className="hover:opacity-70">
            Shop
          </Link>
          {session?.user?.role === ROLES.VENDOR && (
            <Link href="/vendor" className="hover:opacity-70">
              Vendor Dashboard
            </Link>
          )}
          {session?.user?.role === ROLES.ADMIN && (
            <Link href="/admin" className="hover:opacity-70">
              Admin
            </Link>
          )}
          <Link href="/cart" className="hover:opacity-70">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {session?.user ? (
            <>
              <Link href="/account" className="hover:opacity-70">
                Account
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="hover:opacity-70">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/auth/login" className="hover:opacity-70">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
