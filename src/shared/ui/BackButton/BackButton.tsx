import styles from "./BackButton.module.css";

type BackButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function BackButton({
  label,
  onClick,
  disabled = false,
}: BackButtonProps) {
  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      ← {label}
    </button>
  );
}
