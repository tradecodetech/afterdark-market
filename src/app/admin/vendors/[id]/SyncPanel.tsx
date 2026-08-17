"use client";

import { useActionState } from "react";
import type { VendorSyncLog } from "@prisma/client";
import { adminTriggerSync } from "@/lib/actions/admin-actions";

export default function SyncPanel({
  vendorId,
  logs,
}: {
  vendorId: string;
  logs: VendorSyncLog[];
}) {
  const [state, formAction, pending] = useActionState(adminTriggerSync, undefined);

  return (
    <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <h3 className="text-sm font-semibold">Sync</h3>
      <form action={formAction} className="mt-2">
        <input type="hidden" name="vendorId" value={vendorId} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "Syncing…" : "Sync now"}
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-green-600">{state.success}</p>}

      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800"
          >
            <span>{new Date(log.startedAt).toLocaleString()}</span>
            <span
              className={
                log.status === "SUCCESS"
                  ? "text-green-600"
                  : log.status === "ERROR"
                    ? "text-red-600"
                    : "text-neutral-500"
              }
            >
              {log.status} — {log.itemsSynced} synced
              {log.errorMessage ? `: ${log.errorMessage}` : ""}
            </span>
          </li>
        ))}
        {logs.length === 0 && <p className="text-sm text-neutral-500">No syncs yet.</p>}
      </ul>
    </div>
  );
}
