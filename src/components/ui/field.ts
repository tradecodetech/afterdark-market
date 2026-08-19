// Shared styling for text inputs, selects, and textareas. Exported as a
// class-string helper (not a wrapper component) since form elements vary
// in shape (select needs children, textarea needs rows) — this keeps every
// field visually consistent without fighting prop-forwarding.
export function fieldClass(className = "") {
  return [
    "rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition",
    "placeholder:text-neutral-400",
    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
    "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function labelClass(className = "") {
  return ["flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300", className]
    .filter(Boolean)
    .join(" ");
}
