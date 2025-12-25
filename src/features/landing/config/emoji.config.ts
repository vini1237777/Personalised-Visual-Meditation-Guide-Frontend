export type EmojiCategory =
  | "Joy"
  | "Sadness"
  | "Anger"
  | "Calmness"
  | "Fear"
  | "Love"
  | "Tiredness"
  | "Surprise";

export type EmojiConfigItem = {
  category: EmojiCategory;
  feelings: string[];
};

export const EMOJI_MAP: Record<string, EmojiConfigItem> = {
  "😀": {
    category: "Joy",
    feelings: ["Excited", "Proud", "Playful", "Content"],
  },
  "😢": {
    category: "Sadness",
    feelings: ["Lonely", "Vulnerable", "Guilty", "Despair"],
  },
  "😡": {
    category: "Anger",
    feelings: ["Frustrated", "Jealous", "Annoyed", "Bitter"],
  },
  "😌": {
    category: "Calmness",
    feelings: ["Peaceful", "Relaxed", "Satisfied", "Hopeful"],
  },
  "😨": {
    category: "Fear",
    feelings: ["Anxious", "Insecure", "Rejected", "Scared"],
  },
  "😍": {
    category: "Love",
    feelings: ["Affectionate", "Compassionate", "Passionate", "Warm"],
  },
  "😴": {
    category: "Tiredness",
    feelings: ["Sleepy", "Bored", "Lazy", "Drained"],
  },
  "🤔": {
    category: "Surprise",
    feelings: ["Curious", "Intrigued", "Confused", "Amazed"],
  },
};
