import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };

export default function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
