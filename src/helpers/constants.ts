// const modules = import.meta.glob("../assets/videos/*.mp4", {
//   eager: true,
//   as: "url",
// });

// const allVideoPaths = Object.values(modules);

const { allVideoPaths, getVideoPathByFilename } = (() => {
  // The core dynamic loading logic remains the same
  const modules = import.meta.glob("../assets/videos/*.mp4", {
    eager: true,
    as: "url",
  });

  const paths = Object.values(modules);

  const getPath = (filename: string) => {
    const path = Object.keys(modules).find((key) => key.endsWith(filename));
    return path ? modules[path] : undefined;
  };

  return {
    allVideoPaths: paths,
    getVideoPathByFilename: getPath,
  };
})();

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
  Joy: [
    getVideoPathByFilename("6bzzjltmlliyu-download.mp4"),
    getVideoPathByFilename("8a2h0gds3bim-download.mp4"),
  ],
  Sadness: [
    getVideoPathByFilename("9ojkq72px8eb-download.mp4"),
    getVideoPathByFilename("ba8kltzwoe56-download.mp4"),
  ],
  Anger: [
    getVideoPathByFilename("il4dw4c9ky03-download.mp4"),
    getVideoPathByFilename("ve35tz082w2w-download.mp4"),
  ],
  Calmness: [
    getVideoPathByFilename("qw3zgygxm643-download.mp4"),
    getVideoPathByFilename("rndu7mv2e554_download.mp4"),
  ],
  Fear: [
    getVideoPathByFilename("u9jcwe1twnnu-download.mp4"),
    getVideoPathByFilename("6bzzjltmlliyu-download.mp4"),
  ],
  Love: [
    getVideoPathByFilename("8a2h0gds3bim-download.mp4"),
    getVideoPathByFilename("9ojkq72px8eb-download.mp4"),
  ],
  Tiredness: [
    getVideoPathByFilename("ba8kltzwoe56-download.mp4"),
    getVideoPathByFilename("il4dw4c9ky03-download.mp4"),
  ],
  Surprise: [
    getVideoPathByFilename("qw3zgygxm643-download.mp4"),
    getVideoPathByFilename("rndu7mv2e554_download.mp4"),
  ],
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
