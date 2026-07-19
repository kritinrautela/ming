"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Share2 } from "lucide-react";
import { buildInquiryPath } from "@/lib/inquiry";
import { useLanguage } from "@/lib/language";
import styles from "./TeaAssessmentExperience.module.css";

type CupKey = "faith" | "effort" | "stillness" | "mindfulness" | "wisdom";
type ComfortKey = "afterFeast" | "quietCare";
type RouteKey = "self" | "gift" | "team";
type FormatKey = "convenience" | "ritual" | "either";

type AssessmentOption = {
  id: string;
  label: string;
  labelZh: string;
  insight: string;
  insightZh: string;
  scores?: Partial<Record<CupKey, number>>;
  next?: string;
  route?: RouteKey;
  format?: FormatKey;
  comfortResult?: ComfortKey;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  questionZh: string;
  options: AssessmentOption[];
};

type Answer = {
  questionId: string;
  optionId: string;
};

type CupProfile = {
  key: CupKey;
  character: string;
  englishName: string;
  chineseGloss: string;
  headline: string;
  headlineZh: string;
  reading: string;
  readingZh: string;
  serves: string;
  servesZh: string;
  ritual: string;
  ritualZh: string;
};

type ComfortProfile = {
  key: ComfortKey;
  name: string;
  nameZh: string;
  headline: string;
  headlineZh: string;
  reading: string;
  readingZh: string;
  ritual: string;
  ritualZh: string;
};

const TOTAL_QUESTIONS = 8;

const cupProfiles: Record<CupKey, CupProfile> = {
  faith: {
    key: "faith",
    character: "信",
    englishName: "Faith — The Reset",
    chineseGloss: "信 · 願意停下，即是歸途",
    headline: "Return to stillness. A quiet reset in a cup.",
    headlineZh: "回到平靜。一盞茶裡的安靜歸零。",
    reading:
      "Your days are loud, and you have learned to shout over them. Faith asks for something smaller: the willingness to pause at all. This cup does not solve what is waiting for you — it gives you a pale liquor, a slow breath, and a moment in which nothing is asked of you.",
    readingZh:
      "你的日子很吵，而你早已學會與它比聲量。「信」所求的更小：只是願意停下來。這一盞不會替你解決正在等你的事——它給你的是一泓淡湯、一口慢呼吸，以及一個什麼都不被要求的片刻。",
    serves: "For the overloaded mind — stress, noise, too many open threads.",
    servesZh: "給超載的心——壓力、噪音，與太多未收的線頭。",
    ritual: "Before the first sip, set the phone face down in another room, and let the steam reach your face first.",
    ritualZh: "第一口之前，把手機翻面放到另一個房間，先讓茶的熱氣，抵達你的臉。"
  },
  effort: {
    key: "effort",
    character: "精進",
    englishName: "Effort — The Clear Line",
    chineseGloss: "精進 · 一念相續，如水長流",
    headline: "One task. One cup. A single unbroken thread.",
    headlineZh: "一事，一盞，一條不斷的線。",
    reading:
      "You do not lack drive; you lack a container for it. Effort is not about pushing harder — it is the art of returning to the same thread each time it slips. This cup sits beside your work like a quiet metronome: each steep a fresh start, each sip a return to the one thing in front of you.",
    readingZh:
      "你不缺動力，缺的是盛放動力的器皿。「精進」不是更用力，而是每當線索滑落，都能回到同一條線上的功夫。這一盞茶安坐在你的工作旁，像一具安靜的節拍器：每一泡是重新開始，每一口是回到眼前唯一的事。",
    serves: "For work, study, and decisions that deserve a clear mind.",
    servesZh: "給工作、學習，以及值得以清明之心面對的抉擇。",
    ritual: "Brew before you begin, not after you stall — let the first infusion mark the start of a single, undivided hour.",
    ritualZh: "在開始之前泡茶，而不是卡住之後——讓第一泡，為一段完整不分心的時光開場。"
  },
  stillness: {
    key: "stillness",
    character: "定",
    englishName: "Stillness — The Descent",
    chineseGloss: "定 · 身心俱歇，如夜歸山",
    headline: "Let the day set, the way light does.",
    headlineZh: "讓這一天落下，如同天光。",
    reading:
      "Your mind keeps the office open long after the body has gone home. Stillness is the practice of closing the day on purpose — a warm, caffeine-gentle cup, dim light, and the permission to stop producing. This result does not ask you to sleep better; it asks you to arrive at evening more slowly.",
    readingZh:
      "身體早已下班，你的心卻仍替這一天加班。「定」是刻意為一天收尾的功課——一盞溫和低咖啡因的茶、一室昏黃的光，以及一份允許自己停止產出的許可。這個結果不要求你睡得更好，只邀請你更緩慢地走進夜晚。",
    serves: "For the evening transition — winding down, closing the day, making room for rest.",
    servesZh: "給向晚的過渡——鬆開、收尾，為休息騰出位置。",
    ritual: "Make this the last lit screen of your night: brew, dim the lights, and let the empty cup be the day's final full stop.",
    ritualZh: "讓這盞茶成為今晚最後的亮光：沏茶、調暗燈光，讓見底的茶盞，作這一天最後的句號。"
  },
  mindfulness: {
    key: "mindfulness",
    character: "念",
    englishName: "Mindfulness — The Practice",
    chineseGloss: "念 · 手中有盞，心在此處",
    headline: "Not a drink. A practice you can hold.",
    headlineZh: "不只是一杯飲品，而是一門握得住的修行。",
    reading:
      "You are not looking for tea; you are looking for a handrail — something with weight, sequence, and repetition, to bring the attention home. Mindfulness gives you the full ceremony: leaf, water, vessel, and the small choreography between them. When the hands are occupied with something careful, the mind stops running errands.",
    readingZh:
      "你要找的其實不是茶，而是一道扶手——一件有重量、有次第、可以重複的事，把注意力領回家。「念」給你的是完整的茶儀：葉、水、器，以及它們之間細小的手勢編排。當雙手忙於一件細緻的事，心就不再四處奔走。",
    serves: "For those ready for loose leaf and the full brewing ceremony — a daily practice, not a beverage.",
    servesZh: "給準備好泡散茶、行完整茶儀的人——這是一門日課，不是一杯飲料。",
    ritual: "Choose one fixed time each day, and brew the same tea in the same vessel — repetition is where the ritual begins to hold you back.",
    ritualZh: "每天選定同一個時刻，用同一件器皿泡同一款茶——在重複之中，儀式才開始反過來扶住你。"
  },
  wisdom: {
    key: "wisdom",
    character: "慧",
    englishName: "Wisdom — The Long View",
    chineseGloss: "慧 · 一盞之中，見千年",
    headline: "In one cup, a thousand years of attention.",
    headlineZh: "一盞茶中，千年的凝視。",
    reading:
      "For you, tea is not a mood; it is a lineage. You want to know why the cup is shaped this way, why this mountain, why this season — and what it means to give such a thing to someone you care for. Wisdom is the cup of the student and the gift-giver: it holds not just liquor, but the story of every hand that carried it here.",
    readingZh:
      "對你而言，茶不是一種情緒，而是一脈傳承。你想知道盞為何是這個形狀、為何是這座山、為何是這個季節——以及把這樣一件事物贈予所愛之人，意味著什麼。「慧」是求學者與贈禮者之盞：它盛著的不只是茶湯，還有一路將它捧到此處的、每一雙手的故事。",
    serves: "For gift-givers and culture learners — those who want the story, not just the leaf.",
    servesZh: "給贈禮者與文化的求學者——想要的不只是茶葉，還有它的故事。",
    ritual: "With each new tea, learn one thing about where it comes from before you brew it — the cup tastes different once you know.",
    ritualZh: "每遇一款新茶，沖泡之前先認識它來處的一件事——知道了以後，這盞茶的滋味便不一樣了。"
  }
};

