import { useMemo, useState } from "react";
import { EMOJI_MAP } from "../config/emoji.config";

export function useMoodSelection() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  const categoryData = useMemo(() => {
    return activeEmoji ? EMOJI_MAP[activeEmoji] : null;
  }, [activeEmoji]);

  function toggleEmoji(emoji: string) {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    setActiveEmoji(emoji);
  }

  function toggleFeeling(feeling: string) {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  }

  function reset() {
    setSelectedEmojis([]);
    setActiveEmoji(null);
    setSelectedFeelings([]);
  }

  return {
    selectedEmojis,
    activeEmoji,
    selectedFeelings,
    categoryData,
    toggleEmoji,
    toggleFeeling,
    reset,
  };
}
