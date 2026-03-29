import styles from "./About.module.css";
import { ABOUT_TEXT, contentListArray } from "../constants/about.text";
import { BG_VIDEOS } from "../../../assets/bg-videos/videoUrls";
import { useState } from "react";

const toText = (v: string | string[] | null | undefined) =>
  Array.isArray(v) ? v.join(" ") : (v ?? "");

const toArray = (v: string | string[] | null | undefined): string[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim()) return [v];
  return [];
};

export default function About() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <main className={styles.page}>
      <video
        className={styles.videoBg}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        poster="../../../assets/images/bg3.jpg"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <source src={BG_VIDEOS.bg2} type="video/mp4" />
      </video>

      <div className={styles.overlay} />

      <section className={styles.visual} />

      <section className={styles.content}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>{ABOUT_TEXT.title}</h1>
            <p className={styles.pageDesc}>{ABOUT_TEXT.description}</p>
          </header>

          <div className={styles.sections}>
            {contentListArray.map((item) => {
              const titleKey = toText(item.title) || Math.random().toString();
              const title = toText(item.title);

              const subTitleArr = toArray(item.subTitle);
              const descArr = toArray(item.description);

              const isPairList =
                subTitleArr.length > 0 &&
                descArr.length > 0 &&
                subTitleArr.length === descArr.length;

              const isBulletList =
                descArr.length > 1 &&
                descArr.every((d) => d.trim().startsWith("-"));

              const singleSub = !Array.isArray(item.subTitle)
                ? (item.subTitle ?? "").toString().trim()
                : "";

              const singleDesc = !Array.isArray(item.description)
                ? (item.description ?? "").toString().trim()
                : "";

              return (
                <section key={titleKey} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{title}</h2>

                  {isPairList ? (
                    <div className={styles.pairList}>
                      {descArr.map((label, i) => (
                        <div key={`${label}-${i}`} className={styles.pairRow}>
                          <div className={styles.pairLabel}>
                            {label}
                            <span className={styles.pairColon}>:</span>
                          </div>
                          <div className={styles.pairValue}>
                            {subTitleArr[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {singleSub && (
                        <div className={styles.subTitle}>{singleSub}</div>
                      )}

                      {isBulletList ? (
                        <ul className={styles.bullets}>
                          {descArr.map((d) => (
                            <li key={d} className={styles.bulletItem}>
                              {d.replace(/^-+\s*/, "")}
                            </li>
                          ))}
                        </ul>
                      ) : descArr.length > 1 ? (
                        <div className={styles.descList}>
                          {descArr.map((d) => (
                            <p key={d} className={styles.text}>
                              {d}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.text}>{singleDesc}</p>
                      )}
                    </>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