const comfortProfiles: Record<ComfortKey, ComfortProfile> = {
  afterFeast: {
    key: "afterFeast",
    name: "After the Feast",
    nameZh: "飯後 · 解膩之茶",
    headline: "The table is cleared. The tea comes out.",
    headlineZh: "席散之後，正是茶登場的時候。",
    reading:
      "After a rich meal, Chinese tables have always turned to tea — pu-erh and dark oolong most of all, brewed strong and shared slowly while the conversation winds down. It is not medicine; it is punctuation, the full stop at the end of a generous sentence. For centuries, the last course has not been dessert. It has been a pot.",
    readingZh:
      "豐盛的一餐之後，中國的餐桌向來以茶收尾——尤以普洱與濃香烏龍為最，濃濃地泡，慢慢地分，讓談話隨茶湯緩緩降落。這不是藥方，而是標點——一句豐盛長句末尾的句號。千百年來，宴席最後一道，從來不是甜點，而是一壺茶。",
    ritual: "Brew a small pot of ripe pu-erh a shade stronger than usual, and let the table linger a little longer.",
    ritualZh: "泡一小壺熟普洱，比平常略濃一些，讓這一桌人再多坐一會兒。"
  },
  quietCare: {
    key: "quietCare",
    name: "Quiet Care",
    nameZh: "靜養 · 安頓之茶",
    headline: "A warm cup for a low day.",
    headlineZh: "低潮的日子，一盞溫熱的茶。",
    reading:
      "On days when you are simply not at your best, Chinese households have long turned to something warm — ginger and jujube simmered slowly, or a mild tea taken by the window, wrapped in a blanket. This is not a remedy; it is a ritual of being gentle with yourself. Warmth, quiet, and a slow cup — the oldest form of keeping company with your own body.",
    readingZh:
      "在狀態不佳的日子裡，中國人的家中總會端出一些溫熱的東西——慢火煨的薑棗，或裹著毯子、坐在窗邊喝的一盞淡茶。這不是療方，而是一種善待自己的儀式。溫暖、安靜、一杯慢慢喝的茶——這是陪伴自己身體最古老的方式。",
    ritual: "Choose the mildest tea on your shelf, brew it lighter than usual, and let holding the warm cup be half the ritual.",
    ritualZh: "選架上最溫和的一款茶，泡得比平常更淡，讓捧著暖盞的雙手，完成儀式的一半。"
  }
};

