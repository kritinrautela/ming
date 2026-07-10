"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Download, Loader2, Lock, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";

// Set this once the Chazen Shopify store is connected: the checkout URL for
// the First Pack (A$25) product, which is what unlocking the full Tea-Mind
// report is bundled with. Until it's set, the unlock button falls back to
// the same email-inquiry flow already used elsewhere on the site.
const UNLOCK_CHECKOUT_URL = "";
const UNLOCK_STORAGE_KEY = "chazen-tea-mind-report-unlocked";

// Set this to a real form endpoint (Formspree, or any service that accepts a
// plain POST) once one is set up, and this actually starts building an email
// list. Until then, the email step still gates the result — it just doesn't
// save the address anywhere.
const EMAIL_CAPTURE_ENDPOINT = "";
const EMAIL_STORAGE_KEY = "chazen-tea-mind-email-captured";

type ResultKey = "qixu" | "yinxu" | "qiyu" | "tanshi";

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
  pinyin: string;
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

// Inspired by simplified Traditional Chinese Medicine body-constitution
// patterns (體質). Framed for reflection and lifestyle inspiration, not
// medical diagnosis — see the disclaimer shown alongside every result.
const resultOrder: ResultKey[] = ["qixu", "yinxu", "qiyu", "tanshi"];

const resultProfiles: Record<ResultKey, ResultProfile> = {
  qixu: {
    key: "qixu",
    character: "虛",
    chineseName: "氣虛",
    pinyin: "qì xū",
    englishName: "Running Low",
    need: "Rebuilding energy, gently.",
    quickRead: "You're not lazy — you're running on a reserve tank.",
    interpretation:
      "In traditional Chinese wellness terms, this pattern is close to 氣虛 (qì xū), or qi deficiency — when the body's working energy runs low and even ordinary things start to feel effortful. This isn't a diagnosis; it's a familiar pattern for anyone stretched thin for too long. A warming, easily-digested tea can help rebuild reserves rather than spend more of what's left.",
    teaFeeling: "Warm brown, soft steam, an easy first sip.",
    currentState:
      "You may tire more easily than usual, catch colds more often, or feel your motivation thinning by late afternoon.",
    strengths: ["Deeply attuned to your own limits", "Careful and considered rather than reckless", "Good at conserving what matters, once you notice the pattern"],
    watchOuts: ["Pushing through tiredness instead of resting early", "Skipping meals when busy, which drains reserves further", "Mistaking rest for laziness"],
    teas: ["Roasted oolong", "Aged white tea", "Ripe pu-erh", "Red date and longan blend"],
    ritualName: "Rebuild Ritual",
    ritualSteps: [
      "Warm the cup before pouring — let your hands feel it first.",
      "Drink slowly, in a seated, unhurried posture.",
      "After the last sip, name one thing you'll do less of today."
    ],
    product: "Starter Tea Box"
  },
  yinxu: {
    key: "yinxu",
    character: "陰",
    chineseName: "陰虛",
    pinyin: "yīn xū",
    englishName: "Tired but Wired",
    need: "Cooling down a mind that won't switch off.",
    quickRead: "Your body's tired, but nobody told your mind to stop.",
    interpretation:
      "This pattern is close to what's traditionally called 陰虛 (yīn xū), or yin deficiency — a kind of depleted restlessness, where the body wants rest but runs a little hot and wired instead of settling. It often shows up as difficulty winding down at night even when you're exhausted. A cooling, low-caffeine tea can support the transition into rest instead of fighting it.",
    teaFeeling: "Pale gold, cool steam, a quiet aftertaste.",
    currentState:
      "You may feel warm or restless in the evening, wake up during the night, or notice your thoughts speeding up right when your body wants to slow down.",
    strengths: ["Responsible and rarely lets things drop", "Sensitive to your own internal signals, even if you override them", "Capable of real stillness once you actually arrive there"],
    watchOuts: ["Scrolling through the transition into night instead of winding down", "Caffeine or stimulation too late in the day", "Treating rest as another thing to optimize"],
    teas: ["White tea", "Aged white tea", "Low-caffeine herbal blend", "Chrysanthemum white tea"],
    ritualName: "Evening Cooling Ritual",
    ritualSteps: [
      "Thirty minutes before bed, put the phone in another room.",
      "Prepare a low-caffeine or herbal tea.",
      "Drink slowly in dim light, and let your exhale get longer than your inhale."
    ],
    product: "Evening Calm Tea Box"
  },
  qiyu: {
    key: "qiyu",
    character: "鬱",
    chineseName: "氣鬱",
    pinyin: "qì yù",
    englishName: "Held Tension",
    need: "Releasing what's being held instead of said.",
    quickRead: "You're still functioning well — but your body's been holding tension your schedule hasn't had room for.",
    interpretation:
      "This pattern echoes 氣鬱 (qì yù), or qi stagnation — where emotional or physical tension gets held rather than moved through, often while you're still outwardly coping fine. It can show up as tightness in the chest or shoulders, a shorter temper, or a sigh you don't notice you're making. A floral, aromatic tea can support release by making it feel natural rather than forced.",
    teaFeeling: "Soft amber, floral lift, an open exhale.",
    currentState:
      "You may notice tension in your shoulders or jaw, feel more irritable than usual, or catch yourself sighing without meaning to.",
    strengths: ["Expressive once given the room", "Sensitive to what needs to shift, even before you can name it", "Able to move tension out through the body, not just the mind"],
    watchOuts: ["Holding pressure until it sharpens into irritation", "Skipping movement or fresh air when busy", "Trying to think your way through what the body needs to release"],
    teas: ["Jasmine green tea", "Phoenix dancong", "Floral oolong", "Osmanthus oolong"],
    ritualName: "Breathe and Release Ritual",
    ritualSteps: [
      "Inhale slowly with the aroma before the first sip.",
      "Exhale fully after each sip — longer than the inhale.",
      "Roll your shoulders back once, and let your jaw unclench."
    ],
    product: "Relaxation Tea Ritual Box"
  },
  tanshi: {
    key: "tanshi",
    character: "濕",
    chineseName: "痰濕",
    pinyin: "tán shī",
    englishName: "Foggy & Heavy",
    need: "Clearing fog, lifting weight.",
    quickRead: "Nothing's technically wrong — you're just moving through fog today.",
    interpretation:
      "This pattern is close to 痰濕 (tán shī), sometimes translated as dampness — a heavy, sluggish quality where the body and mind feel weighed down and motivation is hard to locate. It's common after too many disrupted routines or too little movement. A bright, clean tea can help cut through the fog rather than add to the heaviness.",
    teaFeeling: "Bright green, clean lift, a light finish.",
    currentState:
      "You may feel physically heavy, mentally cloudy, or find it hard to start things even when you have the time.",
    strengths: ["Steady and low-drama under the surface", "Good at noticing when something needs to change, even if starting is hard", "Capable of real clarity once the fog lifts"],
    watchOuts: ["Staying still when movement is what would actually help", "Heavy meals or screens instead of fresh air", "Waiting to feel motivated before starting anything"],
    teas: ["High mountain oolong", "Longjing", "Raw pu-erh", "Green tea"],
    ritualName: "Clear the Fog Ritual",
    ritualSteps: [
      "Open a window or step outside before your first sip.",
      "Drink standing or walking, not sitting still.",
      "Notice one small thing you can start today — not finish, just start."
    ],
    product: "Focus Tea Set"
  }
};

