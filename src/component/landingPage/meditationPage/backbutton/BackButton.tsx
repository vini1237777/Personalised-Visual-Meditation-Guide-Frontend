import { FaArrowLeft } from "react-icons/fa";
import "./BackButton.css";

interface BackButtonProps {
  label?: string;
  setShowMoodSelector: any;
  setIsMeditateBackButtonClicked: any;
  setIsContinueClicked: any;
}

export default function BackButton({
  label = "Back",
  setShowMoodSelector,
  setIsMeditateBackButtonClicked,
  setIsContinueClicked,
}: BackButtonProps) {
  return (
    <button
      onClick={() => {
        setShowMoodSelector(true);
        setIsMeditateBackButtonClicked(true);
        setIsContinueClicked(false);
      }}
      className="back-button"
    >
      <span>
        <FaArrowLeft />
      </span>
      <span>{label}</span>
    </button>
  );
}
