export const ABOUT_TEXT = {
  title: "About SoulSync",
  description:
    "SoulSync is a meditation app that starts with how you feel. Tell it your mood and it gives you a short, calm session made for that feeling.",
} as const;

export const ABOUT_STEPS = [
  { title: "Tell us how you feel", text: "Tap a face, then pick the words that fit." },
  { title: "Take one slow breath", text: "The panda breathes with you while your session gets ready." },
  { title: "Watch and check out", text: "Enjoy the session, then save how you feel to your journal." },
] as const;

export const ABOUT_BLOCKS = [
  {
    title: "Why we built it",
    text: "Life gets loud and fast. SoulSync is for anyone who wants a quiet few minutes without pressure, long routines or a busy screen.",
  },
  {
    title: "Your journal",
    text: "Every session is saved with how you came in and how you left, so over time you can see what helps you feel better.",
  },
  {
    title: "Who it is for",
    text: "Beginners, busy people and anyone who prefers calm visuals over long instructions. A few minutes is enough.",
  },
  {
    title: "When live AI is resting",
    text: "If the live session cannot be made, SoulSync plays a calm clip picked for your mood, so you are never left waiting.",
  },
] as const;
