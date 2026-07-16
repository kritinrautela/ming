"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Timer, Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/language";

const moods = [
  {
    name: { en: "Scattered", zh: "思緒紛亂" },
    tea: { en: "Wuyi Rock Tea", zh: "武夷岩茶" },
    copy: {
      en: "Mineral warmth and roasted depth for returning attention to the body.",
      zh: "礦質般的溫暖與焙火的深度，讓注意力回到身體。"
    }
  },
  {
    name: { en: "Heavy", zh: "沉重疲憊" },
    tea: { en: "Longjing", zh: "龍井" },
    copy: { en: "Spring green clarity for a lighter, cleaner beginning.", zh: "春日綠茶的清澈，帶來更輕盈、乾淨的開始。" }
  },
  {
    name: { en: "Restless", zh: "焦躁不安" },
    tea: { en: "High Mountain Oolong", zh: "高山烏龍" },
    copy: { en: "Soft alpine aroma for slowing the edge of the day.", zh: "柔和的高山香氣，撫平這一天的稜角。" }
  }
];

export function StillnessRoom() {
  const { t } = useLanguage();
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [mood, setMood] = useState(moods[0]);
  const bowlAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running || seconds === 0) {
      return;
    }

    const interval = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false);
    }
  }, [seconds]);

  const timeLabel = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [seconds]);

  function toggleMeditation() {
    if (seconds === 0) {
      setSeconds(60);
      setRunning(true);
      return;
    }

    setRunning((value) => !value);
  }

  function resetMeditation() {
    setSeconds(60);
    setRunning(false);
  }

  function strikeBowl() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    if (!bowlAudioRef.current) {
      bowlAudioRef.current = new Audio(`${basePath}/audio/singing-bowl.mp3`);
    }

    const audio = bowlAudioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.6;
    void audio.play();
  }

  return (
    <div className="premium-card mx-auto max-w-2xl bg-porcelain p-8 sm:p-12">
      <div className="text-center">
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full border border-moss/30 bg-moss/5 text-[0.65rem] font-bold uppercase tracking-widest text-moss ${
            running ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        >
          {running ? t("Breathe", "呼吸") : t("Begin", "開始")}
        </div>
        <p className="museum-label mt-6 text-brass">{t("60-second tea meditation", "六十秒茶冥想")}</p>
        <p className="display-title mt-3 text-6xl leading-none text-ink">{timeLabel}</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/60">
          {t(
            "Let the first sound mark the beginning. Watch the breath expand and release. Return to the cup before returning to the day.",
            "讓第一聲響標記開始。看著呼吸的展開與釋放。在回到日常之前，先回到這杯茶。"
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="button-primary" onClick={toggleMeditation}>
          {running ? <Pause size={17} /> : <Play size={17} />}
          {running ? t("Pause", "暫停") : seconds === 0 ? t("Restart", "重新開始") : t("Begin", "開始")}
        </button>
        <button type="button" className="button-secondary" onClick={resetMeditation}>
          <Timer size={17} />
          {t("Reset", "重設")}
        </button>
        <button type="button" className="button-secondary" onClick={strikeBowl}>
          <Volume2 size={17} />
          {t("Strike bowl", "敲擊缽音")}
        </button>
      </div>

      <div className="mt-10 border-t border-ink/10 pt-8">
        <p className="museum-label text-center text-ink/50">{t("How are you feeling?", "你現在感覺如何？")}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {moods.map((item) => (
            <button
              type="button"
              key={item.name.en}
              aria-pressed={mood.name.en === item.name.en}
              className={
                mood.name.en === item.name.en
                  ? "rounded-full border border-moss bg-moss px-4 py-2 text-sm font-semibold text-porcelain transition"
                  : "rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-moss/50"
              }
              onClick={() => setMood(item)}
            >
              {t(item.name.en, item.name.zh)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-clay/20 bg-paper px-6 py-5 text-center">
          <p className="museum-label text-clay">{t("Recommended tea", "建議茶款")}</p>
          <strong className="display-title mt-2 block text-2xl text-ink">{t(mood.tea.en, mood.tea.zh)}</strong>
          <span className="mt-1 block text-sm leading-6 text-ink/60">{t(mood.copy.en, mood.copy.zh)}</span>
        </div>
      </div>
    </div>
  );
}
