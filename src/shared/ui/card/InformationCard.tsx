import { useEffect } from "react";
import styles from "./InformationCard.module.css";

const GUIDE_STEPS = [
  {
    title: "Log in or sign up",
    body: "Press Log in with the demo account already filled in. Have an invite? Sign up with that email first, then log in.",
  },
  {
    title: "Start from the home page",
    body: "Under \"What's on your mind?\", press the button to share your mood.",
  },
  {
    title: "Choose how you feel",
    body: "Tap the face closest to your mood, then tap the words that fit.",
  },
  {
    title: "Take one slow breath",
    body: "Press Continue and breathe with the panda. Press Skip if you are ready sooner.",
  },
  {
    title: "Watch your session",
    body: "A calm session picked for your mood opens. Press play and follow along.",
  },
  {
    title: "Check out",
    body: "When you finish, tap the face that shows how you feel now. You can add a note too.",
  },
  {
    title: "Open your journal",
    body: "Choose Journal in the menu to see your sessions. It is saved in this browser.",
  },
];

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
        <section className={styles.guide} aria-labelledby="how-to-use">
          <h2 id="how-to-use" className={styles.guideTitle}>
            How to use SoulSync
          </h2>
          <ol className={styles.steps}>
            {GUIDE_STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <p className={styles.itemTitle}>{step.title}</p>
                  <p className={styles.itemBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.guideNote}>
            AI generated videos are open to invited accounts for now, so the demo
            account plays a calm session picked for your mood. The AI model makes
            clips of up to 8 seconds, so each video repeats while you breathe
            along.
          </p>
        </section>

        <h2 className={styles.guideTitle}>How it is built</h2>
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
