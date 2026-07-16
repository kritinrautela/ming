"use client";

import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";
import styles from "./b2b.module.css";

const useCases = [
  { en: "Corporate gifts", zh: "企業禮品" },
  { en: "Client appreciation", zh: "客戶答謝" },
  { en: "Real estate settlement gifts", zh: "地產交收禮物" },
  { en: "Festival gifts", zh: "節日禮盒" },
  { en: "Business partners", zh: "商業夥伴禮物" },
  { en: "Cultural events", zh: "文化活動禮品" }
];

const whyTeaWorks = [
  {
    title: { en: "Culturally rich", zh: "有文化感" },
    copy: {
      zh: "茶禮比普通禮物更有故事，也更能代表心意。",
      en: "A tea gift carries more story than an ordinary gift, and expresses thoughtfulness more clearly."
    }
  },
  {
    title: { en: "Never gaudy", zh: "不俗氣" },
    copy: {
      zh: "不靠浮誇包裝，而是靠器物、香氣與儀式感。",
      en: "It doesn't rely on showy packaging, but on fine objects, aroma, and a sense of ritual."
    }
  },
  {
    title: { en: "Suits every age", zh: "適合不同年齡" },
    copy: {
      zh: "茶作為禮物，對不同背景和年齡都自然友善。",
      en: "As a gift, tea feels natural and welcoming across backgrounds and ages."
    }
  },
  {
    title: { en: "Long-lasting", zh: "可長期保存" },
    copy: {
      zh: "茶與茶具可以被慢慢使用，不是一刻即逝的禮物。",
      en: "Tea and teaware are used slowly over time, not a gift that's gone in a moment."
    }
  },
  {
    title: { en: "More thoughtful", zh: "更有心意" },
    copy: {
      zh: "一份能被打開、沖泡、記住的關係禮物。",
      en: "A relationship gift that can be opened, brewed, and remembered."
    }
  }
];

const giftOptions = [
  {
    title: { en: "Starter corporate box", zh: "企業入門禮盒" },
    copy: { zh: "適合小批量客戶答謝或首次合作禮。", en: "Suited to small-batch client appreciation or a first partnership gift." }
  },
  {
    title: { en: "Premium cultural box", zh: "頂級文化禮盒" },
    copy: { zh: "適合重要客戶、節日或高價值關係。", en: "Suited to important clients, festivals, or high-value relationships." }
  },
  {
    title: { en: "Custom settlement gift", zh: "客製交收禮物" },
    copy: {
      zh: "為地產交收時刻加入祝賀卡與品牌訊息。",
      en: "Adds a congratulations card and branded message to the real estate settlement moment."
    }
  },
  {
    title: { en: "Event / festival box", zh: "活動／節日禮盒" },
    copy: { zh: "適合文化活動、團隊禮品與節日派送。", en: "Suited to cultural events, team gifting, and festival distribution." }
  }
];

const brandingItems = [
  { en: "Company card", zh: "公司卡片" },
  { en: "Custom message", zh: "客製化訊息" },
  { en: "Logo sleeve", zh: "品牌標誌外套" },
  { en: "Settlement note", zh: "交收賀卡" },
  { en: "Bilingual gift message", zh: "雙語贈禮訊息" }
];

const enquiryFields = [
  { en: "Name", zh: "姓名" },
  { en: "Company", zh: "公司" },
  { en: "Email", zh: "電郵" },
  { en: "Gift purpose", zh: "贈禮目的" },
  { en: "Quantity", zh: "數量" }
];