const questions: Record<string, AssessmentQuestion> = {
  q1: {
    id: "q1",
    question: "Who is this tea moment for?",
    questionZh: "這一盞茶，是為誰而泡？",
    options: [
      { id: "self", label: "For myself", labelZh: "為自己", insight: "Beginning with yourself is not indulgence. It is where attention starts.", insightZh: "從自己開始，並非放縱，而是專注的起點。", route: "self", next: "q2" },
      { id: "gift", label: "A gift for someone else", labelZh: "想送給某個人", insight: "Choosing tea for another is a quiet way of saying: I have been paying attention to you.", insightZh: "為他人選茶，是一種安靜的表達：我一直有留意你。", route: "gift", next: "q2" },
      { id: "team", label: "My team or workspace", labelZh: "給我的團隊或工作空間", insight: "A shared pause changes a room more than any meeting agenda.", insightZh: "一次共同的停頓，比任何會議議程更能改變一個空間。", route: "team", next: "q2" }
    ]
  },
  q2: {
    id: "q2",
    question: "Right now, my mind feels —",
    questionZh: "此刻，我的心像是——",
    options: [
      { id: "loud", label: "Loud. Too many things asking for me at once.", labelZh: "很吵。太多事情同時在向我伸手。", insight: "Noise is rarely about volume. It is about how many directions you are being pulled.", insightZh: "吵，往往無關音量，而在於你被拉向多少個方向。", scores: { faith: 2, stillness: 1 }, next: "q3" },
      { id: "scattered", label: "Scattered. I start things and lose the thread.", labelZh: "渙散。事情開了頭，線索卻總是斷掉。", insight: "Focus is not forced. It gathers, the way leaves settle in still water.", insightZh: "專注無法強求。它像茶葉在靜水中，慢慢沉定。", scores: { effort: 2 }, next: "q3" },
      { id: "wired", label: "Tired, but somehow still wired.", labelZh: "累了，卻靜不下來。", insight: "The body asks for rest long before the mind agrees to it.", insightZh: "身體早已請求休息，只是心遲遲不肯答應。", scores: { stillness: 2 }, next: "q2a" },
      { id: "curious", label: "Curious. I want tea to mean something, not just taste good.", labelZh: "好奇。我希望茶有它的意義，不只是好喝。", insight: "Wanting meaning in small things is not a small want.", insightZh: "想在微小事物中尋找意義，並不是微小的願望。", scores: { wisdom: 2, mindfulness: 1 }, next: "q3" },
      { id: "restless", label: "Restless. I want a ritual to hold onto.", labelZh: "心浮。我想要一個可以安放自己的儀式。", insight: "A ritual is a handrail for the attention. You reach for it because you know you drift.", insightZh: "儀式是專注的扶手。你伸手去握，因為你知道自己會飄。", scores: { mindfulness: 2, faith: 1 }, next: "q2b" }
    ]
  },
  q2a: {
    id: "q2a",
    question: "How many hours do you usually sleep?",
    questionZh: "你平常睡多少小時？",
    options: [
      { id: "under5", label: "Under 5", labelZh: "少於五小時", insight: "The day has been borrowing from the night.", insightZh: "白天一直在向夜晚借時間。", scores: { stillness: 2 }, next: "q3" },
      { id: "five-six", label: "5 to 6", labelZh: "五至六小時", insight: "Enough to function. Perhaps not enough to feel like yourself.", insightZh: "足夠運轉，卻未必足夠讓你像你自己。", scores: { stillness: 1 }, next: "q3" },
      { id: "seven-eight", label: "7 to 8", labelZh: "七至八小時", insight: "The hours are there. Sometimes it is the descent into them that needs care.", insightZh: "時數是有的。有時需要照料的，是入睡前那段下坡路。", next: "q3" },
      { id: "nine-plus", label: "9 or more", labelZh: "九小時以上", insight: "Long rest and deep rest are not always the same thing.", insightZh: "睡得長，和睡得深，不一定是同一回事。", next: "q3" }
    ]
  },
  q2b: {
    id: "q2b",
    question: "What is actually derailing your calm?",
    questionZh: "真正擾亂你平靜的，是什麼？",
    options: [
      { id: "work", label: "The weight of work, and the way it follows me home.", labelZh: "工作的重量，以及它跟著我回家的樣子。", insight: "Work rarely stays where it was left.", insightZh: "工作很少乖乖留在原地。", scores: { effort: 1 }, next: "q3" },
      { id: "discomfort", label: "My body feels a bit off today.", labelZh: "今天身體有點不對勁。", insight: "The body speaks first, and it prefers to be listened to, not argued with.", insightZh: "身體總是先開口。它希望被傾聽，而不是被反駁。", next: "comfort1" },
      { id: "pace", label: "Nothing in particular. Just the pace and noise of the day.", labelZh: "沒有特定原因，只是這一天的節奏與聲音。", insight: "Sometimes the day itself is the weather. You do not fix weather; you find shelter.", insightZh: "有時日子本身就是天氣。天氣無法修理，只能尋一處安身。", scores: { faith: 1 }, next: "q3" }
    ]
  },
  comfort1: {
    id: "comfort1",
    question: "What kind of discomfort?",
    questionZh: "是哪一種不對勁？",
    options: [
      { id: "feast", label: "I just ate something heavy — a big barbecue, something rich or fried.", labelZh: "剛吃了很重的東西——燒烤、油炸，或一頓豐盛的大餐。", insight: "Generations before you finished the same kind of meal, and reached for the same kind of tea.", insightZh: "千百年來，人們吃完同樣豐盛的一餐，也伸手取過同樣的一壺茶。", comfortResult: "afterFeast" },
      { id: "rundown", label: "I'm feeling a bit run down, a little under the weather.", labelZh: "有些疲乏，狀態不太好。", insight: "On low days, warmth itself is the point.", insightZh: "在低潮的日子裡，溫暖本身就是意義。", comfortResult: "quietCare" },
      { id: "neither", label: "Neither, really. I just want to relax.", labelZh: "都不是，我只是想放鬆。", insight: "Then let us set the body aside and pour for the mind.", insightZh: "那麼，讓我們把身體放到一旁，為心斟一盞。", scores: { faith: 1 }, next: "q3" }
    ]
  },
  q3: {
    id: "q3",
    question: "The hardest part of your day is —",
    questionZh: "一天之中，最難的部分是——",
    options: [
      { id: "starting", label: "Starting it. Mornings arrive before I do.", labelZh: "開始。早晨總比我先到。", insight: "How a day begins tends to echo through it.", insightZh: "一天如何開始，往往會在整天裡迴響。", scores: { effort: 2 }, next: "q4" },
      { id: "middle", label: "The middle stretch. My focus thins out.", labelZh: "中段。專注力慢慢變薄。", insight: "Afternoons ask for endurance no one trained us for.", insightZh: "午後所需要的耐力，從來沒有人教過我們。", scores: { effort: 2, mindfulness: 1 }, next: "q4" },
      { id: "ending", label: "Ending it. My mind refuses to close the day.", labelZh: "結束。心不肯替這一天收尾。", insight: "A day without a closing gesture stays open all night.", insightZh: "沒有收尾動作的一天，會整夜敞著門。", scores: { stillness: 2 }, next: "q4" },
      { id: "meaning", label: "No single part. I just want ordinary moments to hold more.", labelZh: "沒有哪個部分特別難。我只是希望平凡的時刻能盛得更多。", insight: "You are not looking for escape. You are looking for depth.", insightZh: "你尋找的不是逃離，而是深度。", scores: { wisdom: 2, faith: 1 }, next: "q4" }
    ]
  },
  q4: {
    id: "q4",
    question: "Your ideal tea moment looks like —",
    questionZh: "你理想中的茶時刻，是——",
    options: [
      { id: "fast", label: "A fast reset between tasks.", labelZh: "兩件事之間，一次快速的歸零。", insight: "Even a brief pause, taken fully, counts as a pause.", insightZh: "停頓再短，只要全然地停，就算數。", scores: { effort: 2 }, next: "q5" },
      { id: "ceremony", label: "A slow, unhurried ceremony.", labelZh: "一場緩慢、不趕時間的茶儀。", insight: "Slowness is a skill, and you seem ready to practise it.", insightZh: "慢，是一種需要練習的能力。而你似乎準備好了。", scores: { mindfulness: 2, wisdom: 1 }, next: "q5" },
      { id: "winddown", label: "Warm light, quiet, the day winding down.", labelZh: "暖光、安靜、一天緩緩落幕。", insight: "Evenings reward those who arrive at them gently.", insightZh: "夜晚，善待那些溫柔走向它的人。", scores: { stillness: 2 }, next: "q5" },
      { id: "breathe", label: "One full minute, just to breathe.", labelZh: "完整的一分鐘，只用來呼吸。", insight: "A minute is small. What you bring to it is not.", insightZh: "一分鐘很小。你放進去的心，卻不小。", scores: { faith: 2 }, next: "q5" }
    ]
  },
  q5: {
    id: "q5",
    question: "How do you want to actually drink it?",
    questionZh: "你想怎麼喝這杯茶？",
    options: [
      { id: "quick", label: "Quick steep, no fuss.", labelZh: "簡單沖泡，不講究。", insight: "Simplicity is its own kind of respect for the leaf.", insightZh: "簡單，也是對茶葉的一種敬意。", format: "convenience", next: "q6" },
      { id: "full", label: "The full ritual, with a gaiwan or pot.", labelZh: "完整的儀式，用蓋碗或茶壺。", insight: "The vessel slows the hand, and the hand slows the mind.", insightZh: "器物讓手慢下來，手再讓心慢下來。", format: "ritual", scores: { mindfulness: 1 }, next: "q6" },
      { id: "either", label: "Either. I just want it to help.", labelZh: "都可以。我只希望它有用。", insight: "Honest. The form matters less than the return.", insightZh: "很誠實。形式如何，不及回到當下重要。", format: "either", next: "q6" }
    ]
  },
  q6: {
    id: "q6",
    question: "When do you drink tea most often?",
    questionZh: "你最常在什麼時候喝茶？",
    options: [
      { id: "morning", label: "Morning, to start well.", labelZh: "早晨，為了好好開始。", insight: "The first cup sets the register of the day.", insightZh: "第一盞茶，定下一天的音準。", scores: { effort: 2 }, next: "q7" },
      { id: "midday", label: "Midday, to catch a breath.", labelZh: "日中，為了喘一口氣。", insight: "A breath taken on purpose is worth ten taken by accident.", insightZh: "一口有意識的呼吸，勝過十口不經意的。", scores: { faith: 2 }, next: "q7" },
      { id: "evening", label: "Evening, to unwind.", labelZh: "傍晚，為了鬆開這一天。", insight: "Unwinding is not stopping. It is untying, knot by knot.", insightZh: "鬆開不是停止，而是一個結、一個結地解。", scores: { stillness: 2 }, next: "q7" },
      { id: "varies", label: "It varies. Whenever I need to reset.", labelZh: "不一定。需要歸零的時候，就是時候。", insight: "You treat tea as a door, not a schedule. Doors can open anywhere.", insightZh: "對你而言，茶是一扇門，不是一張時間表。門，哪裡都能開。", scores: { faith: 1, effort: 1, stillness: 1, mindfulness: 1, wisdom: 1 }, next: "q7" }
    ]
  },
  q7: {
    id: "q7",
    question: "How much does Chinese tea culture itself pull you in?",
    questionZh: "中國茶文化本身，對你的吸引有多深？",
    options: [
      { id: "notmuch", label: "Not much. I just want it to work.", labelZh: "不深。我只希望它有效。", insight: "Fair. The culture will wait; it has waited a thousand years.", insightZh: "無妨。文化等得起——它已經等了一千年。", next: "q8" },
      { id: "alittle", label: "A little. I like knowing the story behind things.", labelZh: "有一點。我喜歡知道事物背後的故事。", insight: "A cup with a story in it tastes different. You already suspect this.", insightZh: "盛著故事的茶，滋味不同。這一點，你其實早就察覺了。", scores: { wisdom: 1 }, next: "q8" },
      { id: "alot", label: "A lot. I want to actually learn the ritual.", labelZh: "很深。我想真正學會這套儀式。", insight: "To learn a ritual is to borrow centuries of other people's stillness.", insightZh: "學一套儀式，等於向千百年來他人的靜，借一點過來。", scores: { wisdom: 2, mindfulness: 1 }, next: "q8" }
    ]
  },
  q8: {
    id: "q8",
    question: "One word for how you want to feel afterward —",
    questionZh: "喝完之後，你想要的感覺，用一個詞——",
    options: [
      { id: "calm", label: "Calm", labelZh: "平靜", insight: "Not the absence of things. The right distance from them.", insightZh: "不是萬事消失，而是與萬事保持恰當的距離。", scores: { faith: 2 } },
      { id: "clear", label: "Clear", labelZh: "清明", insight: "Clarity is what remains when the sediment settles.", insightZh: "清明，是雜質沉底之後留下來的東西。", scores: { effort: 2 } },
      { id: "rested", label: "Rested", labelZh: "安歇", insight: "Rest is not earned. It is allowed.", insightZh: "休息不需要掙來，只需要被允許。", scores: { stillness: 2 } },
      { id: "grounded", label: "Grounded", labelZh: "落定", insight: "To be grounded is to feel the cup in your hands and nothing pulling you elsewhere.", insightZh: "落定，是手中有盞，而沒有任何事把你拉向別處。", scores: { mindfulness: 2 } },
      { id: "whole", label: "Whole", labelZh: "完整", insight: "Whole is what you were before the day divided you.", insightZh: "完整，是這一天把你分割之前，你本來的樣子。", scores: { wisdom: 2 } }
    ]
  }
};

