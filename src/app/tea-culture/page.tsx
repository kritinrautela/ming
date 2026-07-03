import Link from "next/link";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";

export const metadata = {
  title: "Tea Culture"
};

const timeline = [
  ["神農傳說", "茶從傳說與草木經驗開始，慢慢走入人的生活。", "culture-shennong.webp"],
  ["唐代 — 陸羽《茶經》", "茶被書寫、整理，也開始成為有系統的文化。", "culture-luyu-tea-classic.webp"],
  ["宋代 — 點茶與文人美學", "茶與器物、書畫、文人日常連在一起。", "culture-song-diancha.webp"],
  ["明代 — 散茶與日常飲茶", "飲茶方式更貼近日常，也更接近今天的茶桌。", "culture-ming-loose-leaf.webp"],
  ["Modern Chazen", "以茶測試、茶儀式與文化內容，把茶帶回現代生活。", "culture-five-faculties-jian-zhan.webp"]
];

const philosophy = [
  ["茶與心境", "茶讓人暫時離開速度，重新聽見自己的狀態。"],
  ["茶與修習", "重複的泡茶動作，讓日常有了可以安放的節奏。"],
  ["茶與日常", "茶不必隆重，也可以是每天幾分鐘的清明。"],
  ["茶與連結", "一杯茶可以是招待、答謝，也可以是關係中的停頓。"]
];

const modernChazen = [
  ["AI Tea Test", "由生活狀態與茶偏好，找到此刻的茶方向。"],
  ["Tea ritual", "把蓋碗、公道杯、聞香與慢飲變成可學習的流程。"],
  ["Cultural education", "以簡潔內容介紹茶史、器物、禮儀與哲學。"],
  ["Tea boxes", "把茶、儀式和故事放進可收藏、可送禮的形式。"]
];

export default function TeaCulturePage() {
  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Culture"
        title="茶，如何穿過中國歷史"
        english="Tea Through Chinese History"
        copy="從神農傳說、唐代《茶經》、宋代點茶，到現代 Chazen，茶一直不只是飲品，而是一種文化與生活方式。"
        placeholder={{
          asset: "culture-song-diancha.webp",
          label: "Digital tea museum atmosphere",
          note: "Hero placeholder for Song dynasty tea culture"
        }}
      />

      <ChazenContentSection
        eyebrow="Timeline"
        title="茶從傳說走到日常"
        english="From Origin Story to Everyday Practice"
        tone="paper"
      >
        <div className="chazen-card-grid">
          {timeline.map(([title, copy, asset], index) => (
            <article key={title} className="chazen-subpage-card">
              <span>{String(index + 1).padStart(2, "0")} / Future visual: {asset}</span>
              <h3 lang="zh-Hant">{title}</h3>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Tea and philosophy"
        title="茶是一種看見生活的方式"
        english="Tea as a Way of Seeing Daily Life"
      >
        <div className="chazen-card-grid">
          {philosophy.map(([title, copy]) => (
            <article key={title} className="chazen-subpage-card">
              <h3 lang="zh-Hant">{title}</h3>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Five Jian Zhan"
        title="五盞建盞，五種回到自身的方法"
        english="Five Cups, Five Ways Back to the Self"
        copy="Chazen 以五盞建盞對應信、精進、念、定、慧。這裡不是教義，而是一種文化性的比喻：用一杯茶，讓人重新靠近自己。"
        tone="paper"
      >
        <div className="chazen-two-column">
          <div className="chazen-subpage-note">
            <h3>信、精進、念、定、慧</h3>
            <p lang="zh-Hant">
              信，是願意先停下來；精進，是在日常裡持續修習；念，是知道自己正在喝茶；
              定，是心慢慢有停靠之處；慧，是看得更清楚。
            </p>
            <Link href="/five-cups" className="chazen-subpage-button chazen-subpage-button-primary">
              View Five Cups
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
        title="把茶文化帶回現代生活"
        english="Bringing Tea Culture Into Modern Life"
      >
        <div className="chazen-card-grid">
          {modernChazen.map(([title, copy]) => (
            <article key={title} className="chazen-subpage-card">
              <span>{title}</span>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="從儀式開始認識茶"
        copy="Learn the tea table before choosing the next cup."
        primary={{ href: "/tea-ritual", label: "Explore Tea Ritual" }}
        secondary={{ href: "/tea-test", label: "Start Tea Test" }}
        next={{ href: "/five-cups", label: "Five Cups" }}
      />
    </main>
  );
}
