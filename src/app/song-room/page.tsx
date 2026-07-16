"use client";

import { useEffect } from "react";
import { ChapterHero } from "@/components/ChapterHero";
import { MotionReveal } from "@/components/MotionReveal";
import { useLanguage } from "@/lib/language";
import styles from "./page.module.css";

const exhibits = [
  {
    title: "Dian Cha",
    cn: "點茶",
    copy: {
      en: "Powdered tea is whisked into a pale foam. The act is controlled, quiet, and almost architectural.",
      zh: "茶粉被擊拂成一片淡色的泡沫。這個動作克制、安靜，近乎建築般的精確。"
    }
  },
  {
    title: "Jian Ware",
    cn: "建盞",
    copy: {
      en: "Dark bowls reveal light foam. Hare's fur, oil spot, and kiln fire become part of the ceremony.",
      zh: "深色的茶盞映襯出淺色泡沫。兔毫、油滴與窯火，都成為儀式的一部分。"
    }
  },
  {
    title: "Tea Whisk",
    cn: "茶筅",
    copy: {
      en: "The whisk is a discipline of rhythm: wrist, breath, texture, then stillness.",
      zh: "茶筅是一種節奏的修行：手腕、呼吸、質地，然後歸於靜止。"
    }
  },
  {
    title: "Scholar Studio",
    cn: "文人茶",
    copy: {
      en: "Tea belongs beside ink, paper, stone, poetry, and the measured life of the desk.",
      zh: "茶，屬於墨、紙、硯、詩，以及書桌上那種有分寸的生活。"
    }
  }
];

export default function SongRoomPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "宋室 | Chazen" : "The Song Room | Chazen";
  }, [language]);

  return (
    <main>
      <ChapterHero
        chapter="Chapter 05 / The Song Room"
        chapterZh="第五章 / 宋室"
        title="The Song Room"
        chinese="宋室"
        copy="A quiet exhibition on Song dynasty tea aesthetics: foam, dark ceramic, scholar restraint, and the luxury of saying almost nothing."
        copyZh="一場關於宋代茶美學的安靜展覽：泡沫、黑釉瓷器、文人的克制，以及近乎無言的奢侈。"
        image="chazen-song-diancha-v1.jpg"
        imageAlt="A Song dynasty style dian cha tea whisking scene with dark ceramic bowl and pale foam."
      />

      <section className="song-gallery bg-porcelain">
        <div className="container grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <MotionReveal>
            <p className="museum-label">{t("Exhibition Thesis", "展覽主旨")}</p>
            <h2 className="display-title mt-5 text-5xl leading-none text-ink md:text-7xl">
              {t("Restraint is not emptiness. It is concentration.", "克制不是空無，而是專注。")}
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <div className="overflow-hidden rounded-lg border border-ink/10 shadow-soft">
              <video
                className="aspect-[4/5] w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/video/dian-cha.mp4`}
              />
              <p className="museum-label border-t border-ink/10 bg-porcelain px-5 py-3 text-ink/60">
                {t("foam / black glaze / breath / silence", "泡沫／黑釉／呼吸／靜默")}
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container">
          <div className={styles.exhibitGrid}>
            {exhibits.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.06}>
                <article className={styles.exhibitCard}>
                  <span className={styles.exhibitNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.cn}</h3>
                  <p className={styles.exhibitCardTitle}>{item.title}</p>
                  <p>{t(item.copy.en, item.copy.zh)}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-porcelain">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <MotionReveal>
            <p className="museum-label text-brass">{t("Curator Note", "策展筆記")}</p>
            <h2 className="display-title mt-5 text-5xl leading-none md:text-7xl">
              {t("Song elegance lives in what is removed.", "宋代的雅致，存在於被省去的部分。")}
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <p className="max-w-2xl border-l border-porcelain/20 pl-7 text-xl leading-10 text-porcelain/70">
              {t(
                "No loud ornament, no theatrical abundance. The room asks visitors to look at a bowl until the bowl becomes weather, time, hand, fire, and breath.",
                "沒有喧鬧的裝飾，沒有戲劇化的豐盛。這個空間邀請訪客凝視一只茶盞，直到它化為天氣、時間、手、火與呼吸。"
              )}
            </p>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
