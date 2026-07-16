"use client";

import { useEffect } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";
import styles from "../legal.module.css";

const sections = [{"enTitle":"Before you order","zhTitle":"下單之前","enBody":["Availability, preparation time, delivery method, destination, and shipping cost are confirmed before payment or in your written quotation. Custom, co-branded, and larger orders may require additional lead time."],"zhBody":["供應、準備時間、配送方式、目的地與運費會在付款前或書面報價中確認。訂製、聯名與較大數量的訂單可能需要額外製作時間。"]},{"enTitle":"Delivery","zhTitle":"配送","enBody":["Please provide a complete and accurate delivery address and a safe contact method. Dispatch and delivery estimates are not guarantees; delays caused by carriers, weather, customs, or incorrect details may be outside our control."],"zhBody":["請提供完整準確的配送地址與安全的聯絡方式。寄出與送達時間為估算，並非保證；承運商、天氣、海關或資料錯誤造成的延誤可能不在我們控制範圍內。"]},{"enTitle":"Problems with an order","zhTitle":"訂單問題","enBody":["If an item arrives damaged, incorrect, or incomplete, contact us as soon as reasonably possible with your order details and clear photographs of the item and packaging. Keep the packaging while we review the issue."],"zhBody":["如商品到貨時損壞、錯誤或不完整，請在合理時間內聯絡我們，提供訂單資料及商品與包裝的清晰照片。處理期間請保留包裝。"]},{"enTitle":"Returns and changes of mind","zhTitle":"退貨與改變主意","enBody":["Return eligibility and instructions depend on the product and applicable consumer law. For hygiene, safety, and personalisation reasons, opened tea, used teaware, and custom or co-branded items may not be eligible for change-of-mind returns. Contact us before sending anything back."],"zhBody":["退貨資格與程序視產品及適用消費者法律而定。基於衛生、安全與個人化原因，已開封茶葉、使用過的茶具，以及訂製或聯名商品可能不接受因改變主意而退貨。寄回任何商品前請先聯絡我們。"]},{"enTitle":"Consumer rights","zhTitle":"消費者權利","enBody":["Nothing on this page excludes rights or remedies that cannot lawfully be excluded. Confirmed order or quotation terms will provide any additional details relevant to your purchase."],"zhBody":["本頁內容不排除法律上不可排除的權利或補救。已確認的訂單或報價條款會提供與你購買相關的其他細節。"]}];

export default function Page() {
  const { t, language } = useLanguage();
  useEffect(() => { document.title = language === "zh" ? "配送與退換 | Chazen" : "Shipping & Returns | Chazen"; }, [language]);
  return (
    <main>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Order support" eyebrowZh="訂單支援" title="Shipping & Returns" titleZh="配送與退換" copy="A transparent guide to the information confirmed with each Chazen order or quotation." copyZh="每份 Chazen 訂單或報價中會確認的配送與退換資料。" />
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
