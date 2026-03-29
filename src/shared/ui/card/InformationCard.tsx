import { useEffect } from "react";
import styles from "./InformationCard.module.css";

export default function SoulSyncInfoCard({
  open = true,
  setIsOpen,
}: {
  open?: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setIsOpen]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.topBar}>
        <span className={styles.topTitle}>Features</span>
        <div className={styles.topRight}>
          <button
            className={styles.close}
            onClick={() => setIsOpen(false)}
            aria-label="Close features"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          <div>
            <p className={styles.sectionTitle}>Technology Stack</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Frontend</p>
              <p className={styles.itemBody}>
                React.js, TypeScript, CSS Modules, Vite
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Backend</p>
              <p className={styles.itemBody}>
                Node.js, Express.js, MongoDB, REST APIs
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>AI Integration</p>
              <p className={styles.itemBody}>
                Gemini API — structured prompting with mood-aware context for
                personalized session generation
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>Security & Auth</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>JWT Authentication</p>
              <p className={styles.itemBody}>
                Token-based auth with role-based access control — different
                permissions per user role.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Data Protection</p>
              <p className={styles.itemBody}>
                bcrypt password hashing, domain-restricted CORS, and request
                validation on every endpoint.
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>AI-Powered Sessions</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Mood-Aware Generation</p>
              <p className={styles.itemBody}>
                Gemini reads your mood and session history before generating —
                no two sessions are the same.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Context-Aware Prompting</p>
              <p className={styles.itemBody}>
                Each API call includes user mood, session history, and
                preferences — building a rich prompt context for tailored
                responses.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Structured Output</p>
              <p className={styles.itemBody}>
                Every AI response is validated and parsed before reaching the
                client — no raw LLM output in the UI.
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>DevOps & Performance</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>CI/CD Pipeline</p>
              <p className={styles.itemBody}>
                GitHub Actions — automated deploy on every push to main. Zero
                manual steps to production.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Production Hosting</p>
              <p className={styles.itemBody}>
                AWS EC2 with Nginx as reverse proxy and PM2 for process
                management — stable, zero-downtime serving.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Reliability</p>
              <p className={styles.itemBody}>
                PM2 auto-restarts on crash, Nginx handles SSL termination and
                load, environment-based config keeps secrets out of code.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <a
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnGh}
          >
            Frontend repo →
          </a>
          <a
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnGh}
          >
            Backend repo →
          </a>
        </div>
      </div>
    </div>
  );
}
