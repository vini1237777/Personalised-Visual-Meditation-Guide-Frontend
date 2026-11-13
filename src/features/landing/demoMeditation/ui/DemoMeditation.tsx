import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoMeditationProps } from "../../meditation/model/meditation.types";
import { SESSION_NAME, describeBefore } from "../../journal/journal";
import SessionStage from "../../meditation/ui/SessionStage";

import video_6bzzjltmlliyu from "../../../../assets/videos/6bzzjltmllyu-download.mp4";
import video_8a2h0gds3bim from "../../../../assets/videos/8a2h0gds3bim-download.mp4";
import video_9ojkq72px8eb from "../../../../assets/videos/9ojkq72px8eb-download.mp4";
import video_ba8kltzwoe56 from "../../../../assets/videos/ba8kltzwoe56_download.mp4";
import video_il4dw4c9ky03 from "../../../../assets/videos/il4dw4c9ky03-download.mp4";
import video_qw3zgygxm643 from "../../../../assets/videos/qw3zgygxm643-download.mp4";
import video_rndu7mv2e554 from "../../../../assets/videos/rndu7mv2e554_download.mp4";
import video_u9jcwe1twnnu from "../../../../assets/videos/u9jcwe1twnnu-download.mp4";
import video_ve35tz082w2w from "../../../../assets/videos/ve35tz082w2w-download.mp4";

type MoodCategory =
  | "Joy"
  | "Sadness"
  | "Anger"
  | "Calmness"
  | "Fear"
  | "Love"
  | "Tiredness"
  | "Surprise";

const ALL_VIDEOS = [
  video_6bzzjltmlliyu,
  video_8a2h0gds3bim,
  video_9ojkq72px8eb,
  video_ba8kltzwoe56,
  video_il4dw4c9ky03,
  video_qw3zgygxm643,
  video_rndu7mv2e554,
  video_u9jcwe1twnnu,
  video_ve35tz082w2w,
] as const;

type VideoUrl = (typeof ALL_VIDEOS)[number];

const MOOD_VIDEOS: Record<MoodCategory, readonly VideoUrl[]> = {
  Joy: [video_6bzzjltmlliyu, video_8a2h0gds3bim],
  Sadness: [video_9ojkq72px8eb, video_ba8kltzwoe56],
  Anger: [video_il4dw4c9ky03, video_ve35tz082w2w],
  Calmness: [video_qw3zgygxm643, video_rndu7mv2e554],
  Fear: [video_u9jcwe1twnnu, video_6bzzjltmlliyu],
  Love: [video_8a2h0gds3bim, video_9ojkq72px8eb],
  Tiredness: [video_ba8kltzwoe56, video_il4dw4c9ky03],
  Surprise: [video_qw3zgygxm643, video_rndu7mv2e554],
};

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPool(category?: string | null): readonly VideoUrl[] {
  const key = category as MoodCategory | undefined;
  if (key && MOOD_VIDEOS[key]?.length) return MOOD_VIDEOS[key];
  return ALL_VIDEOS;
}

export default function DemoMeditation({
  category,
  isLoading = false,
  checkIn,
  onCheckOut,
}: DemoMeditationProps) {
  const pool = useMemo(() => getPool(category), [category]);

  const [videoUrl, setVideoUrl] = useState<VideoUrl>(() => randomPick(pool));
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    setVideoUrl(randomPick(pool));
    setFailCount(0);
  }, [pool]);

  const shuffle = useCallback(() => {
    const candidates = pool.filter((v) => v !== videoUrl);
    setVideoUrl(candidates.length ? randomPick(candidates) : randomPick(pool));
    setFailCount(0);
  }, [pool, videoUrl]);

  const handleVideoError = useCallback(() => {
    setFailCount((c) => c + 1);

    if (failCount >= 2) {
      console.error("DemoMeditation: video failed 3 times.");
      return;
    }

    const candidates = ALL_VIDEOS.filter((v) => v !== videoUrl);
    if (!candidates.length) return;

    setVideoUrl(randomPick(candidates));
  }, [failCount, videoUrl]);

  const showVideo = !isLoading && failCount < 3;
  const sessionName = SESSION_NAME[category ?? ""] ?? "Calm session";

  return (
    <SessionStage
      videoUrl={showVideo ? videoUrl : null}
      sessionName={sessionName}
      chosenFor={checkIn ? describeBefore(checkIn.before) : ""}
      onAnotherClip={shuffle}
      onCheckOut={onCheckOut}
      onVideoError={handleVideoError}
    />
  );
}
