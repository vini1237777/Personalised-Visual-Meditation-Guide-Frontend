import styles from "./StepBar.module.css";

export const SESSION_STEPS = ["Feeling", "Breathe", "Session", "Check out"] as const;

type StepBarProps = {
  /** Index of the current step, starting at 0. */
  current: number;
  steps?: readonly string[];
  className?: string;
};

export default function StepBar({
  current,
  steps = SESSION_STEPS,
  className,
}: StepBarProps) {
  return (
    <ol
      className={[styles.bar, className].filter(Boolean).join(" ")}
      aria-label="Session steps"
    >
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "on" : "next";
        return (
          <li
            key={label}
            className={styles.step}
            data-state={state}
            aria-current={i === current ? "step" : undefined}
          >
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.label}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
