import { useState } from "react";
import "./MoodSelector.css";
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
  setShowMoodSelector,
  isShowMoodSelector,
  userState,
  setUserState,
  setIsLoading,
  setIsContinueClicked,
  setMeditationContent,
  setShowAnimation,
  isdemoMode,
}: {
  setShowMoodSelector: any;
  isShowMoodSelector: boolean;
  userState: any;
  setUserState: any;
  setIsLoading: any;
  setIsContinueClicked: any;
  setMeditationContent: any;
  setShowAnimation: any;
  isdemoMode: boolean;
}) {
  const [selectedEmojis, setSelectedEmojis] = useState<any[]>([]);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleContinue = async () => {
    setIsContinueClicked(true);
    setIsLoading(true);
    setShowMoodSelector(false);

    if (isdemoMode) {
      setIsLoading(false);
      setShowAnimation(false);
      return;
    }

    if (!userState?.email || String(userState.email).trim() === "") {
      toast.error("Please log in first (email is required).");
      setIsLoading(false);
      setShowMoodSelector(true);
      return;
    }

    try {
      setIsLoading(true);

      const response = await UserService.getScript({
        selectedFeelings,
        selectedEmojis,
        email: (userState && userState.email) || "",
      });

      if (response?.status !== 200) {
        throw new Error(`Unexpected status: ${response?.status}`);
      }

      const data = response.data as {
        generatedScripts?: string;
        videoUrl?: string;
        email: string;
        name?: string;
        [k: string]: any;
      };

      const hasScript =
        typeof data.generatedScripts === "string" &&
        data.generatedScripts.trim().length > 0;
      const hasVideo =
        typeof data.videoUrl === "string" && data.videoUrl.trim().length > 0;

      if (hasScript && hasVideo) {
        toast.success("Successfully generated meditation script");

        setUserState((prev: any) => ({
          ...prev,
          email: data.email ?? prev.email,
          fullName: data.fullName ?? prev.fullName,
        }));

        setMeditationContent((prev: any) => ({
          ...prev,
          script: data.generatedScripts,
          videoUrl: data.videoUrl,
        }));
      } else {
        throw new Error(
          "Malformed response from server (missing script or videoUrl)."
        );
      }
    } catch (err) {
      console.error(err);
      // toast.error(
      //   "Internal Server Error: API quota exceeded for generating video "
      // );
      toast.error(
        err instanceof Error
          ? err.message
          : "Internal Server Error: API quota exceeded for generating video"
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowAnimation(true), 0);
    }
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
    <>
      <>
        <div className="mood-card">
          {isShowMoodSelector && (
            <button
              className="close-btn"
              onClick={() => {
                setIsCollapsed(true);
                setShowMoodSelector(false);
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
                const angle =
                  (index / categoryData.feelings.length) * 2 * Math.PI;
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
                {selectedFeelings.length > 0
                  ? selectedFeelings.join(", ")
                  : "None"}
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
              <div className="arrow-button"></div>
            </div>
          )}
        </div>
      </>
    </>
  );
}
