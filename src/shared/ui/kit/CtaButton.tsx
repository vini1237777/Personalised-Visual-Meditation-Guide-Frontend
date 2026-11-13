import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./CtaButton.module.css";

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Stretch to the width of its container. */
  block?: boolean;
};

export default function CtaButton({
  children,
  block = false,
  className,
  type = "button",
  ...rest
}: CtaButtonProps) {
  return (
    <button
      type={type}
      className={[styles.cta, block ? styles.block : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span>{children}</span>
      <span aria-hidden="true" className={styles.arrow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
