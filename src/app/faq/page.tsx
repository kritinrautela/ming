"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";

const questions = [
  { enQ: "What is Chazen?", zhQ: "Chazen 是甚麼？", enA: "Chazen is a culture-first Chinese tea brand bringing together guided tea discovery, practical ritual, cultural learning, stillness, and meaningful gifting.", zhA: "Chazen 是一個以文化為本的中國茶品牌，結合引導式選茶、實用茶儀式、文化學習、靜心與有意義的贈禮。" },
  { enQ: "Do I need tea knowledge to begin?", zhQ: "開始前需要懂茶嗎？", enA: "No. Chazen is designed to make the first step clear and welcoming while keeping the depth and origin of Chinese tea culture visible.", zhA: "不需要。Chazen 希望讓第一步清晰而容易親近，同時保留中國茶文化的深度與源流。" },
  { enQ: "How does the tea test work?", zhQ: "茶測試如何運作？", enA: "The tea test uses your current mood, preferences, and ritual needs to guide a starting recommendation. It is a discovery tool, not medical or health advice.", zhA: "茶測試會根據你當下的狀態、喜好與儀式需要提供入門建議。它是探索工具，不構成醫療或健康建議。" },
  { enQ: "Can Chazen help with corporate or property settlement gifts?", zhQ: "Chazen 可以提供企業或物業交收禮物嗎？", enA: "Yes. We can discuss quantity, tea selection, message cards, sleeves, and considered co-branding. Current B2B orders begin at 10 boxes, with final pricing confirmed by quote.", zhA: "可以。我們可討論數量、茶款、心意卡、外套及合適的聯名方式。目前企業訂單由 10 盒起，最終價格以正式報價確認。" },
  { enQ: "Are prices and availability final?", zhQ: "價格與供應是否已確定？", enA: "Product details, availability, lead times, and delivery costs are confirmed before payment or in a written quote. Website previews may change as collections develop.", zhA: "產品內容、供應、製作時間與配送費會在付款前或書面報價中確認。網站上的系列預覽可能隨產品發展而調整。" },
  { enQ: "Where can I ask another question?", zhQ: "如有其他問題，可以在哪裡查詢？", enA: `Email ${site.email} or use the contact form. We will reply with the information currently available.`, zhA: `可電郵至 ${site.email} 或使用聯絡表單。我們會按目前可確認的資料回覆。` }
];

export default function FaqPage() {
  const { t, language } = useLanguage();
  useEffect(() => { document.title = language === "zh" ? "常見問題 | Chazen" : "FAQ | Chazen"; }, [language]);
  return <main><section className="section"><div className="container">
    <SectionHeading eyebrow="Helpful details" eyebrowZh="實用資料" title="Frequently asked questions." titleZh="常見問題。" copy="A clear starting point for tea discovery, gifting, orders, and support." copyZh="關於選茶、贈禮、訂單與支援的清晰起點。" />
    <div className="mt-12 grid max-w-4xl gap-4">
      {questions.map((item) => <details key={item.enQ} className="border border-ink/10 bg-porcelain p-5 shadow-soft">
        <summary className="cursor-pointer font-semibold text-ink">{t(item.enQ, item.zhQ)}</summary>
        <p className="mt-4 leading-8 text-ink/66">{t(item.enA, item.zhA)}</p>
      </details>)}
    </div>
    <Link href="/contact" className="button-primary mt-10">{t("Contact Chazen", "聯絡 Chazen")}</Link>
  </div></section></main>;
}
