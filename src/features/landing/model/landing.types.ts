import { User } from "../../user/model/user.types";

export interface LandingPageProps {
  user: User | null;
  setUserState: (user: User | null) => void;
  isLoggedIn: boolean;
}

export type LandingView = "hero" | "mood" | "meditation";

export type LandingState = {
  view: LandingView;
  isLoading: boolean;
  meditationVideoUrl: string | null;
  isDemoMode: boolean;
  showAnimation: boolean;
  isMobile: boolean;
};

export type MeditationContent = {
  videoUrl: string;
};

export type LandingAction =
  | { type: "OPEN_MOOD" }
  | { type: "CLOSE_MOOD" }
  | { type: "BACK_TO_MOOD" }
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | { type: "SET_MEDITATION_VIDEO"; videoUrl: string }
  | { type: "SET_DEMO_MODE"; value: boolean }
  | { type: "SET_ANIMATION"; value: boolean }
  | { type: "OPEN_DEMO_MEDITATION" }
  | { type: "SET_MOBILE"; value: boolean }
  | { type: "OPEN_DEMO_MOOD" };

type View = "hero" | "mood" | "meditation";

export type State = {
  view: View;
  isLoading: boolean;
  meditationVideoUrl: string | null;
  isDemoMode: boolean;
  showAnimation: boolean;
  isMobile: boolean;
};

export type HeroItem = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
};
