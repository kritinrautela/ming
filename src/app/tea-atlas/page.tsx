"use client";

import { useEffect } from "react";
import { ChapterHero } from "@/components/ChapterHero";
import { TeaAtlasExhibit } from "@/components/TeaAtlasExhibit";
import { MotionReveal } from "@/components/MotionReveal";
import { useLanguage } from "@/lib/language";
import styles from "./page.module.css";

const atlasReading = [
  {
    title: { en: "Landscape", zh: "地景" },
    copy: {
      en: "Cliff, forest, lake, island, and shaded field each leave a different trace.",
      zh: "懸崖、森林、湖泊、島嶼與蔽蔭田地，各自留下不同的痕跡。"
    }
  },
  {
    title: { en: "Processing", zh: "製茶工序" },
    copy: {
      en: "Heat, oxidation, rolling, roast, aging, and milling translate place into taste.",
      zh: "熱度、氧化、揉捻、焙火、陳化與研磨，將產地轉化為滋味。"
    }
  },
  {
    title: { en: "Ritual", zh: "儀式" },
    copy: {
      en: "A tea's origin suggests the vessel, pace, temperature, and silence around it.",
      zh: "茶的產地，暗示著適合的器具、節奏、溫度與周圍的靜默。"
    }
  }
];

export default function TeaAtlasPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "茶地圖 | Chazen" : "Tea Atlas | Chazen";
  }, [language]);

  return (
    <main>
      <ChapterHero
        chapter="Chapter 06 / Tea Atlas"
        chapterZh="第六章 / 茶之地圖"
        title="Tea Atlas"
        chinese="茶之地圖"
        copy="A living map of mountain, mist, altitude, processing, and ritual. The leaf remembers where it came from."
        copyZh="一幅關於山、霧、海拔、製茶工序與儀式的活地圖。茶葉記得它從何而來。"
        image="chazen-shanshui-chapter-2.png"
        imageAlt="A misted mountain and water landscape evoking the origins of Chinese tea."
      />

      <section className="section bg-paper">
        <div className="container">
          <MotionReveal className="max-w-3xl">
            <p className="museum-label">{t("Interactive Origin Map", "互動產地地圖")}</p>
            <h2 className="display-title mt-5 text-5xl leading-none text-ink md:text-7xl">
              {t("Terroir is a cultural memory.", "風土，是一種文化記憶。")}
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.1} className="mt-14">
            <TeaAtlasExhibit />
          </MotionReveal>
        </div>
      </section>

      <section className="section bg-porcelain">
        <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <MotionReveal>
            <p className="museum-label">{t("How to Read the Map", "如何閱讀這幅地圖")}</p>
            <h2 className="display-title mt-5 text-5xl leading-none text-ink md:text-7xl">
              {t("Altitude changes the breath of tea.", "海拔改變了茶的呼吸。")}
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <div className={styles.atlasReading}>
              {atlasReading.map((item) => (
                <article key={item.title.en} className={styles.atlasReadingItem}>
                  <p>{t(item.title.en, item.title.zh)}</p>
                  <p>{t(item.copy.en, item.copy.zh)}</p>
                </article>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
