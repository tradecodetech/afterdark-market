import Link from "next/link";

const links = [
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl tracking-tight">Admin</h1>
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
