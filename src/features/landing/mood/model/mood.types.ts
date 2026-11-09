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
  isDemoMode: boolean;

  onLoadingChange: (isLoading: boolean) => void;
  onDemoModeChange: (isDemo: boolean) => void;
  onMeditationReady: (videoUrl: string) => void;
  onClose: () => void;
  onOpenDemoMeditation: () => void;
  meditationContent: any;
  onCheckIn?: (before: { emojis: string[]; feelings: string[] }) => void;
  registerSkip?: (skip: (() => void) | null) => void;
  onWaitingForVideo?: (waiting: boolean) => void;
};
