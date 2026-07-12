"use client";

import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { FiveCupsTabs } from "@/app/five-cups/FiveCupsTabs";
import { useLanguage } from "@/lib/language";

export default function FiveCupsPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title =
      language === "zh" ? "五盞建盞 · Chazen" : "Five Bowls of Practice | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage five-cups-page">
      <ChazenSubpageHero
        eyebrow="Five Cups"
        eyebrowZh="五盞"
        title="五盞建盞 · Five Bowls of Practice"
        english="Five Jian Zhan Cups, Five Ways Back to the Self"
        copy="一盞茶，不只是入口的味道。它是一個讓人慢下來、觀察自己、重新整理內心的過程。"
        copyEn="A cup of tea is more than a taste on the tongue. It's a process that slows you down, lets you observe yourself, and reorganizes your inner world."
        placeholder={{
          asset: "five-cups-overview.webp",
          label: "Future visual: five Jian Zhan cups arranged on a quiet tea table",
          note: "Reserved Five Cups overview visual"
        }}
        media={{
          asset: "chazen-arrival-room.avif",
          alt: "A quiet, softly lit tea room — the arrival point for the Five Cups practice."
        }}
      />

      <ChazenContentSection
        title="從願意停下來，到看清真正需要"
        english="A tea ritual for self-understanding"
        tone="ivory"
      >
        <div className="five-cups-intro-card">
          <p lang={language === "zh" ? "zh-Hant" : undefined}>
            {t(
              "Chazen maps five Jian Zhan cups to the Five Spiritual Faculties: Faith, Effort, Mindfulness, Stillness, Wisdom. From being willing to pause, to sustaining a practice; from noticing your thoughts, to settling body and mind; and finally, seeing in a cup of tea what you truly need.",
              "Chazen 以五盞建盞，對應佛教五根：信、精進、念、定、慧。從願意停下來，到持續修習；從覺察念頭，到安住身心；最後，在一杯茶中看清自己真正需要的是什麼。"
            )}
          </p>
        </div>
      </ChazenContentSection>

      <FiveCupsTabs />

      <ChazenContentSection
        eyebrow="Practice path"
        eyebrowZh="修習路徑"
        title="五盞建盞，不是五件收藏品"
        english="A path from noise toward clarity"
        tone="ivory"
      >
        <div className="five-cups-summary">
          <div>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t("They are a path from chaos toward clarity.", "它們是一條由混亂走向清明的路。")}
            </p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Begin with Faith, willing to pause. Build daily rhythm with Effort. See the present with Mindfulness. Settle body and mind with Stillness. Reflect on what you truly need with Wisdom.",
                "從信開始，願意停下來。以精進建立日常。以念看見當下。以定安住身心。以慧照見真正需要。"
              )}
            </p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>
              {t("This is the Chazen way of tea and stillness.", "這，就是 Chazen 的茶禪之路。")}
            </p>
          </div>
          <ChazenMediaPlaceholder
            asset="five-cups-practice-loop.mp4"
            label="Future video: the Five Cups practice loop"
            type="video"
            note="Reserved slow tea ritual motion asset"
          />
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="由此刻開始"
        titleEn="Begin From This Moment"
        copy="Let the cup you are drawn to become the next quiet step."
        copyZh="讓你受吸引的那一盞，成為你下一個安靜的步伐。"
        primary={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
        secondary={{ href: "/tea-ritual", label: "Enter Tea Ritual", labelZh: "進入茶儀式" }}
        next={{ href: "/tea-culture", label: "Tea Culture", labelZh: "茶文化" }}
      />
    </main>
  );
}
