import styles from "../MoodSelector.module.css";

type Props = {
  selectedEmojis: string[];
  activeEmoji: string | null;
  selectedFeelings: string[];
};

export function SelectionSummary({
  selectedEmojis,
  activeEmoji,
  selectedFeelings,
}: Props) {
  return (
    <div className={styles.outputBox}>
      <p>
        <strong>Selected Emojis:</strong>{" "}
        {selectedEmojis.length > 0 ? selectedEmojis.join(" ") : "None"}
      </p>
      <p>
        <strong>Active Wheel:</strong> {activeEmoji || "None"}
      </p>
      <p>
        <strong>Feelings:</strong>{" "}
        {selectedFeelings.length > 0 ? selectedFeelings.join(", ") : "None"}
      </p>
    </div>
  );
}
