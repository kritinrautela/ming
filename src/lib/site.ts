export const site = {
  name: "Chazen 茶禪",
  tagline: "Premium Chinese tea rituals, sound, and meaningful gifts for moments of return.",
  description:
    "A premium Chinese tea ritual, assessment, sound meditation, and cultural gifting house rooted in Chinese tea culture.",
  price: "A$78",
  email: process.env.NEXT_PUBLIC_CHAZEN_INQUIRY_EMAIL ?? "hello@chazentea.com.au"
};

export const navItems = [
  { label: "Tea Test", labelZh: "茶測試", href: "/tea-test" },
  { label: "Ritual", labelZh: "茶儀式", href: "/tea-ritual" },
  { label: "Culture", labelZh: "茶文化", href: "/tea-culture" },
  { label: "Tea Collection", labelZh: "茶品收藏", href: "/tea-collection" },
  { label: "Five Cups", labelZh: "五盞", href: "/five-cups" },
  { label: "Tea Boxes", labelZh: "茶盒", href: "/tea-boxes" },
  { label: "Song Room", labelZh: "點茶室", href: "/song-room" },
  { label: "Stillness Mode", labelZh: "靜心模式", href: "/stillness-mode" },
  { label: "AI Tea Guide", labelZh: "AI 茶導師", href: "/ai-tea-guide" },
  { label: "B2B Gifts", labelZh: "企業茶禮", href: "/b2b" }
];

export const footerItems = [
  { label: "Tea Test", labelZh: "茶測試", href: "/tea-test" },
  { label: "Tea Ritual", labelZh: "茶儀式", href: "/tea-ritual" },
  { label: "Tea Culture", labelZh: "茶文化", href: "/tea-culture" },
  { label: "Tea Collection", labelZh: "茶品收藏", href: "/tea-collection" },
  { label: "Five Cups", labelZh: "五盞", href: "/five-cups" },
  { label: "Tea Boxes", labelZh: "茶盒", href: "/tea-boxes" },
  { label: "Song Room", labelZh: "點茶室", href: "/song-room" },
  { label: "Stillness Mode", labelZh: "靜心模式", href: "/stillness-mode" },
  { label: "AI Tea Guide", labelZh: "AI 茶導師", href: "/ai-tea-guide" },
  { label: "B2B Gifts", labelZh: "企業茶禮", href: "/b2b" }
];

export const giftBoxItems = [
  "Premium loose-leaf Chinese tea",
  "Compact teaware or infuser",
  "Tea ritual card",
  "QR Zen bowl / sound ritual card",
  "Brand story card",
  "Premium outer gift box",
  "Optional real estate agency congratulations card"
];

export const ritualFlow = [
  {
    step: "01",
    title: "Warm the cup",
    copy: "Let heat prepare the vessel and mark a quiet beginning."
  },
  {
    step: "02",
    title: "Pour slowly",
    copy: "Watch the leaf open and let the pace of the pour slow the room."
  },
  {
    step: "03",
    title: "Listen and breathe",
    copy: "Use the sound ritual as a soft cue to settle attention."
  },
  {
    step: "04",
    title: "Sip without rushing",
    copy: "Take the first sip as a return to presence, not another task."
  }
];

export const ritualTypes = [
  {
    name: "Calm Ritual",
    copy: "For a quiet pause when the day feels full and attention feels scattered.",
    tone: "Slow down, pour gently, return to calm."
  },
  {
    name: "Focus Ritual",
    copy: "For a clean moment before work, study, meetings, or decisions.",
    tone: "Clear the surface, warm the cup, begin again."
  },
  {
    name: "Evening Ritual",
    copy: "For the transition from movement into rest, with low light and a slower cup.",
    tone: "Low light, soft sound, one unhurried sip."
  },
  {
    name: "Cultural Ritual",
    copy: "For people drawn to Chinese tea culture, brewing methods, and the story of the leaf.",
    tone: "Learn the leaf, the water, and the quiet sequence."
  }
];

export const aiPromptCards = [
  "Which tea suits my mood?",
  "Help me choose a gift box",
  "Teach me Chinese tea culture",
  "Guide me through a 3-minute tea ritual"
];
