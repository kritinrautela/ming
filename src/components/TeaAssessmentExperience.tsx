"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, LockKeyhole, Loader2, RotateCcw } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";
import styles from "./TeaAssessmentExperience.module.css";

type Dimension = "pressure" | "calm" | "focus" | "energy" | "sleep" | "emotional" | "grounding" | "ritualReadiness";
type TagKey = "solo" | "sound" | "social" | "quick" | "full" | "deep" | "minimal" | "light" | "rock" | "warm" | "neutral" | "taste" | "grounding";
type ResultKey = "mountainCalm" | "rockStability" | "sunlitFocus" | "eveningWindDown" | "balancedHarmony" | "beginnerGentle";

type AssessmentOption = {
  id: string;
  label: string;
  labelZh: string;
  detail: string;
  detailZh: string;
  scores?: Partial<Record<Dimension, number>>;
  tags?: Partial<Record<TagKey, number>>;
  anchor?: string;
  anchorZh?: string;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  questionZh: string;
  multi?: boolean;
  max?: number;
  options: AssessmentOption[];
};

type Answer = {
  questionId: string;
  optionIds: string[];
};

type ResultProfile = {
  key: ResultKey;
  character: string;
  chineseName: string;
  englishName: string;
  summary: string;
  summaryZh: string;
  reading: string;
  readingZh: string;
  mainTea: string;
  mainTeaZh: string;
  mainTeaCopy: string;
  mainTeaCopyZh: string;
  flowerTea: string;
  flowerTeaZh: string;
  flowerTeaCopy: string;
  flowerTeaCopyZh: string;
  ritual: string[];
  ritualZh: string[];
  product: string;
  productZh: string;
};

const TOTAL_QUESTIONS = 10;

