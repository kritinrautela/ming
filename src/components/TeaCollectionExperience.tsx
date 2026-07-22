"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { buildInquiryPath } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";
import styles from "./TeaCollectionExperience.module.css";

const filters = [
  { en: "All", zh: "全部" },
  { en: "Oolong", zh: "烏龍" },
  { en: "Green", zh: "綠茶" },
  { en: "White", zh: "白茶" },
  { en: "Black / Red", zh: "紅茶" },
  { en: "Pu'er", zh: "普洱" },
  { en: "Japanese", zh: "日本茶" }
];

type Tea = {
  slug: string;
  name: string;
  chinese: string;
  origin: { en: string; zh: string };
  family: { en: string; zh: string };
  process: { en: string; zh: string };
  look: { en: string; zh: string };
  taste: { en: string; zh: string };
  aroma: { en: string; zh: string };
  ritual: { en: string; zh: string };
  note: { en: string; zh: string };
  gift: { en: string; zh: string };
  caffeine: { en: string; zh: string };
  liquor: string;
  palette: string;
  productId: string;
  priceLabel: string;
};

const teas: Tea[] = [
  {
    slug: "da-hong-pao",
    name: "Da Hong Pao",
    chinese: "大紅袍",
    origin: { en: "Wuyi, Fujian", zh: "福建武夷山" },
    family: { en: "Oolong", zh: "烏龍" },
    process: {
      en: "Withered, bruised, oxidized, charcoal roasted, then rested until the roast settles into the leaf.",
      zh: "萎凋、搖青、氧化、炭焙，再靜置至焙火融入茶葉之中。"
    },
    look: { en: "Dark twisted strips with roasted edges and a mineral sheen.", zh: "深色捲曲條索，帶焙火邊緣與礦物光澤。" },
    taste: {
      en: "Cliff mineral, orchid, warm roast, dark honey, and returning sweetness.",
      zh: "岩石礦質、蘭花香、溫暖焙火、深色蜜香，以及回甘。"
    },
    aroma: { en: "Wet stone, orchid, charcoal warmth.", zh: "濕石、蘭花、炭火溫暖。" },
    ritual: { en: "For ceremony, important guests, and conversations with gravity.", zh: "適合正式場合、重要賓客與莊重的對話。" },
    note: {
      en: "A rock tea whose luxury comes from restraint: mountain, roast, and aftertaste.",
      zh: "一款岩茶，其奢華來自克制：山、焙火與回甘。"
    },
    gift: { en: "VIP client, mentor, or ceremonial host gift.", zh: "適合貴賓客戶、導師或正式主人贈禮。" },
    caffeine: { en: "Medium-high intensity", zh: "中高強度" },
    liquor: "#9b4f2d",
    palette: "rock",
    productId: "da-hong-pao",
    priceLabel: "A$32"
  },
  {
    slug: "longjing",
    name: "Longjing",
    chinese: "龍井",
    origin: { en: "Hangzhou, Zhejiang", zh: "浙江杭州" },
    family: { en: "Green", zh: "綠茶" },
    process: {
      en: "Tender spring leaves are hand pan-fired to halt oxidation and preserve clarity.",
      zh: "嫩春茶葉經手工炒製，以停止氧化並保留清澈之感。"
    },
    look: { en: "Flat jade leaves pressed by the palm against a warm pan.", zh: "扁平翠綠茶葉，經手掌於溫熱鍋中壓製而成。" },
    taste: { en: "Chestnut, bean flower, spring grass, rain, and clean sweetness.", zh: "栗香、豆花香、春草香、雨水氣息，以及乾淨的甘甜。" },
    aroma: { en: "Toasted chestnut, tender greens, lake air.", zh: "烤栗香、嫩葉青香、湖畔空氣。" },
    ritual: { en: "A clear morning tea before work, writing, or decision.", zh: "適合工作、書寫或決策前的清晨一杯。" },
    note: { en: "Longjing is clarity as a leaf: quiet, flat, luminous, and precise.", zh: "龍井是化為茶葉的清澈：安靜、扁平、明亮而精準。" },
    gift: { en: "Study, career, focus, or new-beginning gift.", zh: "適合學業、事業、專注或新開始的贈禮。" },
    caffeine: { en: "Medium intensity", zh: "中等強度" },
    liquor: "#c9c36a",
    palette: "green",
    productId: "longjing",
    priceLabel: "A$26"
  },
  {
    slug: "bai-hao-yin-zhen",
    name: "Bai Hao Yin Zhen",
    chinese: "白毫銀針",
    origin: { en: "Fuding, Fujian", zh: "福建福鼎" },
    family: { en: "White", zh: "白茶" },
    process: { en: "Young buds are picked, withered, and dried with minimal intervention.", zh: "採摘嫩芽，經萎凋與乾燥，工序極少人工干預。" },
    look: { en: "Silver down-covered buds, pale as moonlit needles.", zh: "披滿銀毫的芽頭，淡如月下銀針。" },
    taste: { en: "Hay sweetness, pear skin, soft honey, and a quiet luminous body.", zh: "乾草甘甜、梨皮香、柔和蜜香，以及安靜明亮的口感。" },
    aroma: { en: "Warm hay, white flower, soft honey.", zh: "溫暖乾草香、白花香、柔和蜜香。" },
    ritual: { en: "For afternoon recovery and gentle conversation.", zh: "適合午後恢復精神與溫和的對話。" },
    note: { en: "A tea of patience; the luxury is in what is not forced.", zh: "一款需要耐心的茶；它的奢華在於不強求。" },
    gift: { en: "Family, elder, wellness, or soft blessing gift.", zh: "適合家人、長輩、養生或溫柔祝福的贈禮。" },
    caffeine: { en: "Low-medium intensity", zh: "低至中等強度" },
    liquor: "#d8c88f",
    palette: "white",
    productId: "bai-hao-yin-zhen",
    priceLabel: "A$36"
  },
  {
    slug: "tie-guan-yin",
    name: "Tie Guan Yin",
    chinese: "鐵觀音",
    origin: { en: "Anxi, Fujian", zh: "福建安溪" },
    family: { en: "Oolong", zh: "烏龍" },
    process: {
      en: "Withered, shaken, partially oxidized, rolled, dried, and refined by roast.",
      zh: "萎凋、搖青、部分氧化、揉捻、乾燥，並以焙火精製而成。"
    },
    look: { en: "Rolled green pearls that unfurl into thick aromatic leaves.", zh: "捲成翠綠珠狀，沖泡後舒展成厚實的芳香茶葉。" },
    taste: { en: "Orchid, cream, green stem, bright mineral, and lingering perfume.", zh: "蘭花香、奶香、青莖味、明亮礦質感，以及持久的香氣。" },
    aroma: { en: "Orchid, cream, garden air.", zh: "蘭花香、奶香、花園氣息。" },
    ritual: { en: "For welcoming a guest with fragrance before speech.", zh: "適合在言語之前，以香氣迎接賓客。" },
    note: { en: "A tea that teaches the host to let aroma arrive before explanation.", zh: "一款教會主人，讓香氣先於言語到達的茶。" },
    gift: { en: "Hospitality, partner, or fragrant welcome gift.", zh: "適合待客、伴侶或芬芳迎賓的贈禮。" },
    caffeine: { en: "Medium intensity", zh: "中等強度" },
    liquor: "#d2b35f",
    palette: "orchid",
    productId: "tie-guan-yin",
    priceLabel: "A$22"
  },
  {
    slug: "puer",
    name: "Pu'er",
    chinese: "普洱",
    origin: { en: "Yunnan", zh: "雲南" },
    family: { en: "Pu'er", zh: "普洱" },
    process: {
      en: "Sun-dried maocha is compressed and aged, sometimes fermented, until time becomes flavor.",
      zh: "日曬毛茶經壓製與陳化，有時經發酵，直到時間化為滋味。"
    },
    look: { en: "Compressed dark leaves or loose aged fragments with red-brown depth.", zh: "壓製的深色茶葉或散裝陳茶碎片，帶紅褐色深度。" },
    taste: { en: "Earth, camphor, old wood, dried fruit, and mellow sweetness.", zh: "泥土香、樟木香、老木香、乾果香，以及醇厚的甘甜。" },
    aroma: { en: "Old timber, date, rain on earth.", zh: "陳年木香、棗香、雨落大地的氣息。" },
    ritual: { en: "After dinner, when time can become slower.", zh: "適合晚餐後，讓時間慢下來的時刻。" },
    note: { en: "Pu'er is less a product than a record of storage, climate, and patience.", zh: "普洱與其說是產品，不如說是儲存、氣候與耐心的紀錄。" },
    gift: { en: "Elder, family continuity, or long-memory gift.", zh: "適合長輩、家族傳承或長久記憶的贈禮。" },
    caffeine: { en: "Medium intensity", zh: "中等強度" },
    liquor: "#6f3826",
    palette: "aged",
    productId: "puer",
    priceLabel: "A$20"
  },
  {
    slug: "high-mountain-oolong",
    name: "High Mountain Oolong",
    chinese: "高山烏龍",
    origin: { en: "Taiwan", zh: "台灣" },
    family: { en: "Oolong", zh: "烏龍" },
    process: {
      en: "Light oxidation, rolling, careful drying, and gentle roast preserve alpine fragrance.",
      zh: "輕發酵、揉捻、細心乾燥與輕柔焙火，保留高山香氣。"
    },
    look: { en: "Tightly rolled leaves with cool green-gold sheen.", zh: "緊密捲曲的茶葉，帶清涼的翠金光澤。" },
    taste: { en: "Cream, flower, cool air, soft stem, and lingering sweetness.", zh: "奶香、花香、清涼空氣感、柔和莖味，以及持久的甘甜。" },
    aroma: { en: "Alpine flower, cream, cold mist.", zh: "高山花香、奶香、冷冽霧氣。" },
    ritual: { en: "A reset between work and evening.", zh: "適合在工作與夜晚之間重新調整。" },
    note: { en: "Altitude becomes texture: soft, lifted, and quietly expansive.", zh: "海拔化為質地：柔和、輕盈，並靜靜地舒展開來。" },
    gift: { en: "Personal stillness, partner, or calm reset gift.", zh: "適合個人靜心、伴侶或平靜重整的贈禮。" },
    caffeine: { en: "Medium intensity", zh: "中等強度" },
    liquor: "#d7c36c",
    palette: "mountain",
    productId: "high-mountain-oolong",
    priceLabel: "A$30"
  },
  {
    slug: "lapsang-souchong",
    name: "Lapsang Souchong",
    chinese: "正山小種",
    origin: { en: "Tongmu, Wuyi, Fujian", zh: "福建武夷桐木" },
    family: { en: "Black / Red", zh: "紅茶" },
    process: {
      en: "Withered pine-smoked leaves are oxidized, dried, and refined into a deep red tea.",
      zh: "萎凋後以松煙燻製，再氧化、乾燥並精製成深色紅茶。"
    },
    look: { en: "Dark wiry leaves with pine-smoke depth.", zh: "深色細條茶葉，帶松煙深度。" },
    taste: { en: "Pine smoke, dried longan, dark sugar, and mountain warmth.", zh: "松煙香、龍眼乾香、黑糖香，以及山林的溫暖。" },
    aroma: { en: "Pine resin, longan, ember.", zh: "松脂香、龍眼香、餘燼氣息。" },
    ritual: { en: "For courage, winter, and protective gifting.", zh: "適合勇氣、冬日與守護意味的贈禮。" },
    note: {
      en: "The smoke should feel architectural, not loud: a room made of pine and memory.",
      zh: "煙燻感應如建築般沉穩，而非張揚：一個由松木與記憶構成的空間。"
    },
    gift: { en: "Courage, protection, or bold new-beginning gift.", zh: "適合勇氣、守護或大膽新開始的贈禮。" },
    caffeine: { en: "Medium-high intensity", zh: "中高強度" },
    liquor: "#8a3726",
    palette: "ember",
    productId: "lapsang-souchong",
    priceLabel: "A$24"
  },
  {
    slug: "uji-matcha",
    name: "Uji Matcha",
    chinese: "宇治抹茶",
    origin: { en: "Uji, Japan", zh: "日本宇治" },
    family: { en: "Japanese", zh: "日本茶" },
    process: {
      en: "Shade-grown leaves are steamed, dried as tencha, and stone-milled into fine powder.",
      zh: "遮蔭栽培的茶葉經蒸青、乾燥成碾茶，再以石磨磨成細粉。"
    },
    look: { en: "Velvet green powder with a luminous matte surface.", zh: "絲絨般的翠綠粉末，帶明亮的啞光表面。" },
    taste: { en: "Umami, fresh greens, soft bitterness, cream, and a focused finish.", zh: "鮮味、新鮮青草香、柔和苦味、奶香，以及專注的尾韻。" },
    aroma: { en: "Stone mill, sea air, young greens.", zh: "石磨香、海風氣息、嫩葉青香。" },
    ritual: { en: "For a threshold moment before meditation or creative work.", zh: "適合在冥想或創作之前的過渡時刻。" },
    note: { en: "A bridge to powdered tea culture: focused, tactile, and immediate.", zh: "通往抹茶文化的橋樑：專注、觸感豐富且直接。" },
    gift: { en: "Creative focus, meditation, or cross-cultural tea gift.", zh: "適合創作專注、冥想或跨文化茶禮的贈禮。" },
    caffeine: { en: "High intensity", zh: "高強度" },
    liquor: "#4f6f3b",
    palette: "matcha",
    productId: "uji-matcha",
    priceLabel: "A$34"
  }
];

