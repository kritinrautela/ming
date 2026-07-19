"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, LockKeyhole, Loader2, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";
import styles from "./TeaAssessmentExperience.module.css";

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

const TOTAL_QUESTIONS = 9;
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
    timing: "During a morning reset or while you work",
    timingZh: "早上整理節奏時，或工作期間",
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
      "Let the first cup be a deliberate pause rather than a quick fix."
    ],
    strategiesZh: ["每日保留一段穩定的休息時間。", "避免不停用更濃的咖啡因硬撐。", "讓第一杯茶成為有意識的停頓，而不是快速補救。"],
    primaryTea: "Chinese black tea",
    primaryTeaZh: "中國紅茶",
    alternativeTea: "Roasted oolong",
    alternativeTeaZh: "焙火烏龍",
    timing: "At the start of the day or during a work break",
    timingZh: "一天開始時，或工作休息期間",
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
    timing: "On cooler mornings or whenever you want a warmer cup",
    timingZh: "較涼的早上，或想飲一杯溫暖茶湯時",
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
    timing: "On warm afternoons or during a quiet pause",
    timingZh: "較暖的午後，或想安靜停一停時",
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
    timing: "During a gentle daytime pause",
    timingZh: "日間想放慢一下的時候",
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
    timing: "With a meal or during a lighter afternoon pause",
    timingZh: "用餐時，或午後想輕鬆一下時",
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
    timing: "During a work break or when you want to leave busy mode",
    timingZh: "工作休息期間，或想離開忙碌狀態時",
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
    primaryTea: "Lightly brewed aged white tea",
    primaryTeaZh: "淡泡陳年白茶",
    alternativeTea: "Light-roast oolong",
    alternativeTeaZh: "輕焙火烏龍",
    timing: "During a quiet pause earlier in the day",
    timingZh: "日間較早、想安靜停一停的時候",
    caution: "Persistent sleep problems deserve professional assessment; tea is only part of a wind-down ritual.",
    cautionZh: "持續睡眠問題應接受專業評估；茶只可以是降速儀式的一部分。",
    product: "Evening Ritual Selection",
    productZh: "晚間儀式茶選"
  }
};

