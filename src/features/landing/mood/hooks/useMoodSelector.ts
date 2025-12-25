import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Emoji } from "../model/mood.types";
import { EMOJI_MAP } from "../config/emoji.config";
import { User } from "../../../user/model/user.types";
import { LANDING_CONSTANTS } from "../../constants/landing.constants";
import { UserService } from "../../../../services/userServices";

type UseMoodSelectorArgs = {
  user: User | null;
  setUser: any;

  isDemoMode: boolean;

  onLoadingChange: (v: boolean) => void;
  onAnimationChange: (v: boolean) => void;
  onMeditationReady: (videoUrl: string) => void;
};

export function useMoodSelector({
  user,
  setUser,
  isDemoMode,
  onLoadingChange,
  onAnimationChange,
  onMeditationReady,
}: UseMoodSelectorArgs) {
  const [selectedEmojis, setSelectedEmojis] = useState<Emoji[]>([]);
  const [activeEmoji, setActiveEmoji] = useState<Emoji | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categoryData = useMemo(() => {
    return activeEmoji ? EMOJI_MAP[activeEmoji] : null;
  }, [activeEmoji]);

  const toggleEmoji = (emoji: Emoji) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    setActiveEmoji(emoji);
    setIsCollapsed(false);
  };

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const getEmail = (): string | null => {
    const fromUser = user?.email?.toString().trim();
    if (fromUser) return fromUser;

    const saved = localStorage.getItem("user");
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved) as Partial<User>;
      const email = parsed?.email?.toString().trim();
      return email || null;
    } catch {
      return null;
    }
  };

  const handleContinue = async () => {
    onLoadingChange(true);

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, LANDING_CONSTANTS.demoDelayMs));
      onLoadingChange(false);
      onAnimationChange(false);
      return;
    }

    const email = getEmail();
    if (!email) {
      toast.error("Email is required.");
      onLoadingChange(false);
      onAnimationChange(false);
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, LANDING_CONSTANTS.demoDelayMs));

      const response = await UserService.getScript({
        selectedFeelings,
        selectedEmojis,
        email,
      });

      if (response?.status !== 200) {
        throw new Error(`Unexpected status: ${response?.status}`);
      }

      const data = response.data as {
        generatedScripts?: string;
        videoUrl?: string;
        email?: string;
        fullName?: string;
      };

      const videoUrl = (data.videoUrl ?? "").toString().trim();
      const hasVideo = videoUrl.length > 0;

      if (!hasVideo) {
        toast.error("No video received. Please try again.");
        return;
      }

      setUser((prev: User) => ({
        ...prev,
        email: data.email ?? email ?? prev.email,
        fullName: data.fullName ?? prev.fullName,
      }));

      toast.success("Successfully generated meditation session");
      onMeditationReady(videoUrl);
    } catch {
      toast("🌿 Live AI is paused, showing curated session. Click SEE DEMO");
    } finally {
      onLoadingChange(false);
      setTimeout(() => onAnimationChange(true), 0);
    }
  };

  return {
    selectedEmojis,
    activeEmoji,
    selectedFeelings,
    isCollapsed,
    categoryData,

    setIsCollapsed,

    toggleEmoji,
    toggleFeeling,
    handleContinue,
  };
}
