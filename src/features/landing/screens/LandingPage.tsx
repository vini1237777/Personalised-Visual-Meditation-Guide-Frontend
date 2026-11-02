import { HeroSection } from "./HeroSection";
import { useLandingState } from "../hooks/useLandingState";
import { BG_VIDEOS } from "../../../assets/bg-videos/videoUrls";
import { useVideoBackground } from "../../../shared/custom-hooks/Usevideobackground";
import MoodSelector from "./MoodSelector";
import styles from "./LandingPage.module.css";
import MeditationPage from "../meditation/ui/MeditationPage";
import { HERO_ITEMS } from "../config/hero.config";
import { useAuth } from "app/providers/AuthProvider";
import Loader from "shared/ui/Loader";
import { useRef, useState } from "react";
import RecentCheckIns from "../journal/RecentCheckIns";
import { CheckIn, loadJournal, startCheckIn } from "../journal/journal";
import { EMOJI_MAP } from "../mood/config/emoji.config";

export default function LandingPage() {
  const { user, isLoggedIn, setUser } = useAuth();
  const { state, dispatch } = useLandingState();
  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg1);
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const skipRef = useRef<(() => void) | null>(null);
  // The feeling picked today decides which session plays
  const [sessionMood, setSessionMood] = useState<string | null>(null);

  const hasJournal = loadJournal().length > 0;
  const showHero = isLoggedIn && Boolean(user) && state.view === "hero";
  // No name here: the demo account is shared, so a friendly "hey there" fits everyone.
  const hour = new Date().getHours();
  const greeting = `Hey there, good ${hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}`;

  return (
    <div className={styles.landingPage}>
      <div className={styles.poster} />
      <video
        ref={videoRef}
        className={styles.videoBg}
        loop
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />

      <div className={styles.overlay} />

      {showHero && (
        <div className={`${styles.homeGrid} ${hasJournal ? "" : styles.single}`}>
          <div className={styles.homeLeft}>
            {!state.showAnimation && !state.isDemoMode && (
              <div className={styles.welcomeText}>{greeting}</div>
            )}
            <HeroSection items={HERO_ITEMS} onStart={() => dispatch({ type: "OPEN_MOOD" })} />
          </div>
          {!state.showAnimation && !state.isDemoMode && <RecentCheckIns side />}
        </div>
      )}

      {state.view === "mood" && (
        <MoodSelector
          user={user}
          setUser={setUser}
          meditationContent={state.meditationVideoUrl}
          isDemoMode={state.isDemoMode}
          onLoadingChange={(v: boolean) =>
            dispatch({ type: v ? "START_LOADING" : "STOP_LOADING" })
          }
          onAnimationChange={(v: boolean) =>
            dispatch({ type: "SET_ANIMATION", value: v })
          }
          onDemoModeChange={(v: boolean) =>
            dispatch({ type: "SET_DEMO_MODE", value: v })
          }
          onMeditationReady={(videoUrl: string) =>
            dispatch({ type: "SET_MEDITATION_VIDEO", videoUrl })
          }
          onOpenDemoMeditation={() =>
            dispatch({ type: "OPEN_DEMO_MEDITATION" })
          }
          onClose={() => dispatch({ type: "CLOSE_MOOD" })}
          onCheckIn={(before) => {
            setSessionMood(EMOJI_MAP[before.emojis[0]]?.category ?? null);
            setCheckIn(startCheckIn(before));
          }}
          registerSkip={(fn) => {
            skipRef.current = fn;
          }}
        />
      )}

      {state.view === "meditation" && (
        <MeditationPage
          meditationContent={state.meditationVideoUrl}
          isLoading={state.isLoading}
          category={sessionMood ?? user?.category ?? ""}
          showAnimation={state.showAnimation}
          checkIn={checkIn}
          onBackToMood={() => dispatch({ type: "BACK_TO_MOOD" })}
          onDemoModeChange={(v: boolean) =>
            dispatch({ type: "SET_DEMO_MODE", value: v })
          }
          onAnimationChange={(v: boolean) =>
            dispatch({ type: "SET_ANIMATION", value: v })
          }
          onLoadingChange={(v: boolean) =>
            dispatch({ type: v ? "START_LOADING" : "STOP_LOADING" })
          }
        />
      )}

      {state.isLoading && (
        <Loader breath onSkip={() => skipRef.current?.()} />
      )}
    </div>
  );
}
