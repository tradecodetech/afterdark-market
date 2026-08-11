import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { ROLES } from "@/lib/constants";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isVendorRoute = pathname.startsWith("/vendor");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isVendorRoute && !isAdminRoute) return NextResponse.next();

  if (!req.auth?.user) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isVendorRoute && role !== ROLES.VENDOR && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};
