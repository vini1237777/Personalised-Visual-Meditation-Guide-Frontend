import { Link } from "react-router-dom";
import styles from "./About.module.css";
import { ABOUT_TEXT, ABOUT_STEPS, ABOUT_BLOCKS } from "../constants/about.text";
import { BG_VIDEOS } from "../../../assets/bg-videos/videoUrls";
import { useVideoBackground } from "../../../shared/custom-hooks/Usevideobackground";

export default function About() {
  const { videoRef, ready } = useVideoBackground(BG_VIDEOS.bg2);

  return (
    <main className={styles.page}>
      <div className={styles.poster} />

      <video
        ref={videoRef}
        className={styles.videoBg}
        loop
        muted
        playsInline
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
      />

      <div className={styles.overlay} />

      <div className={styles.wrap}>
        <section className={styles.intro}>
          <h1 className={styles.heroTitle}>{ABOUT_TEXT.title}</h1>
          <p className={styles.lead}>{ABOUT_TEXT.description}</p>

          <ol className={styles.steps}>
            {ABOUT_STEPS.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>
                  <strong className={styles.stepTitle}>{s.title}</strong>
                  <span className={styles.stepText}>{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <Link to="/" className={styles.startBtn}>
            Start a session
          </Link>
        </section>

        <section className={styles.panel} aria-label="More about SoulSync">
          {ABOUT_BLOCKS.map((b) => (
            <div key={b.title} className={styles.infoBlock}>
              <h2 className={styles.infoTitle}>{b.title}</h2>
              <p className={styles.infoText}>{b.text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
