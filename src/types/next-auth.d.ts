import type { Role } from "@/lib/constants";
import type { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: Role;
    vendorId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      vendorId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    vendorId?: string | null;
  }
}
