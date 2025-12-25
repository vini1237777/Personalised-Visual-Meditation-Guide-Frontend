import styles from "../MoodSelector.module.css";

type Props = {
  category: string;
  feelings: string[];
  selectedFeelings: string[];
  onToggleFeeling: (feeling: string) => void;
};

export function EmotionWheel({
  category,
  feelings,
  selectedFeelings,
  onToggleFeeling,
}: Props) {
  const categoryClass =
    styles[category.toLowerCase() as keyof typeof styles] ?? "";

  return (
    <div className={styles.emotionWheel}>
      {feelings.map((feeling, index) => {
        const angle = (index / feelings.length) * 2 * Math.PI;
        const radius = 80;
        const center = 110;

        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const isSelected = selectedFeelings.includes(feeling);

        return (
          <div
            key={feeling}
            className={`${styles.feelingItem} ${categoryClass} ${
              isSelected ? styles.feelingItemSelected : ""
            }`}
            style={{ top: y, left: x }}
            onClick={() => onToggleFeeling(feeling)}
          >
            {feeling}
          </div>
        );
      })}
    </div>
  );
}
