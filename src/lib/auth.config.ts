import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/lib/constants";

// Edge-safe config shared between middleware (Edge runtime) and the full
// auth.ts (Node runtime, used in route handlers/server components). Must
// not import prisma or bcrypt here — those only work in Node runtime.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role as Role;
        token.vendorId = (user as { vendorId?: string | null }).vendorId ?? null;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.vendorId = (token.vendorId as string | null) ?? null;
      }
      return session;
    },
  },
};
