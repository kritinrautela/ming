export const cupKeys = ["faith", "effort", "mindfulness", "stillness", "wisdom"] as const;

export type CupKey = (typeof cupKeys)[number];

export type FiveCup = {
  key: CupKey;
  tab: string;
  buddhistTerm: string;
  english: string;
  coreMeaning: string;
  coreMeaningEn: string;
  modernState: string;
  modernStateEn: string;
  teaZenMeaning: string;
  teaZenMeaningEn: string;
  mainCopy: string[];
  mainCopyEn: string[];
  visualDirection: string;
  visualDirectionEn: string;
  asset: string;
  cta: {
    href: string;
    label: string;
    labelZh: string;
  };
};

export const fiveCups: FiveCup[] = [
  {
    key: "faith",
    tab: "信",
    buddhistTerm: "信根",
    english: "Faith / Trust",
    coreMeaning: "願意相信、願意開始、願意停下來",
    coreMeaningEn: "Willing to believe, willing to begin, willing to pause",
    modernState: "對生活疲倦、對自己失去連結、不知道由哪裡開始",
    modernStateEn: "Tired of life, disconnected from yourself, unsure where to begin",
    teaZenMeaning: "相信一杯茶可以成為回到自己的入口",
    teaZenMeaningEn: "Trusting that a single cup of tea can be a doorway back to yourself",
    mainCopy: [
      "第一盞，是信。",
      "信，不是盲目相信。而是在混亂、疲倦、焦慮之中，仍然願意給自己一個停下來的機會。",
      "當雙手捧起第一盞茶，溫度從掌心慢慢傳來，人開始從外面的聲音，回到自己的呼吸。",
      "Chazen 相信，一杯茶未必能即時解決所有問題，但它可以成為一個開始：讓你重新聽見自己，重新相信內心仍然可以安定。"
    ],
    mainCopyEn: [
      "The first cup is Faith.",
      "Faith isn't blind belief. It's the willingness, amid chaos, fatigue, and anxiety, to still give yourself a chance to pause.",
      "As both hands cradle the first cup, warmth slowly travels from the palms, and you begin to move from outside noise back to your own breath.",
      "Chazen believes a single cup of tea may not solve everything at once — but it can be a beginning: a way to hear yourself again, and to trust that your inner world can still settle."
    ],
    visualDirection: "暗色茶室、第一道光照在建盞上、手慢慢捧起茶盞。",
    visualDirectionEn: "A dark tea room, the first light falling on a Jian Zhan cup, hands slowly cradling it.",
    asset: "cup-faith-jian-zhan.png",
    cta: {
      href: "/tea-ritual",
      label: "Begin With One Cup",
      labelZh: "從一盞茶開始"
    }
  },
  {
    key: "effort",
    tab: "精進",
    buddhistTerm: "精進根",
    english: "Diligence / Right Effort",
    coreMeaning: "持續修習，不是急速前進",
    coreMeaningEn: "Sustained practice, not rushing forward",
    modernState: "三分鐘熱度、生活節奏混亂、想改變但難以持續",
    modernStateEn: "Losing momentum quickly, a chaotic daily rhythm, wanting change but struggling to sustain it",
    teaZenMeaning: "每日一杯茶，建立穩定節奏",
    teaZenMeaningEn: "One cup of tea a day, building a steady rhythm",
    mainCopy: [
      "第二盞，是精進。",
      "精進，不是逼自己跑得更快。而是在日常之中，願意一次又一次回到正確的方向。",
      "茶的修習不需要盛大的儀式。也許只是每天早上燒一壺水，洗一隻杯，安靜地喝一口茶。",
      "真正的改變，不是突然發生。而是透過細小、穩定、重複的行動，慢慢重建生活的秩序。"
    ],
    mainCopyEn: [
      "The second cup is Effort.",
      "Effort isn't forcing yourself to run faster. It's being willing, again and again in daily life, to return to the right direction.",
      "A tea practice doesn't need grand ceremony. It might simply be boiling water each morning, rinsing a cup, and quietly taking one sip.",
      "Real change doesn't happen suddenly. It's rebuilt slowly, through small, steady, repeated actions."
    ],
    visualDirection: "早晨光線、茶席準備、茶葉落入蓋碗、日常但有儀式感。",
    visualDirectionEn: "Morning light, a tea table being set, leaves settling into the gaiwan — everyday yet ceremonial.",
    asset: "cup-effort-jian-zhan.png",
    cta: {
      href: "/tea-ritual",
      label: "Build A Daily Ritual",
      labelZh: "建立每日茶修"
    }
  },
  {
    key: "mindfulness",
    tab: "念",
    buddhistTerm: "念根",
    english: "Mindfulness / Awareness",
    coreMeaning: "覺察當下，看見自己的念頭",
    coreMeaningEn: "Awareness of the present, seeing your own thoughts",
    modernState: "分心、腦袋停不下來、情緒被外界牽動",
    modernStateEn: "Distracted, a mind that won't stop, emotions pulled by the outside world",
    teaZenMeaning: "看茶色、聞茶香，也看見自己的心",
    teaZenMeaningEn: "Seeing the tea's color, smelling its aroma, and seeing your own mind",
    mainCopy: [
      "第三盞，是念。",
      "念，是覺察。不是控制念頭，而是看見念頭正在出現。",
      "看茶色，是看見當下的光。聞茶香，是回到身體的感受。喝下一口茶，是知道自己正在喝茶。",
      "當人真正開始覺察，情緒未必立刻消失，但你不再完全被它帶走。",
      "茶在杯中，心在此刻。"
    ],
    mainCopyEn: [
      "The third cup is Mindfulness.",
      "Mindfulness is awareness — not controlling your thoughts, but seeing them as they arise.",
      "Seeing the tea's color is seeing the light of this moment. Smelling its aroma is returning to bodily sensation. Taking a sip is knowing you are drinking tea.",
      "When you truly begin to notice, emotions may not vanish at once, but they no longer completely sweep you away.",
      "The tea is in the cup. The mind is in this moment."
    ],
    visualDirection: "茶湯顏色特寫、香氣煙霧、慢鏡聞香、畫面有細緻文字浮現。",
    visualDirectionEn: "Close-up of tea liquor color, aromatic steam, slow-motion smelling, delicate text overlays.",
    asset: "cup-mindfulness-jian-zhan.png",
    cta: {
      href: "/tea-test",
      label: "Observe Your Mind",
      labelZh: "觀察你的當下"
    }
  },
  {
    key: "stillness",
    tab: "定",
    buddhistTerm: "定根",
    english: "Concentration / Stillness",
    coreMeaning: "安住、穩定、不被散亂牽走",
    coreMeaningEn: "Settling, steadiness, not being pulled away by distraction",
    modernState: "焦慮、心亂、睡不好、做事不能集中",
    modernStateEn: "Anxious, scattered, sleeping poorly, unable to focus",
    teaZenMeaning: "當水聲落下，心也慢慢安住",
    teaZenMeaningEn: "As the water falls, the mind slowly settles too",
    mainCopy: [
      "第四盞，是定。",
      "定，不是沒有念頭。而是在念頭來去之間，仍然能夠安住。",
      "水聲落下，茶湯漸滿。人的呼吸，也在這一刻慢慢變深。",
      "當心太散，茶給你一個中心。當世界太吵，茶給你一段安靜。",
      "定，是讓身體、呼吸、意識重新回到同一個地方。"
    ],
    mainCopyEn: [
      "The fourth cup is Stillness.",
      "Stillness isn't the absence of thought. It's being able to settle even as thoughts come and go.",
      "As the water falls and the tea fills the cup, your breath slowly deepens too.",
      "When the mind feels too scattered, tea gives you a center. When the world feels too loud, tea gives you a stretch of quiet.",
      "Stillness brings body, breath, and awareness back to the same place."
    ],
    visualDirection: "水流慢鏡、茶湯平靜、建盞內水面反光、背景聲音變安靜。",
    visualDirectionEn: "Slow-motion pouring water, a calm tea surface, reflections inside the Jian Zhan cup, background sound fading to quiet.",
    asset: "cup-stillness-jian-zhan.png",
    cta: {
      href: "/tea-ritual",
      label: "Return To Stillness",
      labelZh: "回到安定"
    }
  },
  {
    key: "wisdom",
    tab: "慧",
    buddhistTerm: "慧根",
    english: "Wisdom / Insight",
    coreMeaning: "看清、理解、由茶照見自己",
    coreMeaningEn: "Seeing clearly, understanding, reflecting on yourself through tea",
    modernState: "迷茫、選擇困難、不知道自己真正需要什麼",
    modernStateEn: "Feeling lost, struggling to decide, unsure what you truly need",
    teaZenMeaning: "茶不是答案，而是一面鏡",
    teaZenMeaningEn: "Tea isn't the answer — it's a mirror",
    mainCopy: [
      "第五盞，是慧。",
      "慧，不是知道更多答案。而是看清自己真正的狀態。",
      "有時候，人以為自己需要更多努力，其實需要的是休息。有時候，人以為自己需要逃離，其實需要的是安住。",
      "茶不是答案。茶是一面鏡。",
      "當一杯茶安靜地放在面前，你也許會開始看見：此刻的自己，真正需要的是什麼。"
    ],
    mainCopyEn: [
      "The fifth cup is Wisdom.",
      "Wisdom isn't knowing more answers. It's seeing your true state clearly.",
      "Sometimes, you think you need to try harder, when what you truly need is rest. Sometimes, you think you need to escape, when what you truly need is to settle.",
      "Tea isn't the answer. Tea is a mirror.",
      "When a cup of tea sits quietly before you, you may begin to see what you truly need right now."
    ],
    visualDirection: "建盞內倒影、茶湯如鏡、人物安靜凝望、最後轉到 Chazen Tea Test。",
    visualDirectionEn: "A reflection inside the Jian Zhan cup, tea liquor like a mirror, a figure gazing quietly, transitioning to the Chazen Tea Test.",
    asset: "cup-wisdom-jian-zhan.png",
    cta: {
      href: "/tea-test",
      label: "Discover What You Need",
      labelZh: "找出你當下需要的茶"
    }
  }
];
