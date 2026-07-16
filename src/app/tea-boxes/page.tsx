"use client";

import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";
import styles from "./tea-boxes.module.css";

const journeys = [
  {
    title: { en: "First-time beginner", zh: "初次入門" },
    copy: {
      zh: "想開始學中國茶，但希望簡單、清楚、有方向。",
      en: "Wanting to start learning Chinese tea, but looking for something simple, clear, and directional."
    }
  },
  {
    title: { en: "Personal daily ritual", zh: "個人日常儀式" },
    copy: {
      zh: "希望茶成為日常裡能重複的安定節奏。",
      en: "Wanting tea to become a repeatable, grounding rhythm in daily life."
    }
  },
  {
    title: { en: "Cultural gift / collector", zh: "文化贈禮／收藏者" },
    copy: {
      zh: "想送出一份有故事、有文化感、能被記住的禮物。",
      en: "Wanting to give a gift with a story, cultural depth, and lasting memory."
    }
  }
];

const boxCards = [
  {
    title: { en: "First Pack", zh: "初次體驗包" },
    price: "A$25",
    asset: "first-pack-mockup.webp",
    visual: "Future visual: A$25 First Pack",
    items: [
      { en: "Curated starter tea", zh: "精選入門茶" },
      { en: "Tea-Mind result card", zh: "茶心測試結果卡" },
      { en: "Simple brewing guide", zh: "簡易沖泡指南" },
      { en: "Best after the AI Tea Test", zh: "適合在 AI 茶測試後使用" }
    ]
  },
  {
    title: { en: "Starter Tea Box", zh: "入門茶盒" },
    price: "A$68",
    asset: "starter-tea-box-mockup.webp",
    visual: "Future visual: Starter Tea Box mockup",
    items: [
      { en: "Two entry tea directions", zh: "兩款入門茶方向" },
      { en: "Printed ritual guide", zh: "印製儀式指南" },
      { en: "Beginner brewing notes", zh: "初學者沖泡筆記" },
      { en: "Optional travel tea set path", zh: "可選旅行茶具方案" }
    ]
  },
  {
    title: { en: "Lifetime Tea Box", zh: "一世茶盒" },
    price: "A$78",
    asset: "lifetime-tea-box-mockup.webp",
    visual: "Future visual: Lifetime cultural tea box",
    items: [
      { en: "Premium tea", zh: "頂級茶葉" },
      { en: "Cultural story cards", zh: "文化故事卡" },
      { en: "Gift-ready presentation", zh: "精美禮品包裝" },
      { en: "For gifting, collecting, and milestones", zh: "適合送禮、收藏與紀念時刻" }
    ]
  },
  {
    title: { en: "B2B Cultural Gift Box", zh: "企業文化禮盒" },
    price: "Custom",
    asset: "b2b-gift-box-mockup.webp",
    visual: "Future visual: B2B settlement gift scene",
    items: [
      { en: "Corporate gifts", zh: "企業禮品" },
      { en: "Client appreciation", zh: "客戶答謝" },
      { en: "Real estate settlement gifts", zh: "地產交收禮物" },
      { en: "Custom branding", zh: "品牌客製化" }
    ]
  }
];

const comparisonRows = [
  {
    box: { en: "First Pack", zh: "初次體驗包" },
    price: "A$25",
    purpose: { en: "Low-friction first purchase", zh: "低門檻的第一次購買" },
    bestFor: { en: "Tea Test users and first-time tea drinkers", zh: "茶測試用戶與初次飲茶者" },
    content: { en: "Starter tea, result card, brewing guide", zh: "入門茶、結果卡、沖泡指南" },
    cta: { en: "Start Tea Test", zh: "開始茶測試" }
  },
  {
    box: { en: "Starter Tea Box", zh: "入門茶盒" },
    price: "A$68",
    purpose: { en: "Beginner tea journey", zh: "初學者茶旅程" },
    bestFor: { en: "Home ritual beginners", zh: "居家儀式初學者" },
    content: { en: "Two tea directions, ritual guide, brewing notes", zh: "兩款茶方向、儀式指南、沖泡筆記" },
    cta: { en: "Explore Tea Boxes", zh: "探索茶盒" }
  },
  {
    box: { en: "Lifetime Tea Box", zh: "一世茶盒" },
    price: "A$78",
    purpose: { en: "Cultural collection", zh: "文化收藏" },
    bestFor: { en: "Gifting, collecting, milestones", zh: "送禮、收藏、紀念時刻" },
    content: { en: "Premium tea, story cards, cultural theme", zh: "頂級茶葉、故事卡、文化主題" },
    cta: { en: "Explore Gift Story", zh: "探索禮物故事" }
  },
  {
    box: { en: "B2B Cultural Gift Box", zh: "企業文化禮盒" },
    price: "Custom",
    purpose: { en: "Relationship gifting", zh: "關係贈禮" },
    bestFor: { en: "Teams, clients, settlement gifts", zh: "團隊、客戶、交收禮物" },
    content: { en: "Custom box, message, branding", zh: "客製禮盒、訊息、品牌化" },
    cta: { en: "Enquire", zh: "查詢" }
  }
];

