"use client";

import { useActionState } from "react";
import { importCsvAction } from "@/lib/actions/vendor-actions";
import Button from "@/components/ui/Button";

export default function CsvImportForm() {
  const [state, formAction, pending] = useActionState(importCsvAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <p className="text-xs text-neutral-500">
        Columns: title,description,price,stock,sku,imageUrl,categorySlug
      </p>
      <input
        type="file"
        name="file"
        accept=".csv,text/csv"
        required
        className="text-sm"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
      <Button type="submit" variant="secondary" disabled={pending} className="self-start">
        {pending ? "Importing…" : "Import CSV"}
      </Button>
    </form>
  );
}
