"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import {
  ChazenImageGallery,
  type ChazenGalleryItem
} from "@/components/ChazenImageGallery";
import { useCart } from "@/lib/cart";
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
    productId: "first-pack",
    title: { en: "First Pack", zh: "初次體驗包" },
    price: "A$25",
    asset: "first-pack-mockup.png",
    alt: "A clean white and walnut tea set on a stone table: teapot, four small cups, and a fairness pitcher.",
    items: [
      { en: "Curated starter tea", zh: "精選入門茶" },
      { en: "Tea-Mind result card", zh: "茶心測試結果卡" },
      { en: "Simple brewing guide", zh: "簡易沖泡指南" },
      { en: "Best after the AI Tea Test", zh: "適合在 AI 茶測試後使用" }
    ]
  },
  {
    productId: "starter-tea-box",
    title: { en: "Starter Tea Box", zh: "入門茶盒" },
    price: "A$68",
    asset: "starter-tea-box-mockup.png",
    alt: "A full gongfu tea tray set with a clay teapot, five poured cups, a fairness pitcher, and loose leaves on a wooden scoop.",
    items: [
      { en: "Two entry tea directions", zh: "兩款入門茶方向" },
      { en: "Printed ritual guide", zh: "印製儀式指南" },
      { en: "Beginner brewing notes", zh: "初學者沖泡筆記" },
      { en: "Optional travel tea set path", zh: "可選旅行茶具方案" }
    ]
  },
  {
    productId: "lifetime-tea-box",
    title: { en: "Lifetime Tea Box", zh: "一世茶盒" },
    price: "A$78",
    asset: "lifetime-tea-box-mockup.png",
    alt: "A complete navy and gold plum-blossom porcelain tea set: teapot, gaiwan, fairness pitcher, and five cups.",
    items: [
      { en: "Premium tea", zh: "頂級茶葉" },
      { en: "Cultural story cards", zh: "文化故事卡" },
      { en: "Gift-ready presentation", zh: "精美禮品包裝" },
      { en: "For gifting, collecting, and milestones", zh: "適合送禮、收藏與紀念時刻" }
    ]
  },
  {
    productId: null,
    title: { en: "B2B Cultural Gift Box", zh: "企業文化禮盒" },
    price: "Custom",
    asset: "b2b-gift-box-mockup.png",
    alt: "An ornate black and gold Jian Zhan gaiwan and cups with a landscape motif, arranged for a formal presentation.",
    items: [
      { en: "Corporate gifts", zh: "企業禮品" },
      { en: "Client appreciation", zh: "客戶答謝" },
      { en: "Real estate settlement gifts", zh: "地產交收禮物" },
      { en: "Custom branding", zh: "品牌客製化" }
    ]
  }
];

