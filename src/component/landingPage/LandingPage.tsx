import { useEffect, useState } from "react";
import { herosectionText } from "../../helpers/constants";
import { IUser } from "../../helpers/interface";
import "./LandingPage.css";
import MoodSelector from "./moodSelector/MoodSelector";
import Loader from "../loader/Loader";
import MeditationPage from "./meditationPage/MeditationPage";
import buddhaImage from "../../assets/images/buddha.jpg";
import buddhaMobile from "../../assets/images/buddhaMobile.png";

interface LandingPageProps {
  user: IUser;
  setUserState: (state: any) => void;
  isLoggedIn: boolean;
}

type IMeditationContent = {
  videoUrl?: string;
  script?: string;
};

const LandingPage = ({ user, setUserState, isLoggedIn }: LandingPageProps) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [meditationContent, setMeditationContent] =
    useState<IMeditationContent>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isdemoMode, setIsDemoMode] = useState(false);

  const hasVideo =
    meditationContent &&
    meditationContent?.videoUrl &&
    meditationContent?.videoUrl?.trim()?.length > 0;

  const showHeroSection =
    isLoggedIn &&
    user &&
    Object.values?.(user || {})?.length > 0 &&
    !showMoodSelector;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
  }, [setUserState]);

  useEffect(() => {
    if (hasVideo) {
      setIsLoading(false);
      setShowMoodSelector(false);
      setShowAnimation(false);
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
        isdemoMode={isdemoMode}
        setIsDemoMode={setIsDemoMode}
        showAnimation={showAnimation}
        meditationContent={meditationContent}
        setIsCollapsed={setIsCollapsed}
        isCollapsed={isCollapsed}
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
      isLoading={isLoading}
    />
  );

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const displayName = (user?.fullName || savedUser?.fullName || "")
    .toString()
    .trim()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${isMobile ? buddhaMobile : buddhaImage})`,
      }}
    >
      <div className="welcome-text">
        {!showAnimation &&
          !isdemoMode &&
          showHeroSection &&
          (displayName ? `Welcome ${displayName}` : "Welcome")}
      </div>

      <div className="heading">
        {!showAnimation &&
        !isdemoMode &&
        savedUser &&
        Object.values?.(savedUser || {})?.length > 0 ? (
          !showMoodSelector && showHeroSection && renderHeroSection()
        ) : (
          <></>
        )}
        {showMoodSelector
          ? renderMoodSelector()
          : isdemoMode &&
            showAnimation && (
              <>
                <div className="welcome-text-mood">
                  {displayName ? `Welcome ${displayName}` : "Welcome"}
                </div>
                {renderHeroSection()}
              </>
            )}
        {isContinueClicked && renderMeditationPage()}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default LandingPage;
