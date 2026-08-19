"use client";

import { useActionState } from "react";
import { scheduleVideoSession } from "@/lib/actions/session-actions";

export function ScheduleSessionForm({ sessionId, current }: { sessionId: string; current: Date | null }) {
  const [state, action, pending] = useActionState(scheduleVideoSession, undefined);
  const value = current ? new Date(current.getTime() - current.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : "";

  return (
    <form action={action} className="mt-5 flex flex-col gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900 sm:flex-row sm:items-end">
      <input type="hidden" name="sessionId" value={sessionId} />
      <label className="flex-1 text-sm">
        <span className="font-medium">Schedule for</span>
        <input name="scheduledAt" type="datetime-local" defaultValue={value} className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm dark:border-neutral-700" required />
      </label>
      <button type="submit" disabled={pending} className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">
        {pending ? "Saving…" : "Save time"}
      </button>
      {(state?.error || state?.success) && <p className="text-xs text-neutral-500 sm:max-w-xs">{state.error ?? state.success}</p>}
    </form>
  );
}
