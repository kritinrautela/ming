"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Download, Loader2, Lock, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";

// Set this once the Chazen Shopify store is connected: the checkout URL for
// the First Pack (A$25) product, which is what unlocking the full Tea-Mind
// report is bundled with. Until it's set, the unlock button falls back to
// the same email-inquiry flow already used elsewhere on the site.
const UNLOCK_CHECKOUT_URL = "";
const UNLOCK_STORAGE_KEY = "chazen-tea-mind-report-unlocked";

type ResultKey = "an" | "ding" | "mian" | "fang" | "qing";

type AssessmentOption = {
  label: string;
  result: ResultKey;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  options: AssessmentOption[];
};

type ResultProfile = {
  key: ResultKey;
  character: string;
  chineseName: string;
  englishName: string;
  need: string;
  quickRead: string;
  interpretation: string;
  teaFeeling: string;
  currentState: string;
  strengths: string[];
  watchOuts: string[];
  teas: string[];
  ritualName: string;
  ritualSteps: string[];
  product: string;
};

const resultOrder: ResultKey[] = ["an", "ding", "mian", "fang", "qing"];

const resultProfiles: Record<ResultKey, ResultProfile> = {
  an: {
    key: "an",
    character: "安",
    chineseName: "歸心者",
    englishName: "The Grounded One",
    need: "Grounding, safety, return to self.",
    quickRead: "You look fine outside, but you're quietly carrying more than you're saying.",
    interpretation:
      "You may not be lost; you may simply be carrying too many external voices at once. 安 appears when your inner rhythm is asking for warmth, steadiness, and a place to come home to. A mellow, grounded tea can become a small daily threshold back to yourself.",
    teaFeeling: "Warm brown, ivory, grounding, ripe pu-erh feeling.",
    currentState:
      "You may feel emotionally unsettled, overwhelmed, or slightly disconnected from your own centre.",
    strengths: ["Sensitive to atmosphere", "Thoughtful with others", "Able to notice quiet inner changes"],
    watchOuts: ["Absorbing too many external voices", "Holding worry silently", "Forgetting your own pace"],
    teas: ["Ripe pu-erh", "Aged white tea", "Roasted oolong", "Chenpi white tea"],
    ritualName: "Three-Sip Grounding Ritual",
    ritualSteps: [
      "First sip: feel the warmth of the cup.",
      "Second sip: notice the texture of the tea.",
      "Third sip: ask yourself, \"What do I truly need right now?\""
    ],
    product: "Starter Tea Box"
  },
  ding: {
    key: "ding",
    character: "定",
    chineseName: "修行者",
    englishName: "The Focused One",
    need: "Focus, rhythm, steady attention.",
    quickRead: "Your mind is holding too many tabs open at once.",
    interpretation:
      "You do not need more stimulation; you need a rhythm that lets attention gather again. 定 appears when your mind wants fewer interruptions and a clearer beginning. A clean, fragrant tea can become a daily practice for focus, composure, and steady return.",
    teaFeeling: "Deep green, clean gold, focused, high mountain oolong feeling.",
    currentState:
      "Your mind may be carrying many tabs at once, with attention pulled between tasks, messages, and expectations.",
    strengths: ["Disciplined when rhythm is clear", "Goal-oriented", "Able to turn small habits into practice"],
    watchOuts: ["Mistaking stimulation for focus", "Over-planning instead of beginning", "Letting urgency set the pace"],
    teas: ["High mountain oolong", "Light tieguanyin", "Longjing", "Green tea"],
    ritualName: "One-Cup Focus Ritual",
    ritualSteps: [
      "For three minutes, do only one thing: drink tea.",
      "No phone, no messages, no multitasking.",
      "Notice colour, aroma, temperature, and aftertaste."
    ],
    product: "Focus Tea Set"
  },
  mian: {
    key: "mian",
    character: "眠",
    chineseName: "養息者",
    englishName: "The Rested One",
    need: "Rest, softness, evening rhythm.",
    quickRead: "Your body's tired, but your mind hasn't been given permission to slow down yet.",
    interpretation:
      "Your body may already be tired, but your mind may not have received permission to slow down. 眠 appears when the day needs a softer closing gesture. A gentle tea ritual can support wind-down by marking the boundary between doing and resting.",
    teaFeeling: "Deep blue, warm white, soft evening feeling.",
    currentState:
      "You may feel tired or overstimulated at night, with your body asking for softness while the mind keeps moving.",
    strengths: ["Responsible", "Attuned to subtle comfort", "Able to build rituals that protect your energy"],
    watchOuts: ["Turning rest into another task", "Scrolling through the transition into night", "Choosing intensity when softness is needed"],
    teas: ["White tea", "Aged white tea", "Ripe pu-erh", "Low-caffeine herbal blend", "Chenpi white tea"],
    ritualName: "Evening Wind-Down Ritual",
    ritualSteps: [
      "Thirty to sixty minutes before sleep, put your phone aside.",
      "Prepare a gentle tea.",
      "Smell slowly, breathe slowly, and let the day close."
    ],
    product: "Evening Calm Tea Box"
  },
  fang: {
    key: "fang",
    character: "放",
    chineseName: "舒展者",
    englishName: "The Releasing One",
    need: "Release, openness, emotional movement.",
    quickRead: "You're still functioning well, but your body is holding tension you haven't let go of.",
    interpretation:
      "You may have been holding more than you realise, even while moving through life well. 放 appears when the body and emotions want room to loosen, breathe, and move again. A floral, aromatic tea can support relaxation by making release feel natural rather than forced.",
    teaFeeling: "Soft amber, floral, breathable, relaxed feeling.",
    currentState:
      "You may be carrying tension in the body or emotion, even when you are still functioning well on the outside.",
    strengths: ["Expressive", "Creative", "Able to sense what wants to move"],
    watchOuts: ["Holding pressure until it sharpens", "Confusing release with escape", "Forgetting the body while managing the mind"],
    teas: ["Floral oolong", "Phoenix dancong", "Jasmine green tea", "Light white tea", "Osmanthus oolong"],
    ritualName: "Breathe and Release Ritual",
    ritualSteps: [
      "Inhale with the aroma.",
      "Exhale after each sip.",
      "Relax your shoulders, jaw, and hands.",
      "Silently say, \"I do not need to solve everything right now.\""
    ],
    product: "Relaxation Tea Ritual Box"
  },
  qing: {
    key: "qing",
    character: "清",
    chineseName: "觀照者",
    englishName: "The Clear One",
    need: "Clarity, self-understanding, inner direction.",
    quickRead: "You're not lost — you're just due for a clearer view.",
    interpretation:
      "You may not need more noise, advice, or answers right now. 清 appears when your inner world is asking for a quieter vantage point, so meaning can settle into view. Tea is not the answer itself; it is a mirror that helps reveal what truly matters.",
    teaFeeling: "Ink black, antique gold, mountain stone, cultural depth.",
    currentState:
      "You may feel mentally cloudy, reflective, or quietly aware that your next direction deserves more space.",
    strengths: ["Insightful", "Reflective", "Drawn to meaning, story, and depth"],
    watchOuts: ["Thinking so deeply that movement pauses", "Searching for perfect certainty", "Letting ambiguity become heaviness"],
    teas: ["Raw pu-erh", "Yancha", "Aged tea", "Collectible oolong", "Cultural story tea"],
    ritualName: "Two-Cup Reflection Ritual",
    ritualSteps: [
      "After the first cup, write: \"What do I need to let go of?\"",
      "After the second cup, write: \"What direction do I truly want to move toward?\""
    ],
    product: "Lifetime Tea Box"
  }
};

