import { useMemo, useState } from "react";
import type { Emoji } from "../model/mood.types";
import { EMOJI_MAP } from "../config/emoji.config";
import { User } from "../../../user/model/user.types";
import { UserService } from "../../../../services/userServices";
import { startLiveJob } from "../lib/startLiveJob";
import { waitForJob } from "../lib/waitForJob";

type UseMoodSelectorArgs = {
  user: User | null;
  isDemoMode: boolean;
};

export function useMoodSelector({
  user,
  isDemoMode,
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

  // Null means this session plays the demo, including on any error starting a job.
  const requestLiveJob = () => {
    const email = getEmail();
    if (isDemoMode || !email) return Promise.resolve(null);
    return startLiveJob(() =>
      UserService.getScript({ selectedFeelings, selectedEmojis, email }),
    );
  };

  const waitForVideo = (jobId: string, isStopped: () => boolean) =>
    waitForJob(
      jobId,
      (id) => UserService.getScriptJob(id).then((res) => res.data),
      { isStopped },
    );

  return {
    selectedEmojis,
    activeEmoji,
    selectedFeelings,
    isCollapsed,
    categoryData,

    setIsCollapsed,

    toggleEmoji,
    toggleFeeling,
    requestLiveJob,
    waitForVideo,
  };
}
