import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.vendorId) redirect("/");

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.vendorId },
  });
  if (!vendor) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{vendor.name}</h1>
      <p className="text-sm text-neutral-500">Vendor dashboard</p>
      <nav className="mt-4 flex gap-4 border-b border-neutral-200 pb-3 text-sm dark:border-neutral-800">
        <Link href="/vendor/products" className="hover:underline">
          Products
        </Link>
        <Link href="/vendor/orders" className="hover:underline">
          Orders
        </Link>
        {vendor.integrationType === "API" && (
          <Link href="/vendor/integrations" className="hover:underline">
            API integration
          </Link>
        )}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
