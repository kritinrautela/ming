"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Download, Loader2, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";

type ResultKey =
  | "harmony"
  | "restore"
  | "warm"
  | "cool"
  | "replenish"
  | "light"
  | "release"
  | "settle";

type FlavourKey = "fresh" | "floral" | "warm" | "deep" | "surprise";
type CaffeineKey = "comfortable" | "alert" | "sleep" | "sensitive" | "unsure";

type AssessmentOption = {
  id: string;
  label: string;
  labelZh: string;
  scores?: Partial<Record<ResultKey, number>>;
  next?: string;
  insight: string;
  insightZh: string;
  flavour?: FlavourKey;
  caffeine?: CaffeineKey;
  stomachSensitive?: boolean;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  questionZh: string;
  context?: string;
  contextZh?: string;
  bodySignal?: boolean;
  options: AssessmentOption[];
};

type Answer = {
  questionId: string;
  optionId: string;
};

type ResultProfile = {
  key: ResultKey;
  character: string;
  chineseName: string;
  englishName: string;
  need: string;
  needZh: string;
  quickRead: string;
  quickReadZh: string;
  currentState: string;
  currentStateZh: string;
  strategies: string[];
  strategiesZh: string[];
  primaryTea: string;
  primaryTeaZh: string;
  alternativeTea: string;
  alternativeTeaZh: string;
  timing: string;
  timingZh: string;
  caution: string;
  cautionZh: string;
  product: string;
  productZh: string;
};

const TOTAL_QUESTIONS = 8;
const resultOrder: ResultKey[] = [
  "harmony",
  "restore",
  "warm",
  "cool",
  "replenish",
  "light",
  "release",
  "settle"
];

