import type { ButtonHTMLAttributes } from "react";
import styles from "./FeelingChip.module.css";

type FeelingChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  label: string;
  selected: boolean;
  /** Colour of the small dot. Leave out for the plain variant used for sub feelings. */
  dot?: string;
  variant?: "main" | "sub";
};

export default function FeelingChip({
  label,
  selected,
  dot,
  variant = "main",
  className,
  ...rest
}: FeelingChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      data-variant={variant}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={styles.dot}
          style={selected ? undefined : { background: dot }}
        />
      )}
      {label}
    </button>
  );
}
