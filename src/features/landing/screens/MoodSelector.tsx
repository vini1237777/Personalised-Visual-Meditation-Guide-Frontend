import styles from "./MoodSelector.module.css";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { CtaButton, FeelingChip, StepBar } from "shared/ui/kit";
import { FEELINGS, feelingLabel } from "../mood/config/feelings.config";
import type { MoodSelectorProps } from "../mood/model/mood.types";
import { useMoodSelector } from "../mood/hooks/useMoodSelector";

export default function MoodSelector({
  user,
  isDemoMode,
  onLoadingChange,
  onMeditationReady,
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
    activeEmoji,
    selectedFeelings,
    isCollapsed,
    categoryData,
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

  const activeLabel = activeEmoji
    ? feelingLabel(activeEmoji).toLowerCase()
    : "";

  const start = async () => {
    if (selectedFeelings.length === 0 && !isDemoMode) {
      toast("Pick at least one word that fits to continue.");
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
  };

  return (
    <section className={styles.step} aria-labelledby="feeling-title">
      <StepBar current={0} />

      <h1 id="feeling-title" className={styles.title}>
        {activeLabel ? (
          <>
            You feel <em>{activeLabel}.</em>
            <br />
            Which words fit?
          </>
        ) : (
          <>
            How do you feel
            <br />
            <em>right now?</em>
          </>
        )}
      </h1>

      <div className={styles.feelings} role="group" aria-label="How you feel">
        {FEELINGS.map((f) => (
          <FeelingChip
            key={f.emoji}
            label={f.label}
            dot={f.dot}
            selected={selectedEmojis.includes(f.emoji)}
            onClick={() => toggleEmoji(f.emoji)}
          />
        ))}
      </div>

      {!isCollapsed && categoryData && (
        <>
          <p className={styles.hint}>
            Pick any that fit. You can choose more than one.
          </p>
          <div
            className={styles.words}
            role="group"
            aria-label="Words that fit"
          >
            {categoryData.feelings.map((word) => (
              <FeelingChip
                key={word}
                label={word}
                variant="sub"
                selected={selectedFeelings.includes(word)}
                onClick={() => toggleFeeling(word)}
              />
            ))}
          </div>
        </>
      )}

      {selectedEmojis.length > 0 && (
        <div className={styles.go}>
          <CtaButton onClick={start}>Continue</CtaButton>
        </div>
      )}
    </section>
  );
}
