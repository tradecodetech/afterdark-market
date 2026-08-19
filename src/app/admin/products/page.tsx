import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import { adminToggleProductActive } from "@/lib/actions/admin-actions";
import Badge from "@/components/ui/Badge";
import { textLinkClass } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { vendor: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-sm font-semibold">All products ({products.length})</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-neutral-500">
            <tr>
              <th className="pb-2">Title</th>
              <th className="pb-2">Vendor</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Stock</th>
              <th className="pb-2">Status</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 pr-2">{product.title}</td>
                <td className="py-2 pr-2 text-neutral-500">{product.vendor.name}</td>
                <td className="py-2 pr-2 text-neutral-500">{product.category.name}</td>
                <td className="py-2 pr-2">{formatCents(product.price)}</td>
                <td className="py-2 pr-2">{product.stock}</td>
                <td className="py-2 pr-2">
                  <Badge tone={product.isActive ? "success" : "neutral"}>
                    {product.isActive ? "Active" : "Hidden"}
                  </Badge>
                </td>
                <td className="py-2">
                  <form action={adminToggleProductActive}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit" className={textLinkClass()}>
                      {product.isActive ? "Hide" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
