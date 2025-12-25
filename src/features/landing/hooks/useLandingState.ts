import { useEffect, useReducer } from "react";
import type { LandingState, LandingAction } from "../model/landing.types";

const initialState: LandingState = {
  view: "hero",
  isLoading: false,
  meditationVideoUrl: null,
  isDemoMode: false,
  showAnimation: false,
  isMobile: false,
};

function reducer(state: LandingState, action: LandingAction): LandingState {
  switch (action.type) {
    case "OPEN_MOOD":
      return { ...state, view: "mood" };

    case "CLOSE_MOOD":
      return {
        ...state,
        view: "hero",
        isLoading: false,
        meditationVideoUrl: null,
        showAnimation: false,
        isDemoMode: false,
      };

    case "BACK_TO_MOOD":
      return {
        ...state,
        view: "mood",
        isLoading: false,
        meditationVideoUrl: null,
        showAnimation: false,
      };

    case "START_LOADING":
      return { ...state, isLoading: true };

    case "STOP_LOADING":
      return { ...state, isLoading: false };

    case "SET_MEDITATION_VIDEO":
      return {
        ...state,
        meditationVideoUrl: action.videoUrl,
        view: "meditation",
        isLoading: false,
        showAnimation: false,
        isDemoMode: false,
      };

    case "OPEN_DEMO_MEDITATION":
      return {
        ...state,
        view: "meditation",
        meditationVideoUrl: null,
        isLoading: false,
        showAnimation: state.isDemoMode,
      };

    case "SET_DEMO_MODE":
      return { ...state, isDemoMode: action.value };

    case "SET_ANIMATION":
      return { ...state, showAnimation: action.value };

    case "SET_MOBILE":
      return { ...state, isMobile: action.value };

    default:
      return state;
  }
}

export function useLandingState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const onResize = () =>
      dispatch({ type: "SET_MOBILE", value: window.innerWidth < 768 });

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { state, dispatch };
}
