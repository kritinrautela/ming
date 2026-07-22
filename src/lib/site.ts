export const site = {
  name: "Chazen 茶禪",
  tagline: "Premium Chinese tea rituals, sound, and meaningful gifts for moments of return.",
  description:
    "A premium Chinese tea ritual, assessment, sound meditation, and cultural gifting house rooted in Chinese tea culture.",
  price: "A$78",
  email: process.env.NEXT_PUBLIC_CHAZEN_INQUIRY_EMAIL ?? "chazen24tz@gmail.com"
};

export type NavChild = { label: string; labelZh: string; href: string };
export type NavItem = { label: string; labelZh: string; href: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  { label: "Tea Test", labelZh: "茶測試", href: "/tea-test" },
  {
    label: "Ritual",
    labelZh: "茶儀式",
    href: "/tea-ritual",
    children: [
      { label: "Ritual Guide", labelZh: "茶儀式指南", href: "/tea-ritual" },
      { label: "Stillness Mode", labelZh: "靜心模式", href: "/stillness-mode" },
      { label: "Song Room", labelZh: "點茶室", href: "/song-room" }
    ]
  },
  {
    label: "Brew",
    labelZh: "沖泡室",
    href: "/brew-simulator",
    children: [
      { label: "Brewing Room", labelZh: "沖泡室", href: "/brew-simulator" },
      { label: "AI Tea Guide", labelZh: "AI 茶導師", href: "/ai-tea-guide" }
    ]
  },
  {
    label: "Tea",
    labelZh: "茶品",
    href: "/tea-collection",
    children: [
      { label: "Tea Collection", labelZh: "茶品收藏", href: "/tea-collection" },
      { label: "Tea Boxes", labelZh: "茶盒", href: "/tea-boxes" },
      { label: "Tea Atlas", labelZh: "茶地圖", href: "/tea-atlas" }
    ]
  },
  {
    label: "Culture",
    labelZh: "茶文化",
    href: "/tea-culture",
    children: [
      { label: "Tea Culture", labelZh: "茶文化", href: "/tea-culture" },
      { label: "Our Story", labelZh: "品牌故事", href: "/about" }
    ]
  },
  {
    label: "Five Cups",
    labelZh: "五盞",
    href: "/five-cups",
    children: [
      { label: "Cup Collection", labelZh: "五盞收藏", href: "/five-cups" },
      { label: "Tea Set", labelZh: "茶具組", href: "/tea-boxes" }
    ]
  },
  {
    label: "Gifting",
    labelZh: "文化贈禮",
    href: "/b2b",
    children: [
      { label: "B2B Gifts", labelZh: "企業茶禮", href: "/b2b" },
      { label: "Gift Box", labelZh: "禮盒", href: "/gift-box" }
    ]
  }
];

export const footerItems = [
  { label: "Tea Test", labelZh: "茶測試", href: "/tea-test" },
  { label: "Tea Ritual", labelZh: "茶儀式", href: "/tea-ritual" },
  { label: "Brewing Room", labelZh: "沖泡室", href: "/brew-simulator" },
  { label: "Tea Culture", labelZh: "茶文化", href: "/tea-culture" },
  { label: "Tea Collection", labelZh: "茶品收藏", href: "/tea-collection" },
  { label: "Tea Boxes", labelZh: "茶盒", href: "/tea-boxes" },
  { label: "Five Cups", labelZh: "五盞", href: "/five-cups" },
  { label: "Song Room", labelZh: "點茶室", href: "/song-room" },
  { label: "Stillness Mode", labelZh: "靜心模式", href: "/stillness-mode" },
  { label: "AI Tea Guide", labelZh: "AI 茶導師", href: "/ai-tea-guide" },
  { label: "Gift Box", labelZh: "禮盒", href: "/gift-box" },
  { label: "Tea Atlas", labelZh: "茶地圖", href: "/tea-atlas" },
  { label: "B2B Gifts", labelZh: "企業茶禮", href: "/b2b" },
  { label: "Our Story", labelZh: "品牌故事", href: "/about" },
  { label: "FAQ", labelZh: "常見問題", href: "/faq" },
  { label: "Contact", labelZh: "聯絡我們", href: "/contact" }
];

