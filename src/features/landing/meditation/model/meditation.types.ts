import type { CheckIn } from "../../journal/journal";

export type MeditationPageProps = {
  meditationContent: string | null;
  category: string;
  isLoading: boolean;
  showAnimation: boolean;
  onBackToMood: () => void;
  onDemoModeChange: (v: any) => void;
  onAnimationChange: (v: any) => void;
  onLoadingChange: (v: any) => void;
  checkIn?: CheckIn | null;
};

export type DemoMeditationProps = {
  category: string;
  isLoading: boolean;
  onBack: () => void;
  checkIn?: CheckIn | null;
  onCheckOut: () => void;
};
