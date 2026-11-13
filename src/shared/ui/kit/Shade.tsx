import styles from "./Shade.module.css";

export type ShadeTone = "left" | "even" | "top";

type ShadeProps = {
  tone: ShadeTone;
};

/**
 * Darkens the background video only where text sits, so the video stays bright
 * and every line keeps readable contrast. Sits between the video and the content.
 */
export default function Shade({ tone }: ShadeProps) {
  return <div aria-hidden="true" className={styles.shade} data-tone={tone} />;
}
