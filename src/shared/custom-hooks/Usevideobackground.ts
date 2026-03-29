import { useEffect, useRef, useState } from "react";

export function useVideoBackground(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    setReady(false);

    const onReady = () => setReady(true);

    vid.addEventListener("playing", onReady);
    vid.addEventListener("canplaythrough", onReady);

    vid.src = src;
    vid.load();
    vid.play().catch(() => {});

    return () => {
      vid.removeEventListener("playing", onReady);
      vid.removeEventListener("canplaythrough", onReady);
    };
  }, [src]);

  return { videoRef, ready };
}
