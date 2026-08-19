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

  const links = [
    { href: "/vendor/products", label: "Products" },
    { href: "/vendor/orders", label: "Orders" },
    ...(vendor.integrationType === "API"
      ? [{ href: "/vendor/integrations", label: "API integration" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl tracking-tight">{vendor.name}</h1>
      <p className="text-sm text-neutral-500">Vendor dashboard</p>
      <nav className="mt-5 flex gap-1 border-b border-neutral-200 text-sm dark:border-neutral-800">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-b-2 border-transparent px-3 pb-3 font-medium text-neutral-600 transition hover:border-brand-300 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
