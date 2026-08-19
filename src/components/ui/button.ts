export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 shadow-sm shadow-brand-600/20",
  secondary:
    "border border-neutral-300 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900",
  ghost: "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
  danger: "text-accent-600 hover:text-accent-500 dark:text-accent-400",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

// For small inline actions (Remove, Edit, Suspend...) that shouldn't look
// like a full button — just a consistently-colored underlined text link.
export function textLinkClass(tone: "neutral" | "danger" = "neutral", className = "") {
  const toneClass =
    tone === "danger"
      ? "text-accent-600 hover:text-accent-500 dark:text-accent-400"
      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200";
  return ["text-xs underline underline-offset-2 transition", toneClass, className]
    .filter(Boolean)
    .join(" ");
}
