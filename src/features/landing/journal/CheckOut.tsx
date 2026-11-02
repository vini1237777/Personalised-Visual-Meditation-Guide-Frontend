import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CheckOut.module.css";
import { EMOJI_MAP } from "../mood/config/emoji.config";
import {
  CheckIn,
  GOOD_MOODS,
  describeBefore,
  finishCheckIn,
  moodOf,
  moodWord,
  saveNote,
} from "./journal";

// Shown under a session: "How do you feel now?" and the shift since you came in.
export default function CheckOut({ checkIn, className = "" }: { checkIn: CheckIn | null; className?: string }) {
  const [after, setAfter] = useState<string | null>(checkIn?.after ?? null);
  const [note, setNote] = useState(checkIn?.note ?? "");
  const [noteSaved, setNoteSaved] = useState(Boolean(checkIn?.note));
  if (!checkIn) return null;

  const keepNote = () => {
    saveNote(checkIn.id, note);
    setNoteSaved(true);
  };

  const before = describeBefore(checkIn.before);

  const pick = (emoji: string) => {
    setAfter(emoji);
    finishCheckIn(checkIn.id, emoji);
  };

  return (
    <section className={`${styles.card} ${className}`} aria-live="polite">
      {!after ? (
        <>
          <h3 className={styles.title}>When you are done, how do you feel now?</h3>
          {before && (
            <p className={styles.sub}>
              You came in feeling <strong>{before}</strong>.
            </p>
          )}
        </>
      ) : (
        <>
          <p className={styles.shift} aria-hidden="true">
            <span>{checkIn.before.emojis[0]}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.afterEmoji}>{after}</span>
          </p>
          <h3 className={styles.title}>
            {GOOD_MOODS.has(moodOf(after)) ? "That is a lovely shift." : "Thank you for being honest."}
          </h3>
          <p className={styles.sub}>
            You came in feeling <strong>{before}</strong> and you are leaving{" "}
            <strong>{moodWord(after)}</strong>.{" "}
            {GOOD_MOODS.has(moodOf(after))
              ? "Saved to your journal."
              : "Come back whenever you need another pause. It is saved to your journal."}
          </p>
        </>
      )}

      <div className={styles.faces} role="group" aria-label="How do you feel now">
        {Object.keys(EMOJI_MAP).map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={`${styles.face} ${after === emoji ? styles.faceActive : ""}`}
            onClick={() => pick(emoji)}
            aria-pressed={after === emoji}
            aria-label={EMOJI_MAP[emoji].category}
            title={EMOJI_MAP[emoji].category}
          >
            {emoji}
          </button>
        ))}
      </div>

      {after && (
        <div className={styles.noteBox}>
          <label htmlFor={`note-${checkIn.id}`} className={styles.noteLabel}>
            Anything you want to remember? <span>(optional)</span>
          </label>
          <textarea
            id={`note-${checkIn.id}`}
            className={styles.note}
            rows={3}
            maxLength={500}
            value={note}
            placeholder="A thought, a feeling, what helped..."
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
          />
          <div className={styles.noteActions}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={keepNote}
              disabled={noteSaved || !note.trim()}
            >
              {noteSaved ? "Saved to my journal" : "Save to my journal"}
            </button>
            <Link to="/journal" className={styles.journalLink}>
              Open my journal →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