// Free quick-read: 6 present-moment questions on energy and tension, scored
// into the same five Tea-Mind rhythms used by the full (unlocked) report.
const questions: AssessmentQuestion[] = [
  {
    id: "energy",
    question: "Right now, my energy feels...",
    options: [
      { label: "Heavy, like I'm quietly carrying too much", result: "an" },
      { label: "Scattered, too many tabs open", result: "ding" },
      { label: "Tired, but I can't fully wind down", result: "mian" },
      { label: "Tense, wound up in my body", result: "fang" },
      { label: "Foggy, like something needs thinking through", result: "qing" }
    ]
  },
  {
    id: "forecast",
    question: "If today had a weather forecast, it'd be...",
    options: [
      { label: "Overcast and unsettled", result: "an" },
      { label: "Fast-moving, lots happening", result: "ding" },
      { label: "Late and heavy, evening fog", result: "mian" },
      { label: "Pressure building, storm coming", result: "fang" },
      { label: "Hazy, waiting to clear", result: "qing" }
    ]
  },
  {
    id: "body",
    question: "Right now, your body is asking for...",
    options: [
      { label: "A place to feel steady", result: "an" },
      { label: "A clean, focused start", result: "ding" },
      { label: "Permission to slow down", result: "mian" },
      { label: "Room to breathe and let go", result: "fang" },
      { label: "Quiet, to think clearly", result: "qing" }
    ]
  },
  {
    id: "stress",
    question: "When stress shows up, you tend to...",
    options: [
      { label: "Keep it inside, quietly", result: "an" },
      { label: "Try to plan and solve it fast", result: "ding" },
      { label: "Feel tired and want to escape", result: "mian" },
      { label: "Feel it rise in your body", result: "fang" },
      { label: "Start thinking about the deeper reason", result: "qing" }
    ]
  },
  {
    id: "help",
    question: "What would help you most right now?",
    options: [
      { label: "Feeling grounded again", result: "an" },
      { label: "A clear, steady rhythm", result: "ding" },
      { label: "Real rest", result: "mian" },
      { label: "Releasing tension", result: "fang" },
      { label: "Understanding your next step", result: "qing" }
    ]
  },
  {
    id: "tea-mood",
    question: "Which tea mood pulls you in tonight?",
    options: [
      { label: "Warm, mellow, grounding", result: "an" },
      { label: "Clean, bright, alert", result: "ding" },
      { label: "Soft, gentle, low-key", result: "mian" },
      { label: "Floral, open, easy", result: "fang" },
      { label: "Deep, layered, contemplative", result: "qing" }
    ]
  }
];

