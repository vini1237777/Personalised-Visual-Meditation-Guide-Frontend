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

const LandingPage = ({ user, setUserState }: LandingPageProps) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [meditationContent, setMeditationContent] = useState<any>({});

  const handleTitleButton = () => setShowMoodSelector(true);

  useEffect(() => {
    if (
      showMoodSelector ||
      isContinueClicked ||
      meditationContent?.meditationContent?.videoUrl?.length === 0
    ) {
      setIsLoading(false);
    }
  }, [showMoodSelector, isContinueClicked, meditationContent]);

  const renderHeroSection = () =>
    herosectionText?.map((data: any, index: number) => (
      <div key={index} className="hero-section">
        <h2>{data.headline}</h2>
        <p>{data.subheadline}</p>
        <button onClick={handleTitleButton}>{data.title}</button>
      </div>
    ));

  const renderMoodSelector = () => (
    <div className="mood-selector-section">
      <MoodSelector
        setIsShowMoodSelector={setShowMoodSelector}
        isShowMoodSelector={showMoodSelector}
        userState={{ ...user }}
        setUserState={setUserState}
        setIsLoading={setIsLoading}
        setIsContinueClicked={setIsContinueClicked}
        setMeditationContent={setMeditationContent}
      />
    </div>
  );

  const renderMeditationPage = () =>
    meditationContent?.meditationContent?.videoUrl?.length > 0 && (
      <MeditationPage
        meditationContent={meditationContent?.meditationContent?.videoUrl}
      />
    );

  return (
    <div className="landing-page">
      <div className="welcome-text">
        {!showMoodSelector
          ? `Welcome ${user?.fullName}`
          : "What's on your mind?"}
        !
      </div>

      <div className="heading">
        {!showMoodSelector && renderHeroSection()}
        {showMoodSelector && !isLoading
          ? renderMoodSelector()
          : renderMeditationPage()}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default LandingPage;