export const legalItems = [
  { label: "Privacy", labelZh: "私隱政策", href: "/privacy" },
  { label: "Terms", labelZh: "使用條款", href: "/terms" },
  { label: "Shipping & Returns", labelZh: "配送與退換", href: "/shipping-returns" }
];

export const giftBoxItems = [
  { en: "Premium loose-leaf Chinese tea", zh: "頂級中國散裝茶葉" },
  { en: "Compact teaware or infuser", zh: "輕巧茶具或濾茶器" },
  { en: "Tea ritual card", zh: "茶儀式卡" },
  { en: "QR Zen bowl / sound ritual card", zh: "QR 禪缽／聲音儀式卡" },
  { en: "Brand story card", zh: "品牌故事卡" },
  { en: "Premium outer gift box", zh: "高質感外層禮盒" },
  { en: "Optional real estate agency congratulations card", zh: "可選地產公司賀卡" }
];

export const ritualFlow = [
  { step: "01", title: { en: "Warm the cup", zh: "溫杯" }, copy: { en: "Let heat prepare the vessel and mark a quiet beginning.", zh: "讓熱度先準備好器具，為這場儀式標記一個安靜的開始。" } },
  { step: "02", title: { en: "Pour slowly", zh: "緩緩注水" }, copy: { en: "Watch the leaf open and let the pace of the pour slow the room.", zh: "看著茶葉舒展，讓注水的節奏使整個空間慢下來。" } },
  { step: "03", title: { en: "Listen and breathe", zh: "聆聽與呼吸" }, copy: { en: "Use the sound ritual as a soft cue to settle attention.", zh: "以聲音儀式作為溫柔的提示，讓注意力安定下來。" } },
  { step: "04", title: { en: "Sip without rushing", zh: "不急不徐地啜飲" }, copy: { en: "Take the first sip as a return to presence, not another task.", zh: "第一口茶，是回到當下，而不是另一項待辦事項。" } }
];

export const ritualTypes = [
  { name: { en: "Calm Ritual", zh: "靜心儀式" }, copy: { en: "For a quiet pause when the day feels full and attention feels scattered.", zh: "適合在日子過於繁忙、注意力分散時，安靜地暫停片刻。" }, tone: { en: "Slow down, pour gently, return to calm.", zh: "慢下來，輕輕注水，回到平靜。" } },
  { name: { en: "Focus Ritual", zh: "專注儀式" }, copy: { en: "For a clean moment before work, study, meetings, or decisions.", zh: "適合在工作、學習、會議或決策之前，先有一個清晰的片刻。" }, tone: { en: "Clear the surface, warm the cup, begin again.", zh: "清理桌面，溫杯，重新開始。" } },
  { name: { en: "Evening Ritual", zh: "晚間儀式" }, copy: { en: "For the transition from movement into rest, with low light and a slower cup.", zh: "適合從忙碌過渡到休息，搭配柔和燈光與更慢的一杯茶。" }, tone: { en: "Low light, soft sound, one unhurried sip.", zh: "柔光、輕聲，一口不急的茶。" } },
  { name: { en: "Cultural Ritual", zh: "文化儀式" }, copy: { en: "For people drawn to Chinese tea culture, brewing methods, and the story of the leaf.", zh: "適合對中國茶文化、沖泡方法與茶葉故事感興趣的人。" }, tone: { en: "Learn the leaf, the water, and the quiet sequence.", zh: "認識茶葉、水，以及安靜的沖泡順序。" } }
];

export const aiPromptCards = [
  { en: "Which tea suits my mood?", zh: "哪款茶適合我現在的心情？" },
  { en: "Help me choose a gift box", zh: "幫我選一份禮盒" },
  { en: "Teach me Chinese tea culture", zh: "教我認識中國茶文化" },
  { en: "Guide me through a 3-minute tea ritual", zh: "引導我完成一場三分鐘茶儀式" }
];
