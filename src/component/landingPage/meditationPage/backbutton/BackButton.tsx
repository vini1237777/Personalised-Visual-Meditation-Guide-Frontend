import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BackButton.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
        setIsContinueClicked(false);
        setIsDemoMode(false);
        setVideoUrl && setVideoUrl("");
      }}
      className="back-button"
    >
      <span>
        <FontAwesomeIcon icon={faArrowLeft} /> {label}
      </span>
    </button>
  );
}