const teawareGallery: ChazenGalleryItem[] = [
  {
    asset: "starter-tea-box-mockup.png",
    alt: "A complete clay gongfu tea set arranged on a carved wooden tray.",
    altZh: "完整的陶製工夫茶具陳列於雕花木茶盤上。",
    label: "The complete gongfu table",
    labelZh: "完整工夫茶席",
    shape: "feature"
  },
  {
    asset: "tea-set-clay-pour.webp",
    alt: "A red clay teapot pouring tea into small cups.",
    altZh: "紅陶茶壺正把茶湯注入小茶杯。",
    label: "Clay and the moving pour",
    labelZh: "陶土與流動的茶湯"
  },
  {
    asset: "tea-set-clay-steam.webp",
    alt: "A warm clay teapot and cups in rising steam.",
    altZh: "陶壺與茶杯籠罩在升起的熱氣中。",
    label: "Warm earth",
    labelZh: "溫潤陶土"
  },
  {
    asset: "chazen-blue-white-porcelain-set.png",
    alt: "A blue and white porcelain tea set on a carved wooden tray.",
    altZh: "青花瓷茶具置於雕花木茶盤上。",
    label: "Blue-and-white gathering",
    labelZh: "青花雅聚",
    shape: "square"
  },
  {
    asset: "tea-set-white-still-life.webp",
    alt: "A restrained white porcelain tea setting against an ink-wash wall.",
    altZh: "白瓷茶席安靜地置於水墨牆前。",
    label: "Porcelain stillness",
    labelZh: "白瓷之靜"
  },
  {
    asset: "chazen-garden-bamboo-tea.png",
    alt: "A clay tea set prepared beside a bamboo garden.",
    altZh: "陶製茶具設於竹林庭園旁。",
    label: "Tea beside bamboo",
    labelZh: "竹下茶席",
    shape: "wide"
  },
  {
    asset: "first-pack-mockup.png",
    alt: "A pale porcelain travel tea set with four small cups.",
    altZh: "淺色旅行茶具配四隻小茶杯。",
    label: "A lighter beginning",
    labelZh: "輕盈的開始"
  },
  {
    asset: "tea-set-nocturne.webp",
    alt: "A dark tea service glowing softly in a shadowed room.",
    altZh: "幽暗茶室中泛著柔光的深色茶具。",
    label: "Nocturne tea",
    labelZh: "夜色茶席"
  },
  {
    asset: "lifetime-tea-box-mockup.png",
    alt: "A navy porcelain tea set decorated with gold blossoms.",
    altZh: "飾有金色花卉的深藍瓷茶具。",
    label: "Midnight blossom",
    labelZh: "夜色金花",
    shape: "square"
  },
  {
    asset: "tea-set-blue-white-gaiwan.webp",
    alt: "A blue and white gaiwan ready on a wooden tea table.",
    altZh: "青花蓋碗置於木茶席上。",
    label: "The scholar's gaiwan",
    labelZh: "文人蓋碗"
  },
  {
    asset: "cup-faith-jian-zhan.png",
    alt: "A celadon gaiwan catching soft window light.",
    altZh: "青瓷蓋碗承接窗邊柔光。",
    label: "Celadon light",
    labelZh: "青瓷之光"
  },
  {
    asset: "cup-wisdom-jian-zhan.png",
    alt: "A white gaiwan in a quiet neutral still life.",
    altZh: "白蓋碗置於安靜的中性色靜物場景中。",
    label: "Form reduced to essence",
    labelZh: "器形歸於本質"
  },
  {
    asset: "chazen-gongfu-pour-v2.png",
    alt: "Tea pouring from a decorated gaiwan into a tasting cup.",
    altZh: "茶湯從花紋蓋碗注入品茗杯。",
    label: "The attentive pour",
    labelZh: "專注的一泡",
    shape: "feature"
  },
  {
    asset: "tea-set-blue-white-pair.webp",
    alt: "Two blue and white gaiwans in a traditional tea room.",
    altZh: "兩只青花蓋碗置於傳統茶室。",
    label: "A pair in conversation",
    labelZh: "雙盞相對"
  },
  {
    asset: "cup-mindfulness-jian-zhan.png",
    alt: "A pure white gaiwan presented as a single sculptural object.",
    altZh: "純白蓋碗如一件雕塑般呈現。",
    label: "White study",
    labelZh: "白瓷習作"
  },
  {
    asset: "tea-set-brown-gaiwan.webp",
    alt: "A brown glazed gaiwan beside a glass fairness pitcher.",
    altZh: "褐釉蓋碗與玻璃公道杯相伴。",
    label: "Autumn glaze",
    labelZh: "秋色釉光"
  },
  {
    asset: "tea-set-garden-blue-white.webp",
    alt: "A blue and white gaiwan prepared in a bamboo garden.",
    altZh: "青花蓋碗設於竹林庭園中。",
    label: "Garden infusion",
    labelZh: "庭園一泡",
    shape: "wide"
  },
  {
    asset: "chazen-first-evening-gaiwan.png",
    alt: "Loose tea leaves opening inside a crackle-glaze gaiwan.",
    altZh: "茶葉在開片釉蓋碗中舒展。",
    label: "Leaves opening",
    labelZh: "茶葉初展"
  },
  {
    asset: "b2b-gift-box-mockup.png",
    alt: "A formal black and gold tea set arranged for presentation.",
    altZh: "黑金茶具以正式禮贈方式陳列。",
    label: "Ceremonial black and gold",
    labelZh: "黑金禮器"
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
  const { addItem } = useCart();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    document.title = language === "zh" ? "茶盒 | Chazen" : "Tea Boxes | Chazen";
  }, [language]);

  function handleAddToCart(box: (typeof boxCards)[number]) {
    if (!box.productId) return;
    addItem({ productId: box.productId, name: t(box.title.en, box.title.zh), priceLabel: box.price });
    setAddedProductId(box.productId);
    window.setTimeout(
      () => setAddedProductId((current) => (current === box.productId ? null : current)),
      1800
    );
  }

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
              <div className={styles["tea-box-media"]}>
                <Image src={`${basePath}/images/${box.asset}`} alt={box.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
              <div className={styles["tea-box-body"]}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <div>
                  <h3>{t(box.title.en, box.title.zh)}</h3>
                  <span className={styles["tea-box-price"]}>{box.price}</span>
                  <ul>
                    {box.items.map((item) => (
                      <li key={item.en}>{t(item.en, item.zh)}</li>
                    ))}
                  </ul>
                  {box.productId ? (
                    <button
                      type="button"
                      className={styles["tea-box-buy-button"]}
                      onClick={() => handleAddToCart(box)}
                    >
                      {addedProductId === box.productId
                        ? t("Added ✓", "已加入 ✓")
                        : t("Add to Cart", "加入購物車")}
                    </button>
                  ) : (
                    <a className={styles["tea-box-enquire-link"]} href={`${basePath}/b2b/`}>
                      {t("Enquire", "查詢")}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Teaware collection"
        eyebrowZh="茶器收藏"
        title="一席茶，可以有很多種器物語言"
        english="Objects for Every Kind of Tea Moment"
        copy="從溫潤陶土、青花瓷與安靜青瓷，到正式的黑釉茶器，所有 Chazen 茶器習作都在這裡匯成一席。"
        copyEn="From warm clay and blue-and-white porcelain to quiet celadon and formal black glaze, this collection brings every Chazen teaware study into one place."
        tone="paper"
      >
        <ChazenImageGallery items={teawareGallery} />
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
