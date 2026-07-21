"use client";

import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero,
  ChazenSubpageMedia
} from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";
import styles from "./page.module.css";

const ritualSteps = [
  { zh: "溫器", en: "Warm the Teaware", copy: { zh: "讓茶具先承接溫度", en: "Let the teaware take on warmth first" } },
  {
    zh: "置茶",
    en: "Add the Leaves",
    copy: { zh: "茶葉落入蓋碗，香氣開始打開", en: "Tea leaves settle into the gaiwan, and the aroma begins to open" }
  },
  { zh: "醒茶", en: "Wake the Tea", copy: { zh: "第一道水，喚醒茶葉", en: "The first pour wakes the leaves" } },
  { zh: "聞香", en: "Smell the Aroma", copy: { zh: "先聞香，再入口", en: "Smell the aroma first, then taste" } },
  {
    zh: "出湯",
    en: "Pour the Tea",
    copy: { zh: "茶湯流入公道杯，再分入杯中", en: "The tea flows into the fairness pitcher, then into each cup" }
  },
  { zh: "慢飲", en: "Sip Slowly", copy: { zh: "一口茶，一次呼吸", en: "One sip, one breath" } }
];

const commonMistakes = [
  { zh: "水太熱", en: "Water too hot" },
  { zh: "茶葉太多", en: "Too many leaves" },
  { zh: "浸泡太久", en: "Steeping too long" },
  { zh: "急著喝", en: "Drinking too quickly" },
  { zh: "忽略香氣", en: "Ignoring the aroma" }
];

