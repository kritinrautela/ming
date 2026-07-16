"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language";
import { audioAssets, withBasePath } from "@/lib/media";
import {
  IDEAL_WINDOW,
  dosePresets,
  infusionRate,
  liquorColor,
  mixHex,
  simTeas,
  simVessels,
  suggestedTime,
  tempFactor,
  verdictFor,
  type BrewVerdictKey,
  type SimTea,
  type SimVessel
} from "@/data/brewSim";
import styles from "./BrewSimulator.module.css";

type Stage = "leaf" | "vessel" | "water" | "brew" | "cup";
type BrewPhase = "ready" | "pouring" | "steeping" | "decanting" | "done";

type JournalEntry = {
  infusion: number;
  seconds: number;
  temp: number;
  strength: number;
  verdict: BrewVerdictKey;
};

const STAGES: { id: Stage; char: string; en: string; zh: string }[] = [
  { id: "leaf", char: "葉", en: "Leaf", zh: "選葉" },
  { id: "vessel", char: "器", en: "Vessel", zh: "選器" },
  { id: "water", char: "水", en: "Water", zh: "調水" },
  { id: "brew", char: "沖", en: "Brew", zh: "沖泡" },
  { id: "cup", char: "杯", en: "Cup", zh: "品杯" }
];

const POUR_SECONDS = 2.2;
const DECANT_SECONDS = 2.4;
const STRENGTH_DOMAIN = 1.6;

/** Classical water stages from Lu Yu's tradition — read from the kettle, not a thermometer. */
function waterStage(temp: number): { en: string; zh: string } {
  if (temp < 80) return { en: "Shrimp eyes", zh: "蝦眼" };
  if (temp < 86) return { en: "Crab eyes", zh: "蟹眼" };
  if (temp < 93) return { en: "Fish eyes", zh: "魚眼" };
  if (temp < 98) return { en: "String of pearls", zh: "連珠" };
  return { en: "Rolling boil", zh: "騰波鼓浪" };
}

