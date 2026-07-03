export const cupKeys = ["faith", "effort", "mindfulness", "stillness", "wisdom"] as const;

export type CupKey = (typeof cupKeys)[number];

export type FiveCup = {
  key: CupKey;
  tab: string;
  buddhistTerm: string;
  english: string;
  coreMeaning: string;
  modernState: string;
  teaZenMeaning: string;
  mainCopy: string[];
  visualDirection: string;
  asset: string;
  cta: {
    href: string;
    label: string;
  };
};

export const fiveCups: FiveCup[] = [
  {
    key: "faith",
    tab: "信",
    buddhistTerm: "信根",
    english: "Faith / Trust",
    coreMeaning: "願意相信、願意開始、願意停下來",
    modernState: "對生活疲倦、對自己失去連結、不知道由哪裡開始",
    teaZenMeaning: "相信一杯茶可以成為回到自己的入口",
    mainCopy: [
      "第一盞，是信。",
      "信，不是盲目相信。而是在混亂、疲倦、焦慮之中，仍然願意給自己一個停下來的機會。",
      "當雙手捧起第一盞茶，溫度從掌心慢慢傳來，人開始從外面的聲音，回到自己的呼吸。",
      "Chazen 相信，一杯茶未必能即時解決所有問題，但它可以成為一個開始：讓你重新聽見自己，重新相信內心仍然可以安定。"
    ],
    visualDirection: "暗色茶室、第一道光照在建盞上、手慢慢捧起茶盞。",
    asset: "cup-faith-jian-zhan.webp",
    cta: {
      href: "/tea-ritual",
      label: "Begin With One Cup / 從一盞茶開始"
    }
  },
  {
    key: "effort",
    tab: "精進",
    buddhistTerm: "精進根",
    english: "Diligence / Right Effort",
    coreMeaning: "持續修習，不是急速前進",
    modernState: "三分鐘熱度、生活節奏混亂、想改變但難以持續",
    teaZenMeaning: "每日一杯茶，建立穩定節奏",
    mainCopy: [
      "第二盞，是精進。",
      "精進，不是逼自己跑得更快。而是在日常之中，願意一次又一次回到正確的方向。",
      "茶的修習不需要盛大的儀式。也許只是每天早上燒一壺水，洗一隻杯，安靜地喝一口茶。",
      "真正的改變，不是突然發生。而是透過細小、穩定、重複的行動，慢慢重建生活的秩序。"
    ],
    visualDirection: "早晨光線、茶席準備、茶葉落入蓋碗、日常但有儀式感。",
    asset: "cup-effort-jian-zhan.webp",
    cta: {
      href: "/tea-ritual",
      label: "Build A Daily Ritual / 建立每日茶修"
    }
  },
  {
    key: "mindfulness",
    tab: "念",
    buddhistTerm: "念根",
    english: "Mindfulness / Awareness",
    coreMeaning: "覺察當下，看見自己的念頭",
    modernState: "分心、腦袋停不下來、情緒被外界牽動",
    teaZenMeaning: "看茶色、聞茶香，也看見自己的心",
    mainCopy: [
      "第三盞，是念。",
      "念，是覺察。不是控制念頭，而是看見念頭正在出現。",
      "看茶色，是看見當下的光。聞茶香，是回到身體的感受。喝下一口茶，是知道自己正在喝茶。",
      "當人真正開始覺察，情緒未必立刻消失，但你不再完全被它帶走。",
      "茶在杯中，心在此刻。"
    ],
    visualDirection: "茶湯顏色特寫、香氣煙霧、慢鏡聞香、畫面有細緻文字浮現。",
    asset: "cup-mindfulness-jian-zhan.webp",
    cta: {
      href: "/tea-test",
      label: "Observe Your Mind / 觀察你的當下"
    }
  },
  {
    key: "stillness",
    tab: "定",
    buddhistTerm: "定根",
    english: "Concentration / Stillness",
    coreMeaning: "安住、穩定、不被散亂牽走",
    modernState: "焦慮、心亂、睡不好、做事不能集中",
    teaZenMeaning: "當水聲落下，心也慢慢安住",
    mainCopy: [
      "第四盞，是定。",
      "定，不是沒有念頭。而是在念頭來去之間，仍然能夠安住。",
      "水聲落下，茶湯漸滿。人的呼吸，也在這一刻慢慢變深。",
      "當心太散，茶給你一個中心。當世界太吵，茶給你一段安靜。",
      "定，是讓身體、呼吸、意識重新回到同一個地方。"
    ],
    visualDirection: "水流慢鏡、茶湯平靜、建盞內水面反光、背景聲音變安靜。",
    asset: "cup-stillness-jian-zhan.webp",
    cta: {
      href: "/tea-ritual",
      label: "Return To Stillness / 回到安定"
    }
  },
  {
    key: "wisdom",
    tab: "慧",
    buddhistTerm: "慧根",
    english: "Wisdom / Insight",
    coreMeaning: "看清、理解、由茶照見自己",
    modernState: "迷茫、選擇困難、不知道自己真正需要什麼",
    teaZenMeaning: "茶不是答案，而是一面鏡",
    mainCopy: [
      "第五盞，是慧。",
      "慧，不是知道更多答案。而是看清自己真正的狀態。",
      "有時候，人以為自己需要更多努力，其實需要的是休息。有時候，人以為自己需要逃離，其實需要的是安住。",
      "茶不是答案。茶是一面鏡。",
      "當一杯茶安靜地放在面前，你也許會開始看見：此刻的自己，真正需要的是什麼。"
    ],
    visualDirection: "建盞內倒影、茶湯如鏡、人物安靜凝望、最後轉到 Chazen Tea Test。",
    asset: "cup-wisdom-jian-zhan.webp",
    cta: {
      href: "/tea-test",
      label: "Discover What You Need / 找出你當下需要的茶"
    }
  }
];
