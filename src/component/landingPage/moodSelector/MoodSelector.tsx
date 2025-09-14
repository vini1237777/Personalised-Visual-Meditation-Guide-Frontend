import { useState } from "react";
import "./MoodSelector.css";
import { FaArrowRight } from "react-icons/fa";
import { UserService } from "../../../services/userServices";
import toast from "react-hot-toast";

const emojiMap: Record<string, { category: string; feelings: string[] }> = {
  "😀": {
    category: "Joy",
    feelings: ["Excited", "Proud", "Playful", "Content"],
  },
  "😢": {
    category: "Sadness",
    feelings: ["Lonely", "Vulnerable", "Guilty", "Despair"],
  },
  "😡": {
    category: "Anger",
    feelings: ["Frustrated", "Jealous", "Annoyed", "Bitter"],
  },
  "😌": {
    category: "Calmness",
    feelings: ["Peaceful", "Relaxed", "Satisfied", "Hopeful"],
  },
  "😨": {
    category: "Fear",
    feelings: ["Anxious", "Insecure", "Rejected", "Scared"],
  },
  "😍": {
    category: "Love",
    feelings: ["Affectionate", "Compassionate", "Passionate", "Warm"],
  },
  "😴": {
    category: "Tiredness",
    feelings: ["Sleepy", "Bored", "Lazy", "Drained"],
  },
  "🤔": {
    category: "Surprise",
    feelings: ["Curious", "Intrigued", "Confused", "Amazed"],
  },
};

export default function MoodSelector({
  setIsShowMoodSelector,
  isShowMoodSelector,
  userState,
  setUserState,
  setIsLoading,
  setIsContinueClicked,
  setMeditationContent,
}: {
  setIsShowMoodSelector: any;
  isShowMoodSelector: boolean;
  userState: any;
  setUserState: any;
  setIsLoading: any;
  setIsContinueClicked: any;
  setMeditationContent: any;
}) {
  const [selectedEmojis, setSelectedEmojis] = useState<any[]>([]); // multi-select
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null); // only one wheel
  const [selectedFeelings, setSelectedFeelings] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);

    await UserService.getScript({
      selectedFeelings,
      selectedEmojis,
      userState,
    })
      .then((res: any) => {
        if (res.status === 200) {
          return res?.data;
        }
      })
      .then((res) => {
        if (res?.generatedScripts?.length > 0 && res?.videoUrl?.length > 0) {
          toast.success("Successfully generated meditation script");
          setIsLoading(false);
          setIsContinueClicked(false);
          setUserState((prevState: any) => ({
            ...prevState,
            ...res?.data,
          }));
          setMeditationContent((prevState: any) => ({
            ...prevState,
            ...res?.data,
          }));
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          "Internal Server Error: API Quota exceeded for generating Video."
        );
      });
  };

  const toggleEmoji = (emoji: string | null) => {
    setSelectedEmojis((prev: any) =>
      prev.includes(emoji)
        ? prev.filter((e: any) => e !== emoji)
        : [...prev, emoji]
    );
    setActiveEmoji(emoji);
    setIsCollapsed(false);
  };

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev: any) =>
      prev.includes(feeling)
        ? prev.filter((f: any) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const categoryData = activeEmoji ? emojiMap[activeEmoji] : null;

  return (
    <div className="mood-card">
      {isShowMoodSelector && (
        <button
          className="close-btn"
          onClick={() => {
            setIsCollapsed(true);
            setIsShowMoodSelector(false);
          }}
        >
          ✖
        </button>
      )}
      <div className="emoji-options">
        {Object.keys(emojiMap).map((emoji, index) => (
          <button
            key={index}
            className={`emoji-button ${
              selectedEmojis.includes(emoji) ? "active" : ""
            }`}
            onClick={() => toggleEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      {!isCollapsed && categoryData && (
        <div className="emotion-wheel">
          {categoryData.feelings.map((feeling: string, index: number) => {
            const angle = (index / categoryData.feelings.length) * 2 * Math.PI;
            const radius = 110;
            const x = 120 + radius * Math.cos(angle);
            const y = 120 + radius * Math.sin(angle);

            return (
              <div
                key={feeling}
                className={`feeling-item ${categoryData.category} ${
                  selectedFeelings.includes(feeling) ? "selected" : ""
                }`}
                style={{ top: y, left: x }}
                onClick={() => toggleFeeling(feeling)}
              >
                {feeling}
              </div>
            );
          })}
        </div>
      )}
      {!isCollapsed && selectedEmojis?.length >= 0 && (
        <div className="output-box">
          <p>
            <strong>Selected Emojis:</strong>{" "}
            {selectedEmojis.length > 0 ? selectedEmojis.join(" ") : "None"}
          </p>
          <p>
            <strong>Active Wheel:</strong> {activeEmoji || "None"}
          </p>
          <p>
            <strong>Feelings:</strong>{" "}
            {selectedFeelings.length > 0 ? selectedFeelings.join(", ") : "None"}
          </p>
        </div>
      )}

      {!isCollapsed && selectedEmojis?.length > 0 && (
        <div className="userLogin-button-wrapper">
          <button
            className="userLogin-button"
            onClick={() => {
              handleContinue();
            }}
          >
            Continue
          </button>
          <div className="arrow-button">
            <FaArrowRight color="gray" />
          </div>
        </div>
      )}
    </div>
  );
}
