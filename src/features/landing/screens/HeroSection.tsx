import styles from "./HeroSection.module.css";

type HeroItem = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
};

interface HeroSectionProps {
  items: HeroItem[];
  onStart: () => void;
}

export function HeroSection({ items, onStart }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      {items.map((item, index) => (
        <div key={index} className={styles.heroItem}>
          <h2 className={styles.headline}>{item.headline}</h2>
          <p className={styles.subheadline}>{item.subheadline}</p>

          <button type="button" className={styles.ctaButton} onClick={onStart}>
            {item.ctaLabel}
          </button>
        </div>
      ))}
    </section>
  );
}
