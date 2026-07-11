"use client";

import { useEffect } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";

export default function ContactPage() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "聯絡我們 | Chazen" : "Contact | Chazen";
  }, [language]);

  return (
    <main>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeading
            eyebrow="Contact / inquiry"
            eyebrowZh="聯絡 / 查詢"
            title="Pre-order, request a B2B sample, or discuss partnership."
            titleZh="預購、索取企業樣品，或洽談合作。"
            copy="Submit your inquiry and our team will contact you to discuss pre-orders, B2B gifting, or partnership opportunities."
            copyZh="提交查詢後，我們的團隊將與你聯絡，討論預購、企業贈禮或合作機會。"
          />
          <InquiryForm sourceLabel="Contact page" />
        </div>
      </section>
    </main>
  );
}
