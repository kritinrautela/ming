"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Check, Package, Send } from "lucide-react";
import { ProductVisual } from "@/components/ProductVisual";
import { SectionHeading } from "@/components/SectionHeading";
import { buildInquiryPath } from "@/lib/inquiry";
import { giftBoxItems, site } from "@/lib/site";
import { useLanguage } from "@/lib/language";
import styles from "./gift-box.module.css";

const openListenPour = [
  {
    step: "1",
    title: { en: "Open", zh: "開啟" },
    copy: {
      en: "The box opens with a quiet brand message and a clear ritual invitation.",
      zh: "禮盒開啟時，附有一則安靜的品牌訊息與清晰的儀式邀請。"
    }
  },
  {
    step: "2",
    title: { en: "Listen", zh: "聆聽" },
    copy: {
      en: "Scan the QR card for a short Zen bowl sound ritual.",
      zh: "掃描 QR 卡片，開始一段簡短的禪缽聲音儀式。"
    }
  },
  {
    step: "3",
    title: { en: "Pour", zh: "沖泡" },
    copy: {
      en: "Prepare the first cup slowly and let the gift become an experience.",
      zh: "慢慢準備第一杯茶，讓禮物成為一場體驗。"
    }
  }
];

const perceivedValue = [
  {
    title: { en: "Material", zh: "實體價值" },
    copy: {
      en: "A refined object with tea, teaware, and printed ritual pieces.",
      zh: "一件精緻的物品，包含茶葉、茶具與印製的儀式卡片。"
    }
  },
  {
    title: { en: "Emotional", zh: "情感價值" },
    copy: {
      en: "A slower first cup that marks arrival, gratitude, or a new beginning.",
      zh: "一杯慢下來的初茶，標記著抵達、感謝，或是一個新的開始。"
    }
  },
  {
    title: { en: "Memorable", zh: "難忘價值" },
    copy: {
      en: "A gift with a sequence, sound cue, and story clients can retell.",
      zh: "一份有步驟、有聲音提示、有故事的禮物，讓客戶樂於分享。"
    }
  }
];

export default function GiftBoxPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "茶儀式禮盒 | Chazen" : "Tea Ritual Gift Box | Chazen";
  }, [language]);

  return (
    <main>
      <section className="section">
        <div className={`container ${styles["gift-hero"]}`}>
          <div className={styles["gift-hero-copy"]}>
            <p className="eyebrow">{t("Hero product", "主打產品")}</p>
            <h1>{t("Chazen Tea Ritual Gift Box", "Chazen 茶儀式禮盒")}</h1>
            <p className={styles["gift-hero-price"]}>{site.price}</p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "A complete modern Chinese tea ritual gift: premium loose-leaf tea, compact teaware, guided ritual cards, and a quiet sound moment inside a refined outer gift box.",
                "一份完整的現代中國茶儀式禮物：頂級散裝茶葉、輕巧茶具、引導式儀式卡片，以及精緻外盒中的一段安靜聲音時刻。"
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={buildInquiryPath({
                  type: "Personal gift",
                  message: "I would like to inquire about or pre-order the Chazen Tea Ritual Gift Box.",
                  source: "Gift box hero"
                })}
                className="button-primary"
              >
                {t("Inquire or pre-order", "查詢或預購")} <ArrowRight size={17} />
              </Link>
              <Link href="/b2b" className="button-secondary">
                {t("Request a B2B sample", "索取企業樣品")}
              </Link>
            </div>
          </div>
          <ProductVisual />
        </div>
      </section>

      <section className="section bg-porcelain">
        <div className="container">
          <SectionHeading
            eyebrow="Box contents"
            eyebrowZh="禮盒內容"
            title="Every element supports the first cup."
            titleZh="每個細節都為第一杯茶而準備。"
            copy="The gift box is designed to feel valuable before it is opened, then intimate once the ritual begins."
            copyZh="這份禮盒在打開之前就令人感受到價值，儀式開始後則變得親密而細膩。"
          />
          <div className={`mt-12 ${styles["gift-contents-grid"]}`}>
            {giftBoxItems.map((item, index) => (
              <div key={item.en} className={styles["gift-content-item"]}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <p>{t(item.en, item.zh)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles["gift-ritual-steps"]}`}>
          {openListenPour.map((item) => (
            <div key={item.step} className={styles["gift-ritual-step"]}>
              <p className={styles["gift-ritual-step-number"]}>{item.step}</p>
              <h3>{t(item.title.en, item.title.zh)}</h3>
              <p>{t(item.copy.en, item.copy.zh)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-porcelain">
        <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Perceived value"
            eyebrowZh="感知價值"
            title="More than tea in a box."
            titleZh="不只是一盒茶。"
            copy="Chazen combines a physical gift, a cultural story, and a guided first-use moment. The value is in the ritual the recipient can repeat long after the occasion."
            copyZh="Chazen 結合了實體禮物、文化故事與引導式的初次體驗。它的價值在於收禮者能在活動過後長久重複的那場儀式。"
          />
          <div className={styles["gift-value-grid"]}>
            {perceivedValue.map((item) => (
              <article key={item.title.en} className={styles["gift-value-card"]}>
                <h4>{t(item.title.en, item.title.zh)}</h4>
                <p>{t(item.copy.en, item.copy.zh)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-stone">
        <div className={`container ${styles["gift-b2b"]}`}>
          <div className={styles["gift-b2b-copy"]}>
            <p className="eyebrow">{t("For private and agency gifting", "適合私人與地產公司送禮")}</p>
            <h2>
              {t(
                "A compact luxury gift with a lasting ritual after the handover.",
                "一份精緻的奢華禮物，交收後仍留有一場持久的儀式。"
              )}
            </h2>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "For real estate settlement gifting, add an agency congratulations card so the client receives a personal message alongside the Chazen ritual.",
                "地產交收送禮時，可加上地產公司的賀卡，讓客戶在收到 Chazen 儀式的同時，也收到一則個人化訊息。"
              )}
            </p>
          </div>
          <div className={styles["gift-b2b-actions"]}>
            <Link href="/b2b" className="button-primary">
              {t("Explore settlement gifting", "探索交收送禮方案")} <Package size={17} />
            </Link>
            <Link
              href={buildInquiryPath({
                type: "Real estate settlement",
                message: "I would like to request a B2B sample for settlement gifting.",
                source: "Gift box B2B section"
              })}
              className="button-secondary"
            >
              {t("Request a B2B sample", "索取企業樣品")} <Send size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
