"use client";

import { useEffect } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { useLanguage } from "@/lib/language";
import styles from "./contact.module.css";

export default function ContactPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "聯絡我們 | Chazen" : "Contact | Chazen";
  }, [language]);

  return (
    <main>
      <section className="section">
        <div className={styles.container}>
          <div className={styles.content}>
            <article className={styles.intro}>
              <p className="eyebrow">
                {t("Contact / inquiry", "聯絡 / 查詢")}
              </p>
              <h1>
                {t(
                  "Pre-order, request a B2B sample, or discuss partnership.",
                  "預購、索取企業樣品，或洽談合作。"
                )}
              </h1>
              <p>
                {t(
                  "Submit your inquiry and our team will contact you to discuss pre-orders, B2B gifting, or partnership opportunities.",
                  "提交查詢後，我們的團隊將與你聯絡，討論預購、企業贈禮或合作機會。"
                )}
              </p>
            </article>
            <div className={styles.formWrapper}>
              <span className={styles.formAccent} aria-hidden="true" />
              <InquiryForm sourceLabel="Contact page" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
