import { useState } from "react";
import type { MeditationPageProps } from "../model/meditation.types";
import DemoMeditation from "features/landing/demoMeditation/ui/DemoMeditation";
import CheckOut from "features/landing/journal/CheckOut";
import { SESSION_NAME, describeBefore } from "features/landing/journal/journal";
import SessionStage from "./SessionStage";

/** Steps 03 and 04: the session, then check out. */
export default function MeditationPage({
  meditationContent,
  category,
  isLoading,
  showAnimation,
  onBackToMood,
  onDemoModeChange,
  onAnimationChange,
  checkIn,
}: MeditationPageProps) {
  const [stage, setStage] = useState<"watch" | "checkout">("watch");
  const videoUrl = (meditationContent ?? "").toString().trim();
  const sessionName = SESSION_NAME[category] ?? "Calm session";
  const chosenFor = checkIn ? describeBefore(checkIn.before) : "";

  const checkOut = () => (checkIn ? setStage("checkout") : onBackToMood());

  if (stage === "checkout") {
    return (
      <CheckOut
        checkIn={checkIn ?? null}
        sessionName={sessionName}
        onAnotherSession={onBackToMood}
      />
    );
  }

  if (videoUrl) {
    return (
      <SessionStage
        videoUrl={videoUrl}
        sessionName={sessionName}
        chosenFor={chosenFor}
        onCheckOut={checkOut}
      />
    );
  }

  if (showAnimation) {
    return (
      <DemoMeditation
        category={category}
        isLoading={isLoading}
        onBack={onBackToMood}
        checkIn={checkIn}
        onCheckOut={checkOut}
      />
    );
  }

  return (
    <SessionStage
      videoUrl={null}
      sessionName={sessionName}
      chosenFor={chosenFor}
      onCheckOut={checkOut}
      onAnotherClip={() => {
        onDemoModeChange(true);
        onAnimationChange(false);
        onBackToMood();
      }}
    />
  );
}
