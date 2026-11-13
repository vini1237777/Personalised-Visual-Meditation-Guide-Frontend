import type { Emoji } from "../model/mood.types";

export type Feeling = {
  /** Key into EMOJI_MAP, which drives the session and the journal. */
  emoji: Emoji;
  /** Plain word shown to people. */
  label: string;
  /** Dot colour on the feeling button. */
  dot: string;
};

export const FEELINGS: readonly Feeling[] = [
  { emoji: "😀", label: "Happy", dot: "#ffd166" },
  { emoji: "😢", label: "Sad", dot: "#5b9bff" },
  { emoji: "😡", label: "Angry", dot: "#ff6b5b" },
  { emoji: "😌", label: "Calm", dot: "#7fd07c" },
  { emoji: "😨", label: "Afraid", dot: "#a77fd0" },
  { emoji: "😍", label: "Loving", dot: "#ff8fc2" },
  { emoji: "😴", label: "Tired", dot: "#9aa3b5" },
  { emoji: "🤔", label: "Surprised", dot: "#ffb067" },
];

export function feelingLabel(emoji: string): string {
  return FEELINGS.find((f) => f.emoji === emoji)?.label ?? "";
}
