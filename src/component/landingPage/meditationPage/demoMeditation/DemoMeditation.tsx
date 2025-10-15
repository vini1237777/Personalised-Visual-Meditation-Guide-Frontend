import { useEffect, useMemo, useState } from "react";
import BackButton from "../backbutton/BackButton";
import "./DemoMeditation.css";
import {
  defaultMeditationVideoUrls,
  DemoMeditationProps,
  pickFromMood,
  pickRandom,
} from "../../../../helpers/constants";

export default function DemoMeditation({
  category,
  showBackButton = true,
  width = 640,
  height = 360,
  className,
  setShowMoodSelector,
  setIsContinueClicked,
  setIsDemoMode,
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
      setVideoUrl("");
    }
  };

  const shuffle = () => {
    const next = pickFromMood(category);
    setVideoUrl(next);
    setErrorCount(0);
  };

  return (
    <div className={className ?? "meditation-page"}>
      <div className="meditation-video-container">
        {showBackButton && (
          <BackButton
            label=" Back to Mood Selector"
            setShowMoodSelector={setShowMoodSelector}
            setIsContinueClicked={setIsContinueClicked}
            setIsDemoMode={setIsDemoMode}
          />
        )}
        <h2>🌸 Your Relaxing Guide (Demo)</h2>

        <video
          key={videoUrl}
          width={width}
          height={height}
          controls
          preload="metadata"
          onError={handleError}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="userLogin-button" onClick={shuffle}>
          Shuffle another calm clip
        </button>
      </div>
    </div>
  );
}
