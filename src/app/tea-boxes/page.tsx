import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";

export const metadata = {
  title: "Tea Boxes"
};

const journeys = [
  ["First-time beginner", "想開始學中國茶，但希望簡單、清楚、有方向。"],
  ["Personal daily ritual", "希望茶成為日常裡能重複的安定節奏。"],
  ["Cultural gift / collector", "想送出一份有故事、有文化感、能被記住的禮物。"]
];

const boxCards = [
  {
    title: "First Pack",
    price: "A$25",
    asset: "first-pack-mockup.webp",
    visual: "Future visual: A$25 First Pack",
    items: ["Curated starter tea", "Tea-Mind result card", "Simple brewing guide", "Best after the AI Tea Test"]
  },
  {
    title: "Starter Tea Box",
    price: "A$68",
    asset: "starter-tea-box-mockup.webp",
    visual: "Future visual: Starter Tea Box mockup",
    items: ["Two entry tea directions", "Printed ritual guide", "Beginner brewing notes", "Optional travel tea set path"]
  },
  {
    title: "Lifetime Tea Box",
    price: "A$78",
    asset: "lifetime-tea-box-mockup.webp",
    visual: "Future visual: Lifetime cultural tea box",
    items: ["Premium tea", "Cultural story cards", "Gift-ready presentation", "For gifting, collecting, and milestones"]
  },
  {
    title: "B2B Cultural Gift Box",
    price: "Custom",
    asset: "b2b-gift-box-mockup.webp",
    visual: "Future visual: B2B settlement gift scene",
    items: ["Corporate gifts", "Client appreciation", "Real estate settlement gifts", "Custom branding"]
  }
];

const comparisonRows = [
  ["First Pack", "A$25", "Low-friction first purchase", "Tea Test users and first-time tea drinkers", "Starter tea, result card, brewing guide", "Start Tea Test"],
  ["Starter Tea Box", "A$68", "Beginner tea journey", "Home ritual beginners", "Two tea directions, ritual guide, brewing notes", "Explore Tea Boxes"],
  ["Lifetime Tea Box", "A$78", "Cultural collection", "Gifting, collecting, milestones", "Premium tea, story cards, cultural theme", "Explore Gift Story"],
  ["B2B Cultural Gift Box", "Custom", "Relationship gifting", "Teams, clients, settlement gifts", "Custom box, message, branding", "Enquire"]
];

export default function TeaBoxesPage() {
  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="Tea Boxes"
        title="開始，或延續你的茶旅程"
        english="Begin or Continue Your Tea Journey"
        copy="Chazen 茶盒不是單純產品，而是把茶、儀式、文化與心境帶入日常的方式。"
        placeholder={{
          asset: "starter-tea-box-mockup.webp",
          label: "Future visual: Starter Tea Box mockup",
          note: "Hero placeholder for future tea box photography"
        }}
      />

      <ChazenContentSection
        eyebrow="Choose your journey"
        title="先選擇你的茶旅程"
        english="Three Ways to Begin"
        tone="paper"
      >
        <div className="chazen-three-column">
          {journeys.map(([title, copy]) => (
            <article key={title} className="chazen-subpage-card">
              <span>{title}</span>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Boxes"
        title="茶盒是茶、故事與儀式的容器"
        english="Tea, Story, and Ritual in One Object"
      >
        <div className="chazen-three-column">
          {boxCards.map((box) => (
            <article key={box.title} className="chazen-subpage-card">
              <span>{box.visual} / {box.asset}</span>
              <strong className="chazen-price-tag">{box.price}</strong>
              <h3>{box.title}</h3>
              <ul>
                {box.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Visual placeholders"
        title="未來影像位置先保持安靜"
        english="Reserved Media Without Adding Weight"
        tone="paper"
      >
        <div className="chazen-placeholder-grid">
          {[
            ["starter-travel-tea-set.webp", "Future visual: Starter travel tea set"],
            ["b2b-gift-box-mockup.webp", "Future visual: B2B settlement gift scene"],
            ["tea-box-comparison.webp", "Future visual: Tea box comparison"]
          ].map(([asset, label]) => (
            <ChazenMediaPlaceholder key={asset} asset={asset} label={label} />
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Compare boxes"
        title="用最簡單的方式比較"
        english="A Simple Comparison"
      >
        <div className="chazen-subpage-table">
          <table>
            <thead>
              <tr>
                {["Box", "Price", "Purpose", "Best for", "Content", "CTA"].map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="找到適合你的茶盒"
        copy="Start with your state, then continue with the box that fits your rhythm."
        primary={{ href: "/tea-test", label: "Find My Tea Box" }}
        secondary={{ href: "/five-cups", label: "Explore Five Cups" }}
        next={{ href: "/b2b", label: "B2B Gifts" }}
      />
    </main>
  );
}
