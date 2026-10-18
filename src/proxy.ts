
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { ROLES } from "@/lib/constants";

const { auth } = NextAuth(authConfig);

const PUBLIC_PAGES = new Set([
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/shipping",
  "/community-guidelines",
]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isVendorRoute =
    pathname === "/vendor" || pathname.startsWith("/vendor/");

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  // Preserve existing role-based access controls.
  if (isVendorRoute || isAdminRoute) {
    if (!req.auth?.user) {
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && role !== ROLES.ADMIN) {
      return NextResponse.redirect(
        new URL("/", req.nextUrl.origin)
      );
    }

    if (
      isVendorRoute &&
      role !== ROLES.VENDOR &&
      role !== ROLES.ADMIN
    ) {
      return NextResponse.redirect(
        new URL("/", req.nextUrl.origin)
      );
    }
  }

  const normalizedPath =
    pathname.length > 1
      ? pathname.replace(/\/+$/, "")
      : pathname;

  const requestHeaders = new Headers(req.headers);

  // Never trust a client-supplied copy of this header.
  requestHeaders.delete("x-pikaboo-public-page");

  requestHeaders.set(
    "x-pikaboo-public-page",
    PUBLIC_PAGES.has(normalizedPath) ? "1" : "0"
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