// Free quick-read: 6 plain body-signal questions (energy, temperature,
// sleep, stress response, digestion, and today's need), scored into four
// simplified TCM-inspired patterns. Deliberately not poetic or mystical —
// these read like a short wellness check-in, not a personality quiz.
const questions: AssessmentQuestion[] = [
  {
    id: "energy",
    question: "How's your energy level most days lately?",
    options: [
      { label: "Low — I tire quickly", result: "qixu" },
      { label: "Fine in the day, but I can't wind down at night", result: "yinxu" },
      { label: "Okay, but I feel tight or on edge", result: "qiyu" },
      { label: "Sluggish and foggy — hard to get going", result: "tanshi" }
    ]
  },
  {
    id: "temperature",
    question: "Do you run hot or cold?",
    options: [
      { label: "I get cold easily, especially hands and feet", result: "qixu" },
      { label: "I run warm at night and sleep restlessly", result: "yinxu" },
      { label: "Depends on my stress levels that day", result: "qiyu" },
      { label: "Neither — I feel heavy and damp more than hot or cold", result: "tanshi" }
    ]
  },
  {
    id: "sleep",
    question: "How's your sleep been?",
    options: [
      { label: "I fall asleep fine but wake up tired", result: "qixu" },
      { label: "Hard to switch my mind off at night", result: "yinxu" },
      { label: "I lie there thinking about everything I'm holding onto", result: "qiyu" },
      { label: "I sleep plenty but never feel rested", result: "tanshi" }
    ]
  },
  {
    id: "stress-response",
    question: "When you're stressed, what happens in your body?",
    options: [
      { label: "I just feel drained, like I have nothing left", result: "qixu" },
      { label: "I feel wired and restless, can't settle", result: "yinxu" },
      { label: "Tightness in my chest or shoulders, sometimes a sigh", result: "qiyu" },
      { label: "I want to shut down and do nothing", result: "tanshi" }
    ]
  },
  {
    id: "digestion",
    question: "How's your appetite and digestion lately?",
    options: [
      { label: "Small appetite, low energy after eating", result: "qixu" },
      { label: "Fine, but I get thirsty and crave cool drinks", result: "yinxu" },
      { label: "Comes and goes with my stress levels", result: "qiyu" },
      { label: "Heavy and bloated after meals", result: "tanshi" }
    ]
  },
  {
    id: "today-needs",
    question: "What does today actually need from you?",
    options: [
      { label: "Permission to rest without guilt", result: "qixu" },
      { label: "A way to actually switch off", result: "yinxu" },
      { label: "Somewhere to put this tension", result: "qiyu" },
      { label: "A clear head and a reason to move", result: "tanshi" }
    ]
  }
];

