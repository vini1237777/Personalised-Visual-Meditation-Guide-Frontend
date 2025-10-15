import video_6bzzjltmlliyu from "../assets/videos/6bzzjltmlliyu-download.mp4";
import video_8a2h0gds3bim from "../assets/videos/8a2h0gds3bim-download.mp4";
import video_9ojkq72px8eb from "../assets/videos/9ojkq72px8eb-download.mp4";
import video_ba8kltzwoe56 from "../assets/videos/ba8kltzwoe56-download.mp4";
import video_il4dw4c9ky03 from "../assets/videos/il4dw4c9ky03-download.mp4";
import video_qw3zgygxm643 from "../assets/videos/qw3zgygxm643-download.mp4";
import video_rndu7mv2e554 from "../assets/videos/rndu7mv2e554_download.mp4";
import video_u9jcwe1twnnu from "../assets/videos/u9jcwe1twnnu-download.mp4";
import video_ve35tz082w2w from "../assets/videos/ve35tz082w2w-download.mp4";

const allVideoPaths = [
  video_6bzzjltmlliyu,
  video_8a2h0gds3bim,
  video_9ojkq72px8eb,
  video_ba8kltzwoe56,
  video_il4dw4c9ky03,
  video_qw3zgygxm643,
  video_rndu7mv2e554,
  video_u9jcwe1twnnu,
  video_ve35tz082w2w,
];

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

export const moodVideoMap: any = {
  Joy: [video_6bzzjltmlliyu, video_8a2h0gds3bim],
  Sadness: [video_9ojkq72px8eb, video_ba8kltzwoe56],
  Anger: [video_il4dw4c9ky03, video_ve35tz082w2w],
  Calmness: [video_qw3zgygxm643, video_rndu7mv2e554],
  Fear: [video_u9jcwe1twnnu, video_6bzzjltmlliyu],
  Love: [video_8a2h0gds3bim, video_9ojkq72px8eb],
  Tiredness: [video_ba8kltzwoe56, video_il4dw4c9ky03],
  Surprise: [video_qw3zgygxm643, video_rndu7mv2e554],
};
export const defaultMeditationVideoUrls = allVideoPaths;

export const pickRandom = (arr: any) =>
  arr[Math.floor(Math.random() * arr.length)];

export function pickFromMood(category: any) {
  if (category && moodVideoMap[category]?.length) {
    const validVideos = moodVideoMap[category].filter((url: string) => url);
    if (validVideos.length) {
      return pickRandom(validVideos);
    }
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
