"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/admin-actions";
import { fieldClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function NewCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, undefined);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input name="name" placeholder="Category name" required className={fieldClass()} />
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add"}
      </Button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