type QuizPhase = "intro" | "question" | "loading" | "email" | "result";

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
  return `${profile.chineseName} (${profile.pinyin}) | ${profile.englishName}`;
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ResultKey[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [unlocked, setUnlocked] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const currentQuestion = questions[currentIndex];
  const progress = phase === "intro" ? 0 : Math.min((answers.length / questions.length) * 100, 100);
  const result = useMemo(() => calculateResult(answers), [answers]);

  useEffect(() => {
    try {
      setEmailCaptured(window.localStorage.getItem(EMAIL_STORAGE_KEY) === "true");
    } catch {
      // Private browsing or storage disabled: default to not-yet-captured.
    }
  }, []);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const loadingTimer = window.setTimeout(() => {
      // Returning visitors who already gave an email skip straight to the result.
      setPhase(emailCaptured ? "result" : "email");
    }, 1200);

    return () => window.clearTimeout(loadingTimer);
  }, [phase, emailCaptured]);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      setEmailError("Enter a valid email to see your reading.");
      return;
    }

    setEmailError("");

    if (EMAIL_CAPTURE_ENDPOINT) {
      try {
        await fetch(EMAIL_CAPTURE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, source: "Chazen wellness check-in" })
        });
      } catch {
        // Don't block the result if the capture request fails.
      }
    }

    try {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, "true");
    } catch {
      // Private browsing or storage disabled: the gate still passes this session.
    }

    setEmailCaptured(true);
    setPhase("result");
  }

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
            Six plain questions about your energy, sleep, and tension today — inspired by traditional Chinese
            wellness patterns, not a personality quiz. Free instantly: your pattern and the tea suited to
            tonight. Unlock the full report for the rest.
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
            Inspired by traditional Chinese wellness philosophy, for reflection and lifestyle inspiration —
            not a medical diagnosis.
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
                  : phase === "email"
                    ? "Almost there"
                    : phase === "loading"
                      ? "Reading your pattern"
                      : "Wellness Check-In"}
              </strong>
            </div>
            <div className="assessment-progress-track tea-mind-progress-track" aria-hidden="true">
              <span style={{ width: `${phase === "result" || phase === "email" ? 100 : progress}%` }} />
            </div>
          </div>

          {phase === "intro" && (
            <section className="tea-mind-intro-panel" aria-label="Assessment introduction">
              <div className="tea-mind-oracle-character" aria-hidden="true">
                茶
              </div>
              <p className="museum-kicker">A quiet check-in, not a quick quiz</p>
              <h2>Begin with how your body feels today.</h2>
              <p>
                Six plain questions on energy, sleep, and tension — no poetry, just how you actually feel.
                Your answers map to a simplified pattern from traditional Chinese wellness philosophy:{" "}
                氣虛 running low, 陰虛 tired but wired, 氣鬱 held tension, or 痰濕 foggy and heavy. You'll get
                your pattern and a tea suited to tonight for free — unlock the full report for strengths,
                watch-outs, and a personal ritual.
              </p>
              <div className="tea-mind-type-grid" aria-label="Four wellness patterns">
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
              <span lang="zh-Hant">茶湯漸定，你的結果正在浮現。</span>
              <h2>Reading your pattern...</h2>
              <p>Almost there.</p>
            </section>
          )}

          {phase === "email" && (
            <section className="tea-mind-email-gate" aria-label="Email to reveal your result">
              <p className="museum-kicker">One last thing</p>
              <h2>Where should we send your reading?</h2>
              <p>
                Your pattern is ready. Leave your email to reveal it — we'll also use it to send tea notes
                and the occasional offer. No spam, unsubscribe any time.
              </p>
              <form onSubmit={handleEmailSubmit} className="tea-mind-email-form" noValidate>
                <label htmlFor="tea-mind-email">
                  Email
                  <input
                    id="tea-mind-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "tea-mind-email-error" : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError("");
                    }}
                  />
                </label>
                {emailError && (
                  <span id="tea-mind-email-error" className="tea-mind-email-error">
                    {emailError}
                  </span>
                )}
                <button type="submit" className="tea-mind-primary-action">
                  Reveal my reading
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>
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
                    {result.primary.chineseName} <small>({result.primary.pinyin})</small>
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
                      Your result shows a blended pattern. Your primary reading is {result.primary.chineseName}{" "}
                      ({result.primary.pinyin}), but {result.secondary.chineseName} ({result.secondary.pinyin})
                      is also strongly present.
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

              {unlocked && (
                <div className="tea-mind-membership-upsell">
                  <div>
                    <span>Keep your rhythm going</span>
                    <strong>Chazen Membership</strong>
                    <p>Monthly tea prompts and rituals matched to how you're doing, not just a one-off box.</p>
                  </div>
                  <a href={routeHref("/#membership")}>
                    See membership options
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              )}
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
