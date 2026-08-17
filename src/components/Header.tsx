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

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-black/90">
      {session?.user && !phoneVerified && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <Link href="/auth/verify-phone" className="underline">
            Verify your phone number
          </Link>{" "}
          to finish securing your account.
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/products" className="hover:opacity-70">Shop</Link>
          <Link href="/community" className="hover:opacity-70">Community</Link>
          <Link href="/feed" className="hover:opacity-70">Feed</Link>
          <Link href="/spin" className="hover:opacity-70">Spin & Win</Link>
          {session?.user?.role === ROLES.CREATOR && (
            <Link href="/creator" className="hover:opacity-70">Creator Dashboard</Link>
          )}
          {session?.user?.role === ROLES.VENDOR && (
            <Link href="/vendor" className="hover:opacity-70">Vendor Dashboard</Link>
          )}
          {session?.user?.role === ROLES.ADMIN && (
            <Link href="/admin" className="hover:opacity-70">Admin</Link>
          )}
          <Link href="/cart" className="hover:opacity-70">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {session?.user ? (
            <>
              <Link href="/account" className="hover:opacity-70">Account</Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="hover:opacity-70">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/auth/login" className="hover:opacity-70">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
