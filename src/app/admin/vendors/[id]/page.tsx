import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VendorEditForm from "./VendorEditForm";
import SyncPanel from "./SyncPanel";

export default async function AdminVendorEditPage({
  params,
}: PageProps<"/admin/vendors/[id]">) {
  const { id } = await params;

  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) notFound();

  const syncLogs =
    vendor.integrationType === "API"
      ? await prisma.vendorSyncLog.findMany({
          where: { vendorId: vendor.id },
          orderBy: { startedAt: "desc" },
          take: 10,
        })
      : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">{vendor.name}</h2>
        <p className="text-sm text-neutral-500">Edit vendor & API integration</p>
      </div>

      <div className="rounded-xl border border-neutral-200 p-5 text-sm dark:border-neutral-800">
        <h3 className="font-semibold">What to get from a vendor before connecting their API</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-600 dark:text-neutral-400">
          <li>A product feed URL that returns JSON (a REST endpoint, not a PDF/spreadsheet they email you)</li>
          <li>How to authenticate — usually an API key or bearer token</li>
          <li>A sample response so you can see their field names (what do they call price, stock, sku, image?)</li>
          <li>Whether price is in cents or dollars, and what currency</li>
          <li>Whether stock is a real-time count or just in-stock/out-of-stock</li>
          <li>Their category names, so you can map them to yours (below)</li>
          <li>Any rate limit on the feed (how often you&apos;re allowed to poll it)</li>
        </ul>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manual/CSV vendors don&apos;t need any of this — just switch integration
          type to Manual below.
        </p>
      </div>

      <VendorEditForm vendor={vendor} />

      {vendor.integrationType === "API" && (
        <SyncPanel vendorId={vendor.id} logs={syncLogs} />
      )}
    </div>
  );
}