const resultProfiles: Record<ResultKey, ResultProfile> = {
  mountainCalm: {
    key: "mountainCalm",
    character: "靜",
    chineseName: "山中靜心",
    englishName: "Mountain Calm",
    summary: "Your pressure wants quiet space, softer evenings, and a tea that helps the mind come down gently.",
    summaryZh: "你的壓力渴望安靜的空間、更柔和的夜晚，以及一杯能讓心慢慢沉澱的茶。",
    reading: "Mountain Calm appears when pressure is high and the deeper need is calm. This profile does not ask you to become more productive. It gives you a pale cup, slow breath, and a small return to yourself.",
    readingZh: "當壓力偏高、內心真正需要的是平靜時，便會出現「山中靜心」。這不是要你變得更有效率，而是給你一杯淡雅的茶、一段緩慢的呼吸，以及一次微小的回歸自己。",
    mainTea: "Bai Hao Yin Zhen White Tea",
    mainTeaZh: "白毫銀針白茶",
    mainTeaCopy: "Light white tea for softness, spaciousness, and a clean evening reset.",
    mainTeaCopyZh: "清淡白茶，帶來柔和、寬闊感與潔淨的晚間收尾。",
    flowerTea: "Chrysanthemum or Lily",
    flowerTeaZh: "菊花或百合",
    flowerTeaCopy: "A gentle flower pairing for cooling the mood and softening the edges of the day.",
    flowerTeaCopyZh: "溫和花茶配搭，舒緩情緒、柔化一天的稜角。",
    ritual: ["Use low light and a quiet cup.", "Warm the cup before brewing.", "Pour slowly and breathe for four counts.", "Take the first sip without checking your phone.", "End with one minute of silence."],
    ritualZh: ["調暗燈光，選一個安靜的杯子。", "沖泡前先溫杯。", "緩緩注水，數四下呼吸。", "第一口茶前，先放下手機。", "以一分鐘的靜默作結。"],
    product: "Mountain Calm Tea Selection",
    productZh: "山中靜心茶選"
  },
  rockStability: {
    key: "rockStability",
    character: "定",
    chineseName: "岩骨安定",
    englishName: "Rock Stability",
    summary: "Your answers point toward grounding, strength, and a tea with enough depth to hold pressure.",
    summaryZh: "你的答案指向扎根、力量，以及一杯足以承載壓力的茶。",
    reading: "Rock Stability is a profile of backbone. You may be carrying pressure, but your system wants structure rather than sweetness alone. A roasted mineral cup gives the ritual weight, warmth, and steadiness.",
    readingZh: "「岩骨安定」是有骨氣的結果。你或許正承受壓力，但你的系統需要的是結構，而不只是甜味。焙火帶礦物感的茶，能為儀式帶來份量、溫度與穩定。",
    mainTea: "Da Hong Pao Rock Oolong",
    mainTeaZh: "大紅袍岩茶",
    mainTeaCopy: "A roasted Wuyi-style oolong for mineral depth, warmth, and grounded presence.",
    mainTeaCopyZh: "焙火武夷岩茶，帶來礦物深度、溫暖與扎根感。",
    flowerTea: "Osmanthus",
    flowerTeaZh: "桂花",
    flowerTeaCopy: "A golden floral lift that softens roasted depth without losing strength.",
    flowerTeaCopyZh: "金黃花香，柔化焙火的深度，同時不失力量。",
    ritual: ["Warm the cup until it holds heat.", "Take one grounded breath before pouring.", "Use a small serving and short infusion.", "Notice roast, mineral, and returning sweetness.", "Use the final sip as a boundary between tasks."],
    ritualZh: ["溫杯直到留住熱度。", "注水前先做一次扎根呼吸。", "份量小、沖泡時間短。", "留意焙火、礦物與回甘。", "以最後一口作為工作之間的界線。"],
    product: "Rock Stability Tea Selection",
    productZh: "岩骨安定茶選"
  },
  sunlitFocus: {
    key: "sunlitFocus",
    character: "晨",
    chineseName: "晨光專注",
    englishName: "Sunlit Focus",
    summary: "You need clarity, precision, and clean energy without becoming overstimulated.",
    summaryZh: "你需要清晰、精準，以及不會過度刺激的乾淨能量。",
    reading: "Sunlit Focus belongs to people who want the mind to become bright, not frantic. Your tea should feel green, clean, and deliberate, like opening a window before beginning meaningful work.",
    readingZh: "「晨光專注」屬於希望頭腦明亮、而非急躁的人。你的茶應該清爽、乾淨、有意識，就像在開始重要工作前先打開一扇窗。",
    mainTea: "Longjing Green Tea",
    mainTeaZh: "龍井綠茶",
    mainTeaCopy: "A clear green tea for focus, freshness, and light structure.",
    mainTeaCopyZh: "清澈綠茶，帶來專注、清新與輕盈的結構。",
    flowerTea: "Jasmine Buds",
    flowerTeaZh: "茉莉花蕾",
    flowerTeaCopy: "A fragrant companion for clarity and gentle uplift.",
    flowerTeaCopyZh: "芬芳的搭配，帶來清晰感與溫和提振。",
    ritual: ["Prepare tea in the morning or early afternoon.", "Use water that is warm, not boiling.", "Set one intention before pouring.", "Take three sips before opening your laptop.", "Begin the task immediately after the cup."],
    ritualZh: ["在早上或午後較早時沖泡。", "水溫溫熱、非滾燙。", "注水前先設定一個意圖。", "打開電腦前先喝三口。", "喝完後立即開始工作。"],
    product: "Sunlit Focus Tea Selection",
    productZh: "晨光專注茶選"
  },
  eveningWindDown: {
    key: "eveningWindDown",
    character: "夜",
    chineseName: "夜間緩解",
    englishName: "Evening Wind-Down",
    summary: "Your profile asks for a lower-pressure evening, gentler sleep cues, and a ritual that closes the day.",
    summaryZh: "你的結果需要壓力較低的夜晚、更溫和的睡眠提示，以及一個能為一天畫上句號的儀式。",
    reading: "Evening Wind-Down appears when sleep and calm are both important. The tea should not feel like another task. It should become a small threshold: warm cup, dim light, slower breath, then rest.",
    readingZh: "當睡眠與平靜同樣重要時，會出現「夜間緩解」。茶不應該成為另一項任務，而應該成為一個小小的門檻：溫杯、昏暗燈光、更慢的呼吸，然後休息。",
    mainTea: "White Tea or Light Ripe Pu'er",
    mainTeaZh: "白茶或淡泡熟普",
    mainTeaCopy: "A soft, forgiving tea direction for evening quiet and day-end recovery.",
    mainTeaCopyZh: "柔和、寬容的茶感方向，適合夜晚安靜與一天結束後的恢復。",
    flowerTea: "Rose + Jujube",
    flowerTeaZh: "玫瑰紅棗",
    flowerTeaCopy: "A warm floral-fruit blend for softness and emotional ease.",
    flowerTeaCopyZh: "溫暖花果組合，帶來柔軟感與情緒上的舒緩。",
    ritual: ["Begin after dinner or before screen-free time.", "Use dim light and a smaller cup.", "Hold the cup with both hands.", "Exhale longer than you inhale.", "Let the final sip close the day."],
    ritualZh: ["在晚餐後或無螢幕時間前開始。", "燈光昏暗，使用較小的杯子。", "雙手捧杯。", "呼氣比吸氣更長。", "以最後一口為一天作結。"],
    product: "Evening Wind-Down Tea Selection",
    productZh: "夜間緩解茶選"
  },
  balancedHarmony: {
    key: "balancedHarmony",
    character: "和",
    chineseName: "中和安住",
    englishName: "Balanced Harmony",
    summary: "Your needs are balanced. You do not need an extreme tea; you need a steady practice that can meet many kinds of days.",
    summaryZh: "你的需求相對平衡。你不需要極端的茶，而需要一個能應付各種日子的穩定練習。",
    reading: "Balanced Harmony suggests your answers are spread across pressure, focus, rest, and taste. A flexible tea practice suits you best: refined but simple, culturally grounded, and easy to repeat.",
    readingZh: "「中和安住」代表你的答案平均分布在壓力、專注、休息與口感之間。最適合你的是靈活的茶葉練習：精緻但簡單、扎根於文化，而且容易重複。",
    mainTea: "Gentle Oolong or Seasonal Tea Match",
    mainTeaZh: "溫和烏龍或時令配茶",
    mainTeaCopy: "A balanced tea direction chosen by taste: light, roasted, warm, or neutral.",
    mainTeaCopyZh: "按口感選擇的平衡茶感方向：清爽、焙火、溫暖或中性。",
    flowerTea: "Chrysanthemum + Goji",
    flowerTeaZh: "菊花杞子",
    flowerTeaCopy: "A balanced flower pairing for clarity, warmth, and daily ease.",
    flowerTeaCopyZh: "平衡的花茶組合，帶來清晰、溫暖與日常的自在。",
    ritual: ["Use the same cup for seven days.", "Keep the steps simple and repeatable.", "Take one sip before responding to messages.", "Notice body, breath, and room.", "Let the ritual be modest, not perfect."],
    ritualZh: ["連續七天使用同一個杯子。", "保持步驟簡單、可重複。", "回覆訊息前先喝一口。", "留意身體、呼吸與空間。", "讓儀式保持樸實，而非完美。"],
    product: "Balanced Harmony Tea Selection",
    productZh: "中和安住茶選"
  },
  beginnerGentle: {
    key: "beginnerGentle",
    character: "溫",
    chineseName: "溫和新手",
    englishName: "Gentle Beginner",
    summary: "You are best served by an easy tea entry: simple brewing, clear guidance, and a ritual that does not feel difficult.",
    summaryZh: "最適合你的是簡單易上手的茶：簡易沖泡、清楚指引，以及不會令人卻步的儀式。",
    reading: "Gentle Beginner does not mean basic taste. It means the ritual should respect real life. Your Chazen match should be easy to brew, forgiving in timing, and supported by a short ritual card.",
    readingZh: "「溫和新手」不代表口感基本，而是代表儀式應該尊重真實生活。你的 Chazen 配對應該容易沖泡、時間上有彈性，並附有簡短的儀式卡。",
    mainTea: "Easy-Brew White Tea or Gentle Oolong",
    mainTeaZh: "易沖白茶或溫和烏龍",
    mainTeaCopy: "A low-friction tea that tastes refined without requiring advanced tools.",
    mainTeaCopyZh: "低門檻的茶，味道精緻但不需要進階工具。",
    flowerTea: "Jasmine or Chrysanthemum",
    flowerTeaZh: "茉莉或菊花",
    flowerTeaCopy: "A familiar flower direction that adds fragrance and makes the first ritual feel welcoming.",
    flowerTeaCopyZh: "熟悉的花香方向，為第一次儀式增添香氣與親切感。",
    ritual: ["Use a mug, infuser, or simple cup.", "Brew for 3-5 minutes.", "Take three quiet breaths before the first sip.", "Notice one taste word: sweet, warm, floral, or roasted.", "Repeat at the same time tomorrow."],
    ritualZh: ["使用馬克杯、濾茶器或簡單茶杯。", "沖泡三至五分鐘。", "第一口前先靜靜呼吸三次。", "留意一個味道詞：甜、暖、花香或焙火。", "明天在同一時間重複。"],
    product: "Gentle Beginner Tea Selection",
    productZh: "溫和新手茶選"
  }
};

