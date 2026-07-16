"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language";

const origins = [
  {
    name: "Yunnan Pu'er",
    cn: "雲南普洱",
    x: "24%",
    y: "70%",
    altitude: "1,200-2,000m",
    climate: { en: "Mist, old forest, humid mountain air", zh: "雲霧、老林、潮濕的山間空氣" },
    terroir: { en: "Ancient tea trees, red earth, deep microbial aging", zh: "古茶樹、紅土，以及深層的微生物陳化" },
    type: { en: "Sheng and shou Pu'er", zh: "生普與熟普" },
    process: { en: "Sun-dried maocha, compressed, aged", zh: "日曬毛茶、緊壓、陳化" },
    story: {
      en: "Caravan tea, mountain villages, and the long patience of transformation.",
      zh: "馬幫茶、山中村落，以及漫長轉化所需的耐心。"
    },
    ritual: { en: "Clay pot, slow rinse, many short infusions", zh: "陶壺、緩慢潤茶、多次短泡" }
  },
  {
    name: "Fujian Wuyi",
    cn: "武夷岩茶",
    x: "67%",
    y: "52%",
    altitude: "300-700m",
    climate: { en: "Rock valley, mineral mist, warm rain", zh: "岩谷、礦質霧氣、溫暖的雨" },
    terroir: { en: "Zhengyan cliff soil, orchid aroma, roasted stone character", zh: "正岩崖壁土壤、蘭花香氣、焙火岩韻" },
    type: { en: "Rock oolong", zh: "岩茶烏龍" },
    process: { en: "Withered, shaken, oxidized, charcoal roasted", zh: "萎凋、搖青、氧化、炭焙" },
    story: {
      en: "A tea of cliffs and scholar paths, remembered for yan yun, the rhyme of rock.",
      zh: "一種來自懸崖與文人步道的茶，以「岩韻」為人所記憶。"
    },
    ritual: { en: "Small gaiwan, high leaf ratio, fragrant cup", zh: "小蓋碗、高茶葉比例、聞香杯" }
  },
  {
    name: "Anxi Tieguanyin",
    cn: "安溪鐵觀音",
    x: "63%",
    y: "60%",
    altitude: "600-1,000m",
    climate: { en: "Cool hills, cloud, monsoon freshness", zh: "清涼丘陵、雲霧、季風般的清新" },
    terroir: { en: "Floral lift, creamy body, bright green mountain fragrance", zh: "花香揚起、質地醇厚、明亮的高山青香" },
    type: { en: "Oolong", zh: "烏龍茶" },
    process: { en: "Light oxidation, rolling, careful firing", zh: "輕發酵、揉捻、細心烘焙" },
    story: {
      en: "The Iron Goddess of Mercy, refined through repetition and hand memory.",
      zh: "鐵觀音，透過反覆練習與手感記憶淬煉而成。"
    },
    ritual: { en: "Porcelain gaiwan, clear water, attentive aroma", zh: "瓷蓋碗、清澈的水、專注的聞香" }
  },
  {
    name: "Hangzhou Longjing",
    cn: "杭州龍井",
    x: "72%",
    y: "43%",
    altitude: "100-300m",
    climate: { en: "Lake humidity, spring fog, tender sun", zh: "湖畔濕氣、春霧、柔和的陽光" },
    terroir: { en: "Chestnut, bean blossom, soft green sweetness", zh: "栗香、豆花香、柔和的青綠甘甜" },
    type: { en: "Green tea", zh: "綠茶" },
    process: { en: "Hand pan-fired flat leaf", zh: "手工炒製扁形茶葉" },
    story: {
      en: "West Lake elegance: court tribute, spring picking, quiet clarity.",
      zh: "西湖之雅：皇室貢品、春日採摘、靜謐清澈。"
    },
    ritual: { en: "Glass cup, lower temperature, watch the leaf fall", zh: "玻璃杯、較低水溫、靜看茶葉舒展下沉" }
  },
  {
    name: "Huangshan / Keemun",
    cn: "黃山 / 祁門",
    x: "69%",
    y: "47%",
    altitude: "600-1,200m",
    climate: { en: "Granite peaks, cloud sea, cool rain", zh: "花崗岩峰、雲海、清涼的雨" },
    terroir: { en: "Orchid, pine, mineral freshness, honeyed red tea depth", zh: "蘭香、松香、礦物般的清新，以及蜜香紅茶的深度" },
    type: { en: "Green tea and black tea", zh: "綠茶與紅茶" },
    process: { en: "Pan-fired greens; withered and oxidized Keemun", zh: "炒製綠茶；萎凋發酵的祁門紅茶" },
    story: {
      en: "A mountain of poets, ink landscapes, and fragrant red tea.",
      zh: "一座詩人、水墨山水與芬芳紅茶的山。"
    },
    ritual: { en: "Quiet cup, low light, mountain-water attention", zh: "安靜的茶杯、柔和光線、專注於山泉之水" }
  },
  {
    name: "Chaozhou Dancong",
    cn: "潮州鳳凰單叢",
    x: "65%",
    y: "68%",
    altitude: "600-1,400m",
    climate: { en: "Phoenix Mountain cloud, warm coastal air", zh: "鳳凰山雲霧、溫暖的沿海空氣" },
    terroir: { en: "Single-bush fragrance: honey orchid, almond, magnolia", zh: "單株香氣：蜜蘭香、杏仁香、玉蘭花香" },
    type: { en: "Dancong oolong", zh: "單叢烏龍" },
    process: { en: "Single cultivar harvest, oxidation, roasting", zh: "單一品種採摘、發酵、焙火" },
    story: {
      en: "A tea of individual trees and intense gongfu hospitality.",
      zh: "一種來自單株茶樹、盛載濃厚工夫茶待客之道的茶。"
    },
    ritual: { en: "Chaozhou gongfu, tiny cups, fast precise pours", zh: "潮州工夫茶、小茶杯、快速精準的注水" }
  },
  {
    name: "Taiwan High Mountain",
    cn: "台灣高山烏龍",
    x: "78%",
    y: "69%",
    altitude: "1,000-2,600m",
    climate: { en: "High fog, cool nights, clean mountain air", zh: "高山雲霧、清涼夜晚、潔淨的山間空氣" },
    terroir: { en: "Milky texture, alpine florals, luminous finish", zh: "奶香質地、高山花香、明亮的尾韻" },
    type: { en: "High mountain oolong", zh: "高山烏龍" },
    process: { en: "Light oxidation, ball rolling, gentle roasting", zh: "輕發酵、球形揉捻、輕柔焙火" },
    story: {
      en: "Modern mountain craft, where elevation becomes softness.",
      zh: "現代高山工藝，海拔在此化為柔美。"
    },
    ritual: { en: "Porcelain or glass, wide aroma pause", zh: "瓷杯或玻璃杯，留有充分的聞香停頓" }
  },
  {
    name: "Uji Matcha",
    cn: "宇治抹茶",
    x: "87%",
    y: "34%",
    altitude: "50-250m",
    climate: { en: "River mist, shade cultivation, temperate rain", zh: "河畔霧氣、遮蔭栽培、溫和的雨" },
    terroir: { en: "Umami, vivid green, powdered silk", zh: "鮮味、鮮明的綠、如絲綢般的粉末" },
    type: { en: "Tencha / matcha", zh: "碾茶／抹茶" },
    process: { en: "Shade-grown, steamed, dried, stone-milled", zh: "遮蔭栽培、蒸青、乾燥、石磨研磨" },
    story: {
      en: "A Japanese tea room discipline shaped by shade, whisk, and silence.",
      zh: "一種由遮蔭、茶筅與靜默塑造而成的日本茶室修行。"
    },
    ritual: { en: "Chawan, chasen, slow breath before whisking", zh: "茶碗、茶筅，擊拂前的緩慢呼吸" }
  }
];