type TeaCollectionExperienceProps = {
  basePath: string;
};

export function TeaCollectionExperience({ basePath }: TeaCollectionExperienceProps) {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTea, setSelectedTea] = useState(teas[0]);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const visibleTeas = useMemo(
    () => teas.filter((tea) => activeFilter === "All" || tea.family.en === activeFilter),
    [activeFilter]
  );

  function handleAddToCart(tea: Tea) {
    addItem({ productId: tea.productId, name: tea.name, priceLabel: tea.priceLabel });
    setAddedProductId(tea.productId);
    window.setTimeout(() => setAddedProductId((current) => (current === tea.productId ? null : current)), 1800);
  }

  return (
    <main className="tea-collection-page tea-collection-cinematic">
      <section className="tea-collection-hero">
        <Image
          src={`${basePath}/images/chazen-tea-collection-v1.jpg`}
          alt="Premium Chinese tea collection with loose leaves, tea canisters, and teaware."
          fill
          priority
          sizes="100vw"
        />
        <div className="tea-collection-shade" />
        <div className="tea-collection-hero-copy">
          <p className="museum-kicker">Tea Collection / 茶品收藏</p>
          <h1>{t("Leaves as origin, craft, taste, and ritual.", "茶葉，即產地、工藝、滋味與儀式。")}</h1>
          <p lang={language === "zh" ? "zh-Hant" : undefined}>
            {t(
              "Tea is not a grid of products. It is mountains, a craft, a cup of time.",
              "茶不是商品格子。是一座座山，一種手藝，一杯時間。"
            )}
          </p>
          <a href={`${basePath}/brew-simulator/`} className="museum-link-button">
            {t("Brew these leaves in the Brewing Room", "到沖泡室沖泡這些茶葉")}
          </a>
        </div>
      </section>

      <section className="museum-section tea-catalogue-exhibit">
        <div className="museum-container">
          <div className="tea-catalogue-head">
            <div>
              <p className="museum-kicker">Curated Leaves / 茶葉標本</p>
              <h2>{t("A catalogue arranged like a quiet cabinet, not a shop shelf.", "一份如靜謐標本櫃般編排的目錄，而非店鋪貨架。")}</h2>
            </div>
            <div className={styles["tea-filter-tabs"]} aria-label="Tea filters">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.en}
                  className={activeFilter === filter.en ? styles["is-active"] : ""}
                  onClick={() => {
                    setActiveFilter(filter.en);
                    const nextTea = teas.find((tea) => filter.en === "All" || tea.family.en === filter.en);
                    if (nextTea) setSelectedTea(nextTea);
                  }}
                  aria-pressed={activeFilter === filter.en}
                >
                  {t(filter.en, filter.zh)}
                </button>
              ))}
            </div>
          </div>

          <div className="tea-catalogue-stage">
            <aside className={`tea-curator-panel tea-${selectedTea.palette}`}>
              <div className="tea-liquor-study" aria-hidden="true">
                <span className="tea-cup-steam" />
                <span className="tea-cup-rim" />
                <span className="tea-cup-liquor" style={{ backgroundColor: selectedTea.liquor }} />
                <span className="tea-cup-body" />
              </div>
              <p className="museum-kicker">Selected Tea / 選中茶品</p>
              <h3>{selectedTea.name}</h3>
              <strong lang="zh-Hant">{selectedTea.chinese}</strong>
              <p className={styles["tea-price"]}>{selectedTea.priceLabel}</p>
              <p>{t(selectedTea.note.en, selectedTea.note.zh)}</p>
              <dl>
                <div>
                  <dt>{t("Origin", "產地")}</dt>
                  <dd>{t(selectedTea.origin.en, selectedTea.origin.zh)}</dd>
                </div>
                <div>
                  <dt>{t("Aroma", "香氣")}</dt>
                  <dd>{t(selectedTea.aroma.en, selectedTea.aroma.zh)}</dd>
                </div>
                <div>
                  <dt>{t("Ritual", "適用場合")}</dt>
                  <dd>{t(selectedTea.ritual.en, selectedTea.ritual.zh)}</dd>
                </div>
                <div>
                  <dt>{t("Gift Fit", "贈禮適合")}</dt>
                  <dd>{t(selectedTea.gift.en, selectedTea.gift.zh)}</dd>
                </div>
                <div>
                  <dt>{t("Caffeine", "咖啡因")}</dt>
                  <dd>{t(selectedTea.caffeine.en, selectedTea.caffeine.zh)}</dd>
                </div>
              </dl>
              <div className={styles["tea-curator-actions"]}>
                <button type="button" onClick={() => handleAddToCart(selectedTea)}>
                  {addedProductId === selectedTea.productId
                    ? t("Added ✓", "已加入 ✓")
                    : t(`Add to Cart — ${selectedTea.priceLabel}`, `加入購物車 — ${selectedTea.priceLabel}`)}
                </button>
                <a href={`${basePath}/tea-test/`}>{t("Add to Assessment Profile", "加入測評檔案")}</a>
                <a
                  href={buildInquiryPath({
                    basePath,
                    type: "Tea recommendation",
                    message: `I would like a private recommendation based on ${selectedTea.name}.`,
                    source: "Tea collection"
                  })}
                >
                  {t("Request Recommendation", "索取推薦")}
                </a>
              </div>
            </aside>

            <div className={styles["tea-scroll-gallery"]}>
              {visibleTeas.map((tea, index) => (
                <article
                  id={tea.slug}
                  key={tea.slug}
                  className={`tea-leaf-card tea-${tea.palette} ${selectedTea.slug === tea.slug ? "is-selected" : ""}`}
                >
                  <button type="button" className={styles["tea-leaf-select"]} onClick={() => setSelectedTea(tea)}>
                    <span className="leaf-specimen" aria-hidden="true">
                      <span className="leaf-dish" />
                      <span className="leaf leaf-one" />
                      <span className="leaf leaf-two" />
                      <span className="leaf leaf-three" />
                      <span className="leaf leaf-four" />
                      <em>{String(index + 1).padStart(2, "0")}</em>
                    </span>
                    <span className="tea-liquor-dot" style={{ backgroundColor: tea.liquor }} aria-hidden="true" />
                    <span className={styles["tea-leaf-copy"]}>
                      <span>{t(tea.family.en, tea.family.zh)}</span>
                      <h2>{tea.name}</h2>
                      <strong lang="zh-Hant">{tea.chinese}</strong>
                      <span className={styles["tea-price"]}>{tea.priceLabel}</span>
                      <dl>
                        <div>
                          <dt>{t("Dry Leaf", "乾茶外觀")}</dt>
                          <dd>{t(tea.look.en, tea.look.zh)}</dd>
                        </div>
                        <div>
                          <dt>{t("Process", "製程")}</dt>
                          <dd>{t(tea.process.en, tea.process.zh)}</dd>
                        </div>
                        <div>
                          <dt>{t("Taste", "滋味")}</dt>
                          <dd>{t(tea.taste.en, tea.taste.zh)}</dd>
                        </div>
                        <div>
                          <dt>{t("Cultural Note", "文化筆記")}</dt>
                          <dd>{t(tea.note.en, tea.note.zh)}</dd>
                        </div>
                        <div>
                          <dt>{t("Gift Suitability", "贈禮適合度")}</dt>
                          <dd>{t(tea.gift.en, tea.gift.zh)}</dd>
                        </div>
                        <div>
                          <dt>{t("Caffeine / Intensity", "咖啡因／強度")}</dt>
                          <dd>{t(tea.caffeine.en, tea.caffeine.zh)}</dd>
                        </div>
                      </dl>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="museum-section">
        <div className={`museum-container ${styles["tea-packaging-feature"]}`}>
          <div className={styles["tea-packaging-media"]}>
            <Image
              src={`${basePath}/images/chazen-pyramid-sachets.png`}
              alt="Chazen black, green, and flower tea in individually sealed pyramid sachets, each stamped with the Chazen seal."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="museum-kicker">{t("Every Sachet, Sealed", "每一包，皆有印記")}</p>
            <h2>{t("Whole leaves, not dust, folded into a pyramid mesh.", "完整茶葉，非茶末，摺入三角網袋之中。")}</h2>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Each pyramid sachet gives the leaf room to unfurl the way it would in a gaiwan, sealed with the Chazen mark so every cup starts the same way.",
                "每一只三角茶包都留有空間，讓茶葉如蓋碗沖泡般舒展，並印有 Chazen 印記，讓每一杯都從同樣的起點開始。"
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
