export const navbarLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Github", path: "" },
];

export const appTitle = "Meditation App";
export const bannerText =
  "Welcome to the Meditation App! Find your peace and calm.";
export const bannerAltText = "Meditation Banner";

export const bannerButton = "Get started";
export const submitButton = "Submit";

export const contactButtonSubmitText = "Submit";

export const contactBodyTitle =
  "If you have any questions, feel free to reach out!";

export const contactBodyText =
  "We would love to hear from you. Please fill out the form below to get in touch with us.";

export const nameText = "Name:";
export const emailText = "Email:";

export const aboutBodyText = "This is the about page of our meditation app.";
export const aboutTitle = "About Us";

export const signupButtonText = "Sign Up";

export const memberText = "Already a member?";

export const loginText = "Log In";

export const noMemberText = "Not a member?";

export const herosectionText = [
  {
    headline: "What's on your mind?",
    subheadline: "Join us on a journey to mindfulness and tranquility.",
    title: "Click here! Share your mood with us! Let's go...",
  },
];

// ✅ Royalty-free MP4s (Pixabay). These links stream in <video>.
// License summary: free for commercial/non-commercial use with some restrictions.

export const moodVideoMap: Record<
  | "Joy"
  | "Sadness"
  | "Anger"
  | "Calmness"
  | "Fear"
  | "Love"
  | "Tiredness"
  | "Surprise"
  | any,
  string[]
> = {
  Joy: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/wehiywpzxuqf:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/hlbsmax6krdl:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Sadness: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/ujgur6int7lq:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/0lcj21c05mgb:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Anger: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/2pbfkereuis1:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/ve35tz082w2w:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Calmness: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Fear: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Love: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Tiredness: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
  Surprise: [
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  ],
};

export const defaultMeditationVideoUrls: string[] = [
  `https://generativelanguage.googleapis.com/download/v1beta/files/wehiywpzxuqf:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  `https://generativelanguage.googleapis.com/download/v1beta/files/hlbsmax6krdl:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  `https://generativelanguage.googleapis.com/download/v1beta/files/ujgur6int7lq:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  `https://generativelanguage.googleapis.com/download/v1beta/files/ve35tz082w2w:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  `https://generativelanguage.googleapis.com/download/v1beta/files/98r5v9ejh5kj:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
  `https://generativelanguage.googleapis.com/download/v1beta/files/y99bhu1xyg2a:download?alt=media&key=${process.env.GEMINI_API_KEY}`,
];

export const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export function pickFromMood(category?: keyof typeof moodVideoMap) {
  if (category && moodVideoMap[category]?.length) {
    return pickRandom(moodVideoMap[category]);
  }
  return pickRandom(defaultMeditationVideoUrls);
}

export type DemoMeditationProps = {
  category?: keyof typeof moodVideoMap;
  feeling?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  width?: number;
  height?: number;
  className?: string;
  setShowMoodSelector: any;
  setIsContinueClicked: any;
  setIsDemoMode: any;
};
