"use client";

import { useEffect } from "react";
import { BrewSimulator } from "@/components/BrewSimulator";
import { ChazenContentSection, ChazenCtaBand, ChazenSubpageHero } from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";

const principles = [
  {
    zh: "水溫",
    en: "Temperature",
    copy: {
      en: "Delicate green and white leaves cook above 88°C; oolong, black, and pu-erh want the kettle at or near a full boil. The old kettle-watchers read this from the bubbles — shrimp eyes, crab eyes, fish eyes.",
      zh: "嬌嫩的綠茶與白茶超過 88°C 就會被燙熟；烏龍、紅茶與普洱則需要接近全滾的水。古人從水泡讀溫度——蝦眼、蟹眼、魚眼。"
    }
  },
  {
    zh: "時間",
    en: "Time",
    copy: {
      en: "Gongfu brewing runs short and repeats often. The second and third infusions pour faster than the first, because the leaf is already open. Later steeps slow down as the leaf spends itself.",
      zh: "工夫泡講求短時多泡。第二、三泡比第一泡更快出味，因為葉子已經打開。到後段，葉子漸漸用盡，時間才慢慢拉長。"
    }
  },
  {
    zh: "份量",
    en: "Dose",
    copy: {
      en: "Around five grams to a small vessel is the standard start. More leaf brews faster and deeper; less leaf is more forgiving. Adjust one variable at a time, and let the cup tell you what changed.",
      zh: "小器約五克是標準起點。葉多出味快而深；葉少則更寬容。一次只調整一個變數，讓茶杯告訴你發生了甚麼。"
    }
  }
];

export default function BrewSimulatorPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "沖泡室 | Chazen" : "The Brewing Room | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="The Brewing Room"
        eyebrowZh="沖泡室"
        title="先在這裡，練習一泡茶"
        english="Practice a Pour Before You Pour"
        copy="選一款葉，選一件器，調好水溫與份量，然後注水。看著茶葉舒展、湯色加深，在恰當的一刻出湯。每一泡都會告訴你一些事。"
        copyEn="Choose a leaf, choose a vessel, set the water and the dose, then pour. Watch the leaf unfurl and the liquor deepen, and decant at the right moment. Every infusion tells you something."
        media={{
          asset: "chazen-hero-gongfu-room-v3.jpg",
          alt: "A gongfu tea room with kettle, gaiwan, and cups laid out for practice."
        }}
      />

      <ChazenContentSection
        eyebrow="Simulator"
        eyebrowZh="模擬沖泡"
        title="一張不會弄濕桌子的茶桌"
        english="A Tea Table That Never Spills"
        copy="The model behind this table is simple but honest: hotter water extracts faster, clay holds heat, open leaves give quickly, and every leaf has a window where the cup is balanced."
        copyEn="The model behind this table is simple but honest: hotter water extracts faster, clay holds heat, open leaves give quickly, and every leaf has a window where the cup is balanced."
        tone="paper"
      >
        <BrewSimulator />
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="What the table teaches"
        eyebrowZh="茶桌教的事"
        title="三個變數，一杯平衡的茶"
        english="Three Variables, One Balanced Cup"
      >
        <div className="chazen-three-column">
          {principles.map((principle) => (
            <article key={principle.en} className="chazen-subpage-note">
              <h3>{t(principle.en, principle.zh)}</h3>
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(principle.copy.en, principle.copy.zh)}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="把練習帶到真正的茶桌上"
        titleEn="Take the Practice to a Real Table"
        copy="When you are ready for a real leaf and real steam, the ritual page walks the same six steps with your own teaware."
        copyZh="準備好面對真正的茶葉與蒸氣時，茶儀式頁會用你自己的茶具，走同樣的六個步驟。"
        primary={{ href: "/tea-ritual", label: "Learn the Tea Ritual", labelZh: "學習茶儀式" }}
        secondary={{ href: "/tea-collection", label: "Browse the Teas", labelZh: "瀏覽茶品" }}
        next={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
      />
    </main>
  );
}
