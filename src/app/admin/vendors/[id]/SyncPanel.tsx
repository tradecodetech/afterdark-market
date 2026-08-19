"use client";

import { useActionState } from "react";
import type { VendorSyncLog } from "@prisma/client";
import { adminTriggerSync } from "@/lib/actions/admin-actions";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function SyncPanel({
  vendorId,
  logs,
}: {
  vendorId: string;
  logs: VendorSyncLog[];
}) {
  const [state, formAction, pending] = useActionState(adminTriggerSync, undefined);

  return (
    <Card>
      <h3 className="text-sm font-semibold">Sync</h3>
      <form action={formAction} className="mt-2">
        <input type="hidden" name="vendorId" value={vendorId} />
        <Button type="submit" disabled={pending}>
          {pending ? "Syncing…" : "Sync now"}
        </Button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-green-600">{state.success}</p>}

      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-800"
          >
            <span>{new Date(log.startedAt).toLocaleString()}</span>
            <Badge
              tone={
                log.status === "SUCCESS" ? "success" : log.status === "ERROR" ? "danger" : "neutral"
              }
            >
              {log.status} — {log.itemsSynced} synced
              {log.errorMessage ? `: ${log.errorMessage}` : ""}
            </Badge>
          </li>
        ))}
        {logs.length === 0 && <p className="text-sm text-neutral-500">No syncs yet.</p>}
      </ul>
    </Card>
  );
}
