import { useEffect } from "react";
import styles from "./InformationCard.module.css";

const GUIDE_STEPS = [
  {
    title: "Pick a feeling",
    body: "On the login page, tap how you feel and press Start a session. The demo account logs you in, so there is no sign up.",
  },
  {
    title: "Choose the words that fit",
    body: "Tap the words closest to your feeling, then press Continue.",
  },
  {
    title: "Take one slow breath",
    body: "Follow the light around the ring while your session gets ready. Press Skip if you are ready sooner.",
  },
  {
    title: "Watch your session",
    body: "The video fills the screen. Press play and breathe along, or try another clip.",
  },
  {
    title: "Check out",
    body: "Press Check out, pick how you feel now and add a note if you like. It is saved to your journal.",
  },
  {
    title: "Open your journal",
    body: "Choose Journal in the menu to see every check in as a list, cards or a calendar. It is saved in this browser.",
  },
];

const BUILT_WITH = [
  {
    title: "Frontend",
    items: [
      {
        name: "App",
        text: "React 19, TypeScript, CSS Modules and Create React App.",
      },
      {
        name: "Video",
        text: "Background and demo videos are served through CloudFront. The background videos are 1080p and 72% smaller than the 4K files they replace.",
      },
    ],
  },
  {
    title: "Backend and AI",
    items: [
      {
        name: "API",
        text: "Node.js, Express 5 and TypeScript, with MongoDB through Mongoose.",
      },
      {
        name: "Script and video",
        text: "gpt-4o-mini writes a short script from the feelings you pick, then Veo 3.1 through the Gemini API turns it into a video.",
      },
      {
        name: "Similar sessions",
        text: "Gemini embeddings and MongoDB Atlas Vector Search find your closest saved sessions. If a video cannot be made, you are offered the closest one.",
      },
    ],
  },
  {
    title: "Jobs and storage",
    items: [
      {
        name: "Generation jobs",
        text: "Each video is a job on SQS, run by a Lambda worker with a dead letter queue. The app checks the job until it is done.",
      },
      {
        name: "Private videos",
        text: "Videos are kept in a private S3 bucket and opened with links that last 1 hour.",
      },
    ],
  },
  {
    title: "Security and hosting",
    items: [
      {
        name: "Accounts",
        text: "JWT with an expiry, a role check on user updates, bcrypt password hashing, CORS limited to this site and Zod validation on sign up and log in.",
      },
      {
        name: "Hosting",
        text: "AWS EC2 with Nginx and PM2. GitHub Actions builds and deploys on every push to main.",
      },
    ],
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
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="features-title"
    >
      <div className={styles.topBar}>
        <span id="features-title" className={styles.topTitle}>
          Features
        </span>
        <button
          type="button"
          className={styles.close}
          onClick={() => setIsOpen(false)}
          autoFocus
        >
          Close
        </button>
      </div>

      <div className={styles.body}>
        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use" className={styles.title}>
            How to use <em>SoulSync</em>
          </h2>
          <ol className={styles.steps}>
            {GUIDE_STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={styles.itemTitle}>{step.title}</p>
                  <p className={styles.itemBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.note}>
            AI generated videos are open to invited accounts for now, so the
            demo account plays a calm session picked for your feeling. Each clip
            is up to 8 seconds long and repeats while you breathe along.
          </p>
        </section>

        <section aria-labelledby="how-built" className={styles.built}>
          <h2 id="how-built" className={styles.title}>
            How it is <em>built</em>
          </h2>
          <div className={styles.grid}>
            {BUILT_WITH.map((group) => (
              <div key={group.title} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                {group.items.map((item) => (
                  <div key={item.name} className={styles.item}>
                    <p className={styles.itemTitle}>{item.name}</p>
                    <p className={styles.itemBody}>{item.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.footer}>
          <a
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repo}
          >
            Frontend code
          </a>
          <a
            href="https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repo}
          >
            Backend code
          </a>
        </div>
      </div>
    </div>
  );
}
