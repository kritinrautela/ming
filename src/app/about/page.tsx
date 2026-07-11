"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/language";

export default function AboutPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "關於我們 | Chazen" : "About | Chazen";
  }, [language]);

  return (
    <main>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="About Chazen"
            eyebrowZh="關於 Chazen"
            title="A premium tea ritual brand for calm living and meaningful gifting."
            titleZh="一個為平靜生活與有意義贈禮而生的高端茶儀式品牌。"
            copy="Chazen draws from Chinese tea culture and presents it through modern design, gifting, sound ritual, and future AI-guided personalization."
            copyZh="Chazen 汲取中國茶文化，以現代設計、贈禮、聲音儀式，以及未來的 AI 個人化引導呈現。"
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                en: ["Mission", "Help people reconnect through tea, ritual, sound, and mindful gifting."],
                zh: ["使命", "透過茶、儀式、聲音與用心贈禮，幫助人們重新連結。"]
              },
              {
                en: ["Vision", "Bring Chinese tea culture into contemporary calm living."],
                zh: ["願景", "將中國茶文化帶入當代的平靜生活。"]
              },
              {
                en: ["Principle", "Ritual before commodity. Calm luxury before loud selling."],
                zh: ["原則", "儀式先於商品，靜奢先於喧囂的銷售。"]
              }
            ].map((item) => (
              <div key={item.en[0]} className="border-t border-ink/12 pt-7">
                <p className="display-title text-3xl text-leaf">{t(item.en[0], item.zh[0])}</p>
                <p className="mt-5 text-sm leading-7 text-ink/62">{t(item.en[1], item.zh[1])}</p>
              </div>
            ))}
          </div>
          <Link href="/gift-box" className="button-primary mt-12">
            {t("Explore the first gift box", "探索第一款禮盒")} <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
