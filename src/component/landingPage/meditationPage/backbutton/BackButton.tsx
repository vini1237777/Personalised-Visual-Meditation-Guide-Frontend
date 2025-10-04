import "./BackButton.css";

interface BackButtonProps {
  label?: string;
  setShowMoodSelector: any;
  setIsContinueClicked: any;
  setIsDemoMode?: any;
  setVideoUrl?: any;
}

export default function BackButton({
  label = "Back",
  setShowMoodSelector,
  setIsContinueClicked,
  setIsDemoMode,
  setVideoUrl,
}: BackButtonProps) {
  return (
    <button
      onClick={() => {
        setShowMoodSelector(true);
        // setIsMeditateBackButtonClicked(true);
        setIsContinueClicked(false);
        setIsDemoMode(false);
        setVideoUrl && setVideoUrl("");
      }}
      className="back-button"
    >
      <span>{label}</span>
    </button>
  );
}