const questions: Record<string, AssessmentQuestion> = {
  character: {
    id: "character",
    question: "Among people, which role do you most often become?",
    questionZh: "你在人群中，常常成為哪一種角色？",
    context: "There is no right answer — just notice what feels true.",
    contextZh: "沒有標準答案，留意甚麼感覺最真實。",
    options: [
      { id: "quiet", label: "The quiet one, a little apart from the center", labelZh: "安靜的人，稍微遊離於中心之外", scores: { release: 2 }, next: "goal", insight: "You tend to hold space apart from the center", insightZh: "你傾向與中心保持一點距離" },
      { id: "anchor", label: "The one others lean on to feel steady", labelZh: "別人依靠來感到安穩的人", scores: { harmony: 2 }, next: "goal", insight: "Others settle when you are steady", insightZh: "你在時，別人會安定下來" },
      { id: "warmth", label: "The one who keeps the room warm, without meaning to", labelZh: "不自覺地讓氣氛變暖的人", scores: { restore: 2 }, next: "goal", insight: "You carry the room's mood, often at your own expense", insightZh: "你經常在不知不覺間承擔了整個場合的氣氛" },
      { id: "spent", label: "The one who arrives already spent", labelZh: "還未開始就已經很疲累的人", scores: { restore: 3, settle: 1 }, next: "goal", insight: "You often show up carrying more than others see", insightZh: "你出現時，往往已經帶著別人看不見的疲憊" }
    ]
  },
  goal: {
    id: "goal",
    question: "What are you really hoping this cup will do for you?",
    questionZh: "此刻，你真正希望一杯茶能為你做到甚麼？",
    context: "Choose whichever feels closest, even if none feels exact.",
    contextZh: "選擇最接近的答案，即使沒有一個完全貼切。",
    options: [
      { id: "energy", label: "Steadier energy, not another jolt", labelZh: "更穩定的精神，而不是另一輪刺激", scores: { restore: 1 }, next: "morning", insight: "You want steadier energy", insightZh: "你希望精神更加穩定" },
      { id: "unwind", label: "Permission to slow down and actually unwind", labelZh: "一個可以真正慢下來的許可", scores: { release: 1 }, next: "morning", insight: "You want more room to unwind", insightZh: "你希望有更多放鬆空間" },
      { id: "focus", label: "A clearer head, less scattered", labelZh: "更清晰的頭腦，減少分心", scores: { harmony: 1 }, next: "morning", insight: "You want easier focus", insightZh: "你希望更容易集中" },
      { id: "meals", label: "Something gentle for after I eat", labelZh: "一款飯後較柔和的茶", scores: { light: 1 }, next: "morning", insight: "You want a gentler after-meal cup", insightZh: "你想找一杯較柔和的飯後茶" },
      { id: "discover", label: "Honestly, I just want to know what suits me", labelZh: "老實說，我只是想知道甚麼適合自己", scores: { harmony: 1 }, next: "morning", insight: "You are here to discover your tea", insightZh: "你想探索適合自己的茶" }
    ]
  },
  morning: {
    id: "morning",
    question: "In the last week, what has the first hour after waking actually felt like?",
    questionZh: "過去一星期，醒來後的第一個小時，實際上是怎樣的？",
    bodySignal: true,
    options: [
      { id: "refreshed", label: "Awake, and glad to be", labelZh: "清醒，而且是樂意清醒的那種", scores: { harmony: 2 }, next: "optimise", insight: "You usually wake feeling refreshed", insightZh: "你起床時通常感覺精神良好" },
      { id: "fine", label: "A little slow, but I come round", labelZh: "有點慢熱，但很快就緩過來", scores: { harmony: 1, restore: 1 }, next: "afternoon", insight: "You need a little time, then feel fine", insightZh: "你需要少許時間，之後整體還好" },
      { id: "slow", label: "Tired, and the day takes a while to start", labelZh: "疲倦，這一天需要一段時間才能真正開始", scores: { restore: 2 }, next: "sleep-pattern", insight: "Mornings have felt slow", insightZh: "你最近早上啟動得比較慢" },
      { id: "exhausted", label: "Tired in a way sleep didn't fix", labelZh: "一種睡眠並沒有修復的疲倦", scores: { restore: 3 }, next: "sleep-pattern", insight: "You still feel tired after sleeping", insightZh: "即使睡過，你仍然感到疲倦" },
      { id: "variable", label: "It changes more than I'd like", labelZh: "變化比我想要的還要大", next: "changing-pattern", insight: "Your mornings vary from day to day", insightZh: "你的早晨狀態每天不同" }
    ]
  },
  optimise: {
    id: "optimise",
    question: "If today is already fine, what would make it unmistakably good?",
    questionZh: "如果今天已經還不錯，甚麼會令它變得明確地美好？",
    options: [
      { id: "clearer", label: "A mind that stays where I put it", labelZh: "一個能專注在原地、不亂跑的頭腦", scores: { harmony: 1 }, next: "temperature", insight: "You want to sharpen a good rhythm", insightZh: "你想令良好節奏更加清晰" },
      { id: "fresher", label: "A brighter, cleaner feeling", labelZh: "更明亮、更清爽的感覺", scores: { harmony: 1 }, next: "temperature", insight: "You want a fresher cup", insightZh: "你想要更清新的茶感" },
      { id: "quieter", label: "More room to breathe", labelZh: "更多呼吸的空間", scores: { release: 2 }, next: "tension", insight: "You want more space to unwind", insightZh: "你希望有更多放鬆空間" },
      { id: "meal", label: "Ease after I eat, not heaviness", labelZh: "飯後是輕鬆，而不是沉重", scores: { light: 2 }, next: "digestion", insight: "After-meal comfort matters to you", insightZh: "你重視飯後的舒適感" },
      { id: "explore", label: "Simply a new tea to meet", labelZh: "單純遇見一款新的茶", scores: { harmony: 2 }, next: "temperature", insight: "You want to explore without fixing a problem", insightZh: "你想探索茶，而不是修補問題" }
    ]
  },
  afternoon: {
    id: "afternoon",
    question: "After lunch, where does your energy actually go?",
    questionZh: "午餐後，你的精神實際上去了哪裡？",
    bodySignal: true,
    options: [
      { id: "steady", label: "It holds", labelZh: "維持不變", scores: { harmony: 2 }, next: "temperature", insight: "Your energy stays fairly steady after lunch", insightZh: "午餐後你的精神大致穩定" },
      { id: "slight", label: "It dips, just slightly", labelZh: "有輕微下降", scores: { restore: 1 }, next: "digestion", insight: "You notice a small post-lunch dip", insightZh: "你午餐後有輕微精神下降" },
      { id: "sleepy", label: "It disappears — I could sleep", labelZh: "完全消失——我可以馬上睡著", scores: { restore: 2, light: 1 }, next: "digestion", insight: "Lunch is followed by noticeable sleepiness", insightZh: "午餐後你會明顯眼睏" },
      { id: "heavy", label: "It's replaced by heaviness", labelZh: "被沉重感取代", scores: { light: 3 }, next: "digestion", insight: "Heaviness follows some meals", insightZh: "部分餐後你會感到沉重" },
      { id: "varies", label: "Entirely depends what I ate", labelZh: "完全視乎吃了甚麼", next: "digestion", insight: "Your response changes with the meal", insightZh: "你的狀態會隨食物而改變" }
    ]
  },
  "sleep-pattern": {
    id: "sleep-pattern",
    question: "Which of these is closer to your nights than you'd like?",
    questionZh: "以下哪一種，比你想像中更貼近你最近的夜晚？",
    bodySignal: true,
    options: [
      { id: "short", label: "I usually don't get enough sleep, full stop", labelZh: "我通常就是睡眠不足，沒有其他原因", scores: { restore: 2 }, next: "recovery", insight: "Your sleep time is often too short", insightZh: "你的睡眠時間經常不足" },
      { id: "waking", label: "Sleep starts fine, then breaks apart", labelZh: "睡眠一開始還好，之後就斷斷續續", scores: { settle: 2, replenish: 1 }, next: "tension", insight: "Your sleep is often interrupted", insightZh: "你的睡眠經常中斷" },
      { id: "enough-tired", label: "Enough hours, wrong kind of rest", labelZh: "時數足夠，但不是真正的休息", scores: { restore: 3 }, next: "energy-context", insight: "Enough sleep does not always feel restorative", insightZh: "足夠睡眠未必令你感覺恢復" },
      { id: "switch-off", label: "My mind won't clock out before I do", labelZh: "腦袋比我更晚才願意下班", scores: { settle: 3, release: 1 }, next: "tension", insight: "Your mind stays active before sleep", insightZh: "睡前你的腦袋仍然活躍" },
      { id: "inconsistent", label: "No real pattern to point to", labelZh: "沒有一個固定可以指出的模式", next: "temperature", insight: "Your sleep has no single pattern", insightZh: "你的睡眠沒有單一固定模式" }
    ]
  },
  "changing-pattern": {
    id: "changing-pattern",
    question: "When your rhythm shifts, what does it usually follow?",
    questionZh: "當你的節奏出現變化，通常跟甚麼有關？",
    context: "You do not need to know the exact cause.",
    contextZh: "你不需要知道確實原因。",
    bodySignal: true,
    options: [
      { id: "sleep", label: "How much I slept", labelZh: "睡眠時間", scores: { restore: 2 }, next: "recovery", insight: "Your rhythm changes with sleep", insightZh: "你的節奏會隨睡眠改變" },
      { id: "meals", label: "What or when I ate", labelZh: "吃了甚麼或進食時間", scores: { light: 2 }, next: "digestion", insight: "Meals appear connected to the change", insightZh: "進食似乎與狀態變化有關" },
      { id: "stress", label: "How much pressure I was carrying", labelZh: "當日承載的壓力有多少", scores: { release: 2 }, next: "tension", insight: "Your rhythm changes with pressure", insightZh: "你的節奏會隨壓力改變" },
      { id: "weather", label: "The weather or temperature", labelZh: "天氣或溫度", scores: { warm: 1, cool: 1 }, next: "temperature", insight: "Temperature appears to affect your rhythm", insightZh: "溫度似乎會影響你的節奏" },
      { id: "unclear", label: "Honestly, I'm not sure", labelZh: "老實說，我不確定", next: "temperature", insight: "There is no obvious trigger yet", insightZh: "目前未有明顯觸發因素" }
    ]
  },
  temperature: {
    id: "temperature",
    question: "Lately, which temperature does your body seem to be asking for?",
    questionZh: "最近，你的身體似乎在為哪一種溫度爭取？",
    bodySignal: true,
    options: [
      { id: "comfortable", label: "Generally comfortable, no complaints", labelZh: "大致舒適，沒有甚麼好抱怨", scores: { harmony: 2 }, next: "inner", insight: "Your body temperature feels comfortable", insightZh: "你的冷熱感大致舒適" },
      { id: "cold", label: "Warmth. I feel cold easily", labelZh: "溫暖。我比較容易怕冷", scores: { warm: 3 }, next: "inner", insight: "You tend to prefer warmth", insightZh: "你較容易怕冷、偏好溫暖" },
      { id: "hot", label: "Cool. I run hot and restless", labelZh: "清涼。我容易覺得燥熱不安", scores: { cool: 3 }, next: "inner", insight: "Warmth or restlessness is noticeable", insightZh: "燥熱或煩躁感較明顯" },
      { id: "dry", label: "Moisture — dryness is the louder signal", labelZh: "滋潤——乾燥感是更明顯的訊號", scores: { replenish: 3 }, next: "inner", insight: "Dryness is the clearer signal", insightZh: "乾燥感是較清晰的訊號" },
      { id: "variable", label: "It changes too much to say", labelZh: "變化太大，難以判斷", next: "inner", insight: "Your temperature pattern varies", insightZh: "你的冷熱感並不固定" }
    ]
  },
  digestion: {
    id: "digestion",
    question: "After an ordinary meal, what does your body actually report back?",
    questionZh: "吃過普通一餐後，你的身體實際上給你甚麼回饋？",
    bodySignal: true,
    options: [
      { id: "comfortable", label: "Comfortable, nothing to note", labelZh: "舒適，沒有特別要留意的", scores: { harmony: 2 }, next: "inner", insight: "Meals usually feel comfortable", insightZh: "你進食後通常感覺舒適" },
      { id: "sleepy", label: "A pull toward sleep", labelZh: "一股想睡的拉力", scores: { restore: 1, light: 2 }, next: "inner", insight: "Sleepiness is noticeable after meals", insightZh: "進食後眼睏較為明顯" },
      { id: "heavy", label: "Heaviness or bloating", labelZh: "沉重感或脹氣", scores: { light: 3 }, next: "inner", insight: "Heaviness or bloating follows meals", insightZh: "進食後會出現沉重或脹氣感" },
      { id: "heartburn", label: "Sometimes heartburn or discomfort", labelZh: "有時會胃酸或不適", stomachSensitive: true, next: "inner", insight: "Some meals are followed by stomach discomfort", insightZh: "部分餐後會出現胃部不適" },
      { id: "varies", label: "Entirely depends on the meal", labelZh: "完全視乎吃了甚麼", next: "inner", insight: "Your response depends on the meal", insightZh: "你的反應會隨食物改變" }
    ]
  },
  tension: {
    id: "tension",
    question: "When your mind won't switch off, what is it usually still holding?",
    questionZh: "腦袋停不下來時，通常還在承載甚麼？",
    context: "You can choose “I prefer not to answer.”",
    contextZh: "你可以選擇「不想回答」。",
    bodySignal: true,
    options: [
      { id: "work", label: "Work or something unfinished", labelZh: "工作，或一件未完成的事情", scores: { release: 2, settle: 1 }, next: "inner", insight: "Unfinished tasks stay with you", insightZh: "未完成的事情會留在腦中" },
      { id: "tomorrow", label: "Whatever comes next", labelZh: "接下來要面對的事情", scores: { settle: 2 }, next: "inner", insight: "Your mind keeps planning ahead", insightZh: "你的腦袋會不停計劃之後的事" },
      { id: "conversations", label: "A conversation or a feeling that stayed", labelZh: "一段留下來的對話或感受", scores: { release: 3 }, next: "inner", insight: "Conversations or feelings linger", insightZh: "對話或感受會留在心中" },
      { id: "phone", label: "Whatever my phone last showed me", labelZh: "手機最後給我看的東西", scores: { settle: 2 }, next: "inner", insight: "Phone input keeps the mind active", insightZh: "手機資訊令腦袋保持活躍" },
      { id: "skip", label: "I'd rather not say", labelZh: "我不想回答", next: "inner", insight: "You chose to keep this private", insightZh: "你選擇保留這部分" }
    ]
  },
  recovery: {
    id: "recovery",
    question: "Right before you feel worn down, what's usually missing?",
    questionZh: "在你感到被消耗之前，通常缺少了甚麼？",
    bodySignal: true,
    options: [
      { id: "sleep", label: "Enough sleep", labelZh: "足夠睡眠", scores: { restore: 3 }, next: "inner", insight: "Sleep is the clearest missing piece", insightZh: "睡眠是最明顯缺少的一環" },
      { id: "quiet", label: "Any real quiet", labelZh: "任何真正的安靜", scores: { release: 2 }, next: "inner", insight: "Quiet time is often missing", insightZh: "你經常缺少安靜時間" },
      { id: "meals", label: "Meals at a decent hour", labelZh: "在合理時間好好吃一餐", scores: { restore: 2 }, next: "inner", insight: "Regular meals are often missing", insightZh: "你經常未能定時進食" },
      { id: "warmth", label: "Warmth, and a slower start", labelZh: "溫暖，以及較慢的開始", scores: { warm: 2, restore: 1 }, next: "inner", insight: "Warmth and a slower start feel supportive", insightZh: "溫暖和慢慢開始對你較有幫助" },
      { id: "unclear", label: "Honestly, no clear pattern", labelZh: "老實說，沒有明顯模式", next: "inner", insight: "There is no single missing piece", insightZh: "目前沒有單一明顯缺少的部分" }
    ]
  },
  "energy-context": {
    id: "energy-context",
    question: "That tiredness — when does it actually show up?",
    questionZh: "那份疲倦——它實際上在甚麼時候出現？",
    bodySignal: true,
    options: [
      { id: "morning", label: "Soon after I wake up", labelZh: "起床後不久", scores: { restore: 2 }, next: "inner", insight: "Tiredness is strongest in the morning", insightZh: "疲倦感在早上最明顯" },
      { id: "meals", label: "Right after I eat", labelZh: "剛吃完之後", scores: { light: 3 }, next: "inner", insight: "Tiredness is linked to meals", insightZh: "疲倦感與進食有關" },
      { id: "busy", label: "After a day that demanded too much", labelZh: "在一個要求過多的日子之後", scores: { restore: 2, release: 1 }, next: "inner", insight: "Demanding days leave you depleted", insightZh: "忙碌的一天會令你感到消耗" },
      { id: "allday", label: "It just stays, most of the day", labelZh: "幾乎一整天都在", scores: { restore: 3 }, next: "inner", insight: "Tiredness lasts through much of the day", insightZh: "疲倦感持續大部分時間" },
      { id: "variable", label: "No fixed time — it just arrives", labelZh: "沒有固定時間——它就是會出現", next: "inner", insight: "Tiredness has no fixed timing", insightZh: "疲倦感沒有固定時間" }
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
      { id: "enough", label: "Honestly, I already have enough", labelZh: "老實說，我現在已經足夠", scores: { harmony: 2 }, next: "rest", insight: "You feel adequately supported", insightZh: "你感覺目前得到足夠支持" },
      { id: "skip", label: "I'd rather not say", labelZh: "我不想回答", next: "rest", insight: "You chose to keep this private", insightZh: "你選擇保留這部分" }
    ]
  },
  rest: {
    id: "rest",
    question: "When rest is finally available, what actually happens?",
    questionZh: "當終於有時間休息，實際上會發生甚麼？",
    bodySignal: true,
    options: [
      { id: "natural", label: "I switch off, without trying to", labelZh: "我會自然停下來，不需要刻意嘗試", scores: { harmony: 2 }, next: "flavour", insight: "You can usually switch off naturally", insightZh: "你通常可以自然停下來" },
      { id: "scroll", label: "I keep scrolling instead", labelZh: "我反而會繼續滑手機", scores: { settle: 1, release: 1 }, next: "flavour", insight: "Rest often turns into more phone input", insightZh: "休息時間經常變成更多手機資訊" },
      { id: "mind", label: "My mind keeps running the day", labelZh: "腦袋仍在重播這一天", scores: { settle: 2, release: 1 }, next: "flavour", insight: "Your mind keeps working during rest", insightZh: "休息時你的腦袋仍然運轉" },
      { id: "sleep", label: "Rest becomes sleep almost immediately", labelZh: "休息幾乎馬上變成睡眠", scores: { restore: 2 }, next: "flavour", insight: "Rest quickly becomes sleep", insightZh: "一休息你便很快睡著" },
      { id: "rarely", label: "That time rarely actually arrives", labelZh: "這種時間其實很少真正出現", scores: { restore: 1, release: 1 }, next: "flavour", insight: "You rarely get uninterrupted rest", insightZh: "你很少有不受打擾的休息時間" }
    ]
  },
  flavour: {
    id: "flavour",
    question: "Which cup, just from the description, pulls you in?",
    questionZh: "單憑描述，哪一杯茶最吸引你？",
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
    question: "Last thing — how does caffeine usually treat you?",
    questionZh: "最後一題——咖啡因通常怎樣對待你？",
    options: [
      { id: "comfortable", label: "No noticeable problem", labelZh: "沒有明顯問題", caffeine: "comfortable", insight: "Caffeine does not usually bother you", insightZh: "咖啡因通常不會令你不適" },
      { id: "alert", label: "It can tip me into too alert", labelZh: "有時會令我過度精神", caffeine: "alert", scores: { settle: 1 }, insight: "Caffeine can make you too alert", insightZh: "咖啡因有時令你過度精神" },
      { id: "sleep", label: "It follows me into the night", labelZh: "它會跟著我到晚上", caffeine: "sleep", scores: { settle: 2 }, insight: "Caffeine can affect your sleep", insightZh: "咖啡因可能影響你的睡眠" },
      { id: "sensitive", label: "I'm quite sensitive to it", labelZh: "我對咖啡因比較敏感", caffeine: "sensitive", scores: { settle: 2 }, insight: "You are sensitive to caffeine", insightZh: "你對咖啡因比較敏感" },
      { id: "unsure", label: "Honestly, I've never tracked it", labelZh: "老實說，我從未留意過", caffeine: "unsure", insight: "Your caffeine response is unclear", insightZh: "你未確定咖啡因對自己的影響" }
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
  const fitReasons: Record<ResultKey, [string, string]> = {
    harmony: ["A clean, aromatic cup supports enjoyment and focus without treating a problem you do not have.", "清爽有香氣的茶，適合在狀態穩定時享受與集中，不需要製造問題。"],
    restore: ["A rounded, roasted direction feels gentler than chasing tiredness with an increasingly strong brew.", "圓潤、帶烘焙感的方向，比起用愈來愈濃的茶硬撐疲倦更柔和。"],
    warm: ["Roasted aromas and a fuller cup match your preference for warmth and a steadier start.", "烘焙香與較飽滿的茶感，配合你偏向溫暖與穩定開始的需要。"],
    cool: ["A light floral direction creates a cleaner pause when heat or restlessness feels more noticeable.", "當燥熱或心緒不定較明顯時，清淡花香方向可帶來較乾淨的停頓。"],
    replenish: ["A softer, lightly brewed cup keeps the ritual gentle when dryness or overextension stands out.", "當乾燥感或過度消耗較明顯時，柔和淡泡的茶感更適合作為日常儀式。"],
    light: ["A mellow, lightly brewed direction suits the moments when meals leave you feeling heavy or slow.", "當用餐後容易覺得沉重或緩慢時，醇和淡泡的方向較容易配合。"],
    release: ["A fragrant cup gives you a sensory cue to step out of busy mode and create mental space.", "有香氣的飲品可成為感官提示，幫你離開忙碌狀態並留出思緒空間。"],
    settle: ["A gentle Chinese tea can support the slowing-down ritual, but it still contains caffeine and may suit an earlier pause better.", "柔和的中國茶可以配合放慢節奏的儀式，但仍然含咖啡因，較適合安排在日間較早時段。"]
  };
  let primary = profile.primaryTea;
  let primaryZh = profile.primaryTeaZh;
  let alternative = profile.alternativeTea;
  let alternativeZh = profile.alternativeTeaZh;
  let caution = profile.caution;
  let cautionZh = profile.cautionZh;
  let suitable = `${profile.primaryTea}, ${profile.alternativeTea}`;
  let suitableZh = `${profile.primaryTeaZh}、${profile.alternativeTeaZh}`;
  let [fit, fitZh] = fitReasons[profile.key];
  let matchLabel = "Your Chinese tea match";
  let matchLabelZh = "你的中國茶配對";

  if (profile.key === "harmony") {
    const harmonyChoices: Record<FlavourKey, [string, string, string, string]> = {
      fresh: ["Light Tieguanyin", "清香型鐵觀音", "Longjing green tea", "龍井綠茶"],
      floral: ["Jasmine tea", "茉莉花茶", "Floral oolong", "花香烏龍"],
      warm: ["Roasted oolong", "焙火烏龍", "Chinese black tea", "中國紅茶"],
      deep: ["Ripe pu-erh", "熟普洱", "Wuyi rock oolong", "武夷岩茶"],
      surprise: ["Light Tieguanyin", "清香型鐵觀音", "Seasonal Chazen selection", "Chazen 時令茶選"]
    };
    [primary, primaryZh, alternative, alternativeZh] = harmonyChoices[result.flavour ?? "surprise"];
    suitable = `${primary}, ${alternative}`;
    suitableZh = `${primaryZh}、${alternativeZh}`;
  }

  if (result.caffeine === "sleep" || result.caffeine === "sensitive") {
    const caffeineFreeFlowerChoices: Record<ResultKey, [string, string, string, string]> = {
      harmony: ["Pure rose infusion", "純玫瑰花飲", "Pure osmanthus infusion", "純桂花飲"],
      restore: ["Pure rose infusion", "純玫瑰花飲", "Pure osmanthus infusion", "純桂花飲"],
      warm: ["Pure osmanthus infusion", "純桂花飲", "Pure rose infusion", "純玫瑰花飲"],
      cool: ["Pure chrysanthemum infusion", "純菊花飲", "Pure rose infusion", "純玫瑰花飲"],
      replenish: ["Pure chrysanthemum infusion", "純菊花飲", "Pure osmanthus infusion", "純桂花飲"],
      light: ["Pure osmanthus infusion", "純桂花飲", "Pure rose infusion", "純玫瑰花飲"],
      release: ["Pure rose infusion", "純玫瑰花飲", "Pure osmanthus infusion", "純桂花飲"],
      settle: ["Pure rose infusion", "純玫瑰花飲", "Pure chrysanthemum infusion", "純菊花飲"]
    };
    const flowerFitReasons: Record<ResultKey, [string, string]> = {
      harmony: ["These pure flower infusions keep the cup light and aromatic while giving you a caffeine-free way to explore flavour.", "這兩款純花飲清香輕盈，讓你可以在無咖啡因的情況下探索自己喜歡的味道。"],
      restore: ["These pure flower infusions create a gentle, aromatic pause without using caffeine to push through tiredness.", "這兩款純花飲以柔和香氣帶來停頓，不需要用咖啡因硬撐疲倦。"],
      warm: ["Osmanthus and rose offer a soft, rounded floral experience without adding caffeine.", "桂花與玫瑰帶來柔和圓潤的花香，同時不會加入咖啡因。"],
      cool: ["Chrysanthemum and rose give you a clean, floral direction without a caffeinated tea base.", "菊花與玫瑰提供清爽花香方向，而且不使用含咖啡因茶底。"],
      replenish: ["These pure flower infusions keep the ritual soft, fragrant, and free from caffeine.", "這兩款純花飲令整個飲用體驗保持柔和清香，而且不含咖啡因。"],
      light: ["These pure flower infusions offer a lighter aromatic cup without relying on a caffeinated tea base.", "這兩款純花飲提供較輕盈的香氣體驗，不需要使用含咖啡因茶底。"],
      release: ["Rose and osmanthus use aroma as a cue to step out of busy mode, without adding caffeine.", "玫瑰與桂花以香氣提示你離開忙碌狀態，同時不會加入咖啡因。"],
      settle: ["These pure flower infusions keep the ritual caffeine-free, so the drink itself does not add another stimulant.", "這兩款純花飲不含咖啡因，避免飲品本身再增加刺激。"]
    };
    [primary, primaryZh, alternative, alternativeZh] = caffeineFreeFlowerChoices[profile.key];
    suitable = `${primary}, ${alternative}`;
    suitableZh = `${primaryZh}、${alternativeZh}`;
    matchLabel = "Your caffeine-free Chinese flower infusion match";
    matchLabelZh = "你的無咖啡因中式花飲配對";
    [fit, fitZh] = flowerFitReasons[profile.key];
    caution = "These recommendations are caffeine-free only when they contain pure flowers and no green, white, oolong, black, or dark tea base. Check ingredients carefully; ask a qualified health professional first if you take medicines, are pregnant, or have allergies or ongoing symptoms.";
    cautionZh = "只有在配方使用純花、不含綠茶、白茶、烏龍、紅茶或黑茶茶底時，這些建議才屬無咖啡因。請細閱成分；如正服藥、懷孕、有過敏或持續症狀，應先向合資格專業人士查詢。";
  }

  if (result.stomachSensitive) {
    if (profile.key === "light" && result.caffeine !== "sleep" && result.caffeine !== "sensitive") {
      primary = "Lightly brewed roasted oolong";
      primaryZh = "淡泡焙火烏龍";
      suitable = `${primary}, ${alternative}`;
      suitableZh = `${primaryZh}、${alternativeZh}`;
    }
    caution = `${caution} You also mentioned stomach discomfort. Do not use tea as a treatment; seek professional advice if symptoms persist or worsen.`;
    cautionZh = `${cautionZh} 你亦提到胃部不適。不要將茶當作治療；如果情況持續或加劇，應尋求專業意見。`;
  }

  return { primary, primaryZh, alternative, alternativeZh, suitable, suitableZh, fit, fitZh, matchLabel, matchLabelZh, caution, cautionZh };
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState("character");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const currentQuestion = questions[currentQuestionId];
  const result = useMemo(() => calculateResult(answers), [answers]);
  const tea = useMemo(() => getTeaRecommendation(result), [result]);
  const progress = phase === "intro" ? 0 : Math.min((answers.length / TOTAL_QUESTIONS) * 100, 100);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setPhase("result"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const quizAnchorRef = useRef<HTMLDivElement | null>(null);
  const skipScrollOnMount = useRef(true);

  // Keep the question in view whenever the quiz advances — without this, the
  // next question can render off-screen and the transition reads as a glitch.
  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    if (phase !== "question" && phase !== "loading" && phase !== "result") return;
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    quizAnchorRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
  }, [phase, currentQuestionId]);

  function handleStart() {
    setAnswers([]);
    setCurrentQuestionId("character");
    setSaveState("idle");
    setPhase("question");
  }

  function handleAnswer(option: AssessmentOption) {
    // Ignore further clicks while the selected answer is being acknowledged,
    // so a double-click can't record two answers or skip a question.
    if (selectedOptionId) return;

    setSelectedOptionId(option.id);
    setSaveState("idle");

    // Let the selection state register visually before the question changes —
    // an instant switch reads as a glitch rather than progress.
    window.setTimeout(() => {
      const nextAnswers = [...answers, { questionId: currentQuestion.id, optionId: option.id }];
      setAnswers(nextAnswers);
      setSelectedOptionId(null);

      if (nextAnswers.length >= TOTAL_QUESTIONS || !option.next) {
        setPhase("loading");
        return;
      }

      setCurrentQuestionId(option.next ?? "goal");
    }, 450);
  }

  function handleBack() {
    if (answers.length === 0 || selectedOptionId) return;
    const previous = answers[answers.length - 1];
    setAnswers((current) => current.slice(0, -1));
    setCurrentQuestionId(previous.questionId);
    setSaveState("idle");
  }

  function handleRestart() {
    setAnswers([]);
    setCurrentQuestionId("character");
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
      `${t("Fits naturally into", "自然融入這些時刻")}: ${t(result.primary.timing, result.primary.timingZh)}`,
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
  const fullPlanHref = buildInquiryPath({
    basePath,
    type: "Tea recommendation",
    message: `I completed the Chazen Tea Rhythm Test. My result is ${result.primary.englishName}, and my tea match is ${tea.primary}. I would like the A$25 First Pack with my matched tea, full Tea Rhythm Report, brewing guide, and member access.`,
    source: "Tea Rhythm Full Plan"
  });
  const routeHref = (path: string) => `${basePath}${path}`;

  return (
    <main className={`assessment-page tea-mind-page ${styles.scope}`}>
      <section className="assessment-hero tea-mind-hero" aria-labelledby="assessment-title">
        <Image
          src={`${basePath}/images/chazen-hero-gongfu-room-v3.jpg`}
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
              "Notice the pattern behind your recent energy, rest, digestion, and inner pace. Leave with a tea direction, the best time to drink it, and a simple ritual you can actually use.",
              "留意最近精神、休息、消化與內在節奏之間的脈絡，找出適合你的茶、飲用時間，以及真正做得到的簡單茶儀式。"
            )}
          </p>
          <div className="tea-mind-character-rail" aria-label="Assessment principles">
            <span><strong>今</strong><em>{t("Current rhythm", "當下節奏")}</em></span>
            <span><strong>茶</strong><em>{t("Personal tea match", "個人茶配對")}</em></span>
            <span><strong>行</strong><em>{t("Practical next steps", "可行下一步")}</em></span>
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
          <div
            className="tea-mind-progress"
            aria-label="Assessment progress"
            ref={quizAnchorRef}
            style={{ scrollMarginTop: 96 }}
          >
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
              <p className="museum-kicker">{t("Your tea, with a reason", "適合你的茶，也有清楚原因")}</p>
              <h2>{t("Understand your current rhythm. Find the tea that fits it.", "了解目前節奏，找到真正適合你的茶。")}</h2>
              <p>
                {t(
                  "This short reflection helps you make sense of how you have felt lately, then turns those observations into a practical tea direction. You can receive a balanced result too — the test will never invent a problem just to recommend a product.",
                  "這個簡短測試會整理你最近的感受，再將觀察轉化成實際選茶方向。狀態平衡亦是一個真正結果；測試不會為了推薦產品而製造你沒有的問題。"
                )}
              </p>
              <ul className="tea-mind-purpose-list" aria-label={t("What you will receive", "你會得到甚麼")}>
                <li><Check size={17} aria-hidden="true" />{t("A clear reading of your current rhythm", "清楚了解你目前的生活節奏")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A tea match, an alternative, and the best time to drink it", "適合的茶、另一選擇與最佳飲用時間")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A practical seven-day approach", "一個實際可行的七日方向")}</li>
              </ul>
              <button type="button" className="tea-mind-primary-action" onClick={handleStart}>
                {t("Discover My Tea Rhythm", "找出我的茶節奏")}
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
                    aria-checked={selectedOptionId === option.id}
                    key={`${currentQuestion.id}-${option.id}`}
                    className={
                      selectedOptionId
                        ? selectedOptionId === option.id
                          ? "is-selected"
                          : "is-dimmed"
                        : undefined
                    }
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="tea-mind-option-mark">{String.fromCharCode(65 + index)}</span>
                    <span>{t(option.label, option.labelZh)}</span>
                  </button>
                ))}
              </div>
              {answers.length > 0 ? (
                <button type="button" className="tea-mind-back-button" onClick={handleBack}>
                  <ArrowLeft size={14} aria-hidden="true" /> {t("Back to the previous question", "回到上一題")}
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
              <div className="tea-mind-report-heading">
                <span>{t("Free personal summary", "免費個人摘要")}</span>
                <em>{t("Included with your test", "完成測試即可查看")}</em>
              </div>
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
                  <span>{t("Fits naturally into", "自然融入這些時刻")}</span>
                  <p>{t(result.primary.timing, result.primary.timingZh)}</p>
                </article>
              </div>

              <article className="tea-mind-detail-grid">
                <article>
                  <h4>{t("The signals behind your result", "結果背後的訊號")}</h4>
                  <ul>
                    {result.evidence.length > 0 ? result.evidence.map((option) => (
                      <li key={option.id}>{t(option.insight, option.insightZh)}</li>
                    )) : <li>{t("No single discomfort pattern stood out.", "沒有單一不適模式特別明顯。")}</li>}
                  </ul>
                </article>
                <article>
                  <h4>{t("Your seven-day experiment", "你的七日小實驗")}</h4>
                  <ol>
                    {(language === "zh" ? result.primary.strategiesZh : result.primary.strategies).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              </article>

              <div className="tea-mind-product-panel">
                <div>
                  <span>{t(tea.matchLabel, tea.matchLabelZh)}</span>
                  <strong>{t(tea.primary, tea.primaryZh)}</strong>
                  <p>
                    {t("Alternative", "另一選擇")}: {t(tea.alternative, tea.alternativeZh)}
                  </p>
                  <p className="tea-mind-tea-fit">
                    <b>{t("Why these fit", "為甚麼適合")}: </b>{t(tea.fit, tea.fitZh)}
                  </p>
                  <p className="tea-mind-suitable-teas">
                    <b>{t("Suitable tea directions", "適合的茶飲方向")}: </b>{t(tea.suitable, tea.suitableZh)}
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

              <section className="tea-mind-full-plan" aria-labelledby="full-plan-title">
                <div className="tea-mind-full-plan-copy">
                  <p className="museum-kicker">{t("The complete Chazen plan", "完整茶禪個人方案")}</p>
                  <h3 id="full-plan-title">{t("Do not buy a report. Start with the right tea and a plan for using it.", "不只是買一份報告，而是帶走適合你的茶與實行方案。")}</h3>
                  <p>
                    {t(
                      "The A$25 First Pack brings the insight, the tea, and the next step together. Your full report explains how your answers connect; your matched tea lets you put the plan into practice.",
                      "A$25 初次體驗包將理解、茶葉與下一步放在一起。完整報告會解釋答案之間的關係；配對茶葉則讓你真正實踐建議。"
                    )}
                  </p>
                  <div className="tea-mind-plan-price">
                    <strong>A$25</strong>
                    <span>{t("One-time First Pack", "一次性初次體驗包")}</span>
                  </div>
                  <a className="tea-mind-unlock-button" href={fullPlanHref}>
                    {t("Get My Complete Tea Plan", "取得我的完整茶方案")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <small>{t("Product details, availability, and delivery are confirmed before payment.", "產品內容、供應與配送會在付款前確認。")}</small>
                </div>

                <div className="tea-mind-plan-includes">
                  <span>{t("One purchase, four connected parts", "一次購買，四個互相配合的部分")}</span>
                  <ul>
                    <li><strong>{t("Your matched starter tea", "你的配對入門茶")}</strong><em>{t(tea.primary, tea.primaryZh)}</em></li>
                    <li><strong>{t("Full Tea Rhythm Report", "完整茶節奏報告")}</strong><em>{t("Answer-by-answer interpretation, personal watch-points, and a detailed seven-day plan", "逐題分析、個人留意重點與詳細七日方案")}</em></li>
                    <li><strong>{t("Personal brewing guide", "個人沖泡指南")}</strong><em>{t("Tea strength, timing, and a gentler alternative", "茶湯濃度、飲用時間與較柔和替代選擇")}</em></li>
                    <li><strong>{t("Chazen Free Member access", "茶禪免費會員身份")}</strong><em>{t("Member updates, birthday tea note, and early product news after your first purchase", "首次購買後獲得會員更新、生日茶語與新品消息")}</em></li>
                  </ul>
                </div>
              </section>

              <section className="tea-mind-locked" aria-label={t("Full report preview", "完整報告預覽")}>
                <div className="tea-mind-locked-preview" aria-hidden="true">
                  <p>{t("Inside your full Tea Rhythm Report", "完整茶節奏報告內容")}</p>
                  <div className="tea-mind-locked-grid">
                    <span>{t("Your dominant and secondary signals", "主要與次要訊號")}</span>
                    <span>{t("How context changed your result", "情境如何影響結果")}</span>
                    <span>{t("Seven-day tea and timing schedule", "七日飲茶與時間安排")}</span>
                    <span>{t("What to notice before your next check-in", "下次檢視前的留意重點")}</span>
                  </div>
                </div>
                <div className="tea-mind-locked-overlay">
                  <LockKeyhole size={24} aria-hidden="true" />
                  <p>{t("Your free summary gives you the direction. The complete report shows how to apply it day by day.", "免費摘要提供方向；完整報告則逐日說明如何實行。")}</p>
                  <span>{t("Included in the A$25 First Pack", "已包括在 A$25 初次體驗包內")}</span>
                </div>
              </section>

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
