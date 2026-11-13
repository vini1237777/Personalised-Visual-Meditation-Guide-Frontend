import { useLandingState } from "../hooks/useLandingState";
import { BG_VIDEOS } from "../../../assets/bg-videos/videoUrls";
import { useVideoBackground } from "../../../shared/custom-hooks/Usevideobackground";
import MoodSelector from "./MoodSelector";
import styles from "./LandingPage.module.css";
import MeditationPage from "../meditation/ui/MeditationPage";
import { useAuth } from "app/providers/AuthProvider";
import Loader from "shared/ui/Loader";
import { useEffect, useRef, useState } from "react";
import RecentCheckIns from "../journal/RecentCheckIns";
import {
  CheckIn,
  SESSION_NAME,
  loadJournal,
  startCheckIn,
} from "../journal/journal";
import { Shade } from "shared/ui/kit";
import { EMOJI_MAP } from "../mood/config/emoji.config";
import { takePendingFeeling } from "../mood/lib/pendingFeeling";

export default function LandingPage() {
  const { user, isLoggedIn } = useAuth();
  const { state, dispatch } = useLandingState();
  // A feeling picked on the login screen opens the feeling step with it selected.
  const [pendingFeeling] = useState(takePendingFeeling);
  useEffect(() => {
    if (pendingFeeling) dispatch({ type: "OPEN_MOOD" });
  }, [pendingFeeling, dispatch]);
  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg1);
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const skipRef = useRef<(() => void) | null>(null);
  const [waitingForVideo, setWaitingForVideo] = useState(false);
  // The feeling picked today decides which session plays
  const [sessionMood, setSessionMood] = useState<string | null>(null);

  const hasJournal = loadJournal().length > 0;

  const sessionName = SESSION_NAME[sessionMood ?? ""] ?? "calm session";
  const picking = state.view !== "meditation";

  return (
    <div className={styles.landingPage}>
      <div className={styles.poster} />
      <video
        ref={videoRef}
        className={styles.videoBg}
        loop
        muted
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />

      {picking && <Shade tone="left" />}

      {picking && isLoggedIn && Boolean(user) && (
        <div
          className={`${styles.layout} ${hasJournal ? "" : styles.single}`}
          hidden={state.isLoading}
        >
          <MoodSelector
            user={user}
            meditationContent={state.meditationVideoUrl}
            isDemoMode={state.isDemoMode}
            onLoadingChange={(v: boolean) =>
              dispatch({ type: v ? "START_LOADING" : "STOP_LOADING" })
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
            onWaitingForVideo={setWaitingForVideo}
            initialEmoji={pendingFeeling}
          />
          {hasJournal && <RecentCheckIns side />}
        </div>
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
        <Loader
          breath
          waitingForVideo={waitingForVideo}
          sessionName={sessionName}
          onSkip={() => skipRef.current?.()}
        />
      )}
    </div>
  );
}
