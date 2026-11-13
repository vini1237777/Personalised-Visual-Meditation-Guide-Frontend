import { useEffect, useRef, useState } from "react";
import styles from "./OverviewVideo.module.css";

const PARTS = [
  { at: 0, label: "Problem" },
  { at: 4.6, label: "What it does" },
  { at: 9.4, label: "How it works" },
  { at: 14.6, label: "Result" },
];

const SRC = `${process.env.PUBLIC_URL}/videos/soulsync-overview.mp4`;
const POSTER = `${process.env.PUBLIC_URL}/videos/soulsync-overview.jpg`;

// A 19 second look at SoulSync, opened from the login page.
export default function OverviewVideo({
  onClose,
  onTryDemo,
  demoDisabled,
}: {
  onClose: () => void;
  onTryDemo: () => void;
  demoDisabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [part, setPart] = useState(0);
  const [failed, setFailed] = useState(false);

  const closeLatest = useRef(onClose);
  closeLatest.current = onClose;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLatest.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const play = (at: number) => {
    const v = videoRef.current;
    if (!v) return;
    const go = () => {
      v.currentTime = at;
      v.play().catch(() => {});
    };
    if (v.readyState >= 1) go();
    else v.addEventListener("loadedmetadata", go, { once: true });
  };

  const onTime = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let i = 0;
    PARTS.forEach((p, n) => {
      if (t >= p.at) i = n;
    });
    setPart(i);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="overview-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.top}>
          <h2 id="overview-title" className={styles.title}>
            What is SoulSync?
          </h2>
          <button
            ref={closeRef}
            className={styles.close}
            onClick={onClose}
            aria-label="Close overview"
          >
            ✕
          </button>
        </div>

        {failed ? (
          <p className={styles.failed}>
            The overview could not load right now. Log in to the demo instead.
          </p>
        ) : (
          <video
            ref={videoRef}
            className={styles.video}
            src={SRC}
            poster={POSTER}
            muted
            playsInline
            autoPlay
            preload="metadata"
            onTimeUpdate={onTime}
            onSeeked={onTime}
            onError={() => setFailed(true)}
          />
        )}

        <div className={styles.parts}>
          {PARTS.map((p, n) => (
            <button
              key={p.label}
              type="button"
              className={n === part ? `${styles.part} ${styles.active}` : styles.part}
              aria-current={n === part ? "step" : undefined}
              disabled={failed}
              onClick={() => play(p.at)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.demo}
          disabled={demoDisabled}
          onClick={onTryDemo}
        >
          Log in to the demo
        </button>
      </div>
    </div>
  );
}
