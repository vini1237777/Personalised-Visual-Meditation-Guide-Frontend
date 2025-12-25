export type MeditationPageProps = {
  meditationContent: string | null;
  category: string;
  isLoading: boolean;
  showAnimation: boolean;
  onBackToMood: () => void;
  onDemoModeChange: (v: any) => void;
  onAnimationChange: (v: any) => void;
  onLoadingChange: (v: any) => void;
};

export type DemoMeditationProps = {
  category: string;
  isLoading: boolean;
  onBack: () => void;
};
