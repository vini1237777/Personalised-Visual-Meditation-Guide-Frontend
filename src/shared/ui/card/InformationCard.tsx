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
                OpenAI writes a short script from your moods, then Veo through
                the Gemini API turns it into a video
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>Security & Auth</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>JWT Authentication</p>
              <p className={styles.itemBody}>
                Token based auth, with a role check on account updates.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Data Protection</p>
              <p className={styles.itemBody}>
                bcrypt password hashing, CORS limited to this site, and request
                validation on sign up and log in.
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>AI Powered Sessions</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Mood Based Generation</p>
              <p className={styles.itemBody}>
                The feelings you pick shape the script, so the video starts
                from how you feel today.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Structured Prompting</p>
              <p className={styles.itemBody}>
                Your selected feelings and moods go into a fixed prompt with
                clear rules for length, tone and imagery.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Private Key Handling</p>
              <p className={styles.itemBody}>
                Videos stream through the API, so the Gemini key stays on the
                server.
              </p>
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>DevOps & Performance</p>
            <div className={styles.item}>
              <p className={styles.itemTitle}>CI/CD Pipeline</p>
              <p className={styles.itemBody}>
                GitHub Actions deploys automatically on every push to main.
              </p>
            </div>
            <div className={styles.item}>
              <p className={styles.itemTitle}>Production Hosting</p>
              <p className={styles.itemBody}>
                AWS EC2 with Nginx as reverse proxy and PM2 for process
                management. Videos are served through CloudFront.
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