const resultProfiles: Record<ResultKey, ResultProfile> = {
  harmony: {
    key: "harmony",
    character: "和",
    chineseName: "清和節奏",
    englishName: "Balanced & Fresh",
    need: "Maintain a good rhythm and explore what you enjoy.",
    needZh: "保持良好節奏，探索真正喜歡的茶。",
    quickRead: "You do not need fixing. Your tea can make a good rhythm feel even clearer.",
    quickReadZh: "你不需要被修復。你的茶，可以令原本良好的節奏更加清晰。",
    currentState:
      "Your answers do not point to one strong discomfort pattern. Your tea can be chosen for clarity, pleasure, and the moment you want to create.",
    currentStateZh: "你的答案沒有呈現明顯的單一不適模式，可以按清醒感、味道與生活場景選茶。",
    strategies: [
      "Keep the routine that already helps you feel steady.",
      "Choose tea by time of day rather than by a problem label.",
      "Notice which aroma and finish you genuinely enjoy."
    ],
    strategiesZh: ["維持令你感覺穩定的日常節奏。", "按飲用時間選茶，而不是按問題標籤。", "留意自己真正喜歡的香氣與回甘。"],
    primaryTea: "Light Tieguanyin",
    primaryTeaZh: "清香型鐵觀音",
    alternativeTea: "Longjing green tea",
    alternativeTeaZh: "龍井綠茶",
    timing: "Morning or early afternoon",
    timingZh: "早上或午後較早時段",
    caution: "A steady rhythm can still be disrupted by strong tea late in the day.",
    cautionZh: "即使狀態穩定，太晚飲濃茶仍可能影響休息。",
    product: "Tea Discovery Selection",
    productZh: "茶味探索組合"
  },
  restore: {
    key: "restore",
    character: "養",
    chineseName: "養能節奏",
    englishName: "Gentle Restoration",
    need: "A steadier exchange between effort and recovery.",
    needZh: "讓付出與恢復重新取得平衡。",
    quickRead: "You may be spending energy faster than your routine restores it.",
    quickReadZh: "你最近消耗能量的速度，可能比日常恢復得更快。",
    currentState:
      "Your answers suggest that tiredness or a slow start has been more noticeable than usual. This is a current rhythm, not a diagnosis or a permanent body type.",
    currentStateZh: "你的答案顯示，最近疲倦或啟動較慢的感覺比較明顯。這是當下節奏，不是診斷或永久體質。",
    strategies: [
      "Protect one reliable rest window each day.",
      "Avoid repeatedly using stronger caffeine to push through tiredness.",
      "Make the first cup unhurried and have it with or after food."
    ],
    strategiesZh: ["每日保留一段穩定的休息時間。", "避免不停用更濃的咖啡因硬撐。", "第一杯茶慢慢飲，並安排在進食時或之後。"],
    primaryTea: "Chinese black tea",
    primaryTeaZh: "中國紅茶",
    alternativeTea: "Roasted oolong",
    alternativeTeaZh: "焙火烏龍",
    timing: "Morning, with or after breakfast",
    timingZh: "早上，隨早餐或餐後飲用",
    caution: "Tea can create alertness, but it does not replace sleep or medical care for persistent fatigue.",
    cautionZh: "茶可以帶來清醒感，但不能取代睡眠；持續疲倦亦不應只靠茶處理。",
    product: "Warm Rhythm Selection",
    productZh: "溫養節奏茶選"
  },
  warm: {
    key: "warm",
    character: "暖",
    chineseName: "溫暖節奏",
    englishName: "Warm Start",
    need: "Warmth, steadiness, and a gentler start.",
    needZh: "溫暖、穩定，以及更柔和的開始。",
    quickRead: "Your answers lean towards warmth rather than another push of intensity.",
    quickReadZh: "你的答案較傾向需要溫暖，而不是另一輪強烈刺激。",
    currentState:
      "Feeling cold or slow to begin was the clearest signal in your answers. We are using that preference to shape the tea, not to label your constitution.",
    currentStateZh: "怕冷或啟動較慢是你答案中較清晰的訊號。我們只用它配茶，不會將它變成體質標籤。",
    strategies: [
      "Begin with a warm drink rather than an iced one.",
      "Use a short tea ritual to mark the start of the day.",
      "Keep the brew fragrant and moderate, not aggressively strong."
    ],
    strategiesZh: ["以溫飲代替冰飲開始一天。", "用一個短茶儀式標記一天的開始。", "保持茶湯有香氣但不過濃。"],
    primaryTea: "Roasted Tieguanyin",
    primaryTeaZh: "焙火鐵觀音",
    alternativeTea: "Wuyi rock oolong",
    alternativeTeaZh: "武夷岩茶",
    timing: "Morning or a cool afternoon",
    timingZh: "早上或較涼的午後",
    caution: "If you also feel hot, dry, or restless, choose a lighter brew instead.",
    cautionZh: "如果同時感到燥熱、口乾或不安，應改為較淡的沖泡。",
    product: "Roasted Oolong Selection",
    productZh: "焙火烏龍茶選"
  },
  cool: {
    key: "cool",
    character: "清",
    chineseName: "清爽節奏",
    englishName: "Cool & Clear",
    need: "Less stimulation and a cleaner pause.",
    needZh: "減少刺激，留一段清爽停頓。",
    quickRead: "Your recent rhythm appears to want less heat, noise, and stimulation.",
    quickReadZh: "你最近的節奏，似乎需要少一點熱、雜訊與刺激。",
    currentState:
      "Warmth or restlessness appeared in your answers. In traditional tea culture this can inspire a cooling direction, but it is not enough to identify a medical pattern.",
    currentStateZh: "燥熱或不安在你的答案中出現。傳統茶養概念可據此選擇清爽方向，但不足以判定任何醫療模式。",
    strategies: [
      "Pause before reaching for another strong caffeinated drink.",
      "Keep water, sleep, and meal rhythm in view as well as tea.",
      "Choose a clean, lightly brewed cup in the afternoon."
    ],
    strategiesZh: ["再飲濃咖啡因飲品前先停一停。", "除茶之外，亦留意飲水、睡眠及進食節奏。", "午後選擇乾淨、淡泡的一杯。"],
    primaryTea: "Chrysanthemum infusion",
    primaryTeaZh: "菊花飲",
    alternativeTea: "Lightly brewed white tea",
    alternativeTeaZh: "淡泡白茶",
    timing: "Afternoon",
    timingZh: "午後",
    caution: "Cooling infusions are not automatically suitable if you often feel cold or have digestive discomfort.",
    cautionZh: "如果經常怕冷或腸胃不適，清涼花草飲未必適合。",
    product: "Clear Afternoon Selection",
    productZh: "清爽午後茶選"
  },
  replenish: {
    key: "replenish",
    character: "潤",
    chineseName: "柔潤節奏",
    englishName: "Soft Replenishment",
    need: "A gentler rhythm with less overextension.",
    needZh: "減少過度消耗，回到更柔和的節奏。",
    quickRead: "Dryness or overextension is more noticeable than a lack of drive.",
    quickReadZh: "比起缺乏動力，乾燥感或過度消耗在你身上更明顯。",
    currentState:
      "Your answers mentioned dryness or an unsettled feeling after long periods of activity. The recommendation focuses on a softer tea experience, not treatment.",
    currentStateZh: "你的答案提到乾燥感，或長時間運轉後難以安定。推薦會集中於柔和茶感，而不是治療。",
    strategies: [
      "Keep plain water as the main response to thirst.",
      "Use tea as a pause, not as a replacement for hydration.",
      "Brew lightly and avoid turning the evening cup into stimulation."
    ],
    strategiesZh: ["口渴時仍以清水作主要補充。", "讓茶成為停頓，而不是代替飲水。", "保持淡泡，避免晚間飲品變成刺激。"],
    primaryTea: "White tea",
    primaryTeaZh: "白茶",
    alternativeTea: "Safety-checked goji and chrysanthemum infusion",
    alternativeTeaZh: "通過安全篩選後的杞菊飲",
    timing: "Late morning or early afternoon",
    timingZh: "上午較後或午後較早時段",
    caution: "Persistent dry mouth can have many causes and should not be self-treated with tea.",
    cautionZh: "持續口乾可以有多種原因，不應只靠茶自行處理。",
    product: "Soft White Tea Selection",
    productZh: "柔和白茶茶選"
  },
  light: {
    key: "light",
    character: "輕",
    chineseName: "飯後輕盈",
    englishName: "After-Meal Ease",
    need: "A lighter, less crowded after-meal ritual.",
    needZh: "一個較輕、較少負擔的飯後節奏。",
    quickRead: "The clearest signal is how your energy or comfort changes after eating.",
    quickReadZh: "最清晰的訊號，是進食後能量或舒適感的變化。",
    currentState:
      "Your answers connect heaviness or an energy dip with meals. That makes timing and brew strength more important than assigning you a body type.",
    currentStateZh: "你的答案將沉重感或能量下降連繫到進食，因此飲用時間與濃度比體質標籤更重要。",
    strategies: [
      "Keep the after-meal cup light rather than concentrated.",
      "Take a short, comfortable walk when it suits you.",
      "Notice whether discomfort follows particular meals or strong tea."
    ],
    strategiesZh: ["飯後茶保持淡泡，不要過濃。", "情況合適時作短時間輕鬆步行。", "留意不適是否跟特定食物或濃茶有關。"],
    primaryTea: "Light chenpi ripe pu-erh",
    primaryTeaZh: "淡泡陳皮熟普",
    alternativeTea: "Roasted oolong",
    alternativeTeaZh: "焙火烏龍",
    timing: "After food, never as a treatment for stomach symptoms",
    timingZh: "餐後飲用，但不可當作治療胃部症狀",
    caution: "If tea worsens heartburn, pain, or nausea, stop and seek professional advice rather than trying a stronger brew.",
    cautionZh: "如果茶令胃酸、疼痛或噁心加劇，應停止飲用並尋求專業意見，而不是沖得更濃。",
    product: "After-Meal Tea Selection",
    productZh: "飯後茶選"
  },
  release: {
    key: "release",
    character: "舒",
    chineseName: "思緒舒展",
    englishName: "Open & Unwind",
    need: "Space between responsibility and rest.",
    needZh: "在責任與休息之間留一點空間。",
    quickRead: "You may look composed while your mind keeps carrying the day.",
    quickReadZh: "你外表可能仍然從容，但腦袋仍在承載整日的事情。",
    currentState:
      "Your answers suggest that mental load or held tension is more noticeable than physical heaviness. The aim is to create a transition, not to label an emotional condition.",
    currentStateZh: "你的答案顯示，精神負荷或緊繃比身體沉重更明顯。目標是建立過渡，而不是標籤情緒。",
    strategies: [
      "Create a three-minute phone-free tea break.",
      "Use aroma to mark the end of one task before the next begins.",
      "Let the ritual reduce input instead of adding more content."
    ],
    strategiesZh: ["建立三分鐘無手機茶歇。", "用茶香標記一件事情結束，再開始下一件。", "讓儀式減少輸入，而不是增加更多內容。"],
    primaryTea: "Jasmine tea",
    primaryTeaZh: "茉莉花茶",
    alternativeTea: "Floral oolong",
    alternativeTeaZh: "花香烏龍",
    timing: "Late morning or afternoon",
    timingZh: "上午較後或午後",
    caution: "Choose a caffeine-free alternative if this ritual happens close to bedtime.",
    cautionZh: "如果儀式接近睡前，應改選無咖啡因飲品。",
    product: "Floral Tea Selection",
    productZh: "花香茶選"
  },
  settle: {
    key: "settle",
    character: "靜",
    chineseName: "夜間降速",
    englishName: "Evening Wind-Down",
    need: "A clearer transition out of alert mode.",
    needZh: "從警覺模式清楚地過渡到休息。",
    quickRead: "Your body may be ready to stop before your mind is.",
    quickReadZh: "你的身體可能已準備停下，但腦袋仍未準備好。",
    currentState:
      "Difficulty switching off appeared more than once in your answers. The recommendation removes stimulation; it does not claim to treat insomnia.",
    currentStateZh: "難以關機在你的答案中不只出現一次。推薦會減少刺激，但不會宣稱治療失眠。",
    strategies: [
      "End caffeine earlier in the day.",
      "Keep the final ritual dim, quiet, and screen-free.",
      "Use the same short wind-down cue for several nights."
    ],
    strategiesZh: ["將每日最後一杯咖啡因飲品提前。", "最後的儀式保持柔和燈光、安靜及無螢幕。", "連續數晚使用同一個簡短降速提示。"],
    primaryTea: "Caffeine-free evening infusion",
    primaryTeaZh: "無咖啡因晚間飲",
    alternativeTea: "Chrysanthemum infusion, only when the cooling direction also fits",
    alternativeTeaZh: "只在同時適合清爽方向時選擇菊花飲",
    timing: "Evening",
    timingZh: "晚間",
    caution: "Persistent sleep problems deserve professional assessment; tea is only part of a wind-down ritual.",
    cautionZh: "持續睡眠問題應接受專業評估；茶只可以是降速儀式的一部分。",
    product: "Evening Ritual Selection",
    productZh: "晚間儀式茶選"
  }
};

