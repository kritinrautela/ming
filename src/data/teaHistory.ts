export type TeaHistoryItem = {
  number: string;
  title: string;
  chinese: string;
  copy: string;
  character: string;
  context: string;
  object: string;
  visualLabel: string;
  image: string;
  story: string;
  chazenMeaning: string;
};

export type KnowledgeCard = {
  title: string;
  chinese: string;
  copy: string;
  href: string;
};

export const teaHistoryItems: TeaHistoryItem[] = [
  {
    number: "01",
    title: "Mythic Origin",
    chinese: "神農傳說",
    copy: "Tea began in legend as medicine and observation.",
    character: "藥",
    context: "Mythic time / before written tea culture",
    object: "Wild leaf, heat, body",
    visualLabel: "Steam over mountain herb",
    image: "chazen-shanshui-chapter-2.jpg",
    story: "The myth of Shennong frames tea as a discovery of balance: leaf, body, heat, and attention. Before tea became taste, it was a way of reading nature.",
    chazenMeaning: "CHAZEN begins here: tea as a threshold between the body and the landscape."
  },
  {
    number: "02",
    title: "Tang Dynasty",
    chinese: "陸羽與《茶經》",
    copy: "Lu Yu and The Classic of Tea. Tea became written, studied, and systematised.",
    character: "經",
    context: "Tang dynasty / 618-907",
    object: "The Classic of Tea, water, fire, vessel",
    visualLabel: "Lu Yu and the written tea canon",
    image: "chazen-arrival-room.avif",
    story: "Lu Yu's Tea Classic gave tea a language of source, vessel, water, fire, and conduct. The cup entered scholarship, and scholarship entered the cup.",
    chazenMeaning: "The brand inherits this seriousness: origin and method matter before luxury can be honest."
  },
  {
    number: "03",
    title: "Song Dynasty",
    chinese: "點茶、建盞、文人雅集",
    copy: "Dian Cha, Jian ware, and scholar tea culture. Tea became visual, tactile, and aesthetic.",
    character: "點",
    context: "Song dynasty / 960-1279",
    object: "Jian bowl, bamboo whisk, powdered tea foam",
    visualLabel: "Powdered tea, foam, Jian bowl",
    image: "chazen-song-diancha-v1.jpg",
    story: "Song dian cha turned powdered tea into a luminous surface. Whisk, bowl, foam, wrist, and silence became a visual art of discipline.",
    chazenMeaning: "Song restraint gives CHAZEN its quiet visual discipline: less decoration, more attention."
  },
  {
    number: "04",
    title: "Ming Dynasty",
    chinese: "散茶與沖泡",
    copy: "Loose-leaf brewing shifted tea from powdered performance toward infusion and vessel clarity.",
    character: "散",
    context: "Ming dynasty / 1368-1644",
    object: "Loose leaf, teapot, infusion water",
    visualLabel: "Gongfu vessels and loose leaf",
    image: "chazen-tea-table-topdown-v3.jpg",
    story: "Loose-leaf infusion changed the grammar of tea. Leaves were no longer hidden in powder; shape, fragrance, and repeated steeping became part of the experience.",
    chazenMeaning: "This is why CHAZEN treats the dry leaf as a museum object before water arrives."
  },
  {
    number: "05",
    title: "Qing Dynasty",
    chinese: "工夫茶與南方茶席",
    copy: "Gongfu practice matured through small vessels, southern hospitality, and repeated infusions.",
    character: "工",
    context: "Qing dynasty / 1644-1912",
    object: "Gaiwan, fairness cup, tasting cups",
    visualLabel: "Small cups, quick pour, shared table",
    image: "chazen-tea-table-topdown-v3.jpg",
    story: "Gongfu is not speed. It is cultivated skill: water controlled by time, leaf revealed through sequence, and hospitality made precise.",
    chazenMeaning: "The CHAZEN table borrows this grammar of care: equal cups, exact timing, and a host who notices."
  },
  {
    number: "06",
    title: "Contemporary CHAZEN",
    chinese: "當代茶禪",
    copy: "Tea returns as ritual, sound, meditation, and meaningful gifting.",
    character: "禪",
    context: "Now / tea, stillness, sound, gifting",
    object: "Gaiwan, singing bowl, gift vessel",
    visualLabel: "Tea room, sound, return",
    image: "chazen-hero-gongfu-room-v3.jpg",
    story: "CHAZEN brings origin, teaware, breathing, sound, and cultural memory into one contemporary room for returning to the present.",
    chazenMeaning: "The old forms are not copied as nostalgia. They are edited into a living ritual for modern attention."
  }
];

export const knowledgeCards: KnowledgeCard[] = [
  {
    title: "Lu Yu",
    chinese: "陸羽與茶經",
    copy: "The Tang scholar Lu Yu gave tea language, method, and cultural form. The Classic of Tea made drinking a studied art rather than a casual habit.",
    href: "#tea-history"
  },
  {
    title: "Song Dian Cha",
    chinese: "宋代點茶",
    copy: "Powdered tea was whisked into a luminous surface. Technique, bowl, foam, and scholar taste became a single aesthetic practice.",
    href: "#chapter-index"
  },
  {
    title: "Jian Ware",
    chinese: "建盞",
    copy: "Black-glazed bowls made pale tea foam visible. Their iron-rich surfaces turned drinking into an encounter with light and mineral depth.",
    href: "#chapter-index"
  },
  {
    title: "Gongfu Tea",
    chinese: "工夫茶",
    copy: "Gongfu is not speed but skill over time. Small vessels, repeated infusions, and precise gestures reveal the leaf gradually.",
    href: "#gaiwan-ritual"
  },
  {
    title: "Fairness Cup",
    chinese: "公道杯",
    copy: "The fairness cup is ethics in porcelain. It equalises strength before serving, making hospitality visible on the table.",
    href: "#tea-table"
  },
  {
    title: "Tea Hospitality",
    chinese: "茶與待客之禮",
    copy: "A host offers temperature, timing, sequence, and attention. Tea becomes a refined way to receive another person.",
    href: "#meaningful-gifts"
  },
  {
    title: "Tea Meditation",
    chinese: "茶與靜心",
    copy: "The cup narrows the world enough for attention to return. Breath, steam, and silence make practice ordinary and repeatable.",
    href: "#stillness-mode"
  },
  {
    title: "Tea Gifting",
    chinese: "茶與禮",
    copy: "Tea carries respect without shouting. Origin, vessel, blessing, and packaging turn a gift into memory.",
    href: "#meaningful-gifts"
  }
];
