import styles from "./MoodSelector.module.css";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { EMOJI_MAP } from "../mood/config/emoji.config";
import type { MoodSelectorProps } from "../mood/model/mood.types";
import { useMoodSelector } from "../mood/hooks/useMoodSelector";

const CATEGORY_CLASS: Record<string, string> = {
  Joy: styles.joy,
  Sadness: styles.sadness,
  Anger: styles.anger,
  Fear: styles.fear,
  Love: styles.love,
  Calmness: styles.calmness,
  Tiredness: styles.tiredness,
  Surprise: styles.surprise,
};

export default function MoodSelector({
  user,
  isDemoMode,
  onLoadingChange,
  onMeditationReady,
  onClose,
  onOpenDemoMeditation,
  meditationContent,
  onCheckIn,
  registerSkip,
  onWaitingForVideo,
  initialEmoji,
}: MoodSelectorProps) {
  const starting = useRef(false);
  const stoppedWaiting = useRef(false);

  useEffect(() => {
    stoppedWaiting.current = false;
    return () => {
      stoppedWaiting.current = true;
    };
  }, []);

  const {
    selectedEmojis,
    selectedFeelings,
    isCollapsed,
    categoryData,
    setIsCollapsed,
    toggleEmoji,
    toggleFeeling,
    requestLiveJob,
    waitForVideo,
  } = useMoodSelector({ user, isDemoMode, initialEmoji });

  const playLiveSession = async (jobId: string) => {
    const finish = () => {
      registerSkip?.(null);
      onWaitingForVideo?.(false);
      onLoadingChange(false);
    };
    const openDemo = () => {
      stoppedWaiting.current = true;
      finish();
      onOpenDemoMeditation();
    };

    onWaitingForVideo?.(true);
    registerSkip?.(openDemo);
    try {
      const job = await waitForVideo(jobId, () => stoppedWaiting.current);
      if (stoppedWaiting.current) return;
      const videoUrl = (job.videoUrl ?? "").trim();
      if (!videoUrl) throw new Error("No video");
      finish();
      toast(
        job.reused
          ? "Here is your closest saved session."
          : "Your video is ready. AI clips run up to 8 seconds, so it repeats.",
        { duration: 6000 },
      );
      onMeditationReady(videoUrl);
    } catch {
      if (stoppedWaiting.current) return;
      toast("Your video could not be made, so here is a calm session instead.");
      openDemo();
    }
  };

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={() => {
          setIsCollapsed(true);
          onClose();
        }}
        aria-label="Close mood selector"
      >
        ✖
      </button>

      <h2 className={styles.prompt}>How are you feeling right now?</h2>
      <p className={styles.promptHint}>
        {selectedEmojis.length === 0
          ? "Pick a face to begin."
          : "Now tap the words that fit. You can pick more than one."}
      </p>

      <div className={styles.emojiOptions}>
        {Object.keys(EMOJI_MAP).map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={`${styles.emojiButton} ${
              selectedEmojis.includes(emoji) ? styles.active : ""
            }`}
            onClick={() => toggleEmoji(emoji)}
            aria-pressed={selectedEmojis.includes(emoji)}
            aria-label={EMOJI_MAP[emoji].category}
            title={EMOJI_MAP[emoji].category}
          >
            {emoji}
          </button>
        ))}
      </div>

      {!isCollapsed && categoryData && (
        <div className={styles.emotionWheel}>
          {categoryData.feelings.map((feeling, index) => {
            const angle = (index / categoryData.feelings.length) * 2 * Math.PI;
            const radius = 80;
            const center = 110;

            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);

            return (
              <div
                key={feeling}
                className={`${styles.feelingItem} ${
                  CATEGORY_CLASS[categoryData.category] ?? ""
                } ${selectedFeelings.includes(feeling) ? styles.selected : ""}`}
                style={{ top: y, left: x }}
                onClick={() => toggleFeeling(feeling)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFeeling(feeling);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={selectedFeelings.includes(feeling)}
              >
                {feeling}
              </div>
            );
          })}
        </div>
      )}

      {selectedEmojis.length > 0 && (
        <div className={styles.outputBox} aria-live="polite">
          <p>
            {selectedFeelings.length > 0 ? (
              <>
                You feel <strong>{selectedFeelings.join(", ")}</strong> {selectedEmojis.join(" ")}
              </>
            ) : (
              <>Choose at least one word above to continue.</>
            )}
          </p>
        </div>
      )}

      {selectedEmojis.length > 0 && !isCollapsed && (
        <div className={styles.continueWrapper}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={async () => {
              if (selectedFeelings.length === 0 && !isDemoMode) {
                toast("🙂 Select at least one feeling to continue.");
                return;
              }
              if (starting.current) return;
              starting.current = true;

              onCheckIn?.({ emojis: selectedEmojis, feelings: selectedFeelings });
              onLoadingChange(true);

              const jobId = await requestLiveJob();
              starting.current = false;
              if (jobId) {
                await playLiveSession(jobId);
                return;
              }

              const liveVideoUrl = (meditationContent ?? "").trim();

              // The wait is one guided breath (in 4s, out 4s). Skip ends it early.
              let done = false;
              const proceed = () => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                registerSkip?.(null);
                onLoadingChange(false);

                if (isDemoMode) {
                  onOpenDemoMeditation();
                  return;
                }

                if (!liveVideoUrl) {
                  onOpenDemoMeditation();
                  return;
                }

                onMeditationReady(liveVideoUrl);
              };
              const timer = setTimeout(proceed, 8000);
              registerSkip?.(proceed);
            }}
          >
            Continue
            <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