type QuizPhase = "intro" | "question" | "loading" | "result";

type QuizResult =
  | { type: "comfort"; profile: ComfortProfile; route: RouteKey }
  | {
      type: "cup";
      primary: CupProfile;
      primaryPercent: number;
      supporting: CupProfile;
      supportingPercent: number;
      isBlended: boolean;
      route: RouteKey;
      format: FormatKey;
    };

function calculateResult(answers: Answer[]): QuizResult {
  const totals: Record<CupKey, number> = { faith: 0, effort: 0, stillness: 0, mindfulness: 0, wisdom: 0 };
  let route: RouteKey = "self";
  let format: FormatKey = "either";
  let comfortKey: ComfortKey | undefined;

  answers.forEach((answer) => {
    const question = questions[answer.questionId];
    const option = question?.options.find((item) => item.id === answer.optionId);
    if (!option) return;
    if (option.route) route = option.route;
    if (option.format) format = option.format;
    if (option.comfortResult) comfortKey = option.comfortResult;
    Object.entries(option.scores ?? {}).forEach(([key, value]) => {
      totals[key as CupKey] += value ?? 0;
    });
  });

  if (comfortKey) {
    return { type: "comfort", profile: comfortProfiles[comfortKey], route };
  }

  const sortedCups = (Object.keys(totals) as CupKey[]).sort((a, b) => totals[b] - totals[a]);
  const primaryKey = sortedCups[0];
  const supportingKey = sortedCups[1];
  const totalAll = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
  const primaryPercent = Math.round((totals[primaryKey] / totalAll) * 100);
  const supportingPercent = Math.round((totals[supportingKey] / totalAll) * 100);
  const isBlended = Math.abs(totals[primaryKey] - totals[supportingKey]) <= 1;

  return {
    type: "cup",
    primary: cupProfiles[primaryKey],
    primaryPercent,
    supporting: cupProfiles[supportingKey],
    supportingPercent,
    isBlended,
    route,
    format
  };
}

