import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./JournalPage.module.css";
import { BG_VIDEOS } from "assets/bg-videos/videoUrls";
import { useVideoBackground } from "shared/custom-hooks/Usevideobackground";
import {
  BUBBLE,
  CheckIn,
  SESSION_NAME,
  capitalize,
  feltBetter,
  loadJournal,
  moodOf,
  moodWord,
  streakDays,
} from "features/landing/journal/journal";

type Range = "week" | "month" | "all";

const RANGES: { key: Range; label: string; days: number | null; lead: string }[] = [
  { key: "week", label: "This week", days: 7, lead: "This week" },
  { key: "month", label: "This month", days: 30, lead: "This month" },
  { key: "all", label: "All", days: null, lead: "So far" },
];

function dayHeading(at: number) {
  const d = new Date(at);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}

function times(n: number) {
  return n === 1 ? "once" : n === 2 ? "twice" : `${n} times`;
}

export default function JournalPage() {
  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg1);
  const [range, setRange] = useState<Range>("week");
  const all = useMemo(loadJournal, []);
  const streak = streakDays(all);
  const current = RANGES.find((r) => r.key === range)!;

  const list = useMemo(() => {
    if (current.days === null) return all;
    const since = Date.now() - current.days * 24 * 60 * 60 * 1000;
    return all.filter((c) => c.at >= since);
  }, [all, current.days]);

  const groups = useMemo(() => {
    const out: { heading: string; items: CheckIn[] }[] = [];
    for (const c of list) {
      const heading = dayHeading(c.at);
      const last = out[out.length - 1];
      if (last && last.heading === heading) last.items.push(c);
      else out.push({ heading, items: [c] });
    }
    return out;
  }, [list]);

  const better = list.filter(feltBetter).length;

  return (
    <div className={styles.page}>
      <div className={styles.poster} />
      <video
        ref={videoRef}
        className={styles.videoBg}
        muted
        loop
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />
      <div className={styles.overlay} />

      <main className={styles.card}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>Your journal</h1>
            <p className={styles.summary}>
              {list.length === 0
                ? "No check ins here yet."
                : `${current.lead} you checked in ${times(list.length)}${
                    better ? ` and left feeling better ${times(better)}` : ""
                  }.`}
            </p>
          </div>
          {streak >= 2 && <span className={styles.streak}>{streak} days in a row</span>}
        </div>

        <div className={styles.filters} role="group" aria-label="Show check ins from">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`${styles.filter} ${range === r.key ? styles.filterOn : ""}`}
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {groups.length === 0 ? (
          <div className={styles.empty}>
            <p>Share how you feel on the home page and your first session will show up here.</p>
            <Link to="/" className={styles.cta}>
              Share how I feel
            </Link>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.heading} className={styles.group}>
              <h2 className={styles.dayHeading}>{g.heading}</h2>
              {g.items.map((c) => {
                const mood = moodOf(c.before.emojis[0]);
                const feelings = c.before.feelings.length
                  ? c.before.feelings
                  : [capitalize(moodWord(c.before.emojis[0]))];
                return (
                  <article key={c.id} className={styles.entry}>
                    <span className={styles.face} aria-label={`Came in ${moodWord(c.before.emojis[0])}`}>
                      {c.before.emojis[0]}
                    </span>
                    <div className={styles.middle}>
                      <h3 className={styles.session}>{SESSION_NAME[mood] ?? "Calm session"}</h3>
                      <div className={styles.bubbles}>
                        {feelings.map((f) => (
                          <span key={f} className={styles.bubble} style={{ background: BUBBLE[mood] }}>
                            {f}
                          </span>
                        ))}
                      </div>
                      {c.note && <p className={styles.note}>“{c.note}”</p>}
                    </div>
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                    {c.after ? (
                      <span className={styles.face} aria-label={`Left ${moodWord(c.after)}`}>
                        {c.after}
                      </span>
                    ) : (
                      <span className={`${styles.face} ${styles.faceEmpty}`} title="No check out">
                        ?
                      </span>
                    )}
                    <span className={styles.time}>
                      {new Date(c.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </article>
                );
              })}
            </section>
          ))
        )}
      </main>
    </div>
  );
}
