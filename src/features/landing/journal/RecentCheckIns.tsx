import styles from "./RecentCheckIns.module.css";
import { loadJournal, streakDays, whenLabel } from "./journal";

// A quiet record on the home page: how each recent session changed your mood.
export default function RecentCheckIns() {
  const list = loadJournal();
  if (list.length === 0) return null;

  const streak = streakDays(list);
  const recent = list.slice(0, 4);

  return (
    <aside className={styles.journal} aria-label="Your recent check ins">
      <p className={styles.head}>
        Your journal
        {streak >= 2 && <span className={styles.streak}>{streak} days in a row</span>}
      </p>
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
            </span>
            <span className={styles.when}>{whenLabel(c.at)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
