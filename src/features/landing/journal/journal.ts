import { EMOJI_MAP } from "../mood/config/emoji.config";

// A tiny mood journal kept in the browser: what you felt before a session
// and how you felt after it.
export type CheckIn = {
  id: string;
  at: number;
  before: { emojis: string[]; feelings: string[] };
  after?: string; // emoji picked after the session
};

const KEY = "soulsync.journal";
const MAX = 30;

export function loadJournal(): CheckIn[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as CheckIn[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: CheckIn[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // Storage can be blocked (private mode); the journal is a nice to have.
  }
}

export function startCheckIn(before: CheckIn["before"]): CheckIn {
  const entry: CheckIn = { id: String(Date.now()), at: Date.now(), before };
  save([entry, ...loadJournal()]);
  return entry;
}

export function finishCheckIn(id: string, after: string) {
  save(loadJournal().map((c) => (c.id === id ? { ...c, after } : c)));
}

// Plain words for each mood, used in sentences like "you are leaving calm".
const MOOD_WORD: Record<string, string> = {
  Joy: "happy",
  Sadness: "low",
  Anger: "angry",
  Calmness: "calm",
  Fear: "anxious",
  Love: "loved",
  Tiredness: "tired",
  Surprise: "curious",
};

export const GOOD_MOODS = new Set(["Joy", "Calmness", "Love"]);

export function moodOf(emoji: string) {
  return EMOJI_MAP[emoji]?.category ?? "";
}

export function categoryWord(category: string) {
  return MOOD_WORD[category] ?? "";
}

export function moodWord(emoji: string) {
  return MOOD_WORD[moodOf(emoji)] ?? "different";
}

export function describeBefore(before: CheckIn["before"]) {
  const words = before.feelings.length
    ? before.feelings.map((f) => f.toLowerCase())
    : before.emojis.map(moodWord);
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

export function whenLabel(at: number) {
  const d = new Date(at);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

// Consecutive days, ending today or yesterday, with at least one check in.
export function streakDays(list: CheckIn[]) {
  const days = new Set(list.map((c) => new Date(c.at).toDateString()));
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(cursor.toDateString())) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}
