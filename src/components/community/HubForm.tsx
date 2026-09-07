"use client";
import { useActionState } from "react";
import { hubAction } from "@/lib/actions/creator-hub";

export function HubForm({ op, creatorId = "", label, children }: { op: string; creatorId?: string; label: string; children?: React.ReactNode }) {
  const [state, action, pending] = useActionState(hubAction, {});
  return <form action={action} className="space-y-3">
    <input type="hidden" name="op" value={op} /><input type="hidden" name="creatorId" value={creatorId} />
    {children}
    <button disabled={pending} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">{pending ? "Saving…" : label}</button>
    <p aria-live="polite" className={state.error ? "text-sm text-red-600" : "text-sm text-emerald-700"}>{state.error || state.success}</p>
  </form>;
}
