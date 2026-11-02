import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const messages = [
  "Breathe in… and out.",
  "Slow down. You’re here now.",
  "Preparing your meditation…",
  "A calm session is almost ready.",
];

type LoaderProps = {
  title?: string;
  // Guide one slow breath (in 4s, out 4s) instead of rotating messages.
  breath?: boolean;
  onSkip?: () => void;
};

function BreathGuide({ onSkip }: { onSkip?: () => void }) {
  const [phase, setPhase] = useState<"ready" | "in" | "out">("ready");
  const [count, setCount] = useState(4);

  useEffect(() => {
    const start = requestAnimationFrame(() => setPhase("in"));
    const toOut = setTimeout(() => setPhase("out"), 4000);
    return () => {
      cancelAnimationFrame(start);
      clearTimeout(toOut);
    };
  }, []);

  useEffect(() => {
    if (phase === "ready") return;
    setCount(4);
    const id = setInterval(() => setCount((c) => (c > 1 ? c - 1 : c)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <p className={styles.title}>Take one slow breath while your session gets ready</p>

      <div className={`${styles.breathCircle} ${phase === "in" ? styles.inhale : ""} ${phase === "out" ? styles.exhale : ""}`}>
        <span className={styles.count}>{phase === "ready" ? "" : count}</span>
      </div>

      <p className={styles.phase} key={phase}>
        {phase === "out" ? "Breathe out" : "Breathe in"}
      </p>

      {onSkip && (
        <button type="button" className={styles.skip} onClick={onSkip}>
          Skip
        </button>
      )}
    </div>
  );
}

export default function Loader({ title = "Preparing your session…", breath = false, onSkip }: LoaderProps) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (breath) return;
    const id = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setI((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 900);
    }, 2200);

    return () => clearInterval(id);
  }, [breath]);

  if (breath) return <BreathGuide onSkip={onSkip} />;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.circle} aria-label="Breathing animation" />

      <p className={styles.title}>{title}</p>

      <p className={`${styles.message} ${visible ? styles.show : styles.hide}`}>
        {messages[i]}
      </p>
    </div>
  );
}
