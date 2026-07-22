"use client";

import { useEffect } from "react";
import { ChazenCtaBand } from "@/components/ChazenSubpage";
import {
  FiveCupsCollection,
  FiveCupsCollectionHero,
  FiveCupsJourney
} from "@/app/five-cups/FiveCupsCollection";
import { useLanguage } from "@/lib/language";

export default function FiveCupsPage() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title =
      language === "zh" ? "五盞收藏 · Chazen" : "Five Cups Collection | Chazen";
  }, [language]);

  return (
    <main className="chazen-subpage five-cups-collection-page">
      <FiveCupsCollectionHero />
      <FiveCupsCollection />
      <FiveCupsJourney />

      <ChazenCtaBand
        title="找到屬於你此刻的那一盞"
        titleEn="Find the Cup for This Moment"
        copy="Let the cup you are drawn to become your next quiet step."
        copyZh="讓吸引你的那一盞，成為下一個安靜的步伐。"
        primary={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
        secondary={{ href: "/tea-boxes", label: "Explore Tea Sets", labelZh: "探索茶具組" }}
        next={{ href: "/tea-collection", label: "Tea Collection", labelZh: "茶品收藏" }}
      />
    </main>
  );
}
