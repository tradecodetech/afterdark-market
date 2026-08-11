import { prisma } from "@/lib/prisma";
import { toggleVendorApproved } from "@/lib/actions/admin-actions";
import NewVendorForm from "./NewVendorForm";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="text-sm font-semibold">Add vendor</h2>
        <div className="mt-3">
          <NewVendorForm />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Vendors ({vendors.length})</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-neutral-500">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Integration</th>
                <th className="pb-2">Products</th>
                <th className="pb-2">Status</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="py-2 pr-2">{vendor.name}</td>
                  <td className="py-2 pr-2 text-neutral-500">
                    {vendor.integrationType}
                  </td>
                  <td className="py-2 pr-2">{vendor._count.products}</td>
                  <td className="py-2 pr-2">
                    {vendor.approved ? "Approved" : "Suspended"}
                  </td>
                  <td className="py-2">
                    <form action={toggleVendorApproved}>
                      <input type="hidden" name="vendorId" value={vendor.id} />
                      <button type="submit" className="text-xs underline">
                        {vendor.approved ? "Suspend" : "Approve"}
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
