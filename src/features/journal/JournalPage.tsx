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
  lastSevenDays,
  loadJournal,
  moodOf,
  moodWord,
  saveNote,
  streakDays,
} from "features/landing/journal/journal";

type View = "list" | "cards" | "calendar";
const VIEW_LABEL: Record<View, string> = { list: "List", cards: "Cards", calendar: "Calendar" };
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEW_KEY = "soulsync.journalView";

function mostOften(words: string[]) {
  const count = new Map<string, number>();
  words.forEach((w) => w && count.set(w, (count.get(w) ?? 0) + 1));
  let best = "";
  let n = 0;
  count.forEach((v, k) => {
    if (v > n) {
      best = k;
      n = v;
    }
  });
  return best;
}

function timeOf(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

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
  const [view, setView] = useState<View>(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      return saved === "cards" || saved === "calendar" ? saved : "list";
    } catch {
      return "list";
    }
  });
  const chooseView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // the choice just won't be remembered
    }
  };
  const [all, setAll] = useState<CheckIn[]>(loadJournal);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const startNote = (c: CheckIn) => {
    setEditing(c.id);
    setDraft(c.note ?? "");
  };
  const keepNote = (id: string) => {
    saveNote(id, draft);
    setAll(loadJournal());
    setEditing(null);
  };
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

  // Calendar: one month at a time, tap a day to see its sessions.
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [picked, setPicked] = useState(() => new Date().toDateString());

  const byDay = useMemo(() => {
    const map = new Map<string, CheckIn[]>();
    for (const c of all) {
      const key = new Date(c.at).toDateString();
      map.set(key, [...(map.get(key) ?? []), c]);
    }
    return map;
  }, [all]);

  const cells = useMemo(() => {
    const first = month.getDay();
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const total = Math.ceil((first + days) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const n = i - first + 1;
      if (n < 1 || n > days) return null;
      const date = new Date(month.getFullYear(), month.getMonth(), n);
      return { n, key: date.toDateString(), items: byDay.get(date.toDateString()) ?? [] };
    });
  }, [month, byDay]);

  const monthItems = useMemo(
    () => all.filter((c) => {
      const d = new Date(c.at);
      return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
    }),
    [all, month],
  );
  const monthLeave = mostOften(monthItems.filter((c) => c.after).map((c) => moodWord(c.after as string)));
  const monthName = month.toLocaleDateString([], { month: "long", year: "numeric" });
  const now = new Date();
  const atThisMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const todayKey = now.toDateString();
  const pickedItems = byDay.get(picked) ?? [];
  const shiftMonth = (by: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + by, 1));

  const better = list.filter(feltBetter).length;
  const week = lastSevenDays(all);
  const arrive = mostOften(list.map((c) => moodWord(c.before.emojis[0])));
  const leave = mostOften(list.filter((c) => c.after).map((c) => moodWord(c.after as string)));

  const feelingsOf = (c: CheckIn) =>
    c.before.feelings.length ? c.before.feelings : [capitalize(moodWord(c.before.emojis[0]))];

  const story = (c: CheckIn) => {
    const from = moodWord(c.before.emojis[0]);
    if (!c.after) return `Came in ${from}. No check out yet.`;
    const to = moodWord(c.after);
    return from === to ? `Came in ${from} and stayed ${to}.` : `Came in ${from}, left ${to}.`;
  };

  const noteBlock = (c: CheckIn) =>
    editing === c.id ? (
      <div className={styles.noteEdit}>
        <textarea
          className={styles.noteInput}
          value={draft}
          maxLength={500}
          rows={2}
          autoFocus
          placeholder="What do you want to remember about this session?"
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className={styles.noteActions}>
          <button type="button" className={styles.saveBtn} onClick={() => keepNote(c.id)}>
            Save note
          </button>
          <button type="button" className={styles.textBtn} onClick={() => setEditing(null)}>
            Cancel
          </button>
        </div>
      </div>
    ) : c.note ? (
      <button type="button" className={styles.noteShow} onClick={() => startNote(c)} title="Edit note">
        “{c.note}”
      </button>
    ) : (
      <button type="button" className={styles.textBtn} onClick={() => startNote(c)}>
        + Add a note
      </button>
    );

  const entryRow = (c: CheckIn) => {
    const mood = moodOf(c.before.emojis[0]);
    return (
      <article key={c.id} className={styles.entry}>
        <div className={styles.pair} aria-label={story(c)}>
          <span className={styles.face}>{c.before.emojis[0]}</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
          <span
            className={`${styles.face} ${c.after ? "" : styles.faceEmpty}`}
            title={c.after ? undefined : "No check out yet"}
          >
            {c.after ?? "?"}
          </span>
        </div>
        <div className={styles.middle}>
          <div className={styles.sessionRow}>
            <h3 className={styles.session}>{SESSION_NAME[mood] ?? "Calm session"}</h3>
            {feltBetter(c) && <span className={styles.better}>Felt better</span>}
          </div>
          <p className={styles.story}>{story(c)}</p>
          <div className={styles.bubbles}>
            {feelingsOf(c).map((f) => (
              <span key={f} className={styles.bubble} style={{ background: BUBBLE[mood] }}>
                {f}
              </span>
            ))}
          </div>
          {noteBlock(c)}
        </div>
        <span className={styles.time}>{timeOf(c.at)}</span>
      </article>
    );
  };

  const calendar = (
    <div className={styles.calendar}>
      <section className={styles.calMain} aria-label={monthName}>
        <div className={styles.calHead}>
          <h3 className={styles.calMonth}>{monthName}</h3>
          <div className={styles.calNav}>
            <button type="button" className={styles.calArrow} onClick={() => shiftMonth(-1)} aria-label="Previous month">
              ‹
            </button>
            <button
              type="button"
              className={styles.calArrow}
              onClick={() => shiftMonth(1)}
              disabled={atThisMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>
        <p className={styles.calSummary}>
          {monthItems.length === 0
            ? "No check ins this month."
            : `${monthItems.length} ${monthItems.length === 1 ? "check in" : "check ins"} this month${
                monthLeave ? `. You left ${monthLeave} most often` : ""
              }.`}
        </p>
        <div className={styles.calWeekdays} aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className={styles.calGrid}>
          {cells.map((cell, i) =>
            cell ? (
              <button
                key={cell.key}
                type="button"
                className={`${styles.calDay} ${cell.items.length ? styles.calHas : ""} ${
                  cell.key === picked ? styles.calPicked : ""
                } ${cell.key === todayKey ? styles.calToday : ""}`}
                onClick={() => setPicked(cell.key)}
                aria-pressed={cell.key === picked}
                aria-label={`${cell.n} ${monthName}: ${
                  cell.items.length ? `${cell.items.length} ${cell.items.length === 1 ? "check in" : "check ins"}` : "no check in"
                }`}
              >
                <span className={styles.calNum}>{cell.n}</span>
                {cell.items.length > 0 && (
                  <span className={styles.calFace}>{cell.items[0].after ?? cell.items[0].before.emojis[0]}</span>
                )}
                {cell.items.length > 1 && <span className={styles.calMore}>+{cell.items.length - 1}</span>}
              </button>
            ) : (
              <span key={`blank-${i}`} className={styles.calBlank} />
            ),
          )}
        </div>
      </section>

      <aside className={styles.calDetail} aria-live="polite">
        <h3 className={styles.calDetailTitle}>
          {new Date(picked).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        {pickedItems.length === 0 ? (
          <p className={styles.calNone}>No check in on this day.</p>
        ) : (
          pickedItems.map((c) => <div key={c.id}>{entryRow(c)}</div>)
        )}
      </aside>
    </div>
  );

  const toolbar = (
    <div className={styles.toolbar}>
      <div className={styles.toolbarText}>
        <h2 className={styles.entriesTitle}>
          {view === "calendar" ? "Calendar" : current.label === "All" ? "All check ins" : current.label}
        </h2>
        {view !== "calendar" && (
          <span className={styles.count}>
            {list.length === 0 ? "Nothing here yet" : `${list.length} ${list.length === 1 ? "check in" : "check ins"}`}
          </span>
        )}
      </div>
      <div className={styles.tools}>
        {view !== "calendar" && (
        <div className={styles.segment} role="group" aria-label="Show check ins from">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`${styles.segBtn} ${range === r.key ? styles.segOn : ""}`}
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
        )}
        <div className={styles.segment} role="group" aria-label="Journal view">
          {(["list", "cards", "calendar"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`${styles.segBtn} ${view === v ? styles.segOn : ""}`}
              aria-pressed={view === v}
              onClick={() => chooseView(v)}
            >
              {VIEW_LABEL[v]}
            </button>
          ))}
        </div>
        <Link to="/" className={styles.newBtn}>
          New check in
        </Link>
      </div>
    </div>
  );

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

      <div className={styles.layout}>
        <aside className={`${styles.card} ${styles.panel}`}>
          <h1 className={styles.title}>Your journal</h1>
          <p className={styles.summary}>
            {list.length === 0
              ? "No check ins here yet."
              : `${current.lead} you checked in ${times(list.length)}${
                  better ? ` and left feeling better ${times(better)}` : ""
                }.`}
          </p>
          {streak >= 2 && <span className={styles.streak}>{streak} days in a row</span>}

          <ol className={styles.week} aria-label="The last seven days">
            {week.map((d) => (
              <li key={d.key} className={styles.weekDay}>
                <span
                  className={`${styles.dot} ${d.emoji ? "" : styles.dotEmpty} ${d.isToday ? styles.dotToday : ""}`}
                  aria-label={d.emoji ? `${d.label}: ${moodWord(d.emoji)}` : `${d.label}: no check in`}
                >
                  {d.emoji}
                </span>
                <span className={styles.weekLabel}>{d.label}</span>
              </li>
            ))}
          </ol>

          {arrive && (
            <p className={styles.insight}>
              You arrive {arrive} most often{leave ? `, and you leave ${leave} most often` : ""}.
            </p>
          )}
        </aside>

        <main className={`${styles.card} ${styles.entries}`}>
          {toolbar}
          {all.length > 0 && view === "calendar" ? (
            calendar
          ) : groups.length === 0 ? (
            <div className={styles.empty}>
              <p>Share how you feel on the home page and your first session will show up here.</p>
              <Link to="/" className={styles.cta}>
                Share how I feel
              </Link>
            </div>
          ) : view === "cards" ? (
            <div className={styles.grid}>
              {list.map((c) => {
                const mood = moodOf(c.before.emojis[0]);
                return (
                  <article key={c.id} className={styles.tile}>
                    <div className={styles.tileTop}>
                      <span>{dayHeading(c.at)}</span>
                      <span>{timeOf(c.at)}</span>
                    </div>
                    <div className={`${styles.tileFaces} ${styles.pair}`} aria-label={story(c)}>
                      <span className={styles.face}>{c.before.emojis[0]}</span>
                      <span className={styles.arrow} aria-hidden="true">→</span>
                      {c.after ? (
                        <span className={styles.face}>{c.after}</span>
                      ) : (
                        <span className={`${styles.face} ${styles.faceEmpty}`} title="No check out yet">?</span>
                      )}
                    </div>
                    <h3 className={styles.session}>{SESSION_NAME[mood] ?? "Calm session"}</h3>
                    <p className={styles.story}>
                      {story(c)} {feltBetter(c) && <span className={styles.better}>Felt better</span>}
                    </p>
                    <div className={styles.bubbles}>
                      {feelingsOf(c).map((f) => (
                        <span key={f} className={styles.bubble} style={{ background: BUBBLE[mood] }}>
                          {f}
                        </span>
                      ))}
                    </div>
                    {noteBlock(c)}
                  </article>
                );
              })}
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.heading} className={styles.group}>
                <h2 className={styles.dayHeading}>{g.heading}</h2>
                {g.items.map((c) => {
                  return entryRow(c);
                })}
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
