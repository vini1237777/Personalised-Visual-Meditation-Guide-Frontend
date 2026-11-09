import styles from "./MeditationPage.module.css";
import type { MeditationPageProps } from "../model/meditation.types";
import { BackButton } from "shared/ui/BackButton/BackButton";
import DemoMeditation from "features/landing/demoMeditation/ui/DemoMeditation";
import CheckOut from "features/landing/journal/CheckOut";
import { BreathingPanda } from "features/landing/demoMeditation/ui/BreathingPanda/BreathingPanda";

export default function MeditationPage({
  meditationContent,
  category,
  isLoading,
  showAnimation,
  onBackToMood,
  onDemoModeChange,
  onAnimationChange,
  checkIn,
}: MeditationPageProps) {
  const videoUrl = (meditationContent ?? "").toString().trim();
  const hasVideo = videoUrl.length > 0;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.page} ${!hasVideo && showAnimation ? styles.wide : ""}`}>
        {!(showAnimation && !hasVideo) && (
          <BackButton label="Back to Mood Selector" onClick={onBackToMood} />
        )}

        {hasVideo && (
          <>
            <h2 className={styles.title}>🌸 Your Relaxing Guide</h2>
            <div className={styles.videoContainer}>
              <video
                className={styles.video}
                controls
                loop
                preload="metadata"
                key={videoUrl}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className={styles.videoNote}>
                Made just for you. The AI video model creates clips of up to 8
                seconds, so this one repeats. Breathe along for as long as you
                like.
              </p>
            </div>
            <CheckOut checkIn={checkIn ?? null} />
          </>
        )}

        {!hasVideo && showAnimation && (
          <DemoMeditation
            category={category}
            isLoading={isLoading}
            onBack={onBackToMood}
            checkIn={checkIn}
          />
        )}

        {!hasVideo && !showAnimation && (
          <>
            <h2 className={styles.title}>🌸 Your Relaxing Guide</h2>
            <BreathingPanda />

            <button
              type="button"
              className={styles.seeDemoButton}
              onClick={() => {
                onDemoModeChange(true);
                onAnimationChange(false);
                onBackToMood();
              }}
              disabled={isLoading}
            >
              🌸 <span className={styles.seeDemoText}>See Demo</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