const comparisonHeadings = [
  { en: "Box", zh: "茶盒" },
  { en: "Price", zh: "價格" },
  { en: "Purpose", zh: "目的" },
  { en: "Best for", zh: "適合對象" },
  { en: "Content", zh: "內容" },
  { en: "CTA", zh: "行動呼籲" }
];

export default function TeaBoxesPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "茶盒 | Chazen" : "Tea Boxes | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Boxes"
        eyebrowZh="茶盒"
        title="開始，或延續你的茶旅程"
        english="Begin or Continue Your Tea Journey"
        copy="Chazen 茶盒不是單純產品，而是把茶、儀式、文化與心境帶入日常的方式。"
        copyEn="A Chazen tea box isn't just a product — it's a way of bringing tea, ritual, culture, and mindset into daily life."
        media={{
          asset: "chazen-gift-box-v1.jpg",
          alt: "A refined Chazen cultural tea gift box presented with tea ware and story cards.",
          type: "image"
        }}
      />

      <ChazenContentSection
        eyebrow="Choose your journey"
        eyebrowZh="選擇你的旅程"
        title="先選擇你的茶旅程"
        english="Three Ways to Begin"
        tone="paper"
      >
        <div className={styles["tea-journey-index"]}>
          {journeys.map((item, index) => (
            <article key={item.title.en} className={styles["tea-journey-item"]}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <div>
                <h3>{t(item.title.en, item.title.zh)}</h3>
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
              </div>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Boxes"
        eyebrowZh="茶盒"
        title="茶盒是茶、故事與儀式的容器"
        english="Tea, Story, and Ritual in One Object"
      >
        <div className={styles["tea-boxes-grid"]}>
          {boxCards.map((box, index) => (
            <article key={box.title.en} className={styles["tea-box-card"]}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <div>
                <h3>{t(box.title.en, box.title.zh)}</h3>
                <span className={styles["tea-box-price"]}>{box.price}</span>
                <ul>
                  {box.items.map((item) => (
                    <li key={item.en}>{t(item.en, item.zh)}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Compare boxes"
        eyebrowZh="比較茶盒"
        title="用最簡單的方式比較"
        english="A Simple Comparison"
      >
        <div className={styles["tea-comparison-table"]}>
          <table>
            <thead>
              <tr>
                {comparisonHeadings.map((heading) => (
                  <th key={heading.en}>{t(heading.en, heading.zh)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.box.en}>
                  <td>{t(row.box.en, row.box.zh)}</td>
                  <td>{row.price}</td>
                  <td>{t(row.purpose.en, row.purpose.zh)}</td>
                  <td>{t(row.bestFor.en, row.bestFor.zh)}</td>
                  <td>{t(row.content.en, row.content.zh)}</td>
                  <td>{t(row.cta.en, row.cta.zh)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="找到適合你的茶盒"
        titleEn="Find the Tea Box That Fits You"
        copy="Start with your state, then continue with the box that fits your rhythm."
        copyZh="先從你的狀態開始，再選擇符合你節奏的茶盒。"
        primary={{ href: "/tea-test", label: "Find My Tea Box", labelZh: "找到我的茶盒" }}
        secondary={{ href: "/five-cups", label: "Explore Five Cups", labelZh: "探索五盞建盞" }}
        next={{ href: "/b2b", label: "B2B Gifts", labelZh: "企業茶禮" }}
      />
    </main>
  );
}
