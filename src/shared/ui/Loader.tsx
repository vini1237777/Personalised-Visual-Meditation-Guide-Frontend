import { useEffect, useState } from "react";
import { BreathRing, StepBar } from "shared/ui/kit";
import styles from "./Loader.module.css";
import breath from "./BreathStep.module.css";

const messages = [
  "Breathe in… and out.",
  "Slow down. You’re here now.",
  "Preparing your meditation…",
  "A calm session is almost ready.",
];

type LoaderProps = {
  title?: string;
  // Guide one slow breath (in 4s, out 4s) instead of rotating messages.
  breath?: boolean;
  onSkip?: () => void;
  waitingForVideo?: boolean;
  /** Shown as "Getting your grounding session ready". */
  sessionName?: string;
};

const VOICE_KEY = "soulsync.pandaVoice";

function voiceSaved(): boolean {
  try {
    return localStorage.getItem(VOICE_KEY) === "on";
  } catch {
    return false;
  }
}

// The panda talks you through the breath with the browser's own voice.
function speak(text: string) {
  const synth =
    typeof window !== "undefined" ? window.speechSynthesis : undefined;
  if (!synth) return;
  synth.cancel();
  const line = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices().filter((v) => v.lang.startsWith("en"));
  const soft = voices.find((v) =>
    /samantha|karen|moira|female|zira|google uk english female/i.test(v.name),
  );
  if (soft ?? voices[0])
    line.voice = (soft ?? voices[0]) as SpeechSynthesisVoice;
  line.rate = 0.8;
  line.pitch = 1.1;
  line.volume = 0.9;
  synth.speak(line);
}

// The panda's own breath: soft airy noise that swells on the way in and fades on the way out.
let audio: AudioContext | null = null;

function breathSound(kind: "in" | "out", seconds = 4) {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return;
  audio = audio ?? new Ctx();
  const ctx = audio;
  if (ctx.state === "suspended") void ctx.resume();

  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    // Brown noise sounds like air, white noise sounds like hiss.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const end = now + seconds - 0.2;

  if (kind === "in") {
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(1100, end);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + seconds * 0.6);
    gain.gain.linearRampToValueAtTime(0.0001, end);
  } else {
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(350, end);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
  }

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
  source.stop(now + seconds);
}

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

function BreathGuide({
  onSkip,
  waitingForVideo = false,
  sessionName = "calm session",
}: {
  onSkip?: () => void;
  waitingForVideo?: boolean;
  sessionName?: string;
}) {
  const [phase, setPhase] = useState<"ready" | "in" | "out">("ready");
  const [voiceOn, setVoiceOn] = useState(voiceSaved);

  useEffect(() => {
    const start = requestAnimationFrame(() => setPhase("in"));
    return () => cancelAnimationFrame(start);
  }, []);

  useEffect(() => {
    if (!waitingForVideo) {
      const toOut = setTimeout(() => setPhase("out"), 4000);
      return () => clearTimeout(toOut);
    }
    // A video takes minutes, so the breath keeps going, quietly, until it is ready.
    if (canSpeak) window.speechSynthesis.cancel();
    void audio?.suspend();
    const id = setInterval(
      () => setPhase((p) => (p === "in" ? "out" : "in")),
      4000,
    );
    return () => clearInterval(id);
  }, [waitingForVideo]);

  useEffect(() => {
    if (waitingForVideo || !voiceOn || phase === "ready") return;
    breathSound(phase);
    if (canSpeak)
      speak(phase === "in" ? "Breathe in slowly" : "And breathe out");
  }, [phase, voiceOn, waitingForVideo]);

  // Stop talking when the loader goes away.
  useEffect(
    () => () => {
      if (canSpeak) window.speechSynthesis.cancel();
      void audio?.suspend();
    },
    [],
  );

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    try {
      localStorage.setItem(VOICE_KEY, next ? "on" : "off");
    } catch {}
    if (!next && canSpeak) window.speechSynthesis.cancel();
    if (!next) void audio?.suspend();
    else if (phase !== "ready") breathSound(phase);
  };

  return (
    <div className={breath.screen} role="status" aria-live="polite">
      <StepBar current={1} className={breath.steps} />

      <BreathRing>
        <p className={breath.phase} key={phase}>
          {phase === "out" ? "Breathe out" : "Breathe in"}
        </p>
        <p className={breath.count}>
          {phase === "out" ? "out for four" : "in for four"}
        </p>
      </BreathRing>

      <p className={breath.status}>
        {waitingForVideo ? (
          "Your 8 second video is being made. This can take a few minutes."
        ) : (
          <>
            Getting your <strong>{sessionName.toLowerCase()}</strong> ready
          </>
        )}
      </p>

      <div className={breath.actions}>
        {onSkip && (
          <button type="button" className={breath.skip} onClick={onSkip}>
            {waitingForVideo
              ? "Play a calm session instead"
              : "Skip, I am ready"}
          </button>
        )}
        {!waitingForVideo && (
          <button
            type="button"
            className={breath.sound}
            onClick={toggleVoice}
            aria-pressed={voiceOn}
          >
            {voiceOn ? "Sound on" : "Sound off"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Loader({
  title = "Preparing your session…",
  breath = false,
  onSkip,
  waitingForVideo,
  sessionName,
}: LoaderProps) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (breath) return;
    const id = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setI((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 900);
    }, 2200);

    return () => clearInterval(id);
  }, [breath]);

  if (breath) {
    return (
      <BreathGuide
        onSkip={onSkip}
        waitingForVideo={waitingForVideo}
        sessionName={sessionName}
      />
    );
  }

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.circle} aria-label="Breathing animation" />

      <p className={styles.title}>{title}</p>

      <p className={`${styles.message} ${visible ? styles.show : styles.hide}`}>
        {messages[i]}
      </p>
    </div>
  );
}
