import { LANDING_TEXT } from "../landing.text";
import { formatUserName } from "../../../shared/lib/formatUserName";
import { HeroSection } from "./HeroSection";
import { useLandingState } from "../hooks/useLandingState";
import buddhaImage from "../../../assets/images/buddha.jpg";
import buddhaMobile from "../../../assets/images/buddhaMobile.png";
import MoodSelector from "./MoodSelector";
import styles from "./LandingPage.module.css";
import MeditationPage from "../meditation/ui/MeditationPage";
import { HERO_ITEMS } from "../config/hero.config";
import { useAuth } from "app/providers/AuthProvider";
import Loader from "shared/ui/Loader";

export default function LandingPage() {
  const { user, isLoggedIn, setUser } = useAuth();
  const { state, dispatch } = useLandingState();

  const showHero = isLoggedIn && Boolean(user) && state.view === "hero";
  const displayName = formatUserName(user);

  return (
    <div
      className={styles.landingPage}
      style={{
        backgroundImage: `url(${state.isMobile ? buddhaMobile : buddhaImage})`,
      }}
    >
      {!state.showAnimation && !state.isDemoMode && showHero && (
        <div className={styles.welcomeText}>
          {LANDING_TEXT.welcome}
          {displayName && ` ${displayName}`}
        </div>
      )}

      {showHero && (
        <HeroSection
          items={HERO_ITEMS}
          onStart={() => dispatch({ type: "OPEN_MOOD" })}
        />
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
        />
      )}

      {state.view === "meditation" && (
        <MeditationPage
          meditationContent={state.meditationVideoUrl}
          isLoading={state.isLoading}
          category={user?.category ?? ""}
          showAnimation={state.showAnimation}
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

      {state.isLoading && <Loader />}
    </div>
  );
}
