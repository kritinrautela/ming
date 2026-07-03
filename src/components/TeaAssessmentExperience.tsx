"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Download, Loader2, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";

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

const questions: AssessmentQuestion[] = [
  {
    id: "improve",
    question: "Recently, what do you most want to improve?",
    options: [
      { label: "I want to feel more settled", result: "an" },
      { label: "I want to improve my focus", result: "ding" },
      { label: "I want to relax better before sleep", result: "mian" },
      { label: "I want to release stress and emotions", result: "fang" },
      { label: "I want to understand my direction more clearly", result: "qing" }
    ]
  },
  {
    id: "state",
    question: "Which sentence best describes your current state?",
    options: [
      { label: "I look fine outside, but inside I feel unsettled", result: "an" },
      { label: "My mind is busy and hard to focus", result: "ding" },
      { label: "I feel tired, but I do not fully slow down at night", result: "mian" },
      { label: "My body or emotions feel tense", result: "fang" },
      { label: "I keep thinking about what my next step should be", result: "qing" }
    ]
  },
  {
    id: "feeling",
    question: "Which feeling appears most often recently?",
    options: [
      { label: "Insecurity", result: "an" },
      { label: "Mental overload", result: "ding" },
      { label: "Tiredness", result: "mian" },
      { label: "Irritation or pressure", result: "fang" },
      { label: "Confusion or uncertainty", result: "qing" }
    ]
  },
  {
    id: "stress",
    question: "When stress comes, what do you usually do?",
    options: [
      { label: "I keep it inside and do not want others to notice", result: "an" },
      { label: "I immediately try to plan and solve it", result: "ding" },
      { label: "I feel tired and want to escape for a while", result: "mian" },
      { label: "My emotions rise, but I may not express them", result: "fang" },
      { label: "I start thinking deeply about the reason and meaning", result: "qing" }
    ]
  },
  {
    id: "need",
    question: "What do you feel you need to improve most?",
    options: [
      { label: "Trusting myself more", result: "an" },
      { label: "Executing with more consistency", result: "ding" },
      { label: "Resting better", result: "mian" },
      { label: "Expressing and releasing more naturally", result: "fang" },
      { label: "Understanding my true direction", result: "qing" }
    ]
  },
  {
    id: "friends",
    question: "How might your friends describe you?",
    options: [
      { label: "Sensitive, thoughtful, caring", result: "an" },
      { label: "Goal-oriented, hardworking, disciplined", result: "ding" },
      { label: "Responsible, but sometimes too tired", result: "mian" },
      { label: "Emotional, expressive, creative", result: "fang" },
      { label: "Deep-thinking, insightful, reflective", result: "qing" }
    ]
  },
  {
    id: "tea-time",
    question: "When do you most need tea during the day?",
    options: [
      { label: "When my heart feels unsettled", result: "an" },
      { label: "Before work or study", result: "ding" },
      { label: "After dinner or before sleep", result: "mian" },
      { label: "When I feel stressed and need to loosen up", result: "fang" },
      { label: "When I am alone and thinking", result: "qing" }
    ]
  },
  {
    id: "scene",
    question: "What is your ideal tea scene?",
    options: [
      { label: "Sitting quietly and returning to myself", result: "an" },
      { label: "Taking a three-minute break to refocus", result: "ding" },
      { label: "Ending the day under soft evening light", result: "mian" },
      { label: "Smelling a comforting aroma and relaxing my body", result: "fang" },
      { label: "Drinking tea while thinking about life and direction", result: "qing" }
    ]
  },
  {
    id: "rhythm",
    question: "Which rhythm do you lack most right now?",
    options: [
      { label: "Grounding", result: "an" },
      { label: "Focus", result: "ding" },
      { label: "Rest", result: "mian" },
      { label: "Relaxation", result: "fang" },
      { label: "Clarity", result: "qing" }
    ]
  },
  {
    id: "tea-type",
    question: "Which type of tea sounds most appealing?",
    options: [
      { label: "Warm, mellow, and grounding", result: "an" },
      { label: "Clean, fragrant, and refreshing", result: "ding" },
      { label: "Soft, gentle, and low-stimulation", result: "mian" },
      { label: "Floral, open, and expressive", result: "fang" },
      { label: "Layered, deep, and story-rich", result: "qing" }
    ]
  },
  {
    id: "tea-feeling",
    question: "What feeling do you want tea to give you?",
    options: [
      { label: "Warmth and support", result: "an" },
      { label: "Alertness and focus", result: "ding" },
      { label: "Softness and slowing down", result: "mian" },
      { label: "Openness and flow", result: "fang" },
      { label: "Depth and aftertaste", result: "qing" }
    ]
  },
  {
    id: "caffeine",
    question: "How do you feel about caffeine?",
    options: [
      { label: "I prefer something gentle and not too stimulating", result: "an" },
      { label: "I can accept some uplifting effect", result: "ding" },
      { label: "I am sensitive, especially at night", result: "mian" },
      { label: "I mainly want aroma and relaxation", result: "fang" },
      { label: "I care more about depth, story, and layers", result: "qing" }
    ]
  },
  {
    id: "test-meaning",
    question: "What do you most want to know from this test?",
    options: [
      { label: "How I can feel more at ease", result: "an" },
      { label: "How I can become more focused and steady", result: "ding" },
      { label: "How I can build a calming evening routine", result: "mian" },
      { label: "How I can release pressure and emotion", result: "fang" },
      { label: "How I can understand myself more deeply", result: "qing" }
    ]
  },
  {
    id: "box",
    question: "If Chazen prepared a tea box for you, what should it be?",
    options: [
      { label: "A beginner-friendly grounding tea box", result: "an" },
      { label: "A daily rhythm and focus tea box", result: "ding" },
      { label: "A gentle evening tea box", result: "mian" },
      { label: "A relaxing aromatic tea box", result: "fang" },
      { label: "A cultural and collectible tea box", result: "qing" }
    ]
  },
  {
    id: "receive",
    question: "After finishing the test, what would you most like to receive?",
    options: [
      { label: "A personal tea suggestion that helps me feel grounded", result: "an" },
      { label: "A daily tea habit I can follow", result: "ding" },
      { label: "A calming evening tea ritual guide", result: "mian" },
      { label: "A tea aroma ritual for stress release", result: "fang" },
      { label: "A deeper Tea-Mind personality report", result: "qing" }
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
          <h1 id="assessment-title">Discover your Tea-Mind Personality</h1>
          <p>
            One cup of tea can reveal the rhythm you are living in right now. Take the Chazen AI Tea Test
            to discover whether your current inner rhythm is 安, 定, 眠, 放, or 清.
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
            <span>15 Questions</span>
            <span>Five Tea-Mind Types</span>
            <span>Personal Ritual Result</span>
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
              <p className="museum-kicker">A quiet assessment, not a quick quiz</p>
              <h2>Begin with the rhythm you are living in today.</h2>
              <p>
                This test listens for five Tea-Mind rhythms: 安 for grounding, 定 for focus, 眠 for
                wind-down, 放 for release, and 清 for clarity. Your result will show a primary and
                secondary rhythm, recommended teas, and a small ritual you can return to.
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
                  <p className="museum-kicker">Your Tea-Mind Personality</p>
                  <h2>
                    {result.primary.character}｜{result.primary.chineseName}
                  </h2>
                  <h3>{result.primary.englishName}</h3>
                  <p>{result.primary.interpretation}</p>
                  <p className="tea-mind-tone-line">{result.primary.teaFeeling}</p>
                  {result.blended && (
                    <p className="tea-mind-blend-note">
                      Your result shows a blended Tea-Mind profile. Your primary rhythm is{" "}
                      {result.primary.character}｜{result.primary.chineseName}, but{" "}
                      {result.secondary.character}｜{result.secondary.chineseName} is also strongly present.
                    </p>
                  )}
                </div>
              </div>

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
