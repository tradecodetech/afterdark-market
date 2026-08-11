import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/constants";
import { toggleProductActive, deleteVendorProduct } from "@/lib/actions/vendor-actions";
import NewProductForm from "./NewProductForm";
import CsvImportForm from "./CsvImportForm";

export default async function VendorProductsPage() {
  const session = await auth();
  const vendorId = session!.user.vendorId!;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">Add product manually</h2>
          <div className="mt-3">
            <NewProductForm categories={categories} />
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">Bulk import via CSV</h2>
          <div className="mt-3">
            <CsvImportForm />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Your products ({products.length})</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-neutral-500">
              <tr>
                <th className="pb-2">Title</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Status</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 pr-2">{product.title}</td>
                  <td className="py-2 pr-2 text-neutral-500">{product.sku}</td>
                  <td className="py-2 pr-2">{formatCents(product.price)}</td>
                  <td className="py-2 pr-2">{product.stock}</td>
                  <td className="py-2 pr-2 text-neutral-500">{product.source}</td>
                  <td className="py-2 pr-2">
                    {product.isActive ? "Active" : "Hidden"}
                  </td>
                  <td className="flex gap-3 py-2">
                    <form action={toggleProductActive}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button type="submit" className="text-xs underline">
                        {product.isActive ? "Hide" : "Activate"}
                      </button>
                    </form>
                    <form action={deleteVendorProduct}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button type="submit" className="text-xs text-red-600 underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
