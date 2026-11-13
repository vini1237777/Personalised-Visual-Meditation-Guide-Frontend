import type { ReactNode } from "react";
import styles from "./BreathRing.module.css";

type BreathRingProps = {
  /** Seconds for one full loop of the dot: one breath in and out. */
  seconds?: number;
  children?: ReactNode;
};

/**
 * A thin line drawn as a circle with a small light travelling around it.
 * One loop is one breath, so the eye has something slow to follow.
 */
export default function BreathRing({ seconds = 8, children }: BreathRingProps) {
  return (
    <div
      className={styles.ring}
      style={{ ["--breath" as string]: `${seconds}s` }}
    >
      <svg className={styles.svg} viewBox="0 0 400 400" aria-hidden="true">
        <circle className={styles.track} cx="200" cy="200" r="170" />
        <circle
          className={styles.trail}
          cx="200"
          cy="200"
          r="170"
          pathLength={100}
        />
        <g className={styles.orbit}>
          <circle className={styles.bead} cx="200" cy="30" r="7" />
        </g>
      </svg>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
