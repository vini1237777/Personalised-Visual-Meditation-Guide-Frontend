import { useEffect, useRef, useState } from "react";
import { Shade, StepBar, panel } from "shared/ui/kit";
import styles from "./SessionStage.module.css";

type SessionStageProps = {
  /** The clip to play full screen. Null shows a short message instead. */
  videoUrl: string | null;
  sessionName: string;
  /** Plain words for what the person picked, such as "anxious and scared". */
  chosenFor: string;
  onCheckOut: () => void;
  onAnotherClip?: () => void;
  onVideoError?: () => void;
};

/** Step 03: the session clip fills the screen, with one calm bar of controls. */
export default function SessionStage({
  videoUrl,
  sessionName,
  chosenFor,
  onCheckOut,
  onAnotherClip,
  onVideoError,
}: SessionStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // A new clip starts paused, so sound only begins when the person presses play.
  useEffect(() => setPlaying(false), [videoUrl]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <div className={styles.stage}>
      {videoUrl && (
        <video
          key={videoUrl}
          ref={videoRef}
          className={styles.video}
          src={videoUrl}
          loop
          playsInline
          preload="auto"
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={onVideoError}
        />
      )}
      <Shade tone="even" />

      <div className={styles.content}>
        <StepBar current={2} />

        <div className={styles.line}>
          <h1 className={styles.title}>
            Breathe along for <em>as long as you like.</em>
          </h1>
          <p className={styles.sub}>
            {videoUrl
              ? "Press play, sit back and breathe slowly."
              : "This clip could not load. Breathe slowly here, or try another clip."}
          </p>
        </div>

        <div className={`${panel.panel} ${styles.dock}`}>
          <button
            type="button"
            className={styles.play}
            onClick={togglePlay}
            disabled={!videoUrl}
            aria-label={playing ? "Pause the session" : "Play the session"}
          >
            {playing ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="6"
                  y="5"
                  width="4"
                  height="14"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="14"
                  y="5"
                  width="4"
                  height="14"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            )}
          </button>

          <div className={styles.track}>
            <span className={styles.name}>{sessionName}</span>
            <span className={styles.chosen}>
              {chosenFor ? `Chosen for ${chosenFor}. ` : ""}The clip repeats.
            </span>
          </div>

          {onAnotherClip && (
            <button
              type="button"
              className={styles.action}
              onClick={onAnotherClip}
            >
              Try another clip
            </button>
          )}
          <button
            type="button"
            className={`${styles.action} ${styles.primary}`}
            onClick={() => {
              videoRef.current?.pause();
              onCheckOut();
            }}
          >
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