type QuizPhase = "intro" | "question" | "loading" | "result";

type QuizResult = {
  scores: Record<ResultKey, number>;
  primary: ResultProfile;
  secondary: ResultProfile;
  blended: boolean;
};

function calculateResult(answers: ResultKey[]): QuizResult {
  const scores = resultOrder.reduce(
    (current, key) => ({ ...current, [key]: 0 }),
    {} as Record<ResultKey, number>
  );

  answers.forEach((answer) => {
    scores[answer] += 2;
  });

  const [primaryKey, secondaryKey] = [...resultOrder].sort((a, b) => scores[b] - scores[a]);

  return {
    scores,
    primary: resultProfiles[primaryKey],
    secondary: resultProfiles[secondaryKey],
    blended: scores[primaryKey] - scores[secondaryKey] <= 2
  };
}

function formatProfileName(profile: ResultProfile) {
  return `${profile.character} | ${profile.chineseName} | ${profile.englishName}`;
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ResultKey[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [unlocked, setUnlocked] = useState(false);
  const currentQuestion = questions[currentIndex];
  const progress = phase === "intro" ? 0 : Math.min((answers.length / questions.length) * 100, 100);
  const result = useMemo(() => calculateResult(answers), [answers]);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const loadingTimer = window.setTimeout(() => {
      setPhase("result");
    }, 1200);

    return () => window.clearTimeout(loadingTimer);
  }, [phase]);

  // A visitor is "unlocked" if they've paid before (flagged in localStorage)
  // or if they've just returned from checkout with ?unlocked=true in the URL
  // (set this as the Shopify order-status redirect once the store is connected).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromCheckout = params.get("unlocked") === "true";
      const stored = window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";

      if (fromCheckout) {
        window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
      }

      setUnlocked(fromCheckout || stored);
    } catch {
      // Private browsing or storage disabled: default to locked, no crash.
    }
  }, []);

  function handleStart() {
    setAnswers([]);
    setCurrentIndex(0);
    setSaveState("idle");
    setPhase("question");
  }

  function handleAnswer(resultKey: ResultKey) {
    setSaveState("idle");
    const nextAnswers = [...answers.slice(0, currentIndex), resultKey];
    setAnswers(nextAnswers);

    if (currentIndex >= questions.length - 1) {
      setPhase("loading");
      return;
    }

    window.setTimeout(() => {
      setCurrentIndex((index) => index + 1);
    }, 180);
  }

  function handleRestart() {
    setAnswers([]);
    setCurrentIndex(0);
    setSaveState("idle");
    setPhase("intro");
  }

  async function handleSaveResult() {
    const scoreLines = resultOrder
      .map((key) => `${resultProfiles[key].character} ${resultProfiles[key].chineseName}: ${result.scores[key]}`)
      .join("\n");
    const resultText = [
      `Chazen Tea-Mind Personality: ${formatProfileName(result.primary)}`,
      `Secondary rhythm: ${formatProfileName(result.secondary)}`,
      "",
      result.primary.interpretation,
      "",
      `Current state: ${result.primary.currentState}`,
      `Recommended teas: ${result.primary.teas.join(", ")}`,
      `Recommended Chazen product: ${result.primary.product}`,
      "",
      "Score distribution:",
      scoreLines
    ].join("\n");

    try {
      const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chazen-tea-mind-result-${result.primary.key}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fall back to clipboard below if a file download isn't available in this environment.
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resultText);
      }
    } catch {
      // The result remains visible even if clipboard permissions are unavailable.
    }

    setSaveState("saved");
  }

  const ctaHref = buildInquiryPath({
    basePath,
    type: "Tea recommendation",
    message: `I completed the Chazen AI Tea Test. My Tea-Mind Personality is ${formatProfileName(
      result.primary
    )}. I would like to learn more about the ${result.primary.product}.`,
    source: "Chazen AI Tea Test"
  });
  // Once UNLOCK_CHECKOUT_URL is set to a real Shopify checkout link, the unlock
  // button charges A$25 and bundles the First Pack tea. Until then it falls back
  // to the same working email-inquiry flow used by the rest of the site.
  const unlockHref =
    UNLOCK_CHECKOUT_URL ||
    buildInquiryPath({
      basePath,
      type: "Tea recommendation",
      message: `I completed the Chazen AI Tea Test. My quick read is ${formatProfileName(
        result.primary
      )}. I'd like to unlock my full Tea-Mind report and get the First Pack (A$25).`,
      source: "Chazen AI Tea Test — report unlock"
    });
  const routeHref = (path: string) => `${basePath}${path}`;

  return (
    <main className="assessment-page tea-mind-page">
      <section className="assessment-hero tea-mind-hero" aria-labelledby="assessment-title">
        <Image
          src={`${basePath}/images/chazen-hero-gongfu-room-v3.png`}
          alt="A quiet Chinese tea room prepared for a reflective tea assessment."
          fill
          priority
          sizes="100vw"
        />
        <div className="assessment-hero-shade tea-mind-hero-shade" />
        <div className="assessment-hero-inner tea-mind-hero-inner">
          <p className="museum-kicker">Chazen AI Tea Test / 茶心測試</p>
          <h1 id="assessment-title">How are you, right now?</h1>
          <p>
            Six quick questions on your energy and tension today. Free instantly: which of 安, 定, 眠, 放, or 清
            you're closest to, and the tea suited to tonight. Unlock the full Tea-Mind report for the rest.
          </p>
          <div className="tea-mind-character-rail" aria-label="Tea-Mind result types">
            {resultOrder.map((key) => (
              <span key={key}>
                <strong>{resultProfiles[key].character}</strong>
                <em>{resultProfiles[key].englishName}</em>
              </span>
            ))}
          </div>
          <p className="tea-mind-disclaimer">
            This is not a fixed personality label. It reflects your current inner rhythm.
          </p>
          <div className="assessment-hero-meta">
            <span>6 Questions · 2 Minutes</span>
            <span>Free Quick Read</span>
            <span>A$25 Full Report + Tea</span>
          </div>
          <button type="button" className="tea-mind-start-button" onClick={handleStart}>
            Start My Tea Test
            <span lang="zh-Hant">開始我的茶心測試</span>
          </button>
        </div>
      </section>

      <section className="museum-section tea-mind-room" aria-label="Tea-Mind assessment">
        <div className="museum-container tea-mind-shell">
          <div className="tea-mind-progress" aria-label="Assessment progress">
            <div>
              <span>{phase === "intro" ? "Before first sip" : `${Math.min(answers.length + 1, questions.length)} / ${questions.length}`}</span>
              <strong>
                {phase === "result"
                  ? "Result revealed"
                  : phase === "loading"
                    ? "Reading your rhythm"
                    : "Tea-Mind Assessment"}
              </strong>
            </div>
            <div className="assessment-progress-track tea-mind-progress-track" aria-hidden="true">
              <span style={{ width: `${phase === "result" ? 100 : progress}%` }} />
            </div>
          </div>

          {phase === "intro" && (
            <section className="tea-mind-intro-panel" aria-label="Assessment introduction">
              <div className="tea-mind-oracle-character" aria-hidden="true">
                茶
              </div>
              <p className="museum-kicker">A quiet check-in, not a quick quiz</p>
              <h2>Begin with the rhythm you are living in today.</h2>
              <p>
                Six questions, about two minutes. This test listens for five Tea-Mind rhythms: 安 for
                grounding, 定 for focus, 眠 for wind-down, 放 for release, and 清 for clarity. You'll get
                your rhythm and a tea suited to tonight for free — unlock the full report for strengths,
                watch-outs, and a personal ritual.
              </p>
              <div className="tea-mind-type-grid" aria-label="Five Tea-Mind personalities">
                {resultOrder.map((key) => (
                  <article key={key}>
                    <strong>{resultProfiles[key].character}</strong>
                    <span>{resultProfiles[key].chineseName}</span>
                    <em>{resultProfiles[key].need}</em>
                  </article>
                ))}
              </div>
              <button type="button" className="tea-mind-primary-action" onClick={handleStart}>
                Start My Tea Test
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </section>
          )}

          {phase === "question" && (
            <fieldset key={currentQuestion.id} className="tea-mind-question-panel">
              <legend>
                <span>Question {currentIndex + 1}</span>
                <strong>{currentQuestion.question}</strong>
              </legend>
              <div className="tea-mind-options">
                {currentQuestion.options.map((option) => {
                  const selected = answers[currentIndex] === option.result;

                  return (
                    <button
                      type="button"
                      key={`${currentQuestion.id}-${option.result}`}
                      className={selected ? "is-selected" : ""}
                      onClick={() => handleAnswer(option.result)}
                    >
                      <span className="tea-mind-option-mark">{resultProfiles[option.result].character}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {phase === "loading" && (
            <section className="tea-mind-loading" aria-live="polite">
              <div className="tea-mind-loading-cup" aria-hidden="true">
                <Loader2 size={28} />
                <span />
              </div>
              <span lang="zh-Hant">茶湯漸定，你的茶心人格正在浮現。</span>
              <h2>Preparing your tea reading...</h2>
              <p>The tea is settling. Your result is taking shape.</p>
            </section>
          )}

          {phase === "result" && (
            <section className={`tea-mind-result tea-mind-tone-${result.primary.key}`} aria-live="polite">
              <div className="tea-mind-result-hero">
                <span className="tea-mind-result-character" aria-hidden="true">
                  {result.primary.character}
                </span>
                <div>
                  <p className="museum-kicker">Your quick read &middot; free</p>
                  <h2>
                    {result.primary.character}｜{result.primary.chineseName}
                  </h2>
                  <h3>{result.primary.englishName}</h3>
                  <p>{result.primary.quickRead}</p>
                  <p className="tea-mind-tone-line">{result.primary.teaFeeling}</p>
                </div>
              </div>

              <article className="tea-mind-quick-tea">
                <span>Suited to you right now</span>
                <strong>{result.primary.teas[0]}</strong>
              </article>

              {unlocked ? (
                <>
                  <p className="tea-mind-full-interpretation">{result.primary.interpretation}</p>

                  {result.blended && (
                    <p className="tea-mind-blend-note">
                      Your result shows a blended Tea-Mind profile. Your primary rhythm is{" "}
                      {result.primary.character}｜{result.primary.chineseName}, but{" "}
                      {result.secondary.character}｜{result.secondary.chineseName} is also strongly present.
                    </p>
                  )}

                  <div className="tea-mind-result-grid">
                    <article>
                      <span>Current State</span>
                      <p>{result.primary.currentState}</p>
                    </article>
                    <article>
                      <span>Core Need</span>
                      <p>{result.primary.need}</p>
                    </article>
                    <article>
                      <span>Secondary Personality</span>
                      <p>{formatProfileName(result.secondary)}</p>
                    </article>
                  </div>

                  <div className="tea-mind-detail-grid">
                    <article>
                      <h4>Strengths</h4>
                      <ul>
                        {result.primary.strengths.map((strength) => (
                          <li key={strength}>{strength}</li>
                        ))}
                      </ul>
                    </article>
                    <article>
                      <h4>Watch-Out Points</h4>
                      <ul>
                        {result.primary.watchOuts.map((watchOut) => (
                          <li key={watchOut}>{watchOut}</li>
                        ))}
                      </ul>
                    </article>
                    <article>
                      <h4>Recommended Teas</h4>
                      <ul>
                        {result.primary.teas.map((tea) => (
                          <li key={tea}>{tea}</li>
                        ))}
                      </ul>
                    </article>
                    <article>
                      <h4>{result.primary.ritualName}</h4>
                      <ol>
                        {result.primary.ritualSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </article>
                  </div>

                  <article className="tea-mind-score-panel">
                    <h4>Score Distribution</h4>
                    <div className="tea-mind-score-list">
                      {resultOrder.map((key) => {
                        const profile = resultProfiles[key];
                        const score = result.scores[key];

                        return (
                          <div key={key} className="tea-mind-score-row">
                            <span>
                              {profile.character} {profile.chineseName}
                            </span>
                            <div className="tea-mind-score-track" aria-hidden="true">
                              <span style={{ width: `${(score / (questions.length * 2)) * 100}%` }} />
                            </div>
                            <strong>{score}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </>
              ) : (
                <div className="tea-mind-locked" aria-label="Full Tea-Mind report, locked">
                  <div className="tea-mind-locked-preview" aria-hidden="true">
                    <p>Your full Tea-Mind report</p>
                    <div className="tea-mind-locked-grid">
                      <span>Strengths</span>
                      <span>Watch-out points</span>
                      <span>{result.primary.ritualName}</span>
                      <span>Score breakdown</span>
                    </div>
                  </div>
                  <div className="tea-mind-locked-overlay">
                    <Lock size={20} aria-hidden="true" />
                    <p>
                      Unlock your full report, strengths, {result.primary.ritualName.toLowerCase()}, and a starter
                      tea matched to tonight.
                    </p>
                    <span>A$25 &middot; includes First Pack tea</span>
                    <a href={unlockHref} className="tea-mind-unlock-button">
                      Unlock my report
                    </a>
                  </div>
                </div>
              )}

              <div className="tea-mind-product-panel">
                <div>
                  <span>Recommended Chazen Product</span>
                  <strong>{result.primary.product}</strong>
                  <p>Based on your Tea-Mind result, this tea box may support your current rhythm.</p>
                </div>
                <div className="tea-mind-result-actions">
                  <a href={ctaHref}>
                    Explore My Recommended Tea Box
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <button type="button" onClick={handleSaveResult}>
                    {saveState === "saved" ? <Check size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
                    {saveState === "saved" ? "Result Saved" : "Save My Result"}
                  </button>
                  <button type="button" onClick={handleRestart}>
                    <RotateCcw size={16} aria-hidden="true" />
                    Restart Test
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="chazen-subpage-cta">
        <div className="chazen-subpage-container">
          <div>
            <p className="chazen-subpage-eyebrow">Next step</p>
            <h2 lang="zh-Hant">讓茶測試成為旅程的起點</h2>
            <p>Start with your current state, then continue into ritual and the box that fits your rhythm.</p>
          </div>
          <div className="chazen-subpage-actions">
            <a href={routeHref("/tea-test")} className="chazen-subpage-button chazen-subpage-button-primary">
              Start My Tea Test <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={routeHref("/tea-ritual")} className="chazen-subpage-button">
              Explore Tea Ritual
            </a>
            <a href={routeHref("/tea-boxes")} className="chazen-subpage-button">
              Tea Boxes
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
