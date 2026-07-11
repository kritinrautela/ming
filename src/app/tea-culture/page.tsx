"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";

const timeline = [
  {
    title: { zh: "神農傳說", en: "The Legend of Shennong" },
    copy: {
      zh: "茶從傳說與草木經驗開始，慢慢走入人的生活。",
      en: "Tea began with legend and herbal knowledge, slowly finding its way into daily life."
    },
    asset: "culture-shennong.webp"
  },
  {
    title: { zh: "唐代 — 陸羽《茶經》", en: "Tang Dynasty — Lu Yu's Classic of Tea" },
    copy: {
      zh: "茶被書寫、整理，也開始成為有系統的文化。",
      en: "Tea was written about and codified, becoming a systematic culture."
    },
    asset: "culture-luyu-tea-classic.webp"
  },
  {
    title: { zh: "宋代 — 點茶與文人美學", en: "Song Dynasty — Whisked Tea and Literati Aesthetics" },
    copy: {
      zh: "茶與器物、書畫、文人日常連在一起。",
      en: "Tea intertwined with fine objects, calligraphy, painting, and literati daily life."
    },
    asset: "culture-song-diancha.webp"
  },
  {
    title: { zh: "明代 — 散茶與日常飲茶", en: "Ming Dynasty — Loose-Leaf Tea and Everyday Drinking" },
    copy: {
      zh: "飲茶方式更貼近日常，也更接近今天的茶桌。",
      en: "Tea drinking grew closer to everyday life, resembling the tea table we know today."
    },
    asset: "culture-ming-loose-leaf.webp"
  },
  {
    title: { zh: "Modern Chazen", en: "Modern Chazen" },
    copy: {
      zh: "以茶測試、茶儀式與文化內容，把茶帶回現代生活。",
      en: "Bringing tea back into modern life through the Tea Test, tea ritual, and cultural content."
    },
    asset: "culture-five-faculties-jian-zhan.webp"
  }
];

const philosophy = [
  {
    title: { zh: "茶與心境", en: "Tea and the Mind" },
    copy: {
      zh: "茶讓人暫時離開速度，重新聽見自己的狀態。",
      en: "Tea lets you step away from speed for a moment, and hear your own state again."
    }
  },
  {
    title: { zh: "茶與修習", en: "Tea and Practice" },
    copy: {
      zh: "重複的泡茶動作，讓日常有了可以安放的節奏。",
      en: "The repeated motions of brewing give daily life a rhythm to settle into."
    }
  },
  {
    title: { zh: "茶與日常", en: "Tea and Daily Life" },
    copy: {
      zh: "茶不必隆重，也可以是每天幾分鐘的清明。",
      en: "Tea doesn't need to be formal — it can be a few minutes of clarity each day."
    }
  },
  {
    title: { zh: "茶與連結", en: "Tea and Connection" },
    copy: {
      zh: "一杯茶可以是招待、答謝，也可以是關係中的停頓。",
      en: "A cup of tea can be hospitality, gratitude, or a pause within a relationship."
    }
  }
];

const modernChazen = [
  {
    title: { en: "AI Tea Test", zh: "AI 茶測試" },
    copy: {
      zh: "由生活狀態與茶偏好，找到此刻的茶方向。",
      en: "Find your current tea direction based on your state of life and preferences."
    }
  },
  {
    title: { en: "Tea ritual", zh: "茶儀式" },
    copy: {
      zh: "把蓋碗、公道杯、聞香與慢飲變成可學習的流程。",
      en: "Turning the gaiwan, fairness pitcher, aroma, and slow sipping into a learnable process."
    }
  },
  {
    title: { en: "Cultural education", zh: "文化教育" },
    copy: {
      zh: "以簡潔內容介紹茶史、器物、禮儀與哲學。",
      en: "Introducing tea history, objects, etiquette, and philosophy through concise content."
    }
  },
  {
    title: { en: "Tea boxes", zh: "茶盒" },
    copy: {
      zh: "把茶、儀式和故事放進可收藏、可送禮的形式。",
      en: "Putting tea, ritual, and story into a collectible, giftable form."
    }
  }
];

