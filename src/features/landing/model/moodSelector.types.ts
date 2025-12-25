import type { User } from "../../user/model/user.types";

export type MoodSelectorProps = {
  user: User | null;
  setUser: (user: User | null) => void;

  isDemoMode: boolean;

  onLoadingChange: (isLoading: boolean) => void;
  onAnimationChange: (show: boolean) => void;
  onDemoModeChange: (isDemo: boolean) => void;

  onMeditationReady: (videoUrl: string) => void;

  onBack?: () => void;
};

export type MeditationApiResponse = {
  generatedScripts?: string;
  videoUrl?: string;
  email?: string;
  fullName?: string;
};
