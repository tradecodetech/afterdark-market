import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SyncButton from "./SyncButton";

export default async function VendorIntegrationsPage() {
  const session = await auth();
  const vendorId = session!.user.vendorId!;

  const [vendor, logs] = await Promise.all([
    prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } }),
    prisma.vendorSyncLog.findMany({
      where: { vendorId },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="text-sm">
        <h2 className="text-sm font-semibold">API feed configuration</h2>
        <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-2 text-neutral-600 dark:text-neutral-400">
          <dt>Feed URL</dt>
          <dd className="font-mono text-xs">{vendor.apiBaseUrl ?? "—"}</dd>
          <dt>API key</dt>
          <dd className="font-mono text-xs">
            {vendor.apiKey ? "•".repeat(8) : "—"}
          </dd>
          <dt>Field mapping</dt>
          <dd className="font-mono text-xs">{vendor.fieldMapping ?? "default"}</dd>
        </dl>
        <p className="mt-3 text-xs text-neutral-500">
          Contact an admin to change your feed URL, API key, or field
          mapping.
        </p>
      </Card>

      <SyncButton />

      <div>
        <h2 className="text-sm font-semibold">Recent syncs</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800"
            >
              <span>{new Date(log.startedAt).toLocaleString()}</span>
              <Badge
                tone={
                  log.status === "SUCCESS" ? "success" : log.status === "ERROR" ? "danger" : "neutral"
                }
              >
                {log.status} — {log.itemsSynced} synced
              </Badge>
            </li>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-neutral-500">No syncs yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