export default function B2BPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "企業茶禮 | Chazen" : "B2B Tea Gifts | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage">
      <ChazenSubpageHero
        eyebrow="B2B Gifts"
        eyebrowZh="企業茶禮"
        title="為重要關係準備的文化禮盒"
        english="Cultural Gifts for Meaningful Relationships"
        copy="Chazen 企業茶禮盒適合公司、客戶答謝、地產交收禮物、節日送禮與文化活動。"
        copyEn="Chazen's corporate tea gift boxes suit companies, client appreciation, real estate settlement gifts, festival gifting, and cultural events."
        media={{
          asset: "chazen-gift-box-v1.png",
          alt: "A refined Chazen cultural gift box designed for settlement, client, and corporate gifting.",
          type: "image"
        }}
      />

      <ChazenContentSection
        eyebrow="Who it is for"
        eyebrowZh="適合對象"
        title="適合需要被記住的關係"
        english="For Relationships Worth Marking"
        tone="paper"
      >
        <div className="chazen-card-grid">
          {useCases.map((useCase) => (
            <article key={useCase.en} className="chazen-subpage-card">
              <span>{t(useCase.en, useCase.zh)}</span>
              <p>
                {t(
                  "Quiet, cultural, and useful enough to remain after the handover moment.",
                  "低調、有文化感，且足夠實用，能在交收時刻過後留存下來。"
                )}
              </p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Why tea"
        eyebrowZh="為何選茶"
        title="茶禮有文化，也有溫度"
        english="Why a Tea Gift Works"
      >
        <div className="chazen-card-grid">
          {whyTeaWorks.map((item) => (
            <article key={item.title.en} className="chazen-subpage-card">
              {language === "zh" ? <h3 lang="zh-Hant">{item.title.zh}</h3> : <h3>{item.title.en}</h3>}
              <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Gift box options"
        eyebrowZh="禮盒選項"
        title="不同關係，可以有不同茶禮"
        english="Gift Box Options"
        tone="paper"
      >
        <div className={styles.asymmetricGrid}>
          <div className={styles.processGrid}>
            {giftOptions.map((item, index) => (
              <article key={item.title.en} className={styles.processCard}>
                <div className={styles.processNumber}>{index + 1}</div>
                <div className={styles.processContent}>
                  <h3 lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.title.en, item.title.zh)}</h3>
                  <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
                </div>
              </article>
            ))}
          </div>
          <article className={styles.charzenFormNote}>
            <h3>{t("Designed for the handover moment", "為交收時刻而設")}</h3>
            <p>{t("From A$78 per box, with a minimum order of 10. Final pricing depends on tea, card, sleeve, and co-branding requirements.", "每盒 A$78 起，最低訂量 10 盒。最終價格按茶葉、賀卡、封套及聯名要求而定。")}</p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Custom branding"
        eyebrowZh="客製品牌化"
        title="品牌可以出現，但不需要喧賓奪主"
        english="Quiet Custom Branding"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>{t("Branding options", "品牌客製選項")}</h3>
            <ul>
              {brandingItems.map((item) => (
                <li key={item.en}>{t(item.en, item.zh)}</li>
              ))}
            </ul>
          </article>
          <article className="chazen-subpage-note">
            <h3>{t("Chazen × Your Brand", "Chazen × 你的品牌")}</h3>
            <p>{t("Brand presence is applied through a restrained sleeve, message card, or settlement note—without overwhelming the gift experience.", "品牌可低調呈現在封套、訊息卡或交收賀卡上，不掩蓋禮物本身的體驗。")}</p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Real estate settlement"
        eyebrowZh="地產交收"
        title="交收禮物，不只是答謝"
        english="Settlement Gifts That Remember the Relationship"
        tone="paper"
      >
        <div className="chazen-two-column">
          <article className="chazen-subpage-note">
            <h3>
              {t(
                "A settlement gift should not only say thank you.",
                "地產交收禮物，不應只是一句多謝。"
              )}
            </h3>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "It should help the client remember the relationship.",
                "它應該讓客戶記得這段關係。"
              )}
            </p>
          </article>
          <article className="chazen-subpage-note">
            <h3>{t("The First Evening", "第一個夜晚")}</h3>
            <p>{t("A quiet ritual for the client's first evening at home—created to make the relationship memorable beyond settlement day.", "為客戶入住所準備的一場安靜儀式，讓這段關係在交收日之後仍被記住。")}</p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="Enquiry form"
        eyebrowZh="查詢表格"
        title="告訴我們你的贈禮時刻"
        english="Tell Us About the Gift Moment"
      >
        <div className="chazen-two-column">
          <form
            id="b2b-enquiry"
            className="chazen-form-placeholder"
            action="mailto:chazen24tz@gmail.com?subject=Chazen%20B2B%20Gift%20Enquiry"
            method="post"
            encType="text/plain"
          >
            <h3>{t("Enquire for B2B Gift Box", "查詢企業禮盒")}</h3>
            {enquiryFields.map((field) => (
              <label key={field.en}>
                {t(field.en, field.zh)}
                <input
                  type={field.en === "Email" ? "email" : field.en === "Quantity" ? "number" : "text"}
                  name={field.en.toLowerCase().replaceAll(" ", "-")}
                  placeholder={t(field.en, field.zh)}
                  required={field.en === "Name" || field.en === "Email" || field.en === "Quantity"}
                />
              </label>
            ))}
            <label>
              {t("Message", "訊息")}
              <textarea
                name="message"
                rows={4}
                placeholder={t("Tell us about the gift moment.", "告訴我們這份禮物的場合。")}
                required
              />
            </label>
            <button type="submit" className="button-primary">
              {t("Prepare Email Enquiry", "準備電郵查詢")}
            </button>
          </form>
          <article className="chazen-subpage-note">
            <h3>{t("What happens next", "提交後流程")}</h3>
            <p>{t("Your email app will open with the enquiry details. We will confirm quantity, branding, lead time, and final pricing before production.", "系統會開啟你的電郵程式並帶入查詢資料。我們會在製作前確認數量、聯名方式、交期及最終價格。")}</p>
            <p><a href="mailto:chazen24tz@gmail.com">chazen24tz@gmail.com</a></p>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="查詢企業茶禮盒"
        titleEn="Enquire About a Corporate Tea Gift Box"
        copy="A calm, cultural gift for clients, teams, settlement moments, and festivals."
        copyZh="一份平靜而有文化感的禮物，適合客戶、團隊、交收時刻與節日。"
        primary={{ href: "/b2b#b2b-enquiry", label: "Enquire for B2B Gift Box", labelZh: "查詢企業禮盒" }}
        secondary={{ href: "/tea-boxes", label: "Explore Tea Boxes", labelZh: "探索茶盒" }}
      />
    </main>
  );
}
