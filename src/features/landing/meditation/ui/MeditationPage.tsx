import styles from "./MeditationPage.module.css";
import type { MeditationPageProps } from "../model/meditation.types";
import { BackButton } from "shared/ui/BackButton/BackButton";
import DemoMeditation from "features/landing/demoMeditation/ui/DemoMeditation";
import { BreathingPanda } from "features/landing/demoMeditation/ui/BreathingPanda/BreathingPanda";

export default function MeditationPage({
  meditationContent,
  category,
  isLoading,
  showAnimation,
  onBackToMood,
  onDemoModeChange,
  onAnimationChange,
}: MeditationPageProps) {
  const videoUrl = (meditationContent ?? "").toString().trim();
  const hasVideo = videoUrl.length > 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.page}>
        <BackButton label="Back to Mood Selector" onClick={onBackToMood} />

        {hasVideo && (
          <>
            <h2 className={styles.title}>🌸 Your Relaxing Guide</h2>
            <div className={styles.videoContainer}>
              <video
                className={styles.video}
                controls
                preload="metadata"
                key={videoUrl}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </>
        )}

        {!hasVideo && showAnimation && (
          <DemoMeditation
            category={category}
            isLoading={isLoading}
            onBack={onBackToMood}
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