const questions: Record<string, AssessmentQuestion> = {
  goal: {
    id: "goal",
    question: "What brings you to this tea assessment?",
    questionZh: "甚麼原因令你來做這個茶測試？",
    context: "Choose the answer that feels closest.",
    contextZh: "選擇最接近你的答案。",
    options: [
      { id: "energy", label: "I want more steady energy", labelZh: "我想有更穩定的精神", scores: { restore: 1 }, next: "morning", insight: "You want steadier energy", insightZh: "你希望精神更加穩定" },
      { id: "unwind", label: "I want to slow down and unwind", labelZh: "我想慢下來、放鬆一下", scores: { release: 1 }, next: "morning", insight: "You want more room to unwind", insightZh: "你希望有更多放鬆空間" },
      { id: "focus", label: "I want to focus more easily", labelZh: "我想更容易集中", scores: { harmony: 1 }, next: "morning", insight: "You want easier focus", insightZh: "你希望更容易集中" },
      { id: "meals", label: "I want something gentle after meals", labelZh: "我想找一款飯後較柔和的茶", scores: { light: 1 }, next: "morning", insight: "You want a gentler after-meal cup", insightZh: "你想找一杯較柔和的飯後茶" },
      { id: "discover", label: "I am curious which tea suits me", labelZh: "我想知道哪款茶適合自己", scores: { harmony: 1 }, next: "morning", insight: "You are here to discover your tea", insightZh: "你想探索適合自己的茶" }
    ]
  },
  morning: {
    id: "morning",
    question: "Over the past seven days, how have you usually felt shortly after waking up?",
    questionZh: "過去七天，起床後不久你通常感覺如何？",
    bodySignal: true,
    options: [
      { id: "refreshed", label: "Awake and refreshed", labelZh: "清醒而有精神", scores: { harmony: 2 }, next: "optimise", insight: "You usually wake feeling refreshed", insightZh: "你起床時通常感覺精神良好" },
      { id: "fine", label: "A little sleepy, but generally fine", labelZh: "有點睏，但整體還好", scores: { harmony: 1, restore: 1 }, next: "afternoon", insight: "You need a little time, then feel fine", insightZh: "你需要少許時間，之後整體還好" },
      { id: "slow", label: "Tired and slow to start", labelZh: "疲倦，啟動得比較慢", scores: { restore: 2 }, next: "sleep-pattern", insight: "Mornings have felt slow", insightZh: "你最近早上啟動得比較慢" },
      { id: "exhausted", label: "Very tired, even after sleeping", labelZh: "即使睡過仍然很疲倦", scores: { restore: 3 }, next: "sleep-pattern", insight: "You still feel tired after sleeping", insightZh: "即使睡過，你仍然感到疲倦" },
      { id: "variable", label: "It changes from day to day", labelZh: "每天的情況都不同", next: "changing-pattern", insight: "Your mornings vary from day to day", insightZh: "你的早晨狀態每天不同" }
    ]
  },
  optimise: {
    id: "optimise",
    question: "What would make a good day feel even better?",
    questionZh: "甚麼會令原本不錯的一天變得更好？",
    options: [
      { id: "clearer", label: "Easier concentration", labelZh: "更容易集中", scores: { harmony: 1 }, next: "temperature", insight: "You want to sharpen a good rhythm", insightZh: "你想令良好節奏更加清晰" },
      { id: "fresher", label: "A fresher, brighter feeling", labelZh: "更清新明亮的感覺", scores: { harmony: 1 }, next: "temperature", insight: "You want a fresher cup", insightZh: "你想要更清新的茶感" },
      { id: "quieter", label: "More space to unwind", labelZh: "更多放鬆空間", scores: { release: 2 }, next: "tension", insight: "You want more space to unwind", insightZh: "你希望有更多放鬆空間" },
      { id: "meal", label: "A gentler feeling after meals", labelZh: "飯後感覺更柔和", scores: { light: 2 }, next: "digestion", insight: "After-meal comfort matters to you", insightZh: "你重視飯後的舒適感" },
      { id: "explore", label: "A new tea experience", labelZh: "一種新的茶體驗", scores: { harmony: 2 }, next: "temperature", insight: "You want to explore without fixing a problem", insightZh: "你想探索茶，而不是修補問題" }
    ]
  },
  afternoon: {
    id: "afternoon",
    question: "How does your energy usually change after lunch?",
    questionZh: "午餐後，你的精神通常有甚麼變化？",
    bodySignal: true,
    options: [
      { id: "steady", label: "It stays fairly steady", labelZh: "大致保持穩定", scores: { harmony: 2 }, next: "temperature", insight: "Your energy stays fairly steady after lunch", insightZh: "午餐後你的精神大致穩定" },
      { id: "slight", label: "It drops slightly", labelZh: "有少許下降", scores: { restore: 1 }, next: "digestion", insight: "You notice a small post-lunch dip", insightZh: "你午餐後有輕微精神下降" },
      { id: "sleepy", label: "I become noticeably sleepy", labelZh: "我會明顯眼睏", scores: { restore: 2, light: 1 }, next: "digestion", insight: "Lunch is followed by noticeable sleepiness", insightZh: "午餐後你會明顯眼睏" },
      { id: "heavy", label: "I feel heavy or bloated", labelZh: "我會感到沉重或脹氣", scores: { light: 3 }, next: "digestion", insight: "Heaviness follows some meals", insightZh: "部分餐後你會感到沉重" },
      { id: "varies", label: "It depends on the meal", labelZh: "視乎吃了甚麼", next: "digestion", insight: "Your response changes with the meal", insightZh: "你的狀態會隨食物而改變" }
    ]
  },
  "sleep-pattern": {
    id: "sleep-pattern",
    question: "Which sleep pattern is closest to yours?",
    questionZh: "哪種睡眠模式最接近你？",
    bodySignal: true,
    options: [
      { id: "short", label: "I usually do not get enough sleep", labelZh: "我通常睡眠不足", scores: { restore: 2 }, next: "recovery", insight: "Your sleep time is often too short", insightZh: "你的睡眠時間經常不足" },
      { id: "waking", label: "I often wake during the night", labelZh: "我夜間經常醒來", scores: { settle: 2, replenish: 1 }, next: "tension", insight: "Your sleep is often interrupted", insightZh: "你的睡眠經常中斷" },
      { id: "enough-tired", label: "I sleep enough but still wake tired", labelZh: "睡眠時間足夠，但醒來仍然疲倦", scores: { restore: 3 }, next: "energy-context", insight: "Enough sleep does not always feel restorative", insightZh: "足夠睡眠未必令你感覺恢復" },
      { id: "switch-off", label: "I find it hard to switch off before sleep", labelZh: "睡前很難令腦袋停下來", scores: { settle: 3, release: 1 }, next: "tension", insight: "Your mind stays active before sleep", insightZh: "睡前你的腦袋仍然活躍" },
      { id: "inconsistent", label: "There is no consistent pattern", labelZh: "沒有固定模式", next: "temperature", insight: "Your sleep has no single pattern", insightZh: "你的睡眠沒有單一固定模式" }
    ]
  },
  "changing-pattern": {
    id: "changing-pattern",
    question: "What seems most connected to those changes?",
    questionZh: "這些變化似乎最受甚麼影響？",
    context: "You do not need to know the exact cause.",
    contextZh: "你不需要知道確實原因。",
    bodySignal: true,
    options: [
      { id: "sleep", label: "How much I slept", labelZh: "睡眠時間", scores: { restore: 2 }, next: "recovery", insight: "Your rhythm changes with sleep", insightZh: "你的節奏會隨睡眠改變" },
      { id: "meals", label: "What or when I ate", labelZh: "吃了甚麼或進食時間", scores: { light: 2 }, next: "digestion", insight: "Meals appear connected to the change", insightZh: "進食似乎與狀態變化有關" },
      { id: "stress", label: "How much pressure I was under", labelZh: "當日壓力程度", scores: { release: 2 }, next: "tension", insight: "Your rhythm changes with pressure", insightZh: "你的節奏會隨壓力改變" },
      { id: "weather", label: "The weather or temperature", labelZh: "天氣或溫度", scores: { warm: 1, cool: 1 }, next: "temperature", insight: "Temperature appears to affect your rhythm", insightZh: "溫度似乎會影響你的節奏" },
      { id: "unclear", label: "I am not sure", labelZh: "我不確定", next: "temperature", insight: "There is no obvious trigger yet", insightZh: "目前未有明顯觸發因素" }
    ]
  },
  temperature: {
    id: "temperature",
    question: "Which body-temperature pattern is closest to yours lately?",
    questionZh: "最近哪種冷熱感最接近你？",
    bodySignal: true,
    options: [
      { id: "comfortable", label: "Generally comfortable", labelZh: "大致舒適", scores: { harmony: 2 }, next: "inner", insight: "Your body temperature feels comfortable", insightZh: "你的冷熱感大致舒適" },
      { id: "cold", label: "I feel cold easily", labelZh: "我比較容易怕冷", scores: { warm: 3 }, next: "inner", insight: "You tend to prefer warmth", insightZh: "你較容易怕冷、偏好溫暖" },
      { id: "hot", label: "I feel hot or restless easily", labelZh: "我比較容易覺得熱或煩躁", scores: { cool: 3 }, next: "inner", insight: "Warmth or restlessness is noticeable", insightZh: "燥熱或煩躁感較明顯" },
      { id: "dry", label: "Dryness is more noticeable than heat", labelZh: "乾燥感比熱感更明顯", scores: { replenish: 3 }, next: "inner", insight: "Dryness is the clearer signal", insightZh: "乾燥感是較清晰的訊號" },
      { id: "variable", label: "It changes too much to say", labelZh: "變化太大，難以判斷", next: "inner", insight: "Your temperature pattern varies", insightZh: "你的冷熱感並不固定" }
    ]
  },
  digestion: {
    id: "digestion",
    question: "After a typical meal, what do you notice most?",
    questionZh: "一般進食後，你最明顯留意到甚麼？",
    bodySignal: true,
    options: [
      { id: "comfortable", label: "I feel comfortable", labelZh: "感覺舒適", scores: { harmony: 2 }, next: "inner", insight: "Meals usually feel comfortable", insightZh: "你進食後通常感覺舒適" },
      { id: "sleepy", label: "I feel sleepy", labelZh: "我會感到眼睏", scores: { restore: 1, light: 2 }, next: "inner", insight: "Sleepiness is noticeable after meals", insightZh: "進食後眼睏較為明顯" },
      { id: "heavy", label: "I feel heavy or bloated", labelZh: "我會感到沉重或脹氣", scores: { light: 3 }, next: "inner", insight: "Heaviness or bloating follows meals", insightZh: "進食後會出現沉重或脹氣感" },
      { id: "heartburn", label: "I sometimes get heartburn or discomfort", labelZh: "有時會胃酸或不適", stomachSensitive: true, next: "inner", insight: "Some meals are followed by stomach discomfort", insightZh: "部分餐後會出現胃部不適" },
      { id: "varies", label: "It depends on the meal", labelZh: "視乎吃了甚麼", next: "inner", insight: "Your response depends on the meal", insightZh: "你的反應會隨食物改變" }
    ]
  },
  tension: {
    id: "tension",
    question: "When your mind stays active, what is it usually holding onto?",
    questionZh: "腦袋停不下來時，通常在承載甚麼？",
    context: "You can choose “I prefer not to answer.”",
    contextZh: "你可以選擇「不想回答」。",
    bodySignal: true,
    options: [
      { id: "work", label: "Work or unfinished tasks", labelZh: "工作或未完成的事情", scores: { release: 2, settle: 1 }, next: "inner", insight: "Unfinished tasks stay with you", insightZh: "未完成的事情會留在腦中" },
      { id: "tomorrow", label: "Planning what comes next", labelZh: "計劃接下來的事情", scores: { settle: 2 }, next: "inner", insight: "Your mind keeps planning ahead", insightZh: "你的腦袋會不停計劃之後的事" },
      { id: "conversations", label: "Conversations or feelings", labelZh: "對話或感受", scores: { release: 3 }, next: "inner", insight: "Conversations or feelings linger", insightZh: "對話或感受會留在心中" },
      { id: "phone", label: "Whatever is on my phone", labelZh: "手機上的內容", scores: { settle: 2 }, next: "inner", insight: "Phone input keeps the mind active", insightZh: "手機資訊令腦袋保持活躍" },
      { id: "skip", label: "I prefer not to answer", labelZh: "我不想回答", next: "inner", insight: "You chose to keep this private", insightZh: "你選擇保留這部分" }
    ]
  },
  recovery: {
    id: "recovery",
    question: "What is most often missing before you feel worn down?",
    questionZh: "感到消耗之前，通常最缺少甚麼？",
    bodySignal: true,
    options: [
      { id: "sleep", label: "Enough sleep", labelZh: "足夠睡眠", scores: { restore: 3 }, next: "inner", insight: "Sleep is the clearest missing piece", insightZh: "睡眠是最明顯缺少的一環" },
      { id: "quiet", label: "Quiet time", labelZh: "安靜時間", scores: { release: 2 }, next: "inner", insight: "Quiet time is often missing", insightZh: "你經常缺少安靜時間" },
      { id: "meals", label: "Regular meals", labelZh: "定時進食", scores: { restore: 2 }, next: "inner", insight: "Regular meals are often missing", insightZh: "你經常未能定時進食" },
      { id: "warmth", label: "Warmth and a slower start", labelZh: "溫暖和較慢的開始", scores: { warm: 2, restore: 1 }, next: "inner", insight: "Warmth and a slower start feel supportive", insightZh: "溫暖和慢慢開始對你較有幫助" },
      { id: "unclear", label: "There is no clear pattern", labelZh: "沒有明顯模式", next: "inner", insight: "There is no single missing piece", insightZh: "目前沒有單一明顯缺少的部分" }
    ]
  },
  "energy-context": {
    id: "energy-context",
    question: "When is the tiredness most noticeable?",
    questionZh: "疲倦感在甚麼時候最明顯？",
    bodySignal: true,
    options: [
      { id: "morning", label: "Soon after waking", labelZh: "起床後不久", scores: { restore: 2 }, next: "inner", insight: "Tiredness is strongest in the morning", insightZh: "疲倦感在早上最明顯" },
      { id: "meals", label: "After meals", labelZh: "進食後", scores: { light: 3 }, next: "inner", insight: "Tiredness is linked to meals", insightZh: "疲倦感與進食有關" },
      { id: "busy", label: "After a demanding day", labelZh: "忙碌的一天之後", scores: { restore: 2, release: 1 }, next: "inner", insight: "Demanding days leave you depleted", insightZh: "忙碌的一天會令你感到消耗" },
      { id: "allday", label: "Throughout most of the day", labelZh: "大部分時間", scores: { restore: 3 }, next: "inner", insight: "Tiredness lasts through much of the day", insightZh: "疲倦感持續大部分時間" },
      { id: "variable", label: "There is no fixed time", labelZh: "沒有固定時間", next: "inner", insight: "Tiredness has no fixed timing", insightZh: "疲倦感沒有固定時間" }
    ]
  },
  inner: {
    id: "inner",
    question: "What do you leave least for yourself?",
    questionZh: "你最少留給自己的是甚麼？",
    context: "A private reflection, not a mental-health assessment.",
    contextZh: "這是私人反思，不是心理健康評估。",
    options: [
      { id: "rest", label: "Rest", labelZh: "休息", scores: { restore: 1 }, next: "rest", insight: "You leave little time for rest", insightZh: "你留給休息的時間較少" },
      { id: "space", label: "Space", labelZh: "空間", scores: { release: 1 }, next: "rest", insight: "You leave little space for yourself", insightZh: "你留給自己的空間較少" },
      { id: "patience", label: "Patience", labelZh: "耐性", scores: { release: 1 }, next: "rest", insight: "Patience is harder to keep for yourself", insightZh: "你較難將耐性留給自己" },
      { id: "care", label: "Care", labelZh: "照顧", scores: { replenish: 1 }, next: "rest", insight: "You often put your own care last", insightZh: "你經常將照顧自己放到最後" },
      { id: "enough", label: "I already have enough", labelZh: "我現在已經足夠", scores: { harmony: 2 }, next: "rest", insight: "You feel adequately supported", insightZh: "你感覺目前得到足夠支持" },
      { id: "skip", label: "I prefer not to answer", labelZh: "我不想回答", next: "rest", insight: "You chose to keep this private", insightZh: "你選擇保留這部分" }
    ]
  },
  rest: {
    id: "rest",
    question: "When you have time to rest, what usually happens?",
    questionZh: "有時間休息時，通常會發生甚麼？",
    bodySignal: true,
    options: [
      { id: "natural", label: "I can switch off naturally", labelZh: "我可以自然停下來", scores: { harmony: 2 }, next: "flavour", insight: "You can usually switch off naturally", insightZh: "你通常可以自然停下來" },
      { id: "scroll", label: "I keep scrolling", labelZh: "我會繼續滑手機", scores: { settle: 1, release: 1 }, next: "flavour", insight: "Rest often turns into more phone input", insightZh: "休息時間經常變成更多手機資訊" },
      { id: "mind", label: "My mind keeps working", labelZh: "腦袋仍然運轉", scores: { settle: 2, release: 1 }, next: "flavour", insight: "Your mind keeps working during rest", insightZh: "休息時你的腦袋仍然運轉" },
      { id: "sleep", label: "I fall asleep quickly", labelZh: "我很快便睡著", scores: { restore: 2 }, next: "flavour", insight: "Rest quickly becomes sleep", insightZh: "一休息你便很快睡著" },
      { id: "rarely", label: "I rarely get that time", labelZh: "我很少有這種時間", scores: { restore: 1, release: 1 }, next: "flavour", insight: "You rarely get uninterrupted rest", insightZh: "你很少有不受打擾的休息時間" }
    ]
  },
  flavour: {
    id: "flavour",
    question: "Which tea experience sounds most appealing?",
    questionZh: "哪種茶感最吸引你？",
    options: [
      { id: "fresh", label: "Fresh and bright", labelZh: "清新明亮", flavour: "fresh", next: "caffeine", insight: "You prefer a fresh, bright cup", insightZh: "你偏好清新明亮的茶感" },
      { id: "floral", label: "Soft and floral", labelZh: "柔和花香", flavour: "floral", next: "caffeine", insight: "You prefer a soft floral aroma", insightZh: "你偏好柔和花香" },
      { id: "warm", label: "Warm and roasted", labelZh: "溫暖焙火", flavour: "warm", next: "caffeine", insight: "You prefer a warm roasted cup", insightZh: "你偏好溫暖焙火茶感" },
      { id: "deep", label: "Deep and mellow", labelZh: "深沉醇厚", flavour: "deep", next: "caffeine", insight: "You prefer a deep mellow cup", insightZh: "你偏好深沉醇厚的茶感" },
      { id: "surprise", label: "Choose for me", labelZh: "由 Chazen 為我選擇", flavour: "surprise", next: "caffeine", insight: "You are open to a guided choice", insightZh: "你願意接受引導式推薦" }
    ]
  },
  caffeine: {
    id: "caffeine",
    question: "How does caffeine usually affect you?",
    questionZh: "咖啡因通常對你有甚麼影響？",
    options: [
      { id: "comfortable", label: "No noticeable problem", labelZh: "沒有明顯問題", caffeine: "comfortable", insight: "Caffeine does not usually bother you", insightZh: "咖啡因通常不會令你不適" },
      { id: "alert", label: "It can make me too alert", labelZh: "有時令我過度精神", caffeine: "alert", scores: { settle: 1 }, insight: "Caffeine can make you too alert", insightZh: "咖啡因有時令你過度精神" },
      { id: "sleep", label: "It affects my sleep later", labelZh: "之後會影響睡眠", caffeine: "sleep", scores: { settle: 2 }, insight: "Caffeine can affect your sleep", insightZh: "咖啡因可能影響你的睡眠" },
      { id: "sensitive", label: "I am quite sensitive to it", labelZh: "我對咖啡因比較敏感", caffeine: "sensitive", scores: { settle: 2 }, insight: "You are sensitive to caffeine", insightZh: "你對咖啡因比較敏感" },
      { id: "unsure", label: "I am not sure", labelZh: "我不確定", caffeine: "unsure", insight: "Your caffeine response is unclear", insightZh: "你未確定咖啡因對自己的影響" }
    ]
  }
};

