import styles from "./MoodSelector.module.css";
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
  setUser,
  isDemoMode,
  onLoadingChange,
  onAnimationChange,
  onMeditationReady,
  onClose,
  onOpenDemoMeditation,
  meditationContent,
}: MoodSelectorProps) {
  const {
    selectedEmojis,
    activeEmoji,
    selectedFeelings,
    isCollapsed,
    categoryData,
    setIsCollapsed,
    toggleEmoji,
    toggleFeeling,
  } = useMoodSelector({
    user,
    setUser,
    isDemoMode,
    onLoadingChange,
    onAnimationChange,
    onMeditationReady,
  });

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
                role="button"
                aria-pressed={selectedFeelings.includes(feeling)}
              >
                {feeling}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.outputBox}>
        <p>
          <strong>Selected Emojis:</strong>{" "}
          {selectedEmojis.length > 0 ? selectedEmojis.join(" ") : "None"}
        </p>
        <p>
          <strong>Active Wheel:</strong> {activeEmoji || "None"}
        </p>
        <p>
          <strong>Feelings:</strong>{" "}
          {selectedFeelings.length > 0 ? selectedFeelings.join(", ") : "None"}
        </p>
      </div>

      {selectedEmojis.length > 0 && !isCollapsed && (
        <div className={styles.continueWrapper}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={() => {
              if (selectedFeelings.length === 0 && !isDemoMode) {
                toast("🙂 Select at least one feeling to continue.");
                return;
              }

              onLoadingChange(true);

              const liveVideoUrl = (meditationContent ?? "").trim();

              setTimeout(() => {
                onLoadingChange(false);

                if (isDemoMode) {
                  onOpenDemoMeditation();
                  return;
                }

                if (!liveVideoUrl) {
                  toast(
                    "Live AI is paused, showing curated session. Click SEE DEMO",
                    {
                      icon: "🌿",
                    }
                  );
                  onOpenDemoMeditation();
                  return;
                }

                onMeditationReady(liveVideoUrl);
              }, 8000);
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
