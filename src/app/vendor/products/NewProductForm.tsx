"use client";

import { useActionState } from "react";
import { createManualProduct } from "@/lib/actions/vendor-actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

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
        <input name="title" placeholder="Title" required className={inputClass} />
        <input name="sku" placeholder="SKU" required className={inputClass} />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        rows={2}
        className={inputClass}
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          name="price"
          placeholder="Price (USD)"
          type="number"
          step="0.01"
          required
          className={inputClass}
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          defaultValue={0}
          className={inputClass}
        />
        <select name="categorySlug" required className={inputClass}>
          <option value="">Category…</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <input name="imageUrl" placeholder="Image URL (optional)" className={inputClass} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Adding…" : "Add product"}
      </button>
    </form>
  );
}
