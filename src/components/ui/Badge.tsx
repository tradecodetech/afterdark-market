import type { HTMLAttributes } from "react";

type Tone = "brand" | "accent" | "neutral" | "success" | "danger";

const tones: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  accent: "bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400",
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
  success: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={[
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
