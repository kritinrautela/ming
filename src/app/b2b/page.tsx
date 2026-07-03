import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";

export const metadata = {
  title: "B2B Tea Gifts"
};

const useCases = [
  "Corporate gifts",
  "Client appreciation",
  "Real estate settlement gifts",
  "Festival gifts",
  "Business partners",
  "Cultural events"
];

const whyTeaWorks = [
  ["有文化感", "茶禮比普通禮物更有故事，也更能代表心意。"],
  ["不俗氣", "不靠浮誇包裝，而是靠器物、香氣與儀式感。"],
  ["適合不同年齡", "茶作為禮物，對不同背景和年齡都自然友善。"],
  ["可長期保存", "茶與茶具可以被慢慢使用，不是一刻即逝的禮物。"],
  ["更有心意", "一份能被打開、沖泡、記住的關係禮物。"]
];

const giftOptions = [
  ["Starter corporate box", "適合小批量客戶答謝或首次合作禮。"],
  ["Premium cultural box", "適合重要客戶、節日或高價值關係。"],
  ["Custom settlement gift", "為地產交收時刻加入祝賀卡與品牌訊息。"],
  ["Event / festival box", "適合文化活動、團隊禮品與節日派送。"]
];

const brandingItems = [
  "Company card",
  "Custom message",
  "Logo sleeve",
  "Settlement note",
  "Bilingual gift message"
];

export default function B2BPage() {
  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="B2B Gifts"
        title="為重要關係準備的文化禮盒"
        english="Cultural Gifts for Meaningful Relationships"
        copy="Chazen 企業茶禮盒適合公司、客戶答謝、地產交收禮物、節日送禮與文化活動。"
        placeholder={{
          asset: "b2b-corporate-gift-scene.webp",
          label: "Future visual: B2B settlement gift scene",
          note: "Hero placeholder for future B2B gift photography"
        }}
      />

      <ChazenContentSection
        eyebrow="Who it is for"
        title="適合需要被記住的關係"
        english="For Relationships Worth Marking"
        tone="paper"
      >
        <div className="chazen-card-grid">
          {useCases.map((useCase) => (
            <article key={useCase} className="chazen-subpage-card">
              <span>{useCase}</span>
              <p>Quiet, cultural, and useful enough to remain after the handover moment.</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Why tea"
        title="茶禮有文化，也有溫度"
        english="Why a Tea Gift Works"
      >
        <div className="chazen-card-grid">
          {whyTeaWorks.map(([title, copy]) => (
            <article key={title} className="chazen-subpage-card">
              <h3 lang="zh-Hant">{title}</h3>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Gift box options"
        title="不同關係，可以有不同茶禮"
        english="Gift Box Options"
        tone="paper"
      >
        <div className="chazen-two-column">
          <div className="chazen-card-grid">
            {giftOptions.map(([title, copy]) => (
              <article key={title} className="chazen-subpage-card">
                <span>{title}</span>
                <p lang="zh-Hant">{copy}</p>
              </article>
            ))}
          </div>
          <ChazenMediaPlaceholder
            asset="b2b-settlement-gift.webp"
            label="Future visual: B2B settlement gift scene"
            note="Reserved real estate settlement gift scene"
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Custom branding"
        title="品牌可以出現，但不需要喧賓奪主"
        english="Quiet Custom Branding"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>Branding options</h3>
            <ul>
              {brandingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <ChazenMediaPlaceholder
            asset="b2b-custom-branding.webp"
            label="Future visual: Quiet custom branding sleeve"
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Real estate settlement"
        title="交收禮物，不只是答謝"
        english="Settlement Gifts That Remember the Relationship"
        tone="paper"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>A settlement gift should not only say thank you.</h3>
            <p>It should help the client remember the relationship.</p>
            <p lang="zh-Hant">地產交收禮物不只是答謝，而是讓客戶記得這段關係。</p>
          </article>
          <ChazenMediaPlaceholder
            asset="b2b-festival-gift-box.webp"
            label="Future visual: Festival and event gift box"
          />
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Enquiry form"
        title="先預留清楚的查詢結構"
        english="Enquiry Form Placeholder"
      >
        <div className="chazen-two-column">
          <form id="b2b-enquiry" className="chazen-form-placeholder">
            {/* Future integration: connect these fields to the Chazen B2B enquiry workflow. */}
            <h3>Enquire for B2B Gift Box</h3>
            {["Name", "Company", "Email", "Gift purpose", "Quantity"].map((field) => (
              <label key={field}>
                {field}
                <input type={field === "Email" ? "email" : "text"} placeholder={field} />
              </label>
            ))}
            <label>
              Message
              <textarea rows={4} placeholder="Tell us about the gift moment." />
            </label>
          </form>
          <ChazenMediaPlaceholder
            asset="b2b-enquiry-form.webp"
            label="Future visual: B2B enquiry form preview"
          />
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="查詢企業茶禮盒"
        copy="A calm, cultural gift for clients, teams, settlement moments, and festivals."
        primary={{ href: "/b2b#b2b-enquiry", label: "Enquire for B2B Gift Box" }}
        secondary={{ href: "/tea-boxes", label: "Explore Tea Boxes" }}
      />
    </main>
  );
}
