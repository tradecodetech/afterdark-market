"use client";

import { useActionState } from "react";
import { createManualProduct } from "@/lib/actions/vendor-actions";
import { fieldClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function NewProductForm({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createManualProduct,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <input name="title" placeholder="Title" required className={fieldClass()} />
        <input name="sku" placeholder="SKU" required className={fieldClass()} />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        rows={2}
        className={fieldClass()}
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          name="price"
          placeholder="Price (USD)"
          type="number"
          step="0.01"
          required
          className={fieldClass()}
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          defaultValue={0}
          className={fieldClass()}
        />
        <select name="categorySlug" required className={fieldClass()}>
          <option value="">Category…</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <input name="imageUrl" placeholder="Image URL (optional)" className={fieldClass()} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Adding…" : "Add product"}
      </Button>
    </form>
  );
}
