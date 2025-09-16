import BackButton from "./backbutton/BackButton";
import "./MeditationPage.css";

function MeditationPage({
  meditationContent,
  setShowMoodSelector,
  setIsMeditateBackButtonClicked,
  setIsContinueClicked,
}: any) {
  return (
    <div className="meditation-page">
      <BackButton
        label=" Back to Mood Selector"
        setShowMoodSelector={setShowMoodSelector}
        setIsMeditateBackButtonClicked={setIsMeditateBackButtonClicked}
        setIsContinueClicked={setIsContinueClicked}
      />
      <h2>Your Relaxing Guide</h2>
      <video width="640" height="360" controls>
        <source src={meditationContent} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default MeditationPage;