export function TeaAssessmentExperience({ basePath }: { basePath: string }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState("q1");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");
  const currentQuestion = questions[currentQuestionId];
  const result = useMemo(() => calculateResult(answers), [answers]);
  const progress = phase === "intro" ? 0 : Math.min((answers.length / TOTAL_QUESTIONS) * 100, 100);

  function handleStart() {
    setAnswers([]);
    setCurrentQuestionId("q1");
    setShareState("idle");
    setPhase("question");
  }

  function handleAnswer(option: AssessmentOption) {
    if (selectedOptionId) return;
    setSelectedOptionId(option.id);
    setShareState("idle");
    window.setTimeout(() => {
      const nextAnswers = [...answers, { questionId: currentQuestion.id, optionId: option.id }];
      setAnswers(nextAnswers);
      setSelectedOptionId(null);
      if (!option.next) {
        setPhase("loading");
        window.setTimeout(() => setPhase("result"), 900);
        return;
      }
      setCurrentQuestionId(option.next);
    }, 450);
  }

  function handleBack() {
    if (answers.length === 0 || selectedOptionId) return;
    const previous = answers[answers.length - 1];
    setAnswers((current) => current.slice(0, -1));
    setCurrentQuestionId(previous.questionId);
  }

  function handleRestart() {
    setAnswers([]);
    setCurrentQuestionId("q1");
    setShareState("idle");
    setPhase("intro");
  }

  async function handleShare() {
    const shareText =
      result.type === "cup"
        ? `My Chazen tea profile: ${result.primary.englishName} — ${result.primaryPercent}% ${result.primary.key}, ${result.supportingPercent}% ${result.supporting.key}. ${t(result.primary.headline, result.primary.headlineZh)}`
        : `My Chazen tea result: ${result.profile.name}. ${t(result.profile.headline, result.profile.headlineZh)}`;
    const shareUrl = `${basePath}/tea-test`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Chazen Tea Profile", text: shareText, url: shareUrl });
        setShareState("shared");
        return;
      } catch {
        // User cancelled the native share sheet; fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
      setShareState("copied");
    } catch {
      // Clipboard permission is optional.
    }
  }

  const routeHref = (path: string) => `${basePath}${path}`;

  const shopHref =
    result.type === "cup" && result.route === "gift"
      ? routeHref("/gift-box")
      : result.type === "cup" && result.route === "team"
        ? routeHref("/b2b")
        : routeHref("/tea-collection");

  const shopLabel =
    result.type === "cup" && result.route === "gift"
      ? { en: `A ${result.primary.englishName.split(" — ")[0]} gift, for someone who needs it`, zh: `一份「${result.primary.character}」的禮物，給需要的人` }
      : result.type === "cup" && result.route === "team"
        ? { en: "Request a Team Sample", zh: "為團隊申請試用樣品" }
        : { en: "Shop This Ritual", zh: "選購這個儀式" };

  const inquiryHref = buildInquiryPath({
    basePath,
    type: "Tea recommendation",
    message:
      result.type === "cup"
        ? `I completed the Chazen Five Cups reflection. My result is ${result.primary.englishName} (${result.primaryPercent}% ${result.primary.key}, ${result.supportingPercent}% ${result.supporting.key}). I would like my full ritual card and the 10% first-box code.`
        : `I completed the Chazen Five Cups reflection. My result is ${result.profile.name}. I would like my full ritual card and the 10% first-box code.`,
    source: "Chazen Five Cups Reflection"
  });

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
          <p className="museum-kicker">{t("The Five Cups Reflection", "五盞反思")}</p>
          <h1 id="assessment-title">{t("Which of the five cups is yours today?", "今天，五盞之中，哪一盞是你的？")}</h1>
          <p>
            {t(
              "Chazen maps five Jian Zhan cups to the Five Spiritual Faculties — Faith, Effort, Stillness, Mindfulness, Wisdom. A few honest questions, and a cup that answers back.",
              "Chazen 以五盞建盞，對應五根：信、精進、定、念、慧。幾個誠實的問題，換來一盞回應你的茶。"
            )}
          </p>
          <div className="tea-mind-character-rail" aria-label="Five cups">
            <span><strong>信</strong><em>{t("Faith", "信")}</em></span>
            <span><strong>精進</strong><em>{t("Effort", "精進")}</em></span>
            <span><strong>定</strong><em>{t("Stillness", "定")}</em></span>
            <span><strong>念</strong><em>{t("Mindfulness", "念")}</em></span>
            <span><strong>慧</strong><em>{t("Wisdom", "慧")}</em></span>
          </div>
          <p className="tea-mind-disclaimer">
            {t(
              "The Five Cups is a lifestyle and cultural guide, offered in the spirit of tradition — it is not medical advice.",
              "五盞之說是一份生活與文化的指引，承傳統之意而作——並非醫療建議。"
            )}
          </p>
          <div className="assessment-hero-meta">
            <span>{t("8 Questions", "八條問題")}</span>
            <span>{t("About 2 Minutes", "約兩分鐘")}</span>
            <span>{t("Immediate Result", "即時結果")}</span>
          </div>
          <button type="button" className="tea-mind-start-button" onClick={handleStart}>
            {t("Begin", "開始")}
          </button>
        </div>
      </section>

      <section className="museum-section tea-mind-room" aria-label="Five Cups reflection">
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
                  ? t("Your cup", "你的盞")
                  : phase === "loading"
                    ? t("Settling the leaves", "讓茶葉沉澱")
                    : t("Each answer shapes your cup", "你的答案會決定你的盞")}
              </strong>
            </div>
            <div className="assessment-progress-track tea-mind-progress-track" aria-hidden="true">
              <span style={{ width: `${phase === "result" ? 100 : progress}%` }} />
            </div>
          </div>

          {phase === "intro" && (
            <section className="tea-mind-intro-panel" aria-label="Assessment introduction">
              <div className="tea-mind-oracle-character" aria-hidden="true">茶</div>
              <p className="museum-kicker">{t("Your cup, with a reason", "適合你的盞，也有清楚原因")}</p>
              <h2>{t("Five cups, five ways back to yourself.", "五盞，五條回到自己的路。")}</h2>
              <p>
                {t(
                  "This short reflection moves from how your mind feels right now, through the hardest part of your day, to how you actually want to drink tea — then turns those answers into one cup, with a second cup close behind it.",
                  "這個簡短測試會由你此刻的心境出發，走過一天中最難的部分，到你真正想怎麼喝茶——再將這些答案轉化成一盞主茶，以及緊隨其後的第二盞。"
                )}
              </p>
              <ul className="tea-mind-purpose-list" aria-label={t("What you will receive", "你會得到甚麼")}>
                <li><Check size={17} aria-hidden="true" />{t("Your primary cup and a supporting cup, shown as a simple split", "你的主盞與副盞，以簡單比例呈現")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A tea direction and a ritual you can actually keep", "適合的茶方向，與一個真的能持續的儀式")}</li>
                <li><Check size={17} aria-hidden="true" />{t("A result worth sharing, not just a label", "一個值得分享的結果，而不只是一個標籤")}</li>
              </ul>
              <button type="button" className="tea-mind-primary-action" onClick={handleStart}>
                {t("Find My Cup", "找出我的盞")}
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
                <span className="tea-mind-split-media-character" aria-hidden="true">盞</span>
                <div className="tea-mind-split-media-copy">
                  <p className="tea-mind-split-kicker">{t("Five Cups Reflection", "五盞反思")}</p>
                  <h2>{t("Begin with how you feel.", "從你的感受開始。")}</h2>
                  <p>
                    {t(
                      "Each answer weighs toward one or two cups. Your result pairs a primary cup with the one closest behind it.",
                      "每個答案都會傾向一或兩盞。你的結果會配對一盞主茶，以及緊隨其後的一盞。"
                    )}
                  </p>
                </div>
              </aside>
              <fieldset key={currentQuestion.id} className="tea-mind-question-panel">
                <legend>
                  <span>{t("Question", "問題")} {Math.min(answers.length + 1, TOTAL_QUESTIONS)}</span>
                  <strong>{t(currentQuestion.question, currentQuestion.questionZh)}</strong>
                </legend>
                <div
                  className="tea-mind-options"
                  role="radiogroup"
                  aria-label={t(currentQuestion.question, currentQuestion.questionZh)}
                >
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
                          : index % 2 === 0
                            ? "is-tinted"
                            : undefined
                      }
                      onClick={() => handleAnswer(option)}
                    >
                      <span className="tea-mind-option-mark">{String.fromCharCode(65 + index)}</span>
                      <span className="tea-mind-option-copy">
                        <strong>{t(option.label, option.labelZh)}</strong>
                        <em>{t(option.insight, option.insightZh)}</em>
                      </span>
                    </button>
                  ))}
                </div>
                {answers.length > 0 ? (
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
                <span />
              </div>
              <span>{t("Reading the pattern across your answers", "正在閱讀答案之間的脈絡")}</span>
              <h2>{t("Settling the leaves...", "正在讓茶葉沉澱……")}</h2>
              <p>{t("No diagnosis. No forced label.", "不作診斷，不強加標籤。")}</p>
            </section>
          )}

          {phase === "result" && result.type === "cup" && (
            <section className={`tea-mind-result tea-mind-tone-${result.primary.key}`} aria-live="polite">
              <div className="tea-mind-report-heading">
                <span>{t("Your Five Cups result", "你的五盞結果")}</span>
                <em>{t("Included with your test", "完成測試即可查看")}</em>
              </div>
              <div className="tea-mind-result-hero">
                <span className="tea-mind-result-character" aria-hidden="true">{result.primary.character}</span>
                <div>
                  <p className="museum-kicker">
                    {result.isBlended
                      ? t(`${result.primary.character}–${result.supporting.character}`, `${result.primary.character}–${result.supporting.character}`)
                      : t("Your primary cup", "你的主盞")}
                  </p>
                  <h2>{result.primary.englishName}</h2>
                  <h3>{result.primary.chineseGloss}</h3>
                  <p>{t(result.primary.headline, result.primary.headlineZh)}</p>
                </div>
              </div>

              <div className="tea-mind-split-bar" role="img" aria-label={`${result.primaryPercent}% ${result.primary.englishName}, ${result.supportingPercent}% ${result.supporting.englishName}`}>
                <div style={{ width: `${result.primaryPercent}%` }} className="tea-mind-split-bar-primary">
                  <span>{result.primaryPercent}% {t(result.primary.character, result.primary.character)}</span>
                </div>
                <div style={{ width: `${result.supportingPercent}%` }} className="tea-mind-split-bar-supporting">
                  <span>{result.supportingPercent}% {t(result.supporting.character, result.supporting.character)}</span>
                </div>
              </div>

              <div className="tea-mind-result-grid">
                <article>
                  <span>{t("What this means", "這代表甚麼")}</span>
                  <p>{t(result.primary.reading, result.primary.readingZh)}</p>
                </article>
                <article>
                  <span>{t("Serves", "適合")}</span>
                  <p>{t(result.primary.serves, result.primary.servesZh)}</p>
                </article>
                <article>
                  <span>{t("Your ritual", "你的儀式")}</span>
                  <p>{t(result.primary.ritual, result.primary.ritualZh)}</p>
                </article>
              </div>

              <div className="tea-mind-product-panel">
                <div>
                  <span>{t("Your supporting cup", "你的副盞")}</span>
                  <strong>{result.supporting.englishName}</strong>
                  <p className="tea-mind-tea-fit">{t(result.supporting.headline, result.supporting.headlineZh)}</p>
                </div>
                <div className="tea-mind-result-actions">
                  <a href={shopHref}>
                    {t(shopLabel.en, shopLabel.zh)}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a href={routeHref("/tea-ritual")}>
                    {t("Explore the Ritual", "探索茶儀式")}
                  </a>
                  <button type="button" onClick={handleShare}>
                    <Share2 size={16} aria-hidden="true" />
                    {shareState === "shared"
                      ? t("Shared", "已分享")
                      : shareState === "copied"
                        ? t("Copied", "已複製")
                        : t("Share Your Tea Profile", "分享我的茶盞")}
                  </button>
                  <button type="button" onClick={handleRestart}>
                    {t("Retake Reflection", "重新測試")}
                  </button>
                </div>
              </div>

              <section className="tea-mind-full-plan" aria-labelledby="full-plan-title">
                <div className="tea-mind-full-plan-copy">
                  <p className="museum-kicker">{t("Take it further", "更進一步")}</p>
                  <h3 id="full-plan-title">{t("Get your full ritual card and 10% off your first box.", "取得完整儀式卡，並享首次購買九折優惠。")}</h3>
                  <p>
                    {t(
                      "Your ritual card explains how your answers connect, and pairs your primary and supporting cups into one seven-day practice.",
                      "你的儀式卡會解釋答案之間的關係，並將主盞與副盞結合成一套七日練習。"
                    )}
                  </p>
                  <a className="tea-mind-unlock-button" href={inquiryHref}>
                    {t("Get My Full Ritual Card", "取得我的完整儀式卡")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </section>

              <article className="tea-mind-quick-tea">
                <p>
                  {t(
                    "The Five Cups is a lifestyle and cultural guide, offered in the spirit of tradition — it is not medical advice.",
                    "五盞之說是一份生活與文化的指引，承傳統之意而作——並非醫療建議。"
                  )}
                </p>
              </article>
            </section>
          )}

          {phase === "result" && result.type === "comfort" && (
            <section className="tea-mind-result" aria-live="polite">
              <div className="tea-mind-report-heading">
                <span>{t("Your result", "你的結果")}</span>
                <em>{t("Included with your test", "完成測試即可查看")}</em>
              </div>
              <div className="tea-mind-result-hero">
                <div>
                  <p className="museum-kicker">{t("A traditional pairing", "一份傳統的搭配")}</p>
                  <h2>{result.profile.name}</h2>
                  <h3>{result.profile.nameZh}</h3>
                  <p>{t(result.profile.headline, result.profile.headlineZh)}</p>
                </div>
              </div>

              <div className="tea-mind-result-grid">
                <article>
                  <span>{t("What this means", "這代表甚麼")}</span>
                  <p>{t(result.profile.reading, result.profile.readingZh)}</p>
                </article>
                <article>
                  <span>{t("Your ritual", "你的儀式")}</span>
                  <p>{t(result.profile.ritual, result.profile.ritualZh)}</p>
                </article>
              </div>

              <div className="tea-mind-product-panel">
                <div className="tea-mind-result-actions">
                  <a href={routeHref("/tea-collection")}>
                    {t("Explore Chazen Tea", "探索茶禪茶品")}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <button type="button" onClick={handleShare}>
                    <Share2 size={16} aria-hidden="true" />
                    {shareState === "shared"
                      ? t("Shared", "已分享")
                      : shareState === "copied"
                        ? t("Copied", "已複製")
                        : t("Share This Result", "分享這個結果")}
                  </button>
                  <button type="button" onClick={handleRestart}>
                    {t("Retake Reflection", "重新測試")}
                  </button>
                </div>
              </div>

              <article className="tea-mind-quick-tea">
                <p>
                  {t(
                    "The Five Cups is a lifestyle and cultural guide, offered in the spirit of tradition — it is not medical advice.",
                    "五盞之說是一份生活與文化的指引，承傳統之意而作——並非醫療建議。"
                  )}
                </p>
              </article>
            </section>
          )}
        </div>
      </section>

      <section className="chazen-subpage-cta">
        <div className="chazen-subpage-container">
          <div>
            <p className="chazen-subpage-eyebrow">{t("Continue", "繼續旅程")}</p>
            <h2>{t("Turn your cup into a real tea ritual", "將你的盞變成真正的茶儀式")}</h2>
            <p>{t("Explore the ritual and tea selection that fit your cup.", "探索配合你的盞的儀式與茶選。")}</p>
          </div>
          <div className="chazen-subpage-actions">
            <a href={routeHref("/tea-ritual")} className="chazen-subpage-button chazen-subpage-button-primary">
              {t("Explore Tea Ritual", "探索茶儀式")} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={routeHref("/five-cups")} className="chazen-subpage-button">
              {t("Five Cups", "五盞")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
