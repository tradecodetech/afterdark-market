"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function RefreshChat() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button className="text-sm text-brand-600" disabled={pending} onClick={() => startTransition(() => router.refresh())}>{pending ? "Refreshing…" : "Refresh conversation"}</button>;
}
