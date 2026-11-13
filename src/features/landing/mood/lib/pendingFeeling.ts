import { EMOJI_MAP } from "../config/emoji.config";
import type { Emoji } from "../model/mood.types";

const KEY = "soulsync.pendingFeeling";

/** Remembers the feeling picked on the login screen until the home screen opens. */
export function savePendingFeeling(emoji: Emoji | null): void {
  try {
    if (emoji) sessionStorage.setItem(KEY, emoji);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage can be blocked; the person simply picks again on the next screen.
  }
}

/** Reads the saved feeling once and clears it, so a refresh starts fresh. */
export function takePendingFeeling(): Emoji | null {
  try {
    const value = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return value && value in EMOJI_MAP ? (value as Emoji) : null;
  } catch {
    return null;
  }
}
