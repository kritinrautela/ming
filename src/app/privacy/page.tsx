"use client";

import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";
import styles from "../legal.module.css";

const sections = [{"enTitle":"Information you choose to share","zhTitle":"你主動提供的資料","enBody":["When you send an inquiry, you may provide your name, email, company, quantity, timing, and message. The current website prepares this information in your own email application; it does not operate a customer account or payment database."],"zhBody":["當你提交查詢時，可能會提供姓名、電郵、公司、數量、時間與訊息。目前網站會在你自己的電郵應用程式中準備這些資料；網站本身並不設客戶帳戶或付款資料庫。"]},{"enTitle":"How we use it","zhTitle":"我們如何使用資料","enBody":["We use inquiry information to reply, prepare recommendations or quotes, discuss orders and partnerships, and provide requested support. We do not sell personal information."],"zhBody":["我們使用查詢資料作回覆、準備建議或報價、討論訂單與合作，以及提供所需支援。我們不會出售個人資料。"]},{"enTitle":"Service providers and links","zhTitle":"服務供應商與外部連結","enBody":["Hosting, email, analytics, or other service providers may process limited technical information under their own terms. External websites are responsible for their own privacy practices."],"zhBody":["網站寄存、電郵、分析或其他服務供應商可能按其條款處理有限的技術資料。外部網站各自負責其私隱安排。"]},{"enTitle":"Your choices","zhTitle":"你的選擇","enBody":["You may ask what inquiry information we hold, request a correction, or ask us to delete it where applicable. Contact us using the address below. This policy may be updated as the website and services develop."],"zhBody":["你可以查詢我們持有的查詢資料、要求更正，或在適用情況下要求刪除。請使用下方電郵聯絡我們。本政策可能隨網站與服務發展而更新。"]}];

export default function Page() {
  const { t, language } = useLanguage();
  useEffect(() => { document.title = language === "zh" ? "私隱政策 | Chazen" : "Privacy Policy | Chazen"; }, [language]);
  return (
    <main>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Your information" eyebrowZh="你的資料" title="Privacy Policy" titleZh="私隱政策" copy="A plain-language summary of how Chazen handles information shared through this website." copyZh="Chazen 如何處理你透過本網站提供資料的簡明說明。" />
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
