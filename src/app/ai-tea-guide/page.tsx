"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Gift, MessageCircle, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { aiPromptCards } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export default function AITeaGuidePage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "AI 茶導師 | Chazen" : "AI Tea Guide | Chazen";
  }, [language]);

  return (
    <main>
      <section className="section bg-leaf text-porcelain">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-stone">{t("AI Tea Guide", "AI 茶導師")}</p>
            <h1 className="display-title mt-4 text-5xl leading-[1] md:text-7xl">
              {t("Cha, your AI Tea Guide.", "茶，你的 AI 茶導師。")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-porcelain/72">
              {t(
                "A calm concierge-style guide for tea recommendations, Chinese tea culture, gift selection, and short ritual moments.",
                "一位平靜的專屬嚮導，提供茶葉推薦、中國茶文化、禮盒選擇，以及短暫的儀式時刻。"
              )}
            </p>
          </div>
          <div className="border border-porcelain/15 bg-porcelain/8 p-8">
            <Sparkles className="text-stone" size={26} />
            <p className="display-title mt-6 text-3xl">{t("Guidance with a quieter tone.", "更安靜的引導方式。")}</p>
            <p className="mt-5 text-base leading-8 text-porcelain/72">
              {t(
                "Cha helps customers understand tea, choose a thoughtful gift, and begin a few minutes of breathing, sound, and reflection without turning the ritual into another screen-heavy task.",
                "茶幫助顧客了解茶葉、選擇貼心的禮物，並開始幾分鐘的呼吸、聲音與反思，而不會讓儀式變成另一項耗費螢幕時間的任務。"
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What Cha can help with"
            eyebrowZh="茶可以如何幫助你"
            title="Tea knowledge, gift confidence, and ritual support."
            titleZh="茶葉知識、送禮信心與儀式支援。"
            copy="Cha will recommend tea by mood or moment, explain Chinese tea culture in plain language, support gift selection, and prepare the future Tea Ritual Assessment."
            copyZh="茶會根據心情或時刻推薦茶款、以淺白的語言解說中國茶文化、協助禮物選擇，並為未來的茶儀式測評做準備。"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {aiPromptCards.map((prompt) => (
              <div key={prompt.en} className="premium-card bg-porcelain p-6">
                <MessageCircle className="text-moss" size={20} />
                <p className="mt-5 text-base font-semibold text-ink">{t(prompt.en, prompt.zh)}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/tea-ritual" className="button-primary">
              {t("View ritual pathways", "查看儀式路徑")} <ArrowRight size={17} />
            </Link>
            <Link href="/gift-box" className="button-secondary">
              {t("Choose a gift box", "選擇禮盒")} <Gift size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
