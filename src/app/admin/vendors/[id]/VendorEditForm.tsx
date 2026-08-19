"use client";

import { useActionState, useState } from "react";
import type { Vendor } from "@prisma/client";
import { updateVendor } from "@/lib/actions/admin-actions";
import { VENDOR_FEED_FIELDS } from "@/lib/vendors/types";
import { VENDOR_INTEGRATION } from "@/lib/constants";
import { fieldClass, labelClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

const FIELD_HINTS: Record<(typeof VENDOR_FEED_FIELDS)[number], string> = {
  externalId: "their unique product ID (for re-syncing the same item later)",
  title: "product name",
  description: "product description",
  price: "price in cents",
  stock: "quantity in stock",
  sku: "SKU / part number",
  imageUrl: "image URL",
  categorySlug: "one of your category slugs (wellness, couples, bondage, apparel, accessories)",
};

function parseMapping(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function VendorEditForm({ vendor }: { vendor: Vendor }) {
  const [state, formAction, pending] = useActionState(updateVendor, undefined);
  const [integrationType, setIntegrationType] = useState(vendor.integrationType);
  const mapping = parseMapping(vendor.fieldMapping);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <input type="hidden" name="vendorId" value={vendor.id} />

      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass()}>
          Vendor name
          <input name="name" defaultValue={vendor.name} required className={fieldClass()} />
        </label>
        <label className={labelClass()}>
          Contact email
          <input
            name="contactEmail"
            type="email"
            defaultValue={vendor.contactEmail}
            required
            className={fieldClass()}
          />
        </label>
      </div>

      <label className={labelClass()}>
        Discreet billing label
        <input
          name="discreetLabel"
          defaultValue={vendor.discreetLabel}
          className={fieldClass()}
        />
      </label>

      <label className={labelClass()}>
        Integration type
        <select
          name="integrationType"
          defaultValue={vendor.integrationType}
          onChange={(e) => setIntegrationType(e.target.value)}
          className={fieldClass()}
        >
          <option value={VENDOR_INTEGRATION.MANUAL}>Manual entry</option>
          <option value={VENDOR_INTEGRATION.API}>API feed</option>
        </select>
      </label>

      {integrationType === VENDOR_INTEGRATION.API && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass()}>
              Feed URL
              <input
                name="apiBaseUrl"
                defaultValue={vendor.apiBaseUrl ?? ""}
                placeholder="https://vendor.example.com/api/products"
                className={fieldClass()}
              />
            </label>
            <label className={labelClass()}>
              API key (sent as Bearer token)
              <input
                name="apiKey"
                defaultValue={vendor.apiKey ?? ""}
                placeholder="optional"
                className={fieldClass()}
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Field mapping</p>
            <p className="text-xs text-neutral-500">
              Leave blank if the vendor already uses our field name. Otherwise
              enter the JSON key their feed uses for each field.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {VENDOR_FEED_FIELDS.map((field) => (
                <label key={field} className="flex flex-col gap-1 text-xs">
                  <span className="font-mono">{field}</span>
                  <input
                    name={`map_${field}`}
                    defaultValue={mapping[field] ?? ""}
                    placeholder={field}
                    className={fieldClass()}
                  />
                  <span className="text-neutral-500">{FIELD_HINTS[field]}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
