import { useEffect, useState } from "react";
import { herosectionText } from "../../helpers/constants";
import { IUser } from "../../helpers/interface";
import "./LandingPage.css";
import MoodSelector from "./moodSelector/MoodSelector";
import Loader from "../loader/Loader";
import MeditationPage from "./meditationPage/MeditationPage";

interface LandingPageProps {
  user: IUser;
  setUserState: (state: any) => void;
}

type TMeditationContent = {
  videoUrl?: string;
  script?: string;
};

const LandingPage = ({ user, setUserState }: LandingPageProps) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [meditationContent, setMeditationContent] =
    useState<TMeditationContent>({});

  const [showAnimation, setShowAnimation] = useState(true);
  const [isdemoMode, setIsDemoMode] = useState(false);

  const showHeroSection = Object.keys(user)?.length > 0 && !showMoodSelector;

  const hasVideo =
    meditationContent &&
    meditationContent?.videoUrl &&
    meditationContent?.videoUrl?.trim()?.length > 0;

  useEffect(() => {
    if (hasVideo) {
      setIsLoading(false);
      setShowMoodSelector(false);
    }
  }, [hasVideo]);

  const handleTitleButton = () => setShowMoodSelector(true);

  const renderHeroSection = () =>
    herosectionText.map((data: any, index: number) => (
      <div key={index} className="hero-section">
        <h2>{data.headline}</h2>
        <p>{data.subheadline}</p>
        <button onClick={handleTitleButton}>{data.title}</button>
      </div>
    ));

  const renderMoodSelector = () => (
    <div className="mood-selector-section">
      <MoodSelector
        setShowMoodSelector={setShowMoodSelector}
        isShowMoodSelector={showMoodSelector}
        userState={{ ...user }}
        setUserState={setUserState}
        setIsLoading={setIsLoading}
        setIsContinueClicked={setIsContinueClicked}
        setShowAnimation={setShowAnimation}
        setMeditationContent={(updater: any) => {
          if (typeof updater === "function") {
            setMeditationContent((prev) => updater(prev));
          } else {
            setMeditationContent((prev) => ({ ...prev, ...updater }));
          }
        }}
        setIsDemoMode={setIsDemoMode}
        showAnimation={showAnimation}
        meditationContent={meditationContent}
        isdemoMode={isdemoMode}
      />
    </div>
  );

  const renderMeditationPage = () => (
    <MeditationPage
      meditationContent={meditationContent.videoUrl!}
      setShowMoodSelector={setShowMoodSelector}
      setIsContinueClicked={setIsContinueClicked}
      showAnimation={showAnimation}
      setIsDemoMode={setIsDemoMode}
      category={user?.category}
      isdemoMode={isdemoMode}
    />
  );

  return (
    <div className="landing-page">
      <div className="welcome-text">
        {showHeroSection && `Welcome ${user?.fullName}`}
      </div>

      <div className="heading">
        {Object.keys(user)?.length > 0 ? (
          !showMoodSelector && showHeroSection && renderHeroSection()
        ) : (
          <></>
        )}
        {showMoodSelector && renderMoodSelector()}
        {isContinueClicked && renderMeditationPage()}
      </div>

      {isLoading && <Loader />}
    </div>
  );
};

export default LandingPage;
