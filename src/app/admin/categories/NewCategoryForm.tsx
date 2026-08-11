"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/admin-actions";

export default function NewCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, undefined);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        name="name"
        placeholder="Category name"
        required
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
