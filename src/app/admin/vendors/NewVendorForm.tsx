"use client";

import { useActionState, useState } from "react";
import { createVendor } from "@/lib/actions/admin-actions";
import { VENDOR_INTEGRATION } from "@/lib/constants";
import { fieldClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";

export default function NewVendorForm() {
  const [state, formAction, pending] = useActionState(createVendor, undefined);
  const [integrationType, setIntegrationType] = useState<string>(
    VENDOR_INTEGRATION.MANUAL,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <input name="name" placeholder="Vendor name" required className={fieldClass()} />
        <input
          name="contactEmail"
          type="email"
          placeholder="Contact email"
          required
          className={fieldClass()}
        />
      </div>
      <input
        name="discreetLabel"
        placeholder="Discreet billing label (e.g. Plain Box Co.)"
        className={fieldClass()}
      />
      <select
        name="integrationType"
        value={integrationType}
        onChange={(e) => setIntegrationType(e.target.value)}
        className={fieldClass()}
      >
        <option value={VENDOR_INTEGRATION.MANUAL}>Manual entry</option>
        <option value={VENDOR_INTEGRATION.API}>API feed</option>
      </select>

      {integrationType === VENDOR_INTEGRATION.API && (
        <div className="grid grid-cols-2 gap-2">
          <input name="apiBaseUrl" placeholder="Feed URL" className={fieldClass()} />
          <input name="apiKey" placeholder="API key (optional)" className={fieldClass()} />
        </div>
      )}

      <fieldset className="rounded-xl border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
        <legend className="px-1 text-xs text-neutral-500">
          Optional: create vendor login
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input name="loginEmail" type="email" placeholder="Login email" className={fieldClass()} />
          <input
            name="loginPassword"
            type="password"
            placeholder="Temporary password"
            className={fieldClass()}
          />
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create vendor"}
      </Button>
    </form>
  );
}
