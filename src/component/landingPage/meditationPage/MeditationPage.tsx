import { useEffect, useState } from "react";
import BackButton from "./backbutton/BackButton";
import "./MeditationPage.css";
import { BreathingPanda } from "./BreathingPanda/BreathingPanda";
import DemoMeditation from "./demoMeditation/DemoMeditation";

const renderDemoMeditationPage = (
  category: any,
  setShowMoodSelector: any,
  setIsContinueClicked: any,
  setIsDemoMode: any
) => (
  <DemoMeditation
    category={category}
    setShowMoodSelector={setShowMoodSelector}
    setIsContinueClicked={setIsContinueClicked}
    setIsDemoMode={setIsDemoMode}
  />
);

function MeditationPage({
  meditationContent,
  setShowMoodSelector,
  // setIsMeditateBackButtonClicked,
  setIsContinueClicked,
  showAnimation,
  setIsDemoMode,
  category,
  isdemoMode,
}: any) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    if (meditationContent && meditationContent.length > 0) {
      setVideoUrl(meditationContent);
    }
  }, [meditationContent]);

  console.log(videoUrl, "...........videoUrl");

  if (isdemoMode) {
    return (
      <div className="meditation-page">
        <BackButton
          label=" Back to Mood Selector"
          setShowMoodSelector={setShowMoodSelector}
          setIsContinueClicked={setIsContinueClicked}
          setIsDemoMode={setIsDemoMode}
        />

        {renderDemoMeditationPage(
          category,
          setShowMoodSelector,
          setIsContinueClicked,
          setIsDemoMode
        )}
      </div>
    );
  }

  return (
    <div className="meditation-page">
      <BackButton
        label="Back to Mood Selector"
        setShowMoodSelector={setShowMoodSelector}
        setIsContinueClicked={setIsContinueClicked}
        setIsDemoMode={setIsDemoMode}
        setVideoUrl={setVideoUrl}
      />
      <h2> 🌸 Your Relaxing Guide</h2>
      {!videoUrl && (
        <h2
          onClick={() => {
            setShowMoodSelector(true);
            setIsContinueClicked(false);
            setIsDemoMode(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {" "}
          🌸 See Demo{" "}
        </h2>
      )}
      {showAnimation && videoUrl && !!videoUrl ? (
        <video width="640" height="360" controls key={videoUrl}>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <BreathingPanda />
      )}
    </div>
  );
}

export default MeditationPage;
