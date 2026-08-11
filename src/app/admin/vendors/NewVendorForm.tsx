"use client";

import { useActionState, useState } from "react";
import { createVendor } from "@/lib/actions/admin-actions";
import { VENDOR_INTEGRATION } from "@/lib/constants";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default function NewVendorForm() {
  const [state, formAction, pending] = useActionState(createVendor, undefined);
  const [integrationType, setIntegrationType] = useState<string>(
    VENDOR_INTEGRATION.MANUAL,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <input name="name" placeholder="Vendor name" required className={inputClass} />
        <input
          name="contactEmail"
          type="email"
          placeholder="Contact email"
          required
          className={inputClass}
        />
      </div>
      <input
        name="discreetLabel"
        placeholder="Discreet billing label (e.g. Plain Box Co.)"
        className={inputClass}
      />
      <select
        name="integrationType"
        value={integrationType}
        onChange={(e) => setIntegrationType(e.target.value)}
        className={inputClass}
      >
        <option value={VENDOR_INTEGRATION.MANUAL}>Manual entry</option>
        <option value={VENDOR_INTEGRATION.API}>API feed</option>
      </select>

      {integrationType === VENDOR_INTEGRATION.API && (
        <div className="grid grid-cols-2 gap-2">
          <input name="apiBaseUrl" placeholder="Feed URL" className={inputClass} />
          <input name="apiKey" placeholder="API key (optional)" className={inputClass} />
        </div>
      )}

      <fieldset className="rounded-md border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
        <legend className="px-1 text-xs text-neutral-500">
          Optional: create vendor login
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input name="loginEmail" type="email" placeholder="Login email" className={inputClass} />
          <input
            name="loginPassword"
            type="password"
            placeholder="Temporary password"
            className={inputClass}
          />
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Creating…" : "Create vendor"}
      </button>
    </form>
  );
}
