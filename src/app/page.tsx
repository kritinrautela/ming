"use client";

import Image from "next/image";
import { useState } from "react";
import { ChazenHomeExperience } from "@/components/ChazenHomeExperience";
import { VideoModal } from "@/components/VideoModal";
import { videoAssets, withBasePath } from "@/lib/media";

export default function Home() {
  const [filmOpen, setFilmOpen] = useState(false);

  return (
    <main className="museum-home">
      <section className="cinema-hero" aria-labelledby="home-title">
        <Image
          src={withBasePath("/images/chazen-generated/chazen-tea-room-hero-v2.png")}
          alt="A dark wooden Chinese tea room with a real gongfu tea table, gaiwan, fairness cup, tasting cups, tea tray, singing bowl, steam, and garden morning light."
          fill
          priority
          sizes="100vw"
          className="cinema-hero-image"
        />
        <div className="cinema-hero-shade" />
        <div className="cinema-hero-inner">
          <p className="museum-kicker hero-eyebrow">Private tea room / 茶禪入室</p>
          <div>
            <h1 id="home-title" className="cinema-title">
              CHAZEN <span>茶禪</span>
            </h1>
            <div className="cinema-tagline">
              <p>
                A digital Chinese tea ritual for culture, reflection, sound, and return.
              </p>
              <p lang="zh-Hant">一盞茶，讓人回到自己。</p>
            </div>
            <div className="hero-actions">
              <a href={withBasePath("/discover-your-tea/")} className="museum-cta">
                Discover Your Tea
              </a>
              <a href="#chazen-entrance" className="museum-cta museum-cta-secondary">
                Explore the Culture
              </a>
              <a href="#ritual-media-room" className="museum-cta museum-cta-secondary">
                Enter the Ritual Room
              </a>
            </div>
            <div className="hero-commerce-rail" aria-label="CHAZEN product pillars">
              <span>Reflection <em lang="zh-Hant">覺察</em></span>
              <span>Tea Culture <em lang="zh-Hant">茶史</em></span>
              <span>Ritual Room <em lang="zh-Hant">茶席</em></span>
              <span>Tea Atlas <em lang="zh-Hant">茶地圖</em></span>
            </div>
          </div>
          <aside className="hero-object-caption" aria-label="Hero object caption">
            <span>01</span>
            <p>
              Gaiwan, fairness cup, tasting cups, tea tray, singing bowl, morning garden light.
            </p>
            <small lang="zh-Hant">蓋碗、公道杯、品茗杯、茶盤、冥想鉢與晨光。</small>
            <button type="button" onClick={() => setFilmOpen(true)}>
              Watch Ritual Film
            </button>
          </aside>
          <div className="hero-scroll-cue" aria-hidden="true">
            <span />
            Scroll
          </div>
        </div>
      </section>

      <ChazenHomeExperience />
      <VideoModal
        open={filmOpen}
        title="Ritual Film Coming Soon"
        src={withBasePath(videoAssets.chazenRitualFilm)}
        onClose={() => setFilmOpen(false)}
      />
    </main>
  );
}