const VERDICT_COPY: Record<BrewVerdictKey, { en: string; zh: string }> = {
  under: { en: "Under-steeped", zh: "未到位" },
  ideal: { en: "In the window", zh: "恰到好處" },
  over: { en: "Over-steeped", zh: "過了時" },
  scorched: { en: "Scorched leaf", zh: "葉被燙傷" }
};

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function BrewSimulator() {
  const { t, language } = useLanguage();

  const [teaId, setTeaId] = useState<string | null>(null);
  const [vesselId, setVesselId] = useState<SimVessel["id"] | null>(null);
  const [doseIndex, setDoseIndex] = useState(1);
  const [kettleTemp, setKettleTemp] = useState(90);
  const [stage, setStage] = useState<Stage>("leaf");
  const [brewPhase, setBrewPhase] = useState<BrewPhase>("ready");
  const [infusion, setInfusion] = useState(1);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [soundOn, setSoundOn] = useState(false);

  const tea = useMemo(() => simTeas.find((entry) => entry.id === teaId) ?? null, [teaId]);
  const vessel = useMemo(() => simVessels.find((entry) => entry.id === vesselId) ?? null, [vesselId]);
  const dose = dosePresets[doseIndex];

  // Live simulation values are kept in a ref and mirrored to the DOM with a
  // forced re-render at 10Hz — the usual game-loop pattern, immune to stale closures.
  const simRef = useRef({ fill: 0, strength: 0, elapsed: 0, liveTemp: 90, decant: 0 });
  const scorchedRef = useRef(false);
  const [, forceTick] = useReducer((n: number) => n + 1, 0);

  const audioRef = useRef<Partial<Record<"boil" | "pour" | "bowl", HTMLAudioElement>>>({});
  const soundOnRef = useRef(soundOn);
  soundOnRef.current = soundOn;

  function playSound(key: "boil" | "pour" | "bowl") {
    if (!soundOnRef.current) return;
    try {
      if (!audioRef.current[key]) {
        const src =
          key === "boil"
            ? audioAssets.boilingWater
            : key === "pour"
              ? audioAssets.teaPour
              : audioAssets.singingBowl;
        audioRef.current[key] = new Audio(withBasePath(src));
      }
      const audio = audioRef.current[key]!;
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    } catch {
      // Audio is a garnish; never let it break the brew.
    }
  }

  useEffect(() => {
    const sounds = audioRef.current;
    return () => {
      Object.values(sounds).forEach((audio) => audio?.pause());
    };
  }, []);

  useEffect(() => {
    if (brewPhase !== "pouring" && brewPhase !== "steeping" && brewPhase !== "decanting") return;
    if (!tea || !vessel) return;

    const id = window.setInterval(() => {
      const sim = simRef.current;
      const dt = 0.1;

      if (brewPhase === "pouring") {
        sim.fill = Math.min(1, sim.fill + dt / POUR_SECONDS);
        if (sim.fill >= 1) setBrewPhase("steeping");
      } else if (brewPhase === "steeping") {
        sim.elapsed += dt;
        sim.liveTemp = Math.max(60, sim.liveTemp - vessel.coolRate * dt);
        const rate =
          (1 / tea.baseTime) *
          tempFactor(sim.liveTemp, tea.idealTemp) *
          (dose.grams / 5) *
          vessel.extraction *
          infusionRate(infusion);
        sim.strength += rate * dt;
      } else if (brewPhase === "decanting") {
        sim.decant = Math.min(1, sim.decant + dt / DECANT_SECONDS);
        sim.fill = Math.max(0, 1 - sim.decant);
        if (sim.decant >= 1) {
          const verdict = verdictFor(sim.strength, scorchedRef.current);
          setJournal((prev) => [
            ...prev,
            {
              infusion,
              seconds: sim.elapsed,
              temp: Math.round(sim.liveTemp),
              strength: sim.strength,
              verdict
            }
          ]);
          if (verdict === "ideal") playSound("bowl");
          setBrewPhase("done");
          setStage("cup");
        }
      }

      forceTick();
    }, 100);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brewPhase, tea, vessel, dose.grams, infusion]);

  function chooseTea(id: string) {
    setTeaId(id);
    const nextTea = simTeas.find((entry) => entry.id === id);
    if (nextTea) setKettleTemp(nextTea.idealTemp);
    resetBrew(true);
    setStage("vessel");
  }

  function chooseVessel(id: SimVessel["id"]) {
    setVesselId(id);
    setStage("water");
  }

  function resetBrew(fullSession: boolean) {
    simRef.current = { fill: 0, strength: 0, elapsed: 0, liveTemp: kettleTemp, decant: 0 };
    scorchedRef.current = false;
    setBrewPhase("ready");
    if (fullSession) {
      setInfusion(1);
      setJournal([]);
    }
    forceTick();
  }

  function pourWater() {
    if (!tea) return;
    simRef.current = { fill: 0, strength: 0, elapsed: 0, liveTemp: kettleTemp, decant: 0 };
    scorchedRef.current = tea.scorchTemp !== null && kettleTemp > tea.scorchTemp;
    setBrewPhase("pouring");
    playSound("boil");
  }

  function decant() {
    if (brewPhase !== "steeping") return;
    setBrewPhase("decanting");
    playSound("pour");
  }

  function nextInfusion() {
    if (!tea) return;
    setInfusion((prev) => Math.min(prev + 1, tea.maxInfusions));
    simRef.current = { fill: 0, strength: 0, elapsed: 0, liveTemp: kettleTemp, decant: 0 };
    scorchedRef.current = false;
    setBrewPhase("ready");
    setStage("brew");
    forceTick();
  }

  function startOver() {
    setTeaId(null);
    setVesselId(null);
    setDoseIndex(1);
    setStage("leaf");
    resetBrew(true);
  }

  const sim = simRef.current;
  const busy = brewPhase === "pouring" || brewPhase === "steeping" || brewPhase === "decanting";
  const liquorHex = tea ? liquorColor(tea.liquorStops, sim.strength) : "#f2efd7";
  const verdict = tea ? verdictFor(sim.strength, scorchedRef.current) : "under";
  const lastEntry = journal[journal.length - 1] ?? null;
  const stageIndex = STAGES.findIndex((entry) => entry.id === stage);
  const spent = tea ? infusion >= tea.maxInfusions : false;

  const canVisit = (target: Stage): boolean => {
    if (busy) return false;
    const targetIndex = STAGES.findIndex((entry) => entry.id === target);
    if (targetIndex >= stageIndex) return false;
    if (target === "vessel" && !teaId) return false;
    if (target === "water" && (!teaId || !vesselId)) return false;
    if (target === "brew" && (!teaId || !vesselId)) return false;
    return true;
  };

  const statusMessage = !tea
    ? t("Choose a leaf to begin.", "先選一款茶葉。")
    : brewPhase === "pouring"
      ? t("Pouring water over the leaves.", "正在向茶葉注水。")
      : brewPhase === "steeping"
        ? t(
            `Steeping — ${Math.floor(sim.elapsed)} seconds at ${Math.round(sim.liveTemp)} degrees.`,
            `浸泡中——${Math.floor(sim.elapsed)} 秒，水溫 ${Math.round(sim.liveTemp)} 度。`
          )
        : brewPhase === "decanting"
          ? t("Pouring the tea into the cups.", "正在把茶湯分入杯中。")
          : stage === "cup" && lastEntry
            ? t(VERDICT_COPY[lastEntry.verdict].en, VERDICT_COPY[lastEntry.verdict].zh)
            : "";

  return (
    <div className={styles.simulator}>
      <div className={styles.stations} role="tablist" aria-label={t("Brewing stations", "沖泡步驟")}>
        {STAGES.map((entry, index) => {
          const isActive = entry.id === stage;
          const isDone = index < stageIndex;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.station}${isActive ? ` ${styles.stationActive}` : ""}${
                isDone ? ` ${styles.stationDone}` : ""
              }`}
              onClick={() => canVisit(entry.id) && setStage(entry.id)}
              disabled={!isActive && !canVisit(entry.id)}
            >
              <span className={styles.stationChar} lang="zh-Hant" aria-hidden="true">
                {entry.char}
              </span>
              <span className={styles.stationLabel}>{t(entry.en, entry.zh)}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`${styles.soundToggle}${soundOn ? ` ${styles.soundOn}` : ""}`}
          onClick={() => setSoundOn((prev) => !prev)}
          aria-pressed={soundOn}
        >
          {soundOn ? t("Sound on", "聲音開") : t("Sound off", "聲音關")}
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.scenePanel}>
          <BrewScene
            tea={tea}
            vesselId={vesselId ?? "gaiwan"}
            fill={sim.fill}
            liquorHex={liquorHex}
            liveTemp={sim.liveTemp}
            brewPhase={brewPhase}
            decant={sim.decant}
            leavesIn={stage === "brew" || stage === "cup"}
          />
          <div className={styles.hud}>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>{t("Steep", "浸泡")}</span>
              <span className={styles.hudValue}>{formatClock(sim.elapsed)}</span>
            </div>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>{t("Water", "水溫")}</span>
              <span className={styles.hudValue}>
                {Math.round(brewPhase === "ready" || brewPhase === "done" ? kettleTemp : sim.liveTemp)}
                <small>°C</small>
              </span>
            </div>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>{t("Infusion", "泡數")}</span>
              <span className={styles.hudValue}>
                {infusion}
                <small>/{tea ? tea.maxInfusions : "–"}</small>
              </span>
            </div>
            <div className={`${styles.hudBlock} ${styles.hudMeter}`}>
              <span className={styles.hudLabel}>{t("Strength", "濃度")}</span>
              <div
                className={styles.meter}
                role="meter"
                aria-valuemin={0}
                aria-valuemax={STRENGTH_DOMAIN}
                aria-valuenow={Math.round(sim.strength * 100) / 100}
                aria-label={t("Brew strength", "茶湯濃度")}
              >
                <span
                  className={styles.meterWindow}
                  style={{
                    left: `${(IDEAL_WINDOW[0] / STRENGTH_DOMAIN) * 100}%`,
                    width: `${((IDEAL_WINDOW[1] - IDEAL_WINDOW[0]) / STRENGTH_DOMAIN) * 100}%`
                  }}
                />
                <span
                  className={styles.meterFill}
                  style={{
                    width: `${Math.min(sim.strength / STRENGTH_DOMAIN, 1) * 100}%`,
                    background: liquorHex
                  }}
                />
              </div>
            </div>
          </div>
          <p className={styles.srOnly} aria-live="polite">
            {statusMessage}
          </p>
        </div>

        <div className={styles.controlPanel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {stage === "leaf" && (
                <section aria-label={t("Choose a leaf", "選一款茶葉")}>
                  <p className={styles.panelEyebrow}>{t("Station one — the leaf", "第一步——選葉")}</p>
                  <h3 className={styles.panelTitle}>{t("Choose what you will brew", "選擇你要沖泡的茶")}</h3>
                  <div className={styles.teaGrid}>
                    {simTeas.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className={styles.teaCard}
                        onClick={() => chooseTea(entry.id)}
                      >
                        <span
                          className={styles.teaSwatch}
                          style={{
                            background: `linear-gradient(140deg, ${entry.leafSwatch[0]}, ${entry.leafSwatch[1]})`
                          }}
                          aria-hidden="true"
                        />
                        <span className={styles.teaCardBody}>
                          <span className={styles.teaCardName}>
                            {language === "zh" ? (
                              <span lang="zh-Hant">{entry.nameZh}</span>
                            ) : (
                              entry.name
                            )}
                            <em>{language === "zh" ? entry.name : entry.nameZh}</em>
                          </span>
                          <span className={styles.teaCardMeta}>
                            {t(entry.category, entry.categoryZh)} · {t(entry.origin, entry.originZh)}
                          </span>
                          <span className={styles.teaCardBrew}>
                            {entry.idealTemp}°C · {suggestedTime(entry, 1)}s
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {stage === "vessel" && tea && (
                <section aria-label={t("Choose a vessel", "選一件器具")}>
                  <p className={styles.panelEyebrow}>{t("Station two — the vessel", "第二步——選器")}</p>
                  <h3 className={styles.panelTitle}>
                    {t(`What will hold the ${tea.name}?`, `用甚麼來承載${tea.nameZh}？`)}
                  </h3>
                  <div className={styles.vesselList}>
                    {simVessels.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className={styles.vesselCard}
                        onClick={() => chooseVessel(entry.id)}
                      >
                        <span className={styles.vesselIcon} aria-hidden="true">
                          <VesselGlyph id={entry.id} />
                        </span>
                        <span>
                          <span className={styles.vesselName}>
                            {t(entry.name, entry.nameZh)}{" "}
                            <em lang="zh-Hant">{language === "zh" ? entry.name : entry.nameZh}</em>
                          </span>
                          <span className={styles.vesselNote}>{t(entry.character.en, entry.character.zh)}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {stage === "water" && tea && vessel && (
                <section aria-label={t("Set the water", "調整水")}>
                  <p className={styles.panelEyebrow}>{t("Station three — the water", "第三步——調水")}</p>
                  <h3 className={styles.panelTitle}>{t("Heat the kettle, weigh the leaf", "燒水，秤葉")}</h3>

                  <div className={styles.waterReadout}>
                    <span className={styles.waterTemp}>
                      {kettleTemp}
                      <small>°C</small>
                    </span>
                    <span className={styles.waterStage}>
                      {t(waterStage(kettleTemp).en, waterStage(kettleTemp).zh)}
                      <em lang="zh-Hant">{language === "zh" ? waterStage(kettleTemp).en : waterStage(kettleTemp).zh}</em>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={100}
                    step={1}
                    value={kettleTemp}
                    onChange={(event) => setKettleTemp(Number(event.target.value))}
                    className={styles.slider}
                    aria-label={t("Water temperature in degrees Celsius", "水溫（攝氏度）")}
                  />
                  <p className={styles.waterHint}>
                    {t(
                      `${tea.name} asks for about ${tea.idealTemp}°C.`,
                      `${tea.nameZh}大約需要 ${tea.idealTemp}°C。`
                    )}
                    {tea.scorchTemp !== null &&
                      " " +
                        t(
                          `Above ${tea.scorchTemp}°C the young leaf will cook.`,
                          `超過 ${tea.scorchTemp}°C，嫩葉就會被燙熟。`
                        )}
                  </p>

                  <div className={styles.doseRow} role="radiogroup" aria-label={t("Leaf amount", "茶葉份量")}>
                    {dosePresets.map((preset, index) => (
                      <button
                        key={preset.grams}
                        type="button"
                        role="radio"
                        aria-checked={doseIndex === index}
                        className={`${styles.doseButton}${doseIndex === index ? ` ${styles.doseActive}` : ""}`}
                        onClick={() => setDoseIndex(index)}
                      >
                        <strong>{preset.grams} g</strong>
                        <span>{t(preset.label.en, preset.label.zh)}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => {
                      resetBrew(false);
                      setStage("brew");
                    }}
                  >
                    {t("Bring it to the table", "端上茶桌")}
                  </button>
                </section>
              )}

              {stage === "brew" && tea && vessel && (
                <section aria-label={t("Brew the tea", "沖泡")}>
                  <p className={styles.panelEyebrow}>
                    {t(`Station four — infusion ${infusion}`, `第四步——第 ${infusion} 泡`)}
                  </p>
                  <h3 className={styles.panelTitle}>
                    {brewPhase === "ready" && t("Pour when you are ready", "準備好了就注水")}
                    {brewPhase === "pouring" && t("Water meets leaf", "水遇見葉")}
                    {brewPhase === "steeping" && t("Now, wait with it", "現在，陪它等")}
                    {brewPhase === "decanting" && t("Pouring the cup", "出湯")}
                  </h3>
                  <p className={styles.brewGuide}>
                    {t(
                      `A balanced infusion ${infusion} of ${tea.name} runs about ${suggestedTime(tea, infusion)} seconds — but the leaf, not the clock, has the final word.`,
                      `${tea.nameZh}的第 ${infusion} 泡，大約 ${suggestedTime(tea, infusion)} 秒便平衡——但最終說了算的是茶葉，不是時鐘。`
                    )}
                  </p>
                  <div className={styles.brewActions}>
                    {brewPhase === "ready" && (
                      <button type="button" className={styles.primaryAction} onClick={pourWater}>
                        {t("Pour the water", "注水")}
                      </button>
                    )}
                    {brewPhase === "steeping" && (
                      <button type="button" className={`${styles.primaryAction} ${styles.decantAction}`} onClick={decant}>
                        {t("Pour the tea", "出湯")}
                      </button>
                    )}
                    {(brewPhase === "pouring" || brewPhase === "decanting") && (
                      <span className={styles.brewWaiting}>
                        {brewPhase === "pouring" ? t("Pouring…", "注水中…") : t("Decanting…", "出湯中…")}
                      </span>
                    )}
                  </div>
                  {brewPhase === "ready" && (
                    <button
                      type="button"
                      className={styles.quietLink}
                      onClick={() => setStage("water")}
                    >
                      {t("Adjust water or dose", "調整水溫或份量")}
                    </button>
                  )}
                </section>
              )}

              {stage === "cup" && tea && lastEntry && (
                <section aria-label={t("Taste the cup", "品杯")}>
                  <p className={styles.panelEyebrow}>
                    {t(`Station five — infusion ${lastEntry.infusion}`, `第五步——第 ${lastEntry.infusion} 泡`)}
                  </p>
                  <div className={`${styles.verdictBand} ${styles[`verdict-${lastEntry.verdict}`]}`}>
                    <span
                      className={styles.verdictSwatch}
                      style={{ background: liquorColor(tea.liquorStops, lastEntry.strength) }}
                      aria-hidden="true"
                    />
                    <h3>{t(VERDICT_COPY[lastEntry.verdict].en, VERDICT_COPY[lastEntry.verdict].zh)}</h3>
                    <span className={styles.verdictStats}>
                      {formatClock(lastEntry.seconds)} · {lastEntry.temp}°C
                    </span>
                  </div>
                  <p className={styles.tastingNote} lang={language === "zh" ? "zh-Hant" : undefined}>
                    {t(tea.notes[lastEntry.verdict].en, tea.notes[lastEntry.verdict].zh)}
                  </p>
                  <p className={styles.aromaNote} lang={language === "zh" ? "zh-Hant" : undefined}>
                    <span>{t("In the aroma", "杯中香氣")}</span>
                    {t(tea.aroma.en, tea.aroma.zh)}
                  </p>

                  {journal.length > 0 && (
                    <table className={styles.journal}>
                      <caption>{t("Brew journal", "沖泡記錄")}</caption>
                      <thead>
                        <tr>
                          <th scope="col">{t("Infusion", "泡")}</th>
                          <th scope="col">{t("Time", "時間")}</th>
                          <th scope="col">{t("Temp", "水溫")}</th>
                          <th scope="col">{t("Cup", "茶湯")}</th>
                          <th scope="col">{t("Verdict", "評語")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journal.map((entry) => (
                          <tr key={entry.infusion}>
                            <td>{entry.infusion}</td>
                            <td>{formatClock(entry.seconds)}</td>
                            <td>{entry.temp}°C</td>
                            <td>
                              <span
                                className={styles.journalSwatch}
                                style={{ background: liquorColor(tea.liquorStops, entry.strength) }}
                              />
                            </td>
                            <td>{t(VERDICT_COPY[entry.verdict].en, VERDICT_COPY[entry.verdict].zh)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className={styles.cupActions}>
                    {!spent ? (
                      <button type="button" className={styles.primaryAction} onClick={nextInfusion}>
                        {t(`Infusion ${infusion + 1} — pour again`, `第 ${infusion + 1} 泡——再注水`)}
                      </button>
                    ) : (
                      <p className={styles.spentNote}>
                        {t(
                          "The leaf has given everything it has. Thank it, and begin again.",
                          "這片葉子已經把一切都給了你。謝謝它，然後重新開始。"
                        )}
                      </p>
                    )}
                    <button type="button" className={styles.quietLink} onClick={startOver}>
                      {t("New session — choose another leaf", "新的一席——換一款茶")}
                    </button>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

type BrewSceneProps = {
  tea: SimTea | null;
  vesselId: SimVessel["id"];
  fill: number;
  liquorHex: string;
  liveTemp: number;
  brewPhase: BrewPhase;
  decant: number;
  leavesIn: boolean;
};

/** Fixed pseudo-random leaf placements — deterministic so SSR and client agree. */
const LEAVES = [
  { dx: -34, floatX: -42, floatY: 0.22, rotDry: 24, rotWet: -18, delay: 0 },
  { dx: -22, floatX: -18, floatY: 0.55, rotDry: -40, rotWet: 32, delay: 0.7 },
  { dx: -10, floatX: 6, floatY: 0.35, rotDry: 66, rotWet: -52, delay: 1.4 },
  { dx: 0, floatX: 30, floatY: 0.68, rotDry: -12, rotWet: 12, delay: 0.3 },
  { dx: 10, floatX: -30, floatY: 0.8, rotDry: 48, rotWet: -30, delay: 1.1 },
  { dx: 20, floatX: 44, floatY: 0.42, rotDry: -70, rotWet: 60, delay: 1.8 },
  { dx: 30, floatX: 16, floatY: 0.15, rotDry: 30, rotWet: -8, delay: 0.5 },
  { dx: -28, floatX: 38, floatY: 0.9, rotDry: -22, rotWet: 44, delay: 1.6 },
  { dx: 24, floatX: -8, floatY: 0.6, rotDry: 80, rotWet: -66, delay: 0.9 }
];

const LEAF_PATH = "M0,-9 C4.5,-4.5 4.5,4.5 0,9 C-4.5,4.5 -4.5,-4.5 0,-9 Z";

function BrewScene({ tea, vesselId, fill, liquorHex, liveTemp, brewPhase, decant, leavesIn }: BrewSceneProps) {
  const pouring = brewPhase === "pouring";
  const steeping = brewPhase === "steeping";
  const decanting = brewPhase === "decanting";
  const done = brewPhase === "done";

  // Interior liquid geometry shared by all vessels.
  const liquidBottom = 348;
  const liquidDepth = 96;
  const liquidTop = liquidBottom - liquidDepth * fill;
  const steamLevel = steeping ? Math.max(0, Math.min((liveTemp - 62) / 38, 1)) : 0;
  const wet = fill > 0.12 || decanting;
  const cupFill = done ? 1 : decanting ? Math.max(0, (decant - 0.35) / 0.65) : 0;
  const chaHaiFill = done ? 1 : decanting ? Math.min(decant / 0.7, 1) : 0;
  const surfaceHighlight = mixHex(liquorHex, "#ffffff", 0.35);
  const dryLeaf = tea ? tea.leafSwatch[1] : "#4c5c33";
  const wetLeaf = tea ? mixHex(tea.leafSwatch[0], tea.leafSwatch[1], 0.4) : "#5a6a42";

  return (
    <svg
      viewBox="0 0 640 430"
      className={styles.scene}
      role="img"
      aria-label="Animated tea table: kettle, brewing vessel, fairness pitcher, and cups."
    >
      <defs>
        <clipPath id="brew-clip-gaiwan">
          <path d="M262,250 C266,298 288,338 320,344 C352,338 374,298 378,250 Z" />
        </clipPath>
        <clipPath id="brew-clip-yixing">
          <path d="M258,296 C258,262 284,248 320,248 C356,248 382,262 382,296 C382,328 356,346 320,346 C284,346 258,328 258,296 Z" />
        </clipPath>
        <clipPath id="brew-clip-glass">
          <rect x="264" y="246" width="112" height="104" rx="10" />
        </clipPath>
        <linearGradient id="brew-water-stream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe7e7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c3d6d6" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Table */}
      <line x1="36" y1="368" x2="620" y2="368" stroke="#d8d0c2" strokeWidth="2" />
      <line x1="36" y1="374" x2="620" y2="374" stroke="#d8d0c2" strokeWidth="1" opacity="0.5" />

      {/* Kettle */}
      <g className={`${styles.kettle}${pouring ? ` ${styles.kettlePouring}` : ""}`}>
        <g transform="translate(96,158)">
          <path
            d="M14,44 C14,20 38,8 62,8 C86,8 110,20 110,44 L110,84 C110,96 98,104 62,104 C26,104 14,96 14,84 Z"
            fill="#171713"
            opacity="0.92"
          />
          <path d="M104,40 L148,20 L150,28 L108,54 Z" fill="#171713" opacity="0.92" />
          <path d="M34,10 C40,-6 84,-6 90,10" fill="none" stroke="#171713" strokeWidth="6" strokeLinecap="round" />
          <circle cx="62" cy="6" r="5" fill="#9d8150" />
        </g>
      </g>

      {/* Water stream from kettle to vessel */}
      {pouring && (
        <path
          className={styles.stream}
          d="M247,182 C252,208 286,224 314,246"
          fill="none"
          stroke="url(#brew-water-stream)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {/* Brewing vessel */}
      <g className={`${styles.vessel}${decanting ? ` ${styles.vesselTilted}` : ""}`}>
        {/* Liquid + leaves, clipped to the vessel interior */}
        <g clipPath={`url(#brew-clip-${vesselId})`}>
          <rect x="250" y={liquidTop} width="140" height={liquidBottom - liquidTop + 6} fill={liquorHex} opacity="0.88" />
          {fill > 0.02 && (
            <ellipse cx="320" cy={liquidTop} rx="62" ry="4.5" fill={surfaceHighlight} opacity="0.55" />
          )}
          {leavesIn &&
            LEAVES.map((leaf, index) => {
              const floatY = liquidBottom - 8 - liquidDepth * fill * leaf.floatY;
              const x = wet ? 320 + leaf.floatX : 320 + leaf.dx;
              const y = wet ? floatY : liquidBottom - 5;
              const rot = wet ? leaf.rotWet : leaf.rotDry;
              const scale = wet ? 1 : 0.72;
              return (
                <g
                  key={index}
                  className={wet && (steeping || pouring) ? styles.leafDrift : undefined}
                  style={{ animationDelay: `${leaf.delay}s`, transition: "transform 1.4s cubic-bezier(.35,0,.25,1)" }}
                  transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}
                >
                  <path d={LEAF_PATH} fill={wet ? wetLeaf : dryLeaf} style={{ transition: "fill 1.2s linear" }} />
                </g>
              );
            })}
        </g>

        {/* Vessel walls */}
        {vesselId === "gaiwan" && (
          <g>
            <path
              d="M254,246 C258,300 282,344 320,350 C358,344 382,300 386,246"
              fill="#fbfaf6"
              fillOpacity="0.28"
              stroke="#171713"
              strokeWidth="2.5"
            />
            <ellipse cx="320" cy="246" rx="66" ry="9" fill="none" stroke="#171713" strokeWidth="2.5" />
            <ellipse cx="320" cy="360" rx="52" ry="7" fill="none" stroke="#171713" strokeWidth="2" />
            <g transform="translate(404,216) rotate(24)">
              <ellipse cx="0" cy="0" rx="38" ry="6.5" fill="#fbfaf6" stroke="#171713" strokeWidth="2.5" />
              <circle cx="0" cy="-7" r="5" fill="#9d8150" stroke="#171713" strokeWidth="1.5" />
            </g>
          </g>
        )}
        {vesselId === "yixing" && (
          <g>
            <path
              d="M258,296 C258,262 284,248 320,248 C356,248 382,262 382,296 C382,328 356,346 320,346 C284,346 258,328 258,296 Z"
              fill="#6f4a32"
              fillOpacity="0.22"
              stroke="#171713"
              strokeWidth="2.5"
            />
            <path d="M380,284 C404,272 420,262 428,246" fill="none" stroke="#171713" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M380,300 C398,292 410,282 420,268" fill="none" stroke="#171713" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M260,282 C230,274 226,306 256,314" fill="none" stroke="#171713" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="320" cy="248" rx="44" ry="8" fill="none" stroke="#171713" strokeWidth="2.5" />
            <circle cx="320" cy="236" r="6" fill="#9d8150" stroke="#171713" strokeWidth="1.5" />
          </g>
        )}
        {vesselId === "glass" && (
          <g>
            <rect
              x="260"
              y="242"
              width="120"
              height="112"
              rx="12"
              fill="#fbfaf6"
              fillOpacity="0.12"
              stroke="#171713"
              strokeWidth="2.5"
            />
            <path d="M382,262 C406,266 406,298 382,302" fill="none" stroke="#171713" strokeWidth="2.5" />
            <line x1="272" y1="254" x2="272" y2="332" stroke="#ffffff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Steam */}
      <g className={styles.steamGroup} style={{ opacity: steamLevel }}>
        {[300, 322, 344].map((x, index) => (
          <path
            key={x}
            className={styles.steam}
            style={{ animationDelay: `${index * 0.9}s` }}
            d={`M${x},232 C${x - 8},214 ${x + 8},198 ${x},180`}
            fill="none"
            stroke="#d8d0c2"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Decant stream */}
      {decanting && (
        <path
          className={styles.stream}
          d="M394,262 C430,272 452,286 464,302"
          fill="none"
          stroke={liquorHex}
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}

      {/* Cha hai — fairness pitcher */}
      <g>
        <g clipPath="url(#brew-clip-chahai)" />
        <clipPath id="brew-clip-chahai">
          <path d="M452,306 L488,306 L484,358 L456,358 Z" />
        </clipPath>
        <g clipPath="url(#brew-clip-chahai)">
          <rect x="450" y={358 - 48 * chaHaiFill} width="40" height="52" fill={liquorHex} opacity="0.9" />
        </g>
        <path d="M450,302 L490,302 L485,360 L455,360 Z" fill="#fbfaf6" fillOpacity="0.15" stroke="#171713" strokeWidth="2" />
        <path d="M450,302 L442,296" stroke="#171713" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Cups */}
      {[524, 562, 600].map((cx, index) => (
        <g key={cx}>
          <clipPath id={`brew-clip-cup-${index}`}>
            <path d={`M${cx - 14},340 C${cx - 12},354 ${cx + 12},354 ${cx + 14},340 L${cx + 14},338 L${cx - 14},338 Z`} />
          </clipPath>
          <g clipPath={`url(#brew-clip-cup-${index})`}>
            <rect
              x={cx - 16}
              y={352 - 13 * Math.max(0, Math.min(cupFill * 3 - index * 0.55, 1))}
              width="32"
              height="18"
              fill={liquorHex}
              opacity="0.92"
            />
          </g>
          <path
            d={`M${cx - 15},338 C${cx - 13},355 ${cx + 13},355 ${cx + 15},338`}
            fill="#fbfaf6"
            fillOpacity="0.25"
            stroke="#171713"
            strokeWidth="2"
          />
          <line x1={cx - 9} y1="360" x2={cx + 9} y2="360" stroke="#171713" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

function VesselGlyph({ id }: { id: SimVessel["id"] }) {
  if (id === "gaiwan") {
    return (
      <svg viewBox="0 0 48 40" aria-hidden="true">
        <path d="M8,14 C9,26 15,33 24,34 C33,33 39,26 40,14" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="24" cy="14" rx="17" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="24" cy="9" rx="12" ry="2.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="5" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "yixing") {
    return (
      <svg viewBox="0 0 48 40" aria-hidden="true">
        <path d="M12,22 C12,14 17,10 24,10 C31,10 36,14 36,22 C36,29 31,33 24,33 C17,33 12,29 12,22 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M35,18 C40,15 43,12 44,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13,17 C6,15 5,24 12,26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="8" r="2" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true">
      <rect x="12" y="8" width="22" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M34,14 C40,15 40,25 34,26" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="16" y1="12" x2="16" y2="28" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
