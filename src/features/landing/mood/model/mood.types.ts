import { User } from "../../../user/model/user.types";

export type Emoji = string;

export type EmojiMeta = {
  readonly category: string;
  readonly feelings: readonly string[];
};

export type EmojiMap = Record<Emoji, EmojiMeta>;

export type MoodSelection = {
  selectedEmojis: Emoji[];
  activeEmoji: Emoji | null;
  selectedFeelings: string[];
  isCollapsed: boolean;
};

export type MoodSelectorProps = {
  user: User | null | any;
  setUser: (user: User | null | any) => void;
  isDemoMode: boolean;

  onLoadingChange: (isLoading: boolean) => void;
  onAnimationChange: (show: boolean) => void;
  onDemoModeChange: (isDemo: boolean) => void;
  onMeditationReady: (videoUrl: string) => void;
  onClose: () => void;
  onOpenDemoMeditation: () => void;
  meditationContent: any;
};