type QuizPhase = "intro" | "question" | "loading" | "result";

function getOption(answer: Answer) {
  return questions[answer.questionId]?.options.find((option) => option.id === answer.optionId);
}

function calculateResult(answers: Answer[]) {
  const scores = resultOrder.reduce(
    (current, key) => ({ ...current, [key]: 0 }),
    {} as Record<ResultKey, number>
  );
  const signals = resultOrder.reduce(
    (current, key) => ({ ...current, [key]: new Set<string>() }),
    {} as Record<ResultKey, Set<string>>
  );

  answers.forEach((answer) => {
    const question = questions[answer.questionId];
    const option = getOption(answer);
    if (!option?.scores) return;

    Object.entries(option.scores).forEach(([rawKey, value]) => {
      const key = rawKey as ResultKey;
      scores[key] += value ?? 0;
      if (question.bodySignal && value && value > 0) signals[key].add(question.id);
    });
  });

  const nonHarmony = resultOrder
    .filter((key) => key !== "harmony")
    .sort((a, b) => scores[b] - scores[a]);
  const strongest = nonHarmony[0];
  const runnerUp = nonHarmony[1];
  const hasRepeatedSignal = scores[strongest] >= 4 && signals[strongest].size >= 2;
  const hasClearSignal = scores[strongest] >= 3 && scores[strongest] - scores[runnerUp] >= 2;
  const primaryKey: ResultKey = hasRepeatedSignal || hasClearSignal ? strongest : "harmony";

  const evidence = answers
    .filter((answer) => {
      const option = getOption(answer);
      return primaryKey === "harmony"
        ? Boolean(option?.scores?.harmony)
        : Boolean(option?.scores?.[primaryKey]);
    })
    .map((answer) => getOption(answer))
    .filter((option): option is AssessmentOption => Boolean(option))
    .slice(0, 3);

  const flavour = answers.map(getOption).find((option) => option?.flavour)?.flavour;
  const caffeine = answers.map(getOption).find((option) => option?.caffeine)?.caffeine;
  const stomachSensitive = answers.some((answer) => getOption(answer)?.stomachSensitive);

  return {
    scores,
    primary: resultProfiles[primaryKey],
    evidence,
    flavour,
    caffeine,
    stomachSensitive
  };
}

