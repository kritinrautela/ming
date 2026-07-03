import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";

export const metadata = {
  title: "Tea Ritual"
};

const ritualSteps = [
  ["溫器", "讓茶具先承接溫度"],
  ["置茶", "茶葉落入蓋碗，香氣開始打開"],
  ["醒茶", "第一道水，喚醒茶葉"],
  ["聞香", "先聞香，再入口"],
  ["出湯", "茶湯流入公道杯，再分入杯中"],
  ["慢飲", "一口茶，一次呼吸"]
];

const commonMistakes = [
  "水太熱",
  "茶葉太多",
  "浸泡太久",
  "急著喝",
  "忽略香氣"
];

export default function TeaRitualPage() {
  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Ritual"
        title="茶入口之前，先有一場儀式"
        english="The Ritual Before the Tea"
        copy="從溫器、置茶、醒茶，到聞香、出湯、慢飲，茶不是急著完成，而是讓自己慢下來。"
        placeholder={{
          asset: "ritual-gaiwan-closeup.webp",
          label: "Future visual: Gaiwan ritual closeup",
          note: "Hero placeholder for future ritual photography"
        }}
      />

      <ChazenContentSection
        eyebrow="Gaiwan"
        title="蓋碗是中國茶桌上的小宇宙"
        english="What Is a Gaiwan?"
        tone="paper"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>蓋碗 / Gaiwan</h3>
            <p lang="zh-Hant">
              蓋碗由蓋、碗、托組成，適合觀察茶葉舒展、控制出湯，也讓初學者更直接地感受香氣與水溫。
            </p>
            <p lang="zh-Hant">
              初學者可以先用較少茶葉、較短時間開始，讓每一泡都變成可觀察、可調整的練習。
            </p>
          </article>
          <ChazenMediaPlaceholder
            asset="ritual-gaiwan-closeup.webp"
            label="Future visual: Gaiwan vessel study"
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Cha Hai"
        title="公道杯，讓每一杯茶更平均"
        english="Why Use a Fairness Pitcher?"
      >
        <div className="chazen-two-column">
          <ChazenMediaPlaceholder
            asset="ritual-cha-hai-pour.webp"
            label="Future visual: Cha Hai fairness pitcher pour"
          />
          <article className="chazen-subpage-note">
            <h3>公道杯 / 茶海</h3>
            <p lang="zh-Hant">
              公道杯用來平均茶湯濃度，避免第一杯太淡、最後一杯太濃。茶先流入公道杯，再分入每隻杯中，
              令分享更一致，也讓動作更安定。
            </p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Six steps"
        title="六個步驟，讓茶慢慢發生"
        english="A Six-Step Tea Ritual"
        tone="paper"
      >
        <div className="chazen-card-grid">
          {ritualSteps.map(([title, copy], index) => (
            <article key={title} className="chazen-subpage-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3 lang="zh-Hant">{title}</h3>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Beginner practice"
        title="初學者可以先簡單地喝"
        english="A Casual Beginner Method"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>Common mistakes</h3>
            <ul>
              {commonMistakes.map((mistake) => (
                <li key={mistake} lang="zh-Hant">{mistake}</li>
              ))}
            </ul>
          </article>
          <article className="chazen-subpage-note">
            <h3>Simple method</h3>
            <p lang="zh-Hant">
              先溫杯，少量茶葉，熱水快速出湯。先聞香，再慢慢喝。把第一杯當成觀察，
              第二杯再調整濃淡，不需要一次做到完美。
            </p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Media placeholders"
        title="未來可以加入儀式影像"
        english="Reserved Ritual Media"
        tone="paper"
      >
        <div className="chazen-placeholder-grid">
          <ChazenMediaPlaceholder
            asset="ritual-five-jian-zhan-cups.webp"
            label="Future visual: Gaiwan -> Cha Hai -> Five Jian Zhan Cups"
          />
          <ChazenMediaPlaceholder
            asset="ritual-six-steps-animation.mp4"
            label="Future visual: Six-step ritual animation"
            type="video"
          />
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="開始你的茶儀式"
        copy="Begin with one cup, one vessel, and enough quiet to notice the aroma."
        primary={{ href: "/tea-ritual", label: "Start Your Tea Ritual" }}
        secondary={{ href: "/tea-test", label: "Start Tea Test" }}
        next={{ href: "/tea-boxes", label: "Starter Tea Box" }}
      />
    </main>
  );
}
