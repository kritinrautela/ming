"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import {
  ChazenImageGallery,
  type ChazenGalleryItem
} from "@/components/ChazenImageGallery";
import { useLanguage } from "@/lib/language";
import { withBasePath } from "@/lib/media";
import styles from "./about.module.css";

const pillars = [
  {
    en: ["Culture, carried forward", "We respect the knowledge, objects, and gestures of Chinese tea culture, then present them with clarity for contemporary life."],
    zh: ["承傳文化", "我們尊重中國茶文化中的知識、器物與動作，再以清晰、當代的方式帶進日常生活。"]
  },
  {
    en: ["Ritual before product", "Tea is more than something to consume. Warming the cup, watching the leaf open, and sharing the first pour can turn an ordinary pause into a meaningful return."],
    zh: ["儀式先於商品", "茶不只是被消費的東西。溫杯、看茶葉舒展、分享第一泡，都能把普通的停頓變成一次有意義的回歸。"]
  },
  {
    en: ["Quiet, considered luxury", "We choose restraint over noise: thoughtful materials, useful details, honest storytelling, and gifts that feel personal rather than promotional."],
    zh: ["安靜而有分寸的質感", "我們選擇克制而非喧鬧：用心的材質、有用的細節、真誠的故事，以及有個人溫度而非宣傳式的禮物。"]
  }
];

const atmosphereStudies: ChazenGalleryItem[] = [
  {
    asset: "chazen-atmosphere-first-evening.webp",
    alt: "A white gaiwan and two dark cups beside a window at dusk.",
    altZh: "黃昏窗邊的白蓋碗與兩只深色茶杯。",
    label: "The first evening",
    labelZh: "第一個夜晚",
    shape: "feature"
  },
  {
    asset: "chazen-atmosphere-gift-study.webp",
    alt: "A black and celadon Chazen tea gift presented by candlelight.",
    altZh: "燭光下陳列的黑色與青瓷 Chazen 茶禮。",
    label: "A gift with a room around it",
    labelZh: "一份有空間感的茶禮",
    shape: "square"
  },
  {
    asset: "chazen-atmosphere-shanshui-gold.webp",
    alt: "A warm gold ink-wash mountain landscape.",
    altZh: "暖金色的水墨山水長卷。",
    label: "Landscape as a state of mind",
    labelZh: "山水即心境",
    shape: "wide"
  },
  {
    asset: "chazen-atmosphere-tea-room-study.webp",
    alt: "A candlelit tea room with dark teaware, bamboo, and scrolls.",
    altZh: "燭光茶室內陳列深色茶器、竹枝與卷軸。",
    label: "The imagined tea room",
    labelZh: "想像中的茶室",
    shape: "wide"
  }
];

export default function AboutPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "品牌故事 | Chazen" : "Our Story | Chazen";
  }, [language]);

  return (
    <main>
      <ChazenSubpageHero
        eyebrow="Our story"
        eyebrowZh="品牌故事"
        title="以茶，回到當下。"
        english="Tea as a way to return."
        copy="Chazen 茶禪是一個以文化為本的中國茶品牌。我們相信，一杯茶可以為平靜、專注與連結留出空間。"
        copyEn="Chazen 茶禪 is a culture-first Chinese tea brand created around a simple belief: a cup of tea can make space for calm, attention, and connection."
      />

      <ChazenContentSection
        eyebrow="What we are building"
        eyebrowZh="我們正在建立"
        title="茶禪一味"
        english="Tea and Zen, one flavor"
        tone="ivory"
      >
        <div className={styles.storyGrid}>
          <p className={styles.pullStatement}>{t("茶禪一味", "茶禪一味")}</p>
          <div className={styles.storyText}>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "The name Chazen brings tea and Zen into one idea. It reflects the long relationship between tea, awareness, hospitality, and the art of slowing down.",
              "Chazen 將「茶」與「禪」放在同一個概念之中，回應茶、覺察、待客之道與慢下來的藝術之間悠久的連結。"
            )}</p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "We are building a modern tea house beyond a physical room: tea rituals, cultural stories, guided discovery, sound, and meaningful gifts designed to meet people where they are.",
              "我們正在建立一間不受實體空間限制的現代茶文化之家，透過茶儀式、文化故事、引導式探索、聲音與有意義的贈禮，讓不同的人都能找到自己的入口。"
            )}</p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "Our intention is not to simplify Chinese tea into a trend. It is to make the first step welcoming while keeping the culture visible, respected, and worth learning.",
              "我們的目的不是把中國茶簡化成潮流，而是讓第一步更容易親近，同時讓文化保持可見、受到尊重，並值得繼續學習。"
            )}</p>
          </div>
        </div>

        <figure className={styles.storyFigure}>
          <Image
            src={withBasePath("/images/chazen-tea-room-hero-v2.jpg")}
            alt={t(
              "The Chazen tea room: a low wooden table, gaiwan, and warm side light.",
              "Chazen 茶室：矮木茶桌、蓋碗，與溫暖的側光。"
            )}
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
          />
          <figcaption lang={language === "zh" ? "zh-Hant" : undefined}>
            {t("The tea room the brand is built around.", "品牌圍繞著的那間茶室。")}
          </figcaption>
        </figure>

        <div className={styles.pillarsGrid}>
          {pillars.map((item) => (
            <article key={item.en[0]} className={styles.pillarCard}>
              <h2 className={styles.pillarTitle} lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.en[0], item.zh[0])}</h2>
              <p className={styles.pillarText} lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.en[1], item.zh[1])}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Atmosphere studies"
        eyebrowZh="意境習作"
        title="品牌不只是一件物品，也是一種空間感"
        english="A Brand Is Also a Sense of Place"
        copy="這些 Chazen 意境作品把黃昏、山水、器物與一間想像中的茶室連在一起，呈現品牌希望保留的安靜與深度。"
        copyEn="These Chazen atmosphere studies connect dusk, landscape, objects, and an imagined tea room—the quiet sense of place the brand is designed to preserve."
        tone="paper"
      >
        <ChazenImageGallery items={atmosphereStudies} />
      </ChazenContentSection>

      <ChazenCtaBand
        title="一條從好奇心走向個人茶儀式的清晰路徑。"
        titleEn="A thoughtful path from curiosity to personal ritual."
        copy="Chazen brings together guided tea discovery, practical brewing rituals, cultural education, the Five Cups philosophy, and gifting for personal and professional milestones."
        copyZh="Chazen 結合引導式選茶、實用沖泡儀式、文化內容、五盞理念，以及為個人與企業重要時刻而設的贈禮。"
        primary={{ href: "/tea-test", label: "Begin with the tea test", labelZh: "從茶測試開始" }}
        secondary={{ href: "/b2b", label: "Explore cultural gifting", labelZh: "探索文化贈禮" }}
      />
    </main>
  );
}
