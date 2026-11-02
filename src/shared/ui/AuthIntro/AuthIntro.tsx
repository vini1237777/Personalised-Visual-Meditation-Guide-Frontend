import type { ReactNode } from "react";
import styles from "./AuthIntro.module.css";

const STEPS = [
  { face: "😨", title: "Tell us how you feel", text: "Tap a face, then the words that fit." },
  { face: "🐼", title: "Take one slow breath", text: "In for four, out for four while your session gets ready." },
  { face: "😌", title: "Watch and check out", text: "A short calm session for that feeling. Then save how you feel to your journal." },
];

// Fills the empty side of the login and sign up pages: what SoulSync does.
export default function AuthIntro({ title, subtitle, footer }: { title: string; subtitle: string; footer?: ReactNode }) {
  return (
    <section className={styles.intro} aria-label="About SoulSync">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li key={s.title} className={styles.step} style={{ animationDelay: `${200 + i * 120}ms` }}>
            <span className={styles.face} aria-hidden="true">
              {s.face}
            </span>
            <span>
              <strong>{s.title}</strong>
              <span className={styles.text}>{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      {footer && <p className={styles.footer}>{footer}</p>}
    </section>
  );
}