const questions: AssessmentQuestion[] = [
  {
    id: "q1",
    question: "Among people, which role do you most often become?",
    questionZh: "你在人群中，常常成為哪一種角色？",
    options: [
      { id: "quiet", label: "The quiet one, a little apart from the center.", labelZh: "安靜的人，稍微遊離於中心之外。", detail: "I listen more than I speak.", detailZh: "我聆聽多於發言。", scores: { calm: 2 }, tags: { solo: 1 } },
      { id: "anchor", label: "The one others lean on.", labelZh: "別人依靠的對象。", detail: "People settle when I'm steady.", detailZh: "我在時，大家會安定下來。", scores: { grounding: 2 }, tags: { rock: 1 } },
      { id: "warmth", label: "The one who keeps the room warm.", labelZh: "讓氣氛變暖的人。", detail: "I carry the mood, sometimes without meaning to.", detailZh: "我常在不自覺間承擔了整個場合的情緒。", scores: { energy: 2 }, tags: { warm: 1, social: 1 } },
      { id: "spent", label: "The one who arrives already spent.", labelZh: "還未開始就已經很疲累的人。", detail: "I show up, but not all of me does.", detailZh: "我出現了，但不是全部的我都在。", scores: { pressure: 2, sleep: 1 } }
    ]
  },
  {
    id: "q2",
    question: "In a gathering, which chair do you usually take?",
    questionZh: "在聚會裡，你通常會坐在哪一個位置？",
    options: [
      { id: "window", label: "Near the window, slightly outside the circle.", labelZh: "靠近窗邊，稍微遊離圈外。", detail: "Close enough to belong, far enough to breathe.", detailZh: "剛好足夠歸屬，也剛好足夠呼吸。", tags: { solo: 2 } },
      { id: "company", label: "Beside whoever seems to need company.", labelZh: "坐在需要陪伴的人身邊。", detail: "I notice who is quiet and sit there.", detailZh: "我會留意誰比較安靜，然後坐過去。", scores: { emotional: 2 }, tags: { social: 1 } },
      { id: "lively", label: "Wherever the conversation is liveliest.", labelZh: "哪裡最熱鬧就往哪裡去。", detail: "I'm drawn toward the energy in the room.", detailZh: "我會被場合中的能量吸引。", scores: { energy: 1 }, tags: { social: 2 } },
      { id: "desk", label: "Wherever I sat, but my mind is still at my desk.", labelZh: "人坐下了，但思緒仍在辦公桌前。", detail: "Presence is the hardest part.", detailZh: "在場，是最難的部分。", scores: { pressure: 2, focus: 1 } }
    ]
  },
  {
    id: "q3",
    question: "Which quiet struggle do you carry most days?",
    questionZh: "你日常最常帶著的，是哪一種內在拉扯？",
    options: [
      { id: "mind", label: "A mind that will not slow down.", labelZh: "停不下來的思緒。", detail: "Thoughts keep arriving after you've asked them to stop.", detailZh: "即使叫它停下，念頭仍然持續出現。", scores: { calm: 3 } },
      { id: "scatter", label: "Attention that scatters before the task is finished.", labelZh: "還沒做完就已經分心的注意力。", detail: "You begin well, then drift.", detailZh: "你開始得很好，然後就飄走了。", scores: { focus: 3 } },
      { id: "tired", label: "A tiredness that sleep doesn't actually fix.", labelZh: "睡眠也修復不了的疲憊。", detail: "You wake up still owing yourself rest.", detailZh: "醒來後，仍然欠自己一份休息。", scores: { energy: 2, sleep: 1 } },
      { id: "loud", label: "Evenings that stay loud long after the day should have ended.", labelZh: "夜晚在該結束時仍然喧鬧。", detail: "The day won't close on time.", detailZh: "這一天總是無法準時結束。", scores: { sleep: 3 } }
    ]
  },
  {
    id: "q4",
    question: "When that struggle peaks, what do you notice first?",
    questionZh: "這種拉扯最強烈時，你最先察覺到的是？",
    options: [
      { id: "thoughts", label: "My thoughts, not my body.", labelZh: "思緒，而不是身體。", detail: "The noise is entirely internal.", detailZh: "所有的雜音，都完全來自內心。", scores: { calm: 2, emotional: 1 } },
      { id: "body", label: "My body — heavy, wired, or restless.", labelZh: "身體——沉重、緊繃或不安。", detail: "It shows up physically before I can name it.", detailZh: "在我能說出來之前，身體已經先反應。", scores: { energy: 2, pressure: 1 } },
      { id: "patience", label: "My patience — small things land bigger than they should.", labelZh: "耐性——小事的反應變得比例失衡。", detail: "I react before I mean to.", detailZh: "我還沒想清楚，就已經反應了。", scores: { emotional: 2, calm: 1 } },
      { id: "fine", label: "Nothing dramatic. I want refinement, not repair.", labelZh: "沒甚麼特別。我想要的是精煉，而不是修復。", detail: "Your ritual should sharpen a life that already works.", detailZh: "你的儀式，應該令已經運作良好的生活更加細緻。" }
    ]
  },
  {
    id: "q5",
    question: "Which taste direction attracts you first?",
    questionZh: "你偏好茶的口感？",
    options: [
      { id: "fresh", label: "Fresh and light.", labelZh: "清新淡雅。", detail: "Green tea or white tea: clean, pale, elegant.", detailZh: "綠茶或白茶：清淨、淡雅、優雅。", tags: { light: 3, taste: 2 } },
      { id: "roasted", label: "Rich, roasted, and returning-sweet.", labelZh: "濃郁焙火、回甘。", detail: "Oolong or rock tea: mineral, deep, grounded.", detailZh: "烏龍或岩茶：礦物感、深沉、扎實。", tags: { rock: 3, grounding: 1, taste: 2 } },
      { id: "warmsweet", label: "Warm and gently sweet.", labelZh: "溫暖微甜。", detail: "Black tea or ripe pu'er: soft, round, comforting.", detailZh: "紅茶或熟普：柔和、圓潤、療癒。", tags: { warm: 3, taste: 2 } },
      { id: "nopref", label: "No strong preference.", labelZh: "沒有特別偏好。", detail: "You care more about the effect and ritual fit.", detailZh: "你更在意效果與儀式是否合適。", tags: { neutral: 2, taste: 1 } }
    ]
  },
  {
    id: "q6",
    question: "How much real time do you have to brew tea?",
    questionZh: "你平時沖茶的時間預算？",
    options: [
      { id: "five", label: "Within 5 minutes.", labelZh: "五分鐘之內。", detail: "Quick, reliable, and easy to repeat.", detailZh: "快速、可靠、容易重複。", scores: { ritualReadiness: 1 }, tags: { quick: 2 } },
      { id: "fifteen", label: "10-15 minutes.", labelZh: "十至十五分鐘。", detail: "Enough time for a proper small ritual.", detailZh: "足夠時間進行一場正式的小儀式。", scores: { ritualReadiness: 3 }, tags: { full: 2 } },
      { id: "slow", label: "No rush. I want to taste slowly.", labelZh: "不趕時間，我想慢慢品嚐。", detail: "You are open to a deeper tea table rhythm.", detailZh: "你願意進入更深層的茶席節奏。", scores: { ritualReadiness: 4 }, tags: { deep: 2 } }
    ]
  },
  {
    id: "q7",
    question: "How far do you want the ritual to go?",
    questionZh: "你對茶儀式的興趣程度？",
    options: [
      { id: "simple", label: "I want a simple 3-5 minute version.", labelZh: "我想要簡單的三至五分鐘版本。", detail: "A small ritual I can actually keep.", detailZh: "一個我真的能持續下去的小儀式。", scores: { ritualReadiness: 1 }, tags: { quick: 2 } },
      { id: "gaiwan", label: "I am willing to try a full gaiwan ritual.", labelZh: "我願意嘗試完整的蓋碗儀式。", detail: "I want the cultural feeling and the proper steps.", detailZh: "我想要文化的感覺與正式的步驟。", scores: { ritualReadiness: 4 }, tags: { full: 3 } },
      { id: "justdrink", label: "I mainly want to drink tea.", labelZh: "我主要只是想喝茶。", detail: "The ritual can stay secondary.", detailZh: "儀式對我來說是次要的。", scores: { ritualReadiness: 0 }, tags: { minimal: 3 } }
    ]
  },
  {
    id: "q8",
    question: "What would you most like to improve recently?",
    questionZh: "你最近最想改善的狀態是？",
    multi: true,
    max: 2,
    options: [
      { id: "stress", label: "Reduce stress.", labelZh: "減少壓力。", detail: "A calmer inner pace.", detailZh: "更平靜的內在節奏。", scores: { calm: 2 } },
      { id: "focus", label: "Improve focus.", labelZh: "改善專注力。", detail: "Cleaner attention and fewer scattered starts.", detailZh: "更清晰的注意力，減少分心的開始。", scores: { focus: 2 } },
      { id: "sleep", label: "Improve sleep.", labelZh: "改善睡眠。", detail: "A softer evening and steadier rest.", detailZh: "更柔和的夜晚與更穩定的休息。", scores: { sleep: 2 } },
      { id: "calm", label: "Increase daily calm.", labelZh: "增加日常的平靜。", detail: "More stillness in ordinary moments.", detailZh: "在平凡時刻中，多一點安定。", scores: { calm: 2 } }
    ]
  },
  {
    id: "q9",
    question: "What feeling do you most want tea to give you?",
    questionZh: "你最想透過茶得到的感覺？",
    options: [
      { id: "breeze", label: "Like a clear breeze in the mountains.", labelZh: "像山中的一陣清風。", detail: "Quiet, spacious, and mentally soft.", detailZh: "安靜、寬闊，心境柔軟。", scores: { calm: 2 } },
      { id: "rock", label: "Like rock: stable and strong.", labelZh: "像岩石一樣，穩定而強壯。", detail: "Grounded, substantial, and steady.", detailZh: "扎根、實在、穩固。", scores: { grounding: 3 }, tags: { rock: 1 } },
      { id: "sunlight", label: "Like warm sunlight.", labelZh: "像溫暖的陽光。", detail: "Bright, gentle, and life-giving.", detailZh: "明亮、溫柔，充滿生命力。", scores: { energy: 2 }, tags: { warm: 1 } }
    ]
  },
  {
    id: "q10",
    question: "If tea could hold one part of you steady today, which part?",
    questionZh: "今天，如果一盞茶能穩住你其中一部分，你希望是哪一部分？",
    options: [
      { id: "breath", label: "My breath.", labelZh: "我的呼吸。", detail: "The simple act of slowing down.", detailZh: "單純地慢下來。", scores: { calm: 1 }, anchor: "your breath", anchorZh: "你的呼吸" },
      { id: "focus", label: "My focus.", labelZh: "我的專注力。", detail: "A mind that stays where I put it.", detailZh: "一個能停留在原地的頭腦。", scores: { focus: 1 }, anchor: "your focus", anchorZh: "你的專注力" },
      { id: "rest", label: "My rest.", labelZh: "我的休息。", detail: "An evening that actually ends.", detailZh: "一個真正結束的夜晚。", scores: { sleep: 1 }, anchor: "your rest", anchorZh: "你的休息" },
      { id: "composure", label: "My composure around others.", labelZh: "我在人前的從容。", detail: "Steadiness that holds even in company.", detailZh: "即使在人群中也能維持的穩定。", scores: { emotional: 1, grounding: 1 }, anchor: "your composure around others", anchorZh: "你在人前的從容" }
    ]
  }
];

