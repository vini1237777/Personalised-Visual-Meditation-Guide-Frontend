import { useEffect, useMemo, useState } from "react";
import "./DemoMeditation.css";

import video_6bzzjltmlliyu from "../../../../assets/videos/6bzzjltmllyu-download.mp4";
import video_8a2h0gds3bim from "../../../../assets/videos/8a2h0gds3bim-download.mp4";
import video_9ojkq72px8eb from "../../../../assets/videos/9ojkq72px8eb-download.mp4";
import video_ba8kltzwoe56 from "../../../../assets/videos/ba8kltzwoe56_download.mp4";
import video_il4dw4c9ky03 from "../../../../assets/videos/il4dw4c9ky03-download.mp4";
import video_qw3zgygxm643 from "../../../../assets/videos/qw3zgygxm643-download.mp4";
import video_rndu7mv2e554 from "../../../../assets/videos/rndu7mv2e554_download.mp4";
import video_u9jcwe1twnnu from "../../../../assets/videos/u9jcwe1twnnu-download.mp4";
import video_ve35tz082w2w from "../../../../assets/videos/ve35tz082w2w-download.mp4";
import { BreathingPanda } from "../BreathingPanda/BreathingPanda";

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

const moodVideoMap: any = {
  Joy: [video_6bzzjltmlliyu, video_8a2h0gds3bim],
  Sadness: [video_9ojkq72px8eb, video_ba8kltzwoe56],
  Anger: [video_il4dw4c9ky03, video_ve35tz082w2w],
  Calmness: [video_qw3zgygxm643, video_rndu7mv2e554],
  Fear: [video_u9jcwe1twnnu, video_6bzzjltmlliyu],
  Love: [video_8a2h0gds3bim, video_9ojkq72px8eb],
  Tiredness: [video_ba8kltzwoe56, video_il4dw4c9ky03],
  Surprise: [video_qw3zgygxm643, video_rndu7mv2e554],
};

const defaultMeditationVideoUrls = allVideoPaths;

const pickRandom = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const pickFromMood = (category: any) => {
  if (category && moodVideoMap[category]?.length) {
    const validVideos = moodVideoMap[category].filter((url: string) => url);
    if (validVideos.length) {
      return pickRandom(validVideos);
    }
  }
  return pickRandom(defaultMeditationVideoUrls);
};

type DemoMeditationProps = {
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
  isLoading: boolean;
};

export default function DemoMeditation({
  category,
  width = 640,
  height = 360,
  className,
  isLoading,
}: DemoMeditationProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [errorCount, setErrorCount] = useState(0);

  const initialUrl = useMemo(() => pickFromMood(category), [category]);

  useEffect(() => {
    setVideoUrl(initialUrl);
    setErrorCount(0);
  }, [initialUrl]);

  const handleError = () => {
    if (errorCount >= 3) {
      console.error("Video failed to load 3 times. Stopping playback.");
      setVideoUrl("");
      return;
    }

    setErrorCount((prev) => prev + 1);

    const availableVideos = defaultMeditationVideoUrls.filter(
      (url) => url !== videoUrl
    );

    if (availableVideos.length > 0) {
      const next = pickRandom(availableVideos);
      setVideoUrl(next);
    } else {
      console.error("All available videos have failed to load.");
      setVideoUrl("");
    }
  };

  const shuffle = () => {
    const next = pickFromMood(category);
    setVideoUrl(next);
    setErrorCount(0);
  };

  return (
    <div className={className ?? "demo-meditation-page"}>
      <div className="demo-meditation-video-container">
        <h2>🌸 Your Relaxing Guide (Demo)</h2>
        {!isLoading ? (
          <video
            key={videoUrl}
            width={width}
            height={height}
            onError={handleError}
            controls
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <BreathingPanda />
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="userLogin-button" onClick={shuffle}>
          Shuffle another calm clip
        </button>
      </div>
    </div>
  );
}
