const VIDEO_BASE_PATH = "../../assets/videos/";

const allVideoFileNames = [
  "6bzzjltmlliyu-download.mp4",
  "8a2h0gds3bim-download.mp4",
  "9ojkq72px8eb-download.mp4",
  "ba8kltzwoe56-download.mp4",
  "il4dw4c9ky03-download.mp4",
  "qw3zgygxm643-download.mp4",
  "rndu7mv2e554_download.mp4",
  "u9jcwe1twnnu-download.mp4",
  "ve35tz082w2w-download.mp4",
];

const allVideoPaths = allVideoFileNames.map(
  (fileName) => `${VIDEO_BASE_PATH}${fileName}`
);

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
  Joy: [allVideoPaths[0], allVideoPaths[1]],
  Sadness: [allVideoPaths[2], allVideoPaths[3]],
  Anger: [allVideoPaths[4], allVideoPaths[8]],
  Calmness: [allVideoPaths[5], allVideoPaths[6]],
  Fear: [allVideoPaths[7], allVideoPaths[0]],
  Love: [allVideoPaths[1], allVideoPaths[2]],
  Tiredness: [allVideoPaths[3], allVideoPaths[4]],
  Surprise: [allVideoPaths[5], allVideoPaths[6]],
};

export const defaultMeditationVideoUrls: string[] = allVideoPaths;

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