type QuizPhase = "intro" | "question" | "loading" | "result";

function clampValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedOptions(question: AssessmentQuestion | undefined, answer: Answer | undefined): AssessmentOption[] {
  if (!question || !answer) return [];
  return answer.optionIds
    .map((id) => question.options.find((option) => option.id === id))
    .filter((option): option is AssessmentOption => Boolean(option));
}

function calculateScores(answers: Answer[]) {
  const totals: Record<Dimension, number> = {
    pressure: 0,
    calm: 0,
    focus: 0,
    energy: 0,
    sleep: 0,
    emotional: 0,
    grounding: 0,
    ritualReadiness: 0
  };
  const tags: Record<TagKey, number> = {
    solo: 0,
    sound: 0,
    social: 0,
    quick: 0,
    full: 0,
    deep: 0,
    minimal: 0,
    light: 0,
    rock: 0,
    warm: 0,
    neutral: 0,
    taste: 0,
    grounding: 0
  };
  const selected: AssessmentOption[] = [];

  answers.forEach((answer) => {
    const question = questions.find((item) => item.id === answer.questionId);
    getSelectedOptions(question, answer).forEach((option) => {
      selected.push(option);
      Object.entries(option.scores ?? {}).forEach(([dimension, value]) => {
        totals[dimension as Dimension] += value ?? 0;
      });
      Object.entries(option.tags ?? {}).forEach(([tag, value]) => {
        tags[tag as TagKey] += value ?? 0;
      });
    });
  });

  const needScores: Record<string, number> = {
    calm: totals.calm,
    focus: totals.focus,
    sleep: totals.sleep,
    energy: totals.energy,
    grounding: totals.grounding,
    emotional: totals.emotional
  };
  const primaryNeedKey = Object.entries(needScores).sort((a, b) => b[1] - a[1])[0][0];
  const primaryNeedLabels: Record<string, [string, string]> = {
    calm: ["Calm", "平靜"],
    focus: ["Focus", "專注"],
    sleep: ["Sleep", "睡眠"],
    energy: ["Energy", "活力"],
    grounding: ["Grounding", "扎根"],
    emotional: ["Emotional Balance", "情緒平衡"]
  };

  const tasteKeys: TagKey[] = ["light", "rock", "warm", "neutral"];
  const tasteKey = [...tasteKeys].sort((a, b) => tags[b] - tags[a])[0];
  const tasteLabels: Record<string, [string, string]> = {
    light: ["Fresh / White / Longjing", "清新／白茶／龍井"],
    rock: ["Rock / Da Hong Pao", "岩韻／大紅袍"],
    warm: ["Warm / Black Tea / Ripe Pu'er", "溫暖／紅茶／熟普"],
    neutral: ["Neutral / Effect First", "中性／效果優先"]
  };

  const ritualStyle: [string, string] =
    tags.minimal >= 3 || tags.quick >= 4
      ? ["Gentle 3-minute ritual", "溫和三分鐘儀式"]
      : tags.full >= 3 || tags.deep >= 2
        ? ["Full gaiwan ritual", "完整蓋碗儀式"]
        : tags.solo >= 2
          ? ["Solo quiet ritual", "獨處靜心儀式"]
          : ["Simple daily tea ritual", "簡單日常茶儀式"];

  const pressureIndex =
    totals.pressure +
    Math.min(totals.calm, 5) * 0.45 +
    Math.min(totals.sleep, 5) * 0.45 +
    Math.min(totals.focus, 5) * 0.25 +
    Math.min(totals.emotional, 4) * 0.45;
  const highestNeed = Math.max(...Object.values(needScores));
  const highestTaste = Math.max(tags.light, tags.rock, tags.warm, tags.neutral, 1);

  const weighted = {
    pressureLevel: clampValue(Math.round((pressureIndex / 9) * 100), 0, 100),
    primaryNeed: clampValue(Math.round((highestNeed / 9) * 100), 0, 100),
    ritualReadiness: clampValue(Math.round((totals.ritualReadiness / 10) * 100), 0, 100),
    tastePreference: clampValue(Math.round((highestTaste / 4) * 100), 0, 100)
  };

  const evidence = selected
    .filter((option) => (option.scores?.[primaryNeedKey as Dimension] ?? 0) > 0)
    .slice(0, 3);

  const primaryKey: ResultKey = (() => {
    if (weighted.ritualReadiness <= 25 || tags.minimal >= 3) return "beginnerGentle";
    if (totals.sleep >= 5 && totals.calm >= 4) return "eveningWindDown";
    if (weighted.pressureLevel >= 55 && (totals.grounding >= 3 || tags.rock >= 3 || tags.grounding >= 1)) return "rockStability";
    if (primaryNeedKey === "focus" && weighted.pressureLevel <= 75) return "sunlitFocus";
    if (weighted.pressureLevel >= 50 && totals.calm >= 4) return "mountainCalm";
    return "balancedHarmony";
  })();

  const anchorOption = answers
    .map((answer) => getSelectedOptions(questions.find((q) => q.id === answer.questionId), answer)[0])
    .find((option) => option?.anchor);

  return {
    totals,
    tags,
    weighted,
    primaryNeedLabel: primaryNeedLabels[primaryNeedKey],
    tasteLabel: tasteLabels[tasteKey],
    ritualStyle,
    evidence,
    primary: resultProfiles[primaryKey],
    anchor: anchorOption ? ([anchorOption.anchor, anchorOption.anchorZh] as [string, string]) : null
  };
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const currentQuestion = questions[currentIndex];
  const result = useMemo(() => calculateScores(answers), [answers]);
  const progress = phase === "intro" ? 0 : Math.min((answers.length / TOTAL_QUESTIONS) * 100, 100);

  function handleStart() {
    setAnswers([]);
    setCurrentIndex(0);
    setMultiSelected([]);
    setSaveState("idle");
    setPhase("question");
  }

  function advance(nextAnswers: Answer[]) {
    setAnswers(nextAnswers);
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      setPhase("loading");
      window.setTimeout(() => setPhase("result"), 900);
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  function handleAnswer(option: AssessmentOption) {
    if (selectedOptionId) return;
    setSelectedOptionId(option.id);
    setSaveState("idle");
    window.setTimeout(() => {
      const nextAnswers = [...answers, { questionId: currentQuestion.id, optionIds: [option.id] }];
      setSelectedOptionId(null);
      advance(nextAnswers);
    }, 450);
  }

  function toggleMultiOption(option: AssessmentOption) {
    setMultiSelected((current) => {
      if (current.includes(option.id)) return current.filter((id) => id !== option.id);
      if (current.length >= (currentQuestion.max ?? 2)) return current;
      return [...current, option.id];
    });
  }

  function handleMultiNext() {
    if (multiSelected.length === 0) return;
    setSaveState("idle");
    const nextAnswers = [...answers, { questionId: currentQuestion.id, optionIds: multiSelected }];
    setMultiSelected([]);
    advance(nextAnswers);
  }

  function handleBack() {
    if (currentIndex === 0 || selectedOptionId) return;
    const poppedAnswer = answers[answers.length - 1];
    setAnswers((current) => current.slice(0, -1));
    setCurrentIndex((index) => index - 1);
    setMultiSelected(poppedAnswer ? poppedAnswer.optionIds : []);
  }

  function handleRestart() {
    setAnswers([]);
    setCurrentIndex(0);
    setMultiSelected([]);
    setSaveState("idle");
    setPhase("intro");
  }

  async function handleSaveResult() {
    const evidence = result.evidence.map((option) => `- ${t(option.detail, option.detailZh)}`).join("\n");
    const resultText = [
      `Chazen Tea State: ${result.primary.character} ${result.primary.chineseName} | ${result.primary.englishName}`,
      "",
      t(result.primary.summary, result.primary.summaryZh),
      "",
      `${t("What we noticed", "我們留意到")}:`,
      evidence || `- ${t("Your answers were evenly spread.", "你的答案相對平均分布。")}`,
      "",
      `${t("Tea match", "茶葉配對")}: ${t(result.primary.mainTea, result.primary.mainTeaZh)}`,
      `${t("Flower pairing", "花茶配搭")}: ${t(result.primary.flowerTea, result.primary.flowerTeaZh)}`,
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
      link.download = `chazen-tea-state-${result.primary.key}.txt`;
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
    message: `I completed the Chazen Tea State Reflection. My result is ${result.primary.englishName}, and my tea match is ${result.primary.mainTea}. I would like to learn more about the ${result.primary.product}.`,
    source: "Chazen Tea State Reflection"
  });
  const fullPlanHref = buildInquiryPath({
    basePath,
    type: "Tea recommendation",
    message: `I completed the Chazen Tea State Reflection. My result is ${result.primary.englishName}, and my tea match is ${result.primary.mainTea}. I would like the A$25 First Pack with my matched tea, full report, brewing guide, and member access.`,
    source: "Tea State Full Plan"
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
          <p className="museum-kicker">{t("Chazen Tea State Reflection", "茶禪狀態反思")}</p>
          <h1 id="assessment-title">{t("What have you been carrying, without quite noticing?", "你一直帶著甚麼，卻不曾細看？")}</h1>
          <p>
            {t(
              "Ten short questions about who you are in a room, what quietly wears you down, and how you actually live with tea. Leave with a tea match, a flower pairing, and a ritual you can keep.",
              "十條簡短問題，關於你在人群中的角色、日常悄悄消耗你的內在拉扯，以及你真正的飲茶習慣。完成後，你會得到適合的茶、花茶配搭，以及一個能持續的儀式。"
            )}
          </p>
          <div className="tea-mind-character-rail" aria-label="Assessment principles">
            <span><strong>今</strong><em>{t("Current state", "當下狀態")}</em></span>
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
            <span>{t("10 Questions", "十條問題")}</span>
            <span>{t("About 3 Minutes", "約三分鐘")}</span>
            <span>{t("Immediate Result", "即時結果")}</span>
          </div>
          <button type="button" className="tea-mind-start-button" onClick={handleStart}>
            {t("Start Listening", "開始聽自己")}
          </button>
        </div>
      </section>

      <section className="museum-section tea-mind-room" aria-label="Tea state reflection">
        <div className="museum-container tea-mind-shell">
          <div className="tea-mind-progress" aria-label="Assessment progress" style={{ scrollMarginTop: 96 }}>
            <div>
              <span>
                {phase === "intro"
                  ? t("Before the first sip", "第一口之前")
                  : `${Math.min(answers.length + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`}
              </span>
              <strong>
                {phase === "result"
                  ? t("Your tea state", "你的茶狀態")
                  : phase === "loading"
                    ? t("Bringing the clues together", "正在整理線索")
                    : t("Each answer shapes your result", "你的答案會決定結果")}
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
              <h2>{t("Begin with who you are, not just how you feel.", "從你是誰開始，而不只是你感覺如何。")}</h2>
              <p>
                {t(
                  "This short reflection moves from personality to daily struggle to how you actually live with tea, then turns those observations into a practical tea direction. A balanced result is a real result too — the test will never invent a problem just to recommend a product.",
                  "這個簡短測試會由性格出發，走到日常的內在拉扯，再到你真正的飲茶習慣，然後將這些觀察轉化成實際的選茶方向。狀態平衡亦是一個真正結果；測試不會為了推薦產品而製造你沒有的問題。"
                )}
              </p>
              <ul className="tea-mind-purpose-list" aria-label={t("What you will receive", "你會得到甚麼")}>
                <li><Check size={17} aria-hidden="true" />{t("A clear reading of your current state", "清楚了解你目前的狀態")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A tea match, a flower pairing, and a ritual to try", "適合的茶、花茶配搭與一個可實行的儀式")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A practical, repeatable daily approach", "一個實際、可重複的日常方向")}</li>
              </ul>
              <button type="button" className="tea-mind-primary-action" onClick={handleStart}>
                {t("Discover My Tea State", "找出我的茶狀態")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </section>
          )}

          {phase === "question" && (
            <div className="tea-mind-split">
              <aside
                className="tea-mind-split-media"
                style={{ backgroundImage: `url(${basePath}/images/chazen-shanshui-chapter-2.jpg)` }}
              >
                <div className="tea-mind-split-media-shade" aria-hidden="true" />
                <span className="tea-mind-split-media-character" aria-hidden="true">茶</span>
                <div className="tea-mind-split-media-copy">
                  <p className="tea-mind-split-kicker">{t("Tea State Reflection", "茶狀態反思")}</p>
                  <h2>{t("Begin with your current state.", "從你目前的狀態開始。")}</h2>
                  <p>
                    {t(
                      "Each answer refines the reading. Your result pairs a primary tea, a flower tea, and the ritual that fits you.",
                      "每個答案都會令結果更準確。你會得到一款主茶、一款花茶，以及最適合你的儀式。"
                    )}
                  </p>
                </div>
              </aside>
              <fieldset key={currentQuestion.id} className="tea-mind-question-panel">
                <legend>
                  <span>{t("Question", "問題")} {currentIndex + 1}</span>
                  <strong>{t(currentQuestion.question, currentQuestion.questionZh)}</strong>
                  {currentQuestion.multi ? (
                    <em className="tea-mind-question-context">
                      {t(`Choose up to ${currentQuestion.max ?? 2}.`, `最多選 ${currentQuestion.max ?? 2} 個。`)}
                    </em>
                  ) : null}
                </legend>
                <div
                  className="tea-mind-options"
                  role={currentQuestion.multi ? "group" : "radiogroup"}
                  aria-label={t(currentQuestion.question, currentQuestion.questionZh)}
                >
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentQuestion.multi
                      ? multiSelected.includes(option.id)
                      : selectedOptionId === option.id;
                    const isDimmed = !currentQuestion.multi && selectedOptionId !== null && selectedOptionId !== option.id;
                    return (
                      <button
                        type="button"
                        role={currentQuestion.multi ? "checkbox" : "radio"}
                        aria-checked={isSelected}
                        key={`${currentQuestion.id}-${option.id}`}
                        className={isSelected ? "is-selected" : isDimmed ? "is-dimmed" : index % 2 === 0 ? "is-tinted" : undefined}
                        onClick={() => (currentQuestion.multi ? toggleMultiOption(option) : handleAnswer(option))}
                      >
                        <span className="tea-mind-option-mark">{String.fromCharCode(65 + index)}</span>
                        <span className="tea-mind-option-copy">
                          <strong>{t(option.label, option.labelZh)}</strong>
                          <em>{t(option.detail, option.detailZh)}</em>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {currentQuestion.multi ? (
                  <button
                    type="button"
                    className="tea-mind-primary-action"
                    disabled={multiSelected.length === 0}
                    onClick={handleMultiNext}
                  >
                    {t("Next", "下一題")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : null}
                {currentIndex > 0 ? (
                  <button type="button" className="tea-mind-back-button" onClick={handleBack}>
                    <ArrowLeft size={14} aria-hidden="true" /> {t("Back to the previous question", "回到上一題")}
                  </button>
                ) : null}
              </fieldset>
            </div>
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
                  <p className="museum-kicker">{t("Your current tea state", "你目前的茶狀態")}</p>
                  <h2>{result.primary.chineseName}</h2>
                  <h3>{result.primary.englishName}</h3>
                  <p>{t(result.primary.summary, result.primary.summaryZh)}</p>
                  {result.anchor ? (
                    <p className="tea-mind-anchor-line">
                      {t(`Today you came here for ${result.anchor[0]}.`, `今天，你來到這裡，是為了${result.anchor[1]}。`)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="tea-mind-result-grid">
                <article>
                  <span>{t("What this means", "這代表甚麼")}</span>
                  <p>{t(result.primary.reading, result.primary.readingZh)}</p>
                </article>
                <article>
                  <span>{t("Your primary need", "你目前最需要的")}</span>
                  <p>{t(result.primaryNeedLabel[0], result.primaryNeedLabel[1])}</p>
                </article>
                <article>
                  <span>{t("Ritual style", "儀式風格")}</span>
                  <p>{t(result.ritualStyle[0], result.ritualStyle[1])}</p>
                </article>
              </div>

              <article className="tea-mind-detail-grid">
                <article>
                  <h4>{t("The signals behind your result", "結果背後的訊號")}</h4>
                  <ul>
                    {result.evidence.length > 0 ? result.evidence.map((option) => (
                      <li key={option.id}>{t(option.detail, option.detailZh)}</li>
                    )) : <li>{t("Your answers were evenly spread.", "你的答案相對平均分布。")}</li>}
                  </ul>
                </article>
                <article>
                  <h4>{t("Your daily ritual", "你的日常儀式")}</h4>
                  <ol>
                    {(language === "zh" ? result.primary.ritualZh : result.primary.ritual).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              </article>

              <div className="tea-mind-product-panel">
                <div>
                  <span>{t("Your tea match", "你的茶葉配對")}</span>
                  <strong>{t(result.primary.mainTea, result.primary.mainTeaZh)}</strong>
                  <p>
                    {t("Flower pairing", "花茶配搭")}: {t(result.primary.flowerTea, result.primary.flowerTeaZh)}
                  </p>
                  <p className="tea-mind-tea-fit">
                    <b>{t("Why this fits", "為甚麼適合")}: </b>{t(result.primary.mainTeaCopy, result.primary.mainTeaCopyZh)}
                  </p>
                  <p className="tea-mind-suitable-teas">
                    <b>{t("Flower tea notes", "花茶說明")}: </b>{t(result.primary.flowerTeaCopy, result.primary.flowerTeaCopyZh)}
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
                    <li><strong>{t("Your matched starter tea", "你的配對入門茶")}</strong><em>{t(result.primary.mainTea, result.primary.mainTeaZh)}</em></li>
                    <li><strong>{t("Full Tea State Report", "完整茶狀態報告")}</strong><em>{t("Answer-by-answer interpretation, personal watch-points, and a detailed daily plan", "逐題分析、個人留意重點與詳細日常方案")}</em></li>
                    <li><strong>{t("Personal brewing guide", "個人沖泡指南")}</strong><em>{t("Tea strength, timing, and a gentler alternative", "茶湯濃度、飲用時間與較柔和替代選擇")}</em></li>
                    <li><strong>{t("Chazen Free Member access", "茶禪免費會員身份")}</strong><em>{t("Member updates, birthday tea note, and early product news after your first purchase", "首次購買後獲得會員更新、生日茶語與新品消息")}</em></li>
                  </ul>
                </div>
              </section>

              <section className="tea-mind-locked" aria-label={t("Full report preview", "完整報告預覽")}>
                <div className="tea-mind-locked-preview" aria-hidden="true">
                  <p>{t("Inside your full Tea State Report", "完整茶狀態報告內容")}</p>
                  <div className="tea-mind-locked-grid">
                    <span>{t("Your dominant and secondary signals", "主要與次要訊號")}</span>
                    <span>{t("How context changed your result", "情境如何影響結果")}</span>
                    <span>{t("Daily tea and timing schedule", "日常飲茶與時間安排")}</span>
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
                <p>
                  {t(
                    "This reflective tea pairing is inspired by traditional Chinese wellness ideas. It is not a medical diagnosis or treatment recommendation.",
                    "這個茶飲配對受傳統中式養生概念啟發，不是醫療診斷或治療建議。"
                  )}
                </p>
                <small>
                  {t(
                    "Check with a qualified health professional before using herbal blends if you take medicines, are pregnant, or have allergies or ongoing symptoms.",
                    "如正服藥、懷孕、有過敏或持續症狀，使用花草配方前應先向合資格專業人士查詢。"
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
            <p>{t("Explore the ritual and tea selection that fit your current state.", "探索配合你目前狀態的儀式與茶選。")}</p>
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
