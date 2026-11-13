import { Link } from "react-router-dom";
import { panel } from "shared/ui/kit";
import styles from "./RecentCheckIns.module.css";
import { feelingLabel } from "../mood/config/feelings.config";
import { loadJournal, whenLabel } from "./journal";

// A quiet record beside the feeling step: the last few sessions, before and after.
export default function RecentCheckIns(_props: { side?: boolean }) {
  const list = loadJournal();
  if (list.length === 0) return null;

  const recent = list.slice(0, 3);

  return (
    <aside
      className={`${panel.panel} ${styles.recent}`}
      aria-label="Your last check ins"
    >
      <h2 className={styles.head}>
        <span>Your last check ins</span>
        <Link to="/journal" className={styles.open}>
          Journal
        </Link>
      </h2>

      <ul className={styles.list}>
        {recent.map((c) => {
          const before = feelingLabel(c.before.emojis[0] ?? "");
          const after = c.after ? feelingLabel(c.after) : "";
          return (
            <li key={c.id} className={styles.row}>
              <span className={styles.change}>
                {before}
                {after && (
                  <>
                    <span className={styles.arrow} aria-label="to">
                      {" "}
                      →{" "}
                    </span>
                    {after}
                  </>
                )}
              </span>
              <span className={styles.when}>{whenLabel(c.at)}</span>
              <small className={styles.note}>
                {c.note ?? (c.before.feelings.join(", ") || "No note")}
              </small>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
