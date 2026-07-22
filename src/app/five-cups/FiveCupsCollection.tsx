"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { fiveCups } from "@/app/five-cups/fiveCupsData";
import { useLanguage } from "@/lib/language";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function FiveCupsCollectionHero() {
  const { t, language } = useLanguage();

  return (
    <section className="five-collection-hero">
      <div className="five-collection-hero-mark" aria-hidden="true">五</div>
      <div className="five-collection-container five-collection-hero-grid">
        <MotionReveal className="five-collection-hero-copy">
          <p className="five-collection-kicker">{t("The Collection", "五盞收藏")}</p>
          <h1 lang={language === "zh" ? "zh-Hant" : undefined}>
            {t("Five cups. One path back to yourself.", "五盞，一條回到自己的路。")}
          </h1>
          <p className="five-collection-hero-intro" lang={language === "zh" ? "zh-Hant" : undefined}>
            {t(
              "A collection shaped around Faith, Effort, Mindfulness, Stillness, and Wisdom — five vessels for five states of modern life.",
              "以信、精進、念、定、慧為脈絡，五件器物，對應現代生活中的五種內在狀態。"
            )}
          </p>
          <div className="five-collection-hero-actions">
            <Link href="#collection" className="five-collection-button five-collection-button-light">
              {t("View the collection", "瀏覽五盞收藏")} <ArrowDown size={16} aria-hidden="true" />
            </Link>
            <Link href="/tea-test" className="five-collection-text-link">
              {t("Find your cup", "找到你的那一盞")} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </MotionReveal>

        <MotionReveal className="five-collection-hero-stage" delay={0.14}>
          <figure className="five-collection-hero-image">
            <Image
              src={`${basePath}/images/chazen-song-diancha-v1.jpg`}
              alt="A dark Jian Zhan bowl used in a quiet Song-style tea ritual"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 92vw"
            />
            <div className="five-collection-image-veil" aria-hidden="true" />
          </figure>
          <div className="five-collection-hero-note">
            <span>{t("Collection 01—05", "收藏 01—05")}</span>
            <strong>{t("Five Spiritual Faculties", "五根")}</strong>
            <small>{t("A living practice, held in the hand.", "把一場修習，捧在手中。")}</small>
          </div>
          <div className="five-collection-hero-seal" lang="zh-Hant" aria-hidden="true">五盞</div>
        </MotionReveal>
      </div>
    </section>
  );
}

export function FiveCupsCollection() {
  const { t, language } = useLanguage();

  return (
    <section id="collection" className="five-collection-catalogue" aria-labelledby="five-collection-title">
      <div className="five-collection-container">
        <MotionReveal className="five-collection-heading">
          <div>
            <p className="five-collection-kicker">{t("The five pieces", "五盞器物")}</p>
            <h2 id="five-collection-title" lang={language === "zh" ? "zh-Hant" : undefined}>
              {t("Meet the complete collection", "認識完整的五盞收藏")}
            </h2>
          </div>
          <p lang={language === "zh" ? "zh-Hant" : undefined}>
            {t(
              "Each cup is a distinct doorway into practice. Explore the state it reflects, the ritual it holds, and the step it invites you to take.",
              "每一盞都是一道不同的修習入口。看見它映照的狀態、承載的儀式，以及邀請你踏出的下一步。"
            )}
          </p>
        </MotionReveal>

        <div className="five-collection-grid">
          {fiveCups.map((cup, index) => (
            <MotionReveal
              key={cup.key}
              className={`five-collection-card five-collection-card-${cup.key}`}
              delay={index * 0.07}
            >
              <Link
                href={`/five-cups/${cup.key}`}
                className="five-collection-card-link"
                aria-label={t(`Explore ${cup.english}`, `探索${cup.tab}盞`)}
              >
                <Image
                  src={`${basePath}/images/${cup.asset}`}
                  alt={cup.visualDirectionEn}
                  fill
                  sizes="(min-width: 1100px) 50vw, (min-width: 700px) 50vw, 100vw"
                  className="five-collection-card-image"
                />
                <div className="five-collection-card-veil" aria-hidden="true" />
                <div className="five-collection-card-topline">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{cup.buddhistTerm}</span>
                </div>
                <span className="five-collection-card-character" lang="zh-Hant" aria-hidden="true">
                  {cup.tab}
                </span>
                <div className="five-collection-card-copy">
                  <p>{language === "zh" ? cup.tab : cup.english}</p>
                  {language === "zh" ? <h3>{cup.english}</h3> : <h3 lang="zh-Hant">{cup.tab}</h3>}
                  <span lang={language === "zh" ? "zh-Hant" : undefined}>
                    {t(cup.teaZenMeaningEn, cup.teaZenMeaning)}
                  </span>
                  <strong>
                    {t("Explore this cup", "探索這一盞")} <ArrowRight size={15} aria-hidden="true" />
                  </strong>
                </div>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FiveCupsJourney() {
  const { t, language } = useLanguage();

  return (
    <section className="five-collection-journey">
      <div className="five-collection-container five-collection-journey-grid">
        <MotionReveal className="five-collection-film">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src={`${basePath}/video/dian-cha.mp4`}
          />
          <div aria-hidden="true" />
          <p>{t("The collection in practice", "五盞之間，一場修習")}</p>
        </MotionReveal>

        <MotionReveal className="five-collection-journey-copy" delay={0.12}>
          <p className="five-collection-kicker">{t("One collection, five movements", "一組收藏，五重轉化")}</p>
          <h2 lang={language === "zh" ? "zh-Hant" : undefined}>
            {t("From the willingness to begin, to the clarity to see.", "從願意開始，到清楚看見。")}
          </h2>
          <ol>
            {fiveCups.map((cup, index) => (
              <li key={cup.key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{language === "zh" ? cup.tab : cup.english.split(" / ")[0]}</strong>
                  <small>{t(cup.coreMeaningEn, cup.coreMeaning)}</small>
                </div>
              </li>
            ))}
          </ol>
        </MotionReveal>
      </div>
    </section>
  );
}
