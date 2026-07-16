"use client";

import { useEffect } from "react";
import { ChapterHero } from "@/components/ChapterHero";
import { StillnessRoom } from "@/components/StillnessRoom";
import { MotionReveal } from "@/components/MotionReveal";
import { useLanguage } from "@/lib/language";
import styles from "./stillness.module.css";

const pillars = [
  {
    title: { en: "Sound", zh: "聲音" },
    copy: { en: "A single bowl tone gives the mind a threshold.", zh: "一聲缽音，為心靈標記一道門檻。" }
  },
  {
    title: { en: "Breath", zh: "呼吸" },
    copy: {
      en: "A quiet pulse marks each inhale and exhale for sixty seconds.",
      zh: "六十秒間，一個安靜的脈動標記著每一次吸氣與呼氣。"
    }
  },
  {
    title: { en: "Tea", zh: "茶" },
    copy: {
      en: "The recommendation is not an upsell. It is a ritual pairing for the state you arrived in.",
      zh: "這份推薦不是促銷，而是為你此刻的狀態所配對的儀式。"
    }
  }
];

export default function StillnessModePage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "靜心模式 | Chazen" : "Stillness Mode | Chazen";
  }, [language]);

  return (
    <main className={styles.stillnessPage}>
      <ChapterHero
        chapter="Chapter 07 / Stillness Mode"
        chapterZh="第七章 / 靜心模式"
        title="Stillness Mode"
        chinese="靜心茶室"
        copy="A quiet digital tea room for one minute of breath, bowl sound, and a tea recommendation based on the mood you bring to the cup."
        copyZh="一間安靜的數位茶室，給你一分鐘的呼吸、缽音，以及一份根據你此刻心情而定的茶推薦。"
        image="chazen-tea-room-hero-v2.jpg"
        imageAlt="A dim, quiet tea room prepared for a moment of stillness."
      />

      <section className={`section ${styles.stillnessHero}`}>
        <div className="container">
          <MotionReveal className="mb-12 max-w-3xl">
            <p className={`museum-label ${styles.eyebrowBrass}`}>{t("Interactive Meditation Chamber", "互動靜心室")}</p>
            <h2 className="display-title mt-5 text-5xl leading-none text-porcelain md:text-7xl">
              {t("Listen once. Breathe for sixty seconds.", "聆聽一次。呼吸六十秒。")}
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <StillnessRoom />
          </MotionReveal>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: "#0e100d" }}>
        <div className="container grid gap-8 md:grid-cols-3">
          {pillars.map((item, index) => (
            <MotionReveal key={item.title.en} delay={index * 0.06}>
              <article className="border-l border-brass/20 pl-6">
                <p className={`museum-label ${styles.eyebrowBrass}`}>{t(item.title.en, item.title.zh)}</p>
                <p className="mt-6 text-lg leading-8 text-porcelain/70">{t(item.copy.en, item.copy.zh)}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
