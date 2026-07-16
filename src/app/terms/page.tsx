"use client";

import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";
import styles from "../legal.module.css";

const sections = [{"enTitle":"Website information","zhTitle":"網站資料","enBody":["Content is provided for general information, cultural learning, and product discovery. We aim for accuracy, but previews, descriptions, prices, availability, and timing may change before an order is confirmed."],"zhBody":["內容供一般資訊、文化學習與產品探索之用。我們力求準確，但預覽、描述、價格、供應與時間可能在訂單確認前更改。"]},{"enTitle":"Orders and quotations","zhTitle":"訂單與報價","enBody":["An inquiry, email, or website form does not by itself create an accepted order. Product scope, price, delivery, lead time, and payment terms must be confirmed in writing. Custom and B2B work may have separate agreed terms."],"zhBody":["查詢、電郵或網站表單本身並不構成已接受的訂單。產品內容、價格、配送、製作時間與付款條款須以書面確認。訂製與企業項目可能另有協議條款。"]},{"enTitle":"Wellbeing content","zhTitle":"身心內容","enBody":["Tea tests, rituals, meditation, and wellbeing content are for general guidance and personal reflection. They are not medical advice, diagnosis, or treatment. Consider your own health needs, allergies, sensitivities, and caffeine tolerance."],"zhBody":["茶測試、儀式、冥想與身心內容只供一般引導與個人反思，不構成醫療建議、診斷或治療。請考慮自身健康需要、過敏、敏感情況與咖啡因耐受度。"]},{"enTitle":"Intellectual property and acceptable use","zhTitle":"知識產權與適當使用","enBody":["Unless stated otherwise, Chazen branding, writing, design, and original website content may not be copied or commercially reused without permission. Do not misuse the website, interfere with its operation, or submit unlawful or harmful material."],"zhBody":["除非另有說明，Chazen 品牌、文字、設計與原創網站內容不得在未經許可下複製或作商業再用。請勿濫用網站、干擾其運作，或提交違法或有害內容。"]},{"enTitle":"Updates","zhTitle":"更新","enBody":["We may update the website and these terms as the business develops. Mandatory consumer rights that apply to you are not excluded by these terms."],"zhBody":["我們可能隨業務發展更新網站與條款。本條款不排除任何適用於你的強制性消費者權利。"]}];

export default function Page() {
  const { t, language } = useLanguage();
  useEffect(() => { document.title = language === "zh" ? "網站使用條款 | Chazen" : "Website Terms | Chazen"; }, [language]);
  return (
    <main>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Using Chazen online" eyebrowZh="使用 Chazen 網站" title="Website Terms" titleZh="網站使用條款" copy="These terms explain the current role of the website while Chazen collections and services continue to develop." copyZh="以下條款說明在 Chazen 系列與服務持續發展期間，本網站目前的功能。" />
          <div className={`${styles.contentWrapper} mt-12`}>
            {sections.map((section) => (
              <article key={section.enTitle} className={styles.section}>
                <h2 className={styles.sectionTitle} lang={language === "zh" ? "zh-Hant" : undefined}>{t(section.enTitle, section.zhTitle)}</h2>
                {section.enBody.map((body, index) => <p key={body} className={styles.sectionBody} lang={language === "zh" ? "zh-Hant" : undefined}>{t(body, section.zhBody[index])}</p>)}
              </article>
            ))}
            <div className={styles.contactFooter}>
              <p>{t("Questions? Contact ", "如有問題，請聯絡 ")}<a className={styles.contactLink} href={`mailto:${site.email}`}>{site.email}</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