export default function TeaRitualPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "茶儀式 | Chazen" : "Tea Ritual | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Ritual"
        eyebrowZh="茶儀式"
        title="茶入口之前，先有一場儀式"
        english="The Ritual Before the Tea"
        copy="從溫器、置茶、醒茶，到聞香、出湯、慢飲，茶不是急著完成，而是讓自己慢下來。"
        copyEn="From warming the teaware, to adding the leaves, waking the tea, smelling the aroma, pouring, and sipping slowly — tea isn't about finishing quickly. It's about letting yourself slow down."
        media={{
          asset: "gaiwan-ritual.mp4",
          alt: "A close, unhurried gaiwan tea ritual: warming the vessel, pouring, and settling the leaf.",
          type: "video"
        }}
      />

      <ChazenContentSection
        eyebrow="Gaiwan"
        eyebrowZh="蓋碗"
        title="蓋碗是中國茶桌上的小宇宙"
        english="What Is a Gaiwan?"
        tone="paper"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>{t("Gaiwan", "蓋碗")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "The gaiwan is made of a lid, a bowl, and a saucer — well suited to watching the leaf unfurl, controlling the pour, and letting beginners directly sense aroma and water temperature.",
                "蓋碗由蓋、碗、托組成，適合觀察茶葉舒展、控制出湯，也讓初學者更直接地感受香氣與水溫。"
              )}
            </p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Beginners can start with fewer leaves and a shorter steep, turning each infusion into something observable and adjustable.",
                "初學者可以先用較少茶葉、較短時間開始，讓每一泡都變成可觀察、可調整的練習。"
              )}
            </p>
          </article>
          <ChazenSubpageMedia
            asset="chazen-tea-table-topdown-v3.jpg"
            alt="A top-down view of the tea table set for the ritual: gaiwan, fairness pitcher, and cups arranged in sequence."
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Cha Hai"
        eyebrowZh="茶海"
        title="公道杯，讓每一杯茶更平均"
        english="Why Use a Fairness Pitcher?"
      >
        <div className="chazen-two-column">
          <ChazenSubpageMedia
            asset="chazen-ritual-film.mp4"
            alt="A short film following the six-step tea ritual, including the pour into the fairness pitcher."
            type="video"
          />
          <article className="chazen-subpage-note">
            <h3>{t("Fairness Pitcher / Cha Hai", "公道杯 / 茶海")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "The fairness pitcher evens out the strength of the tea, so the first cup isn't too weak and the last isn't too strong. Tea flows into it first, then is shared into each cup — making the pour more consistent and the motion more settled.",
                "公道杯用來平均茶湯濃度，避免第一杯太淡、最後一杯太濃。茶先流入公道杯，再分入每隻杯中，令分享更一致，也讓動作更安定。"
              )}
            </p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Six steps"
        eyebrowZh="六個步驟"
        title="六個步驟，讓茶慢慢發生"
        english="A Six-Step Tea Ritual"
        tone="paper"
      >
        <ul className={styles.ritualSteps}>
          {ritualSteps.map((step, index) => (
            <li key={step.zh} className={styles.ritualStep}>
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
              {language === "zh" ? <h3 lang="zh-Hant">{step.zh}</h3> : <h3>{step.en}</h3>}
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(step.copy.en, step.copy.zh)}</p>
            </li>
          ))}
        </ul>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Beginner practice"
        eyebrowZh="初學者練習"
        title="初學者可以先簡單地喝"
        english="A Casual Beginner Method"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>{t("Common mistakes", "常見錯誤")}</h3>
            <ul>
              {commonMistakes.map((mistake) => (
                <li key={mistake.en} lang={language === "zh" ? "zh-Hant" : undefined}>
                  {t(mistake.en, mistake.zh)}
                </li>
              ))}
            </ul>
          </article>
          <article className="chazen-subpage-note">
            <h3>{t("Simple method", "簡易方法")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Warm the cup first, use a small amount of leaves, and pour quickly with hot water. Smell the aroma first, then sip slowly. Treat the first cup as observation, and adjust the strength on the second — no need to get it perfect right away.",
                "先溫杯，少量茶葉，熱水快速出湯。先聞香，再慢慢喝。把第一杯當成觀察，第二杯再調整濃淡，不需要一次做到完美。"
              )}
            </p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="The pour"
        eyebrowZh="出湯"
        title="出湯是儀式中最安靜的一刻"
        english="The Pour Is the Quietest Moment"
        tone="paper"
      >
        <div className="chazen-two-column">
          <ChazenSubpageMedia
            asset="chazen-gongfu-pour-v2.png"
            alt="A hand lifting the lid of a painted porcelain gaiwan, tea streaming into a small cup below with rising steam."
          />
          <article className="chazen-subpage-note">
            <h3>{t("Watch the stream, not the clock", "看茶湯，而非看時鐘")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "A good pour is steady and unhurried — the light catching the steam matters as much as the timing. Let the stream, not a stopwatch, tell you when the cup is ready.",
                "好的出湯，穩定且不急促——光影映在茶煙上，與時間同等重要。讓茶湯本身，而不是碼表，告訴你何時可以入杯。"
              )}
            </p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Somewhere quiet"
        eyebrowZh="尋一處安靜"
        title="找一處安靜的地方，讓茶自己完成"
        english="Find a Quiet Place, and Let the Tea Finish Itself"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>{t("The ritual doesn't need a tea house", "儀式不需要茶館")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "A garden path, a windowsill, or a corner of a balcony is enough. What the ritual asks for isn't a special room — it's a few minutes where nothing else is more urgent than this cup.",
                "一條花園小徑、一扇窗台，或陽台一角，已經足夠。儀式所需要的並非特別的房間，而是幾分鐘裡，沒有任何事比這杯茶更急迫。"
              )}
            </p>
          </article>
          <ChazenSubpageMedia
            asset="chazen-garden-bamboo-tea.png"
            alt="A tea set laid out on a bamboo table on a shaded garden terrace, surrounded by bamboo stalks and greenery."
          />
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="開始你的茶儀式"
        titleEn="Begin Your Tea Ritual"
        copy="Begin with one cup, one vessel, and enough quiet to notice the aroma. Or practice the pour first in the Brewing Room."
        copyZh="從一杯茶、一件器具，以及足夠留意香氣的靜謐開始。或先在沖泡室練習一泡。"
        primary={{ href: "/brew-simulator", label: "Practice in the Brewing Room", labelZh: "到沖泡室練習" }}
        secondary={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
        next={{ href: "/tea-boxes", label: "Starter Tea Box", labelZh: "入門茶盒" }}
      />
    </main>
  );
}
