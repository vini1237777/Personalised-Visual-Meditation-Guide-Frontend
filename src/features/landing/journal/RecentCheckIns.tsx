import { Link } from "react-router-dom";
import styles from "./RecentCheckIns.module.css";
import { capitalize, lastSevenDays, loadJournal, moodWord, streakDays, whenLabel } from "./journal";

// A quiet record on the home page: the last week at a glance and how the
// latest sessions changed your mood.
export default function RecentCheckIns({ side = false }: { side?: boolean }) {
  const list = loadJournal();
  if (list.length === 0) return null;

  const streak = streakDays(list);
  const week = lastSevenDays(list);
  const recent = list.slice(0, 3);
  const lastNote = list.find((c) => c.note)?.note;

  return (
    <aside className={`${styles.journal} ${side ? styles.side : ""}`} aria-label="Your journal">
      <p className={styles.head}>
        Your journal
        {streak >= 2 && <span className={styles.streak}>{streak} days in a row</span>}
      </p>

      <ol className={styles.week} aria-label="The last seven days">
        {week.map((d) => (
          <li key={d.key} className={styles.day}>
            <span
              className={`${styles.dot} ${d.emoji ? "" : styles.empty} ${d.isToday ? styles.today : ""}`}
              aria-label={d.emoji ? `${d.label}: ${moodWord(d.emoji)}` : `${d.label}: no check in`}
            >
              {d.emoji}
            </span>
            <span className={styles.dayLabel}>{d.label}</span>
          </li>
        ))}
      </ol>

      <ul className={styles.list}>
        {recent.map((c) => (
          <li key={c.id} className={styles.row}>
            <span className={styles.faces}>
              {c.before.emojis[0]}
              {c.after && (
                <>
                  <span className={styles.arrow}>→</span>
                  {c.after}
                </>
              )}
              <span className={styles.words}>
                {c.after && moodWord(c.after) === moodWord(c.before.emojis[0])
                  ? `Still ${moodWord(c.after)}`
                  : `${capitalize(moodWord(c.before.emojis[0]))}${c.after ? ` to ${moodWord(c.after)}` : ""}`}
              </span>
            </span>
            <span className={styles.when}>{whenLabel(c.at)}</span>
          </li>
        ))}
      </ul>

      {side && lastNote && (
        <p className={styles.lastNote}>
          “{lastNote}” <span>Your last note</span>
        </p>
      )}

      <Link to="/journal" className={styles.open}>
        Open my journal →
      </Link>
    </aside>
  );
}
