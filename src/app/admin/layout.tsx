import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <nav className="mt-4 flex gap-4 border-b border-neutral-200 pb-3 text-sm dark:border-neutral-800">
        <Link href="/admin/vendors" className="hover:underline">
          Vendors
        </Link>
        <Link href="/admin/products" className="hover:underline">
          Products
        </Link>
        <Link href="/admin/categories" className="hover:underline">
          Categories
        </Link>
        <Link href="/admin/orders" className="hover:underline">
          Orders
        </Link>
        <Link href="/admin/users" className="hover:underline">
          Users
        </Link>
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