function getTeaRecommendation(result: ReturnType<typeof calculateResult>) {
  const profile = result.primary;
  let primary = profile.primaryTea;
  let primaryZh = profile.primaryTeaZh;
  let alternative = profile.alternativeTea;
  let alternativeZh = profile.alternativeTeaZh;
  let caution = profile.caution;
  let cautionZh = profile.cautionZh;

  if (profile.key === "harmony") {
    const harmonyChoices: Record<FlavourKey, [string, string, string, string]> = {
      fresh: ["Light Tieguanyin", "清香型鐵觀音", "Longjing green tea", "龍井綠茶"],
      floral: ["Jasmine tea", "茉莉花茶", "Floral oolong", "花香烏龍"],
      warm: ["Roasted oolong", "焙火烏龍", "Chinese black tea", "中國紅茶"],
      deep: ["Ripe pu-erh", "熟普洱", "Wuyi rock oolong", "武夷岩茶"],
      surprise: ["Light Tieguanyin", "清香型鐵觀音", "Seasonal Chazen selection", "Chazen 時令茶選"]
    };
    [primary, primaryZh, alternative, alternativeZh] = harmonyChoices[result.flavour ?? "surprise"];
  }

  if (result.caffeine === "sleep" || result.caffeine === "sensitive") {
    alternative = primary;
    alternativeZh = primaryZh;
    primary = "Caffeine-free evening infusion";
    primaryZh = "無咖啡因晚間飲";
    caution = "Because you reported caffeine sensitivity, ordinary green, white, oolong, black, and pu-erh tea may still affect you. Check herbal ingredients if you take medicines, are pregnant, or have allergies.";
    cautionZh = "你表示對咖啡因敏感；一般綠茶、白茶、烏龍、紅茶及普洱仍可能影響你。如正服藥、懷孕或有過敏，亦應先核對花草成分。";
  }

  if (result.stomachSensitive) {
    if (profile.key === "light") {
      primary = "Lightly brewed roasted oolong, after food";
      primaryZh = "餐後淡泡焙火烏龍";
    }
    caution = "You mentioned stomach discomfort. Do not use tea as a treatment, avoid strong tea on an empty stomach, and seek professional advice if symptoms persist or worsen.";
    cautionZh = "你提到胃部不適。不要將茶當作治療，避免空腹飲濃茶；如果情況持續或加劇，應尋求專業意見。";
  }

  return { primary, primaryZh, alternative, alternativeZh, caution, cautionZh };
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState("goal");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const currentQuestion = questions[currentQuestionId];
  const result = useMemo(() => calculateResult(answers), [answers]);
  const tea = useMemo(() => getTeaRecommendation(result), [result]);
  const progress = phase === "intro" ? 0 : Math.min((answers.length / TOTAL_QUESTIONS) * 100, 100);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setPhase("result"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function handleStart() {
    setAnswers([]);
    setCurrentQuestionId("goal");
    setSaveState("idle");
    setPhase("question");
  }

  function handleAnswer(option: AssessmentOption) {
    const nextAnswers = [...answers, { questionId: currentQuestion.id, optionId: option.id }];
    setAnswers(nextAnswers);
    setSaveState("idle");

    if (nextAnswers.length >= TOTAL_QUESTIONS) {
      setPhase("loading");
      return;
    }

    if (!option.next) {
      setPhase("loading");
      return;
    }

    window.setTimeout(() => setCurrentQuestionId(option.next ?? "goal"), 160);
  }

  function handleBack() {
    if (answers.length === 0) return;
    const previous = answers[answers.length - 1];
    setAnswers((current) => current.slice(0, -1));
    setCurrentQuestionId(previous.questionId);
    setSaveState("idle");
  }

  function handleRestart() {
    setAnswers([]);
    setCurrentQuestionId("goal");
    setSaveState("idle");
    setPhase("intro");
  }

  async function handleSaveResult() {
    const evidence = result.evidence
      .map((option) => `- ${t(option.insight, option.insightZh)}`)
      .join("\n");
    const resultText = [
      `Chazen Tea Rhythm: ${result.primary.character} ${result.primary.chineseName} | ${result.primary.englishName}`,
      "",
      t(result.primary.quickRead, result.primary.quickReadZh),
      "",
      `${t("What we noticed", "我們留意到")}:`,
      evidence || `- ${t("No single discomfort pattern stood out.", "沒有單一不適模式特別明顯。")}`,
      "",
      `${t("Tea match", "茶葉配對")}: ${t(tea.primary, tea.primaryZh)}`,
      `${t("Alternative", "另一選擇")}: ${t(tea.alternative, tea.alternativeZh)}`,
      `${t("Best time", "建議時間")}: ${t(result.primary.timing, result.primary.timingZh)}`,
      "",
      `${t("Important note", "重要提示")}: ${t(tea.caution, tea.cautionZh)}`,
      "",
      t(
        "This reflective tea pairing is inspired by traditional Chinese wellness ideas. It is not a medical diagnosis or treatment recommendation.",
        "這個茶飲配對受傳統中式養生概念啟發，不是醫療診斷或治療建議。"
      )
    ].join("\n");

    try {
      const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chazen-tea-rhythm-${result.primary.key}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      // The visible result remains available if file download is blocked.
    }

    try {
      await navigator.clipboard?.writeText(resultText);
    } catch {
      // Clipboard permission is optional.
    }

    setSaveState("saved");
  }

  const ctaHref = buildInquiryPath({
    basePath,
    type: "Tea recommendation",
    message: `I completed the Chazen Tea Rhythm Test. My result is ${result.primary.englishName}, and my tea match is ${tea.primary}. I would like to learn more about the ${result.primary.product}.`,
    source: "Chazen Tea Rhythm Test"
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
          <p className="museum-kicker">Chazen Tea Rhythm Test / 茶與身體節奏</p>
          <h1 id="assessment-title">{t("What has your body been telling you lately?", "你的身體，最近想告訴你甚麼？")}</h1>
          <p>
            {t(
              "Eight short questions about your recent rhythm, inner needs, and tea preferences. Your answers shape what comes next, then lead to a tea pairing — not a diagnosis.",
              "八條關於最近節奏、內在需要與飲茶偏好的簡短問題。你的答案會決定下一題，最後配對一杯茶——不是作出診斷。"
            )}
          </p>
          <div className="tea-mind-character-rail" aria-label="Assessment principles">
            <span><strong>8</strong><em>{t("Adaptive questions", "動態問題")}</em></span>
            <span><strong>今</strong><em>{t("Current rhythm", "當下節奏")}</em></span>
            <span><strong>茶</strong><em>{t("Personal tea match", "個人茶配對")}</em></span>
            <span><strong>非</strong><em>{t("No diagnosis", "不作診斷")}</em></span>
          </div>
          <p className="tea-mind-disclaimer">
            {t(
              "Inspired by traditional Chinese wellness ideas for reflection and tea discovery. No name or email is required.",
              "受傳統中式養生概念啟發，用於自我觀察與探索茶。毋須姓名或電郵。"
            )}
          </p>
          <div className="assessment-hero-meta">
            <span>{t("8 Questions", "八條問題")}</span>
            <span>{t("About 2 Minutes", "約兩分鐘")}</span>
            <span>{t("Immediate Result", "即時結果")}</span>
          </div>
          <button type="button" className="tea-mind-start-button" onClick={handleStart}>
            {t("Start Listening", "開始聽自己")}
          </button>
        </div>
      </section>

      <section className="museum-section tea-mind-room" aria-label="Tea rhythm assessment">
        <div className="museum-container tea-mind-shell">
          <div className="tea-mind-progress" aria-label="Assessment progress">
            <div>
              <span>
                {phase === "intro"
                  ? t("Before the first sip", "第一口之前")
                  : `${Math.min(answers.length + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`}
              </span>
              <strong>
                {phase === "result"
                  ? t("Your tea rhythm", "你的茶節奏")
                  : phase === "loading"
                    ? t("Bringing the clues together", "正在整理線索")
                    : t("Your answers shape what comes next", "你的答案會決定下一題")}
              </strong>
            </div>
            <div className="assessment-progress-track tea-mind-progress-track" aria-hidden="true">
              <span style={{ width: `${phase === "result" ? 100 : progress}%` }} />
            </div>
          </div>

          {phase === "intro" && (
            <section className="tea-mind-intro-panel" aria-label="Assessment introduction">
              <div className="tea-mind-oracle-character" aria-hidden="true">茶</div>
              <p className="museum-kicker">{t("A conversation, not a checklist", "一場對話，而不是檢查表")}</p>
              <h2>{t("One answer opens the next question.", "每一個答案，都會打開下一個問題。")}</h2>
              <p>
                {t(
                  "Everyone follows an eight-question path, but not everyone sees the same questions. We first notice a signal, then ask about its context before matching a tea. Stable answers are a real result too — you will never be forced to choose a problem you do not have.",
                  "每個人都會完成八題，但不一定看到相同問題。我們先留意訊號，再了解相關情境，然後配茶。狀態穩定亦是一個真正結果——你不會被迫選擇自己沒有的問題。"
                )}
              </p>
              <div className="tea-mind-type-grid" aria-label="How the test works">
                <article><strong>一</strong><span>{t("Notice", "觀察")}</span><em>{t("Recent rhythm", "最近節奏")}</em></article>
                <article><strong>二</strong><span>{t("Follow", "追問")}</span><em>{t("Relevant context", "相關情境")}</em></article>
                <article><strong>三</strong><span>{t("Understand", "理解")}</span><em>{t("What you need", "當下需要")}</em></article>
                <article><strong>四</strong><span>{t("Match", "配對")}</span><em>{t("Tea and timing", "茶與時間")}</em></article>
              </div>
              <button type="button" className="tea-mind-primary-action" onClick={handleStart}>
                {t("Begin the 8 Questions", "開始八條問題")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </section>
          )}

          {phase === "question" && (
            <fieldset key={`${currentQuestion.id}-${answers.length}`} className="tea-mind-question-panel">
              <legend>
                <span>{t("Question", "問題")} {answers.length + 1}</span>
                <strong>{t(currentQuestion.question, currentQuestion.questionZh)}</strong>
                {currentQuestion.context ? (
                  <em className="tea-mind-question-context">
                    {t(currentQuestion.context, currentQuestion.contextZh ?? currentQuestion.context)}
                  </em>
                ) : null}
              </legend>
              <div className="tea-mind-options" role="radiogroup" aria-label={t(currentQuestion.question, currentQuestion.questionZh)}>
                {currentQuestion.options.map((option, index) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked="false"
                    key={`${currentQuestion.id}-${option.id}`}
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="tea-mind-option-mark">{String.fromCharCode(65 + index)}</span>
                    <span>{t(option.label, option.labelZh)}</span>
                  </button>
                ))}
              </div>
              {answers.length > 0 ? (
                <button type="button" className="tea-mind-back-button" onClick={handleBack}>
                  {t("Back", "上一題")}
                </button>
              ) : null}
            </fieldset>
          )}

          {phase === "loading" && (
            <section className="tea-mind-loading" aria-live="polite">
              <div className="tea-mind-loading-cup" aria-hidden="true">
                <Loader2 size={28} />
                <span />
              </div>
              <span>{t("Reading the pattern across your answers", "正在閱讀答案之間的脈絡")}</span>
              <h2>{t("Bringing the clues together...", "正在整理線索……")}</h2>
              <p>{t("No diagnosis. No forced label.", "不作診斷，不強加標籤。")}</p>
            </section>
          )}

          {phase === "result" && (
            <section className={`tea-mind-result tea-mind-tone-${result.primary.key}`} aria-live="polite">
              <div className="tea-mind-result-hero">
                <span className="tea-mind-result-character" aria-hidden="true">{result.primary.character}</span>
                <div>
                  <p className="museum-kicker">{t("Your current tea rhythm", "你目前的茶節奏")}</p>
                  <h2>{result.primary.chineseName}</h2>
                  <h3>{result.primary.englishName}</h3>
                  <p>{t(result.primary.quickRead, result.primary.quickReadZh)}</p>
                </div>
              </div>

              <div className="tea-mind-result-grid">
                <article>
                  <span>{t("What this means", "這代表甚麼")}</span>
                  <p>{t(result.primary.currentState, result.primary.currentStateZh)}</p>
                </article>
                <article>
                  <span>{t("What you need now", "你現在需要甚麼")}</span>
                  <p>{t(result.primary.need, result.primary.needZh)}</p>
                </article>
                <article>
                  <span>{t("Best time", "建議時間")}</span>
                  <p>{t(result.primary.timing, result.primary.timingZh)}</p>
                </article>
              </div>

              <article className="tea-mind-detail-grid">
                <article>
                  <h4>{t("Why you received this result", "為甚麼得到這個結果")}</h4>
                  <ul>
                    {result.evidence.length > 0 ? result.evidence.map((option) => (
                      <li key={option.id}>{t(option.insight, option.insightZh)}</li>
                    )) : <li>{t("No single discomfort pattern stood out.", "沒有單一不適模式特別明顯。")}</li>}
                  </ul>
                </article>
                <article>
                  <h4>{t("A simple 7-day approach", "簡單七日策略")}</h4>
                  <ol>
                    {(language === "zh" ? result.primary.strategiesZh : result.primary.strategies).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              </article>

              <div className="tea-mind-product-panel">
                <div>
                  <span>{t("Your tea match", "你的茶葉配對")}</span>
                  <strong>{t(tea.primary, tea.primaryZh)}</strong>
                  <p>
                    {t("Alternative", "另一選擇")}: {t(tea.alternative, tea.alternativeZh)}
                  </p>
                </div>
                <div className="tea-mind-result-actions">
                  <a href={ctaHref}>
                    {t("Explore My Tea Match", "探索我的茶葉配對")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <button type="button" onClick={handleSaveResult}>
                    {saveState === "saved" ? <Check size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
                    {saveState === "saved" ? t("Result Saved", "結果已儲存") : t("Save My Result", "儲存我的結果")}
                  </button>
                  <button type="button" onClick={handleRestart}>
                    <RotateCcw size={16} aria-hidden="true" />
                    {t("Retake Test", "重新測試")}
                  </button>
                </div>
              </div>

              <article className="tea-mind-quick-tea">
                <span>{t("Important fit and safety note", "重要配對與安全提示")}</span>
                <p>{t(tea.caution, tea.cautionZh)}</p>
                <small>
                  {t(
                    "This reflective pairing is inspired by traditional Chinese wellness ideas. It is not a medical diagnosis or treatment recommendation. Check with a qualified health professional before using herbal blends if you take medicines, are pregnant, or have allergies or ongoing symptoms.",
                    "這個配對受傳統中式養生概念啟發，不是醫療診斷或治療建議。如正服藥、懷孕、有過敏或持續症狀，使用花草配方前應先向合資格專業人士查詢。"
                  )}
                </small>
              </article>
            </section>
          )}
        </div>
      </section>

      <section className="chazen-subpage-cta">
        <div className="chazen-subpage-container">
          <div>
            <p className="chazen-subpage-eyebrow">{t("Continue", "繼續旅程")}</p>
            <h2>{t("Turn the result into a real tea ritual", "將結果變成真正的茶儀式")}</h2>
            <p>{t("Explore the ritual and tea selection that fit your current rhythm.", "探索配合你目前節奏的儀式與茶選。")}</p>
          </div>
          <div className="chazen-subpage-actions">
            <a href={routeHref("/tea-ritual")} className="chazen-subpage-button chazen-subpage-button-primary">
              {t("Explore Tea Ritual", "探索茶儀式")} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={routeHref("/tea-boxes")} className="chazen-subpage-button">
              {t("Tea Boxes", "茶盒")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
