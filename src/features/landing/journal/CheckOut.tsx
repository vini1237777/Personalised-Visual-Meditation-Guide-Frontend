import { useState } from "react";
import { Link } from "react-router-dom";
import { CtaButton, FeelingChip, Shade, StepBar, panel } from "shared/ui/kit";
import styles from "./CheckOut.module.css";
import { FEELINGS, feelingLabel } from "../mood/config/feelings.config";
import { CheckIn, finishCheckIn, saveNote } from "./journal";

type CheckOutProps = {
  checkIn: CheckIn | null;
  sessionName: string;
  /** Go back to step 01 for another session. */
  onAnotherSession?: () => void;
};

/** Step 04: how do you feel now, and an optional line for the journal. */
export default function CheckOut({
  checkIn,
  sessionName,
  onAnotherSession,
}: CheckOutProps) {
  const [after, setAfter] = useState<string | null>(checkIn?.after ?? null);
  const [note, setNote] = useState(checkIn?.note ?? "");
  const [saved, setSaved] = useState(false);
  if (!checkIn) return null;

  const before = feelingLabel(checkIn.before.emojis[0] ?? "").toLowerCase();

  const pick = (emoji: string) => {
    setAfter(emoji);
    setSaved(false);
    finishCheckIn(checkIn.id, emoji);
  };

  const save = () => {
    saveNote(checkIn.id, note);
    setSaved(true);
  };

  return (
    <div className={styles.screen}>
      <Shade tone="left" />
      <div className={styles.layout}>
        <section className={styles.main} aria-labelledby="checkout-title">
          <StepBar current={3} />
          <h1 id="checkout-title" className={styles.title}>
            How do you feel <em>now?</em>
          </h1>
          {before && (
            <p className={styles.before}>
              You started your {sessionName.toLowerCase()} feeling{" "}
              <b>{before}</b>.
            </p>
          )}
          <div
            className={styles.feelings}
            role="group"
            aria-label="How you feel now"
          >
            {FEELINGS.map((f) => (
              <FeelingChip
                key={f.emoji}
                label={f.label}
                dot={f.dot}
                selected={after === f.emoji}
                onClick={() => pick(f.emoji)}
              />
            ))}
          </div>
        </section>

        <div className={`${panel.panel} ${styles.note}`}>
          {saved ? (
            <div className={styles.done} role="status">
              <p className={styles.doneTitle}>Saved to your journal.</p>
              <p className={styles.doneText}>
                {before && after
                  ? `You came in ${before} and left ${feelingLabel(after).toLowerCase()}.`
                  : "Come back whenever you need another pause."}
              </p>
              <div className={styles.doneActions}>
                <Link to="/journal" className={styles.link}>
                  Open my journal
                </Link>
                {onAnotherSession && (
                  <button
                    type="button"
                    className={styles.link}
                    onClick={onAnotherSession}
                  >
                    Start another session
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <label htmlFor={`note-${checkIn.id}`} className={styles.label}>
                A note for your journal, if you like
              </label>
              <textarea
                id={`note-${checkIn.id}`}
                className={styles.area}
                rows={4}
                maxLength={500}
                value={note}
                placeholder="A thought, a feeling, what helped"
                onChange={(e) => setNote(e.target.value)}
              />
              <CtaButton block onClick={save} disabled={!after}>
                Save to my journal
              </CtaButton>
              {!after && (
                <p className={styles.hint}>Pick how you feel now to save.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