export default function TeaCulturePage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "茶文化 | Chazen" : "Tea Culture | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Culture"
        eyebrowZh="茶文化"
        title="茶，如何穿過中國歷史"
        english="Tea Through Chinese History"
        copy="從神農傳說、唐代《茶經》、宋代點茶，到現代 Chazen，茶一直不只是飲品，而是一種文化與生活方式。"
        copyEn="From the legend of Shennong, to the Tang dynasty's Classic of Tea, to Song dynasty whisked tea, to modern Chazen — tea has always been more than a drink; it is a culture and a way of life."
        placeholder={{
          asset: "culture-song-diancha.webp",
          label: "Digital tea museum atmosphere",
          note: "Hero placeholder for Song dynasty tea culture"
        }}
      />

      <ChazenContentSection
        eyebrow="Timeline"
        eyebrowZh="時間線"
        title="茶從傳說走到日常"
        english="From Origin Story to Everyday Practice"
        tone="paper"
      >
        <div className="chazen-card-grid">
          {timeline.map((item, index) => (
            <article key={item.title.en} className="chazen-subpage-card">
              <span>
                {String(index + 1).padStart(2, "0")} / {t("Future visual", "未來視覺")}: {item.asset}
              </span>
              {language === "zh" ? <h3 lang="zh-Hant">{item.title.zh}</h3> : <h3>{item.title.en}</h3>}
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Tea and philosophy"
        eyebrowZh="茶與哲理"
        title="茶是一種看見生活的方式"
        english="Tea as a Way of Seeing Daily Life"
      >
        <div className="chazen-card-grid">
          {philosophy.map((item) => (
            <article key={item.title.en} className="chazen-subpage-card">
              {language === "zh" ? <h3 lang="zh-Hant">{item.title.zh}</h3> : <h3>{item.title.en}</h3>}
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Five Jian Zhan"
        eyebrowZh="五盞建盞"
        title="五盞建盞，五種回到自身的方法"
        english="Five Cups, Five Ways Back to the Self"
        copy="Chazen 以五盞建盞對應信、精進、念、定、慧。這裡不是教義，而是一種文化性的比喻：用一杯茶，讓人重新靠近自己。"
        copyEn="Chazen maps five Jian Zhan cups to Faith, Effort, Mindfulness, Stillness, and Wisdom. This isn't doctrine — it's a cultural metaphor: using a cup of tea to bring you closer to yourself."
        tone="paper"
      >
        <div className="chazen-two-column">
          <div className="chazen-subpage-note">
            <h3>{t("Faith, Effort, Mindfulness, Stillness, Wisdom", "信、精進、念、定、慧")}</h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Faith is being willing to pause first; Effort is sustaining a daily practice; Mindfulness is knowing you're drinking tea; Stillness is the mind slowly finding a place to rest; Wisdom is seeing more clearly.",
                "信，是願意先停下來；精進，是在日常裡持續修習；念，是知道自己正在喝茶；定，是心慢慢有停靠之處；慧，是看得更清楚。"
              )}
            </p>
            <Link href="/five-cups" className="chazen-subpage-button chazen-subpage-button-primary">
              {t("View Five Cups", "查看五盞建盞")}
            </Link>
          </div>
          <ChazenMediaPlaceholder
            asset="culture-five-faculties-jian-zhan.webp"
            label="Future visual: Five Jian Zhan Cups and Five Faculties"
            note="Reserved cultural Five Cups visual"
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Modern Chazen"
        eyebrowZh="現代 Chazen"
        title="把茶文化帶回現代生活"
        english="Bringing Tea Culture Into Modern Life"
      >
        <div className="chazen-card-grid">
          {modernChazen.map((item) => (
            <article key={item.title.en} className="chazen-subpage-card">
              <span>{t(item.title.en, item.title.zh)}</span>
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="從儀式開始認識茶"
        titleEn="Get to Know Tea Through Ritual"
        copy="Learn the tea table before choosing the next cup."
        copyZh="在選擇下一杯茶之前，先認識這張茶桌。"
        primary={{ href: "/tea-ritual", label: "Explore Tea Ritual", labelZh: "探索茶儀式" }}
        secondary={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
        next={{ href: "/five-cups", label: "Five Cups", labelZh: "五盞" }}
      />
    </main>
  );
}
