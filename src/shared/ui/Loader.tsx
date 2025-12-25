import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const messages = [
  "Breathe in… and out.",
  "Slow down. You’re here now.",
  "Preparing your meditation…",
  "A calm session is almost ready.",
];

export default function Loader({
  title = "Preparing your session…",
}: {
  title?: string;
}) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setI((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 900);
    }, 2200);

    return () => clearInterval(id);
  }, []);

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