export function TeaAtlasExhibit() {
  const [active, setActive] = useState(origins[0]);
  const { t, language } = useLanguage();

  return (
    <div className="atlas-exhibit">
      <div className="atlas-map" aria-label="Interactive tea origin map">
        <div className="atlas-landmass" />
        {origins.map((origin) => (
          <button
            key={origin.name}
            type="button"
            className={`atlas-point ${active.name === origin.name ? "is-active" : ""}`}
            style={{ left: origin.x, top: origin.y }}
            onClick={() => setActive(origin)}
          >
            <span>{language === "zh" ? origin.cn : origin.name}</span>
          </button>
        ))}
      </div>
      <article className="atlas-card">
        <p className="museum-label">{t("Selected Origin", "所選產地")}</p>
        <h2 className="display-title mt-4 text-5xl leading-none text-ink">{active.cn}</h2>
        <p className="mt-2 text-xl font-semibold text-leaf">{active.name}</p>
        <dl className="atlas-facts">
          <div>
            <dt>{t("Altitude", "海拔")}</dt>
            <dd>{active.altitude}</dd>
          </div>
          <div>
            <dt>{t("Climate", "氣候")}</dt>
            <dd>{t(active.climate.en, active.climate.zh)}</dd>
          </div>
          <div>
            <dt>{t("Tea Type", "茶類")}</dt>
            <dd>{t(active.type.en, active.type.zh)}</dd>
          </div>
          <div>
            <dt>{t("Process", "製程")}</dt>
            <dd>{t(active.process.en, active.process.zh)}</dd>
          </div>
        </dl>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="museum-label text-moss">{t("Terroir", "風土")}</p>
            <p className="mt-3 text-sm leading-7 text-ink/65">{t(active.terroir.en, active.terroir.zh)}</p>
          </div>
          <div>
            <p className="museum-label text-moss">{t("Recommended Ritual", "建議儀式")}</p>
            <p className="mt-3 text-sm leading-7 text-ink/65">{t(active.ritual.en, active.ritual.zh)}</p>
          </div>
        </div>
        <p className="mt-8 border-l border-clay/35 pl-5 text-base leading-8 text-ink/70">
          {t(active.story.en, active.story.zh)}
        </p>
      </article>
    </div>
  );
}
