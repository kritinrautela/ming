"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe2,
  Mail,
  PlayCircle,
  Volume2,
  X
} from "lucide-react";
import { SoundDock } from "@/components/SoundDock";
import { StillnessPractice } from "@/components/StillnessPractice";
import { TeaAtlasMap } from "@/components/TeaAtlasMap";
import { TeaHistoryTimeline } from "@/components/TeaHistoryTimeline";
import { TeaTableInteractive } from "@/components/TeaTableInteractive";
import { VideoModal } from "@/components/VideoModal";
import { teaHistoryItems } from "@/data/teaHistory";
import { teaObjects, type TeaObject } from "@/data/teaObjects";
import { teaOrigins, type TeaOrigin } from "@/data/teaOrigins";
import { buildInquiryPath } from "@/lib/inquiry";
import { audioAssets, videoAssets, withBasePath } from "@/lib/media";

type TeaTool = TeaObject;

type InfoModalContent = {
  kicker: string;
  title: string;
  chinese?: string;
  body: string[];
  items?: Array<{ label: string; value: string }>;
  action?: string;
};

const teaTools: TeaTool[] = [
  {
    number: "01",
    english: "Gaiwan",
    chinese: "蓋碗",
    purpose: "A lidded bowl used to brew loose-leaf tea with control, openness, and clarity.",
    meaning: "The lid gathers aroma. The bowl reveals colour. The saucer carries heat with respect.",
    used: "Used for warming, receiving leaves, brewing, controlling aroma, and pouring.",
    note: "蓋為天，托為地，碗為人。一器之中，藏天地人。",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "The host reads heat, colour, fragrance, and time through one open vessel.",
    x: "48%",
    y: "42%"
  },
  {
    number: "02",
    english: "Fairness Cup",
    chinese: "公道杯",
    purpose: "Receives brewed liquor before serving so every cup has equal strength.",
    meaning: "Hospitality becomes an ethic designed into the pour.",
    used: "Used immediately after each infusion leaves the gaiwan.",
    note: "Its name carries fairness. The vessel makes equality visible before the first sip.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It equalises the infusion so the first guest and last guest receive the same tea.",
    x: "63%",
    y: "34%"
  },
  {
    number: "03",
    english: "Tasting Cup",
    chinese: "品茗杯",
    purpose: "A small cup that concentrates aroma, warmth, and texture.",
    meaning: "The cup asks the drinker to pause before judgment.",
    used: "Used after the fairness cup distributes each infusion.",
    note: "Small volume keeps the tea alive through repeated infusions rather than one large serving.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It turns tasting into attention: aroma first, warmth second, texture last.",
    x: "72%",
    y: "58%"
  },
  {
    number: "04",
    english: "Tea Scoop",
    chinese: "茶則",
    purpose: "Transfers dry leaves cleanly and measures abundance with restraint.",
    meaning: "Generosity without excess, precision without harshness.",
    used: "Used when moving leaves from presentation vessel into gaiwan.",
    note: "The scoop is a discipline of proportion: enough leaf to speak, not enough to shout.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It sets proportion before water arrives, shaping intensity without spectacle.",
    x: "28%",
    y: "60%"
  },
  {
    number: "05",
    english: "Tea Tongs",
    chinese: "茶夾",
    purpose: "Handles hot cups and protects the drinking rim from unnecessary touch.",
    meaning: "Care appears as cleanliness, distance, and restraint.",
    used: "Used during warming, rinsing, arranging, and resetting cups.",
    note: "Refinement often means removing the hand when the tool can serve more respectfully.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It preserves cleanliness while hot vessels move through the ritual sequence.",
    x: "22%",
    y: "48%"
  },
  {
    number: "06",
    english: "Tea Tray",
    chinese: "茶盤",
    purpose: "A drained stage for water, vessels, and controlled movement.",
    meaning: "It contains overflow so the room can remain visually still.",
    used: "Used throughout the full brewing sequence.",
    note: "The tray makes abundance quiet. Water can move freely while the ritual remains composed.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It gives water a hidden path so the table can remain calm and exact.",
    x: "50%",
    y: "52%"
  },
  {
    number: "07",
    english: "Tea Cloth",
    chinese: "茶巾",
    purpose: "Wipes water marks and restores calm between gestures.",
    meaning: "Cleanliness is visual stillness.",
    used: "Used between pours and whenever the table needs a quiet reset.",
    note: "The cloth is the rhythm nobody notices until it is missing.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It erases excess water, allowing each gesture to begin from quiet again.",
    x: "34%",
    y: "75%"
  },
  {
    number: "08",
    english: "Waste Bowl",
    chinese: "水盂",
    purpose: "Receives rinse water, old heat, and the first discarded infusion.",
    meaning: "Release is part of refinement.",
    used: "Used during warming, rinsing, and clearing.",
    note: "The bowl gives letting go a place on the table.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It keeps the necessary discard dignified, contained, and intentional.",
    x: "80%",
    y: "42%"
  },
  {
    number: "09",
    english: "Tea Needle",
    chinese: "茶針",
    purpose: "Clears spouts and opens compressed leaves with delicacy.",
    meaning: "Precision without force.",
    used: "Used when a vessel or compressed tea needs gentle opening.",
    note: "The needle reminds the host that force is rarely elegance.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It solves obstruction with delicacy, preserving the vessel and the leaf.",
    x: "18%",
    y: "66%"
  },
  {
    number: "10",
    english: "Tea Presentation Vessel",
    chinese: "茶荷",
    purpose: "Presents dry leaves so guests can read shape, fragrance, and origin before brewing.",
    meaning: "A pause of respect before water transforms the leaf.",
    used: "Used before the leaves enter the warmed gaiwan.",
    note: "The leaf is first treated as an object of origin: mountain, season, craft, and weather.",
    sound: audioAssets.teaPour,
    soundLabel: "Tea Pouring",
    video: videoAssets.gaiwanRitual,
    brewingRole: "It turns dry leaf into a museum object before it becomes drink.",
    x: "35%",
    y: "36%"
  },
  {
    number: "11",
    english: "Singing Bowl",
    chinese: "冥想鉢",
    purpose: "A sound object used to mark the threshold before stillness and tea.",
    meaning: "One tone turns ordinary time into ritual time.",
    used: "Used before a practice, a quiet pour, or Stillness Mode.",
    note: "Not a gongfu necessity, but a CHAZEN threshold object: sound before water.",
    sound: audioAssets.singingBowl,
    soundLabel: "Singing Bowl",
    video: videoAssets.stillnessRoom,
    brewingRole: "It marks the threshold between ordinary time and ritual time.",
    x: "18%",
    y: "32%"
  }
];

const ritualSteps = [
  {
    number: "01",
    title: "Warm the vessel",
    chinese: "溫杯",
    copy: "Heat crosses porcelain first. The vessel wakes before the leaf, and the room learns the pace of the hand.",
    image: "chazen-tea-table-topdown-v3.png",
    fallback: "chazen-tea-table-topdown-v3.png"
  },
  {
    number: "02",
    title: "Present the leaves",
    chinese: "賞茶",
    copy: "The dry leaf is offered to the eye: twist, roast, stem, fragrance, season, and mountain.",
    image: "chazen-tea-collection-v1.png",
    fallback: "chazen-tea-collection-v1.png"
  },
  {
    number: "03",
    title: "Awaken the tea",
    chinese: "醒茶",
    copy: "A brief rinse releases storage, dust, and sleep. What remains is the first clean breath of the tea.",
    image: "chazen-hero-gongfu-room-v3.png",
    fallback: "chazen-hero-gongfu-room-v3.png"
  },
  {
    number: "04",
    title: "Brew",
    chinese: "注水",
    copy: "Water falls with intention. Temperature, angle, seconds, and silence become architecture.",
    image: "chazen-hero-gongfu-room-v3.png",
    fallback: "chazen-hero-gongfu-room-v3.png"
  },
  {
    number: "05",
    title: "Pour",
    chinese: "出湯",
    copy: "The liquor leaves before it becomes heavy. Timing is the elegance of restraint.",
    image: "chazen-tea-table-topdown-v3.png",
    fallback: "chazen-tea-table-topdown-v3.png"
  },
  {
    number: "06",
    title: "Taste",
    chinese: "品茗",
    copy: "The first sip is received before it is judged: aroma, texture, warmth, return.",
    image: "chazen-song-diancha-v1.png",
    fallback: "chazen-song-diancha-v1.png"
  }
];

const teaHistory = [
  ["01", "Mythic Origin", "神農傳說", "Tea begins in legend, observation, and medicine."],
  ["02", "Tang Dynasty", "唐代", "Lu Yu writes The Classic of Tea. Tea becomes studied as culture."],
  ["03", "Song Dynasty", "宋代", "Dian Cha, Jian ware, scholar aesthetics, restraint, and elegance."],
  ["04", "Ming Dynasty", "明代", "Loose-leaf tea becomes dominant and brewing shifts toward infusion."],
  ["05", "Qing Dynasty", "清代", "Gongfu tea culture matures in southern China."],
  ["06", "Modern CHAZEN", "當代茶禪", "Tea returns as ritual, stillness, sound, meditation, and meaningful gifting."]
];

const knowledgeCards = [
  ["Lu Yu", "陸羽與茶經", "The Tang scholar Lu Yu gave tea language, method, and cultural form. The Classic of Tea made drinking a studied art rather than a casual habit.", "#tea-history"],
  ["Song Dian Cha", "宋代點茶", "Powdered tea was whisked into a luminous surface. Technique, bowl, foam, and scholar taste became a single aesthetic practice.", "#chapter-index"],
  ["Jian Ware", "建盞", "Black-glazed bowls made pale tea foam visible. Their iron-rich surfaces turned drinking into an encounter with light and mineral depth.", "#chapter-index"],
  ["Gongfu Tea", "工夫茶", "Gongfu is not speed but skill over time. Small vessels, repeated infusions, and precise gestures reveal the leaf gradually.", "#gaiwan-ritual"],
  ["Fairness Cup", "公道杯", "The fairness cup is ethics in porcelain. It equalises strength before serving, making hospitality visible on the table.", "#tea-table"],
  ["Tea Hospitality", "茶與待客之禮", "A host offers temperature, timing, sequence, and attention. Tea becomes a refined way to receive another person.", "#meaningful-gifts"],
  ["Tea Meditation", "茶與靜心", "The cup narrows the world enough for attention to return. Breath, steam, and silence make practice ordinary and repeatable.", "#stillness-mode"],
  ["Tea Gifting", "茶與禮", "Tea carries respect without shouting. Origin, vessel, blessing, and packaging turn a gift into memory.", "#meaningful-gifts"]
];

const songCards = [
  ["Dian Cha", "點茶", "Powdered tea whisked into a fine foam, where hand, breath, and bowl meet."],
  ["Jian Ware", "建盞", "Black glaze made to hold tea foam, light, and mineral depth."],
  ["Tea Whisk", "茶筅", "Bamboo rhythm, small circles, and a disciplined wrist."],
  ["Song Aesthetic", "宋風美學", "Restraint as a form of abundance."],
  ["Tea Texts", "茶典", "Knowledge carried through ritual language and scholar practice."]
];

const atlasRegions = [
  {
    name: "Yunnan",
    chinese: "雲南",
    tea: "Pu'er 普洱",
    climate: "Misty highlands, old trees, warm rain.",
    terroir: "Ancient arbor roots, red earth, mountain humidity.",
    process: "Sun-drying, compression, microbial aging.",
    taste: "Earth, camphor, dark fruit, long sweetness.",
    ritual: "Slow infusions and shared patience.",
    history: "One of tea's oldest landscapes, tied to caravan routes and border cultures."
  },
  {
    name: "Fujian Wuyi",
    chinese: "福建武夷",
    tea: "Rock Tea 岩茶",
    climate: "Cliff shade, river mist, mineral stone.",
    terroir: "Narrow valleys and weathered rock hold heat and fragrance.",
    process: "Withering, bruising, roasting, slow refinement.",
    taste: "Mineral depth, orchid, roast, returning sweetness.",
    ritual: "Short gongfu infusions that reveal layers.",
    history: "A scholar and cliff-tea landscape with centuries of tribute and craft."
  },
  {
    name: "Anxi",
    chinese: "安溪",
    tea: "Tie Guan Yin 鐵觀音",
    climate: "Cool slopes and fragrant air.",
    terroir: "Granite soils, fog, and careful garden management.",
    process: "Rolled oolong with controlled oxidation.",
    taste: "Orchid, cream, green stem, bright finish.",
    ritual: "Aroma cups and repeated awakening.",
    history: "Home of one of China's most beloved oolong traditions."
  },
  {
    name: "Hangzhou",
    chinese: "杭州",
    tea: "Longjing 龍井",
    climate: "Spring rain, lake air, tender early shoots.",
    terroir: "West Lake slopes, mild humidity, fine picking windows.",
    process: "Pan-fired flat leaf craft.",
    taste: "Chestnut, bean, spring grass, clarity.",
    ritual: "Glass or porcelain brewing to watch the leaf fall.",
    history: "A green tea associated with literati taste and imperial praise."
  },
  {
    name: "Anhui",
    chinese: "安徽",
    tea: "Huangshan / Keemun 黃山 / 祁門",
    climate: "Mountain cloud, pine shade, cool mornings.",
    terroir: "Yellow Mountain mist and mineral slopes.",
    process: "Green tea shaping and black tea oxidation traditions.",
    taste: "Floral, pine, cocoa, and refined sweetness.",
    ritual: "Quiet cups for fragrance and clarity.",
    history: "A province of famous mountain teas and export black tea heritage."
  },
  {
    name: "Chaozhou",
    chinese: "潮州",
    tea: "Dancong 單叢",
    climate: "Phoenix Mountain mist and warm coastal air.",
    terroir: "Single-bush aromatics from high mountain gardens.",
    process: "Oolong oxidation, shaping, and patient roasting.",
    taste: "Honey orchid, fruit, spice, and a bright edge.",
    ritual: "Small pots, quick pours, intense aroma.",
    history: "A living center of gongfu tea service and aromatic oolong craft."
  },
  {
    name: "Taiwan",
    chinese: "台灣",
    tea: "High Mountain Oolong 高山烏龍",
    climate: "Cold highland fog and strong day-night temperature shifts.",
    terroir: "Alpine gardens, soft mist, slow leaf growth.",
    process: "Light oxidation, rolling, careful low roasting.",
    taste: "Cream, flower, cool air, lingering sweetness.",
    ritual: "Porcelain gaiwan or small pot to follow the fragrance arc.",
    history: "A modern oolong culture shaped by altitude and precision."
  },
  {
    name: "Uji",
    chinese: "宇治",
    tea: "Matcha 抹茶",
    climate: "Shade cultivation and humid river basin air.",
    terroir: "Managed shade, tender leaves, concentrated umami.",
    process: "Steaming, drying, stone milling.",
    taste: "Umami, green depth, soft bitterness, cream.",
    ritual: "Whisked tea as a focused act of presence.",
    history: "A Japanese tea center connected to chanoyu and powdered tea practice."
  }
];

const wisdomCards = [
  {
    character: "福",
    name: "Fu",
    chinese: "福德之福",
    meaning: "Blessing and harmony",
    mood: "Soft white tea for family harmony.",
    gift: "A housewarming or elder-respect blessing.",
    design: "A clay-red seal character held inside warm ivory paper, designed for family blessing sets.",
    story: "Fu is the wish that a home receives enough: enough peace, enough food, enough kindness, enough return."
  },
  {
    character: "祿",
    name: "Lu",
    chinese: "祿位之祿",
    meaning: "Focus and prosperity",
    mood: "Longjing for clear work and composed ambition.",
    gift: "A study, career, or client success set.",
    design: "A bronze vertical mark with ledger-like lines, designed for career, study, and client gifting.",
    story: "Lu is prosperity with discipline. It is not noise or display, but the steady dignity of work becoming fruit."
  },
  {
    character: "壽",
    name: "Shou",
    chinese: "長壽之壽",
    meaning: "Longevity and time",
    mood: "Aged Pu'er for patience and long memory.",
    gift: "A birthday, elder, or family continuity gift.",
    design: "A dark ink roundel with slow concentric breath lines, designed for elder respect and long memory.",
    story: "Shou carries time as a blessing. A cup offered slowly says: may your days be long, clear, and gently held."
  },
  {
    character: "劉",
    name: "Liu Bei",
    chinese: "劉備",
    meaning: "Benevolence",
    mood: "High mountain oolong for gentle leadership.",
    gift: "A diplomatic host gift for trust and care.",
    design: "A soft moss-green silhouette of a host figure, hands lowered, inviting without force.",
    story: "Liu Bei represents humane leadership: the strength to gather people through trust rather than fear."
  },
  {
    character: "關",
    name: "Guan Yu",
    chinese: "關羽",
    meaning: "Loyalty",
    mood: "Wuyi rock tea for vow, gravity, and depth.",
    gift: "A brotherhood, partnership, or oath collection.",
    design: "A tall ink shadow with a clay-red edge, composed like a guardian at the threshold.",
    story: "Guan Yu turns loyalty into ceremony: a vow kept beyond convenience, a bond poured cup after cup."
  },
  {
    character: "張",
    name: "Zhang Fei",
    chinese: "張飛",
    meaning: "Courage",
    mood: "Lapsang Souchong for smoke, courage, and protection.",
    gift: "A protective gift for decisive new beginnings.",
    design: "A heavier brush silhouette with angled bronze cuts, designed for protective, brotherhood gifts.",
    story: "Zhang Fei is courage before hesitation. In CHAZEN, that force is softened by tea into protection, not aggression."
  },
  {
    character: "羽",
    name: "Lu Yu",
    chinese: "陸羽",
    meaning: "Tea wisdom",
    mood: "A tasting flight for method, water, and attention.",
    gift: "A scholar set for those who study craft.",
    design: "A scholar mark beside thin manuscript lines, referencing The Classic of Tea and Tang scholarship.",
    story: "Lu Yu is the figure of tea becoming language. Water, fire, vessel, and conduct become a way of thinking."
  },
  {
    character: "軾",
    name: "Su Shi",
    chinese: "蘇軾",
    meaning: "Scholar elegance",
    mood: "Anhui tea for poetry, mountain air, and resilience.",
    gift: "A literary gift for reflection and grace.",
    design: "A drifting ink figure with river-lines and open sky, designed for poetic gifts and reflective practice.",
    story: "Su Shi brings humour, exile, poetry, and resilience. The cup becomes a companion to the mind that keeps moving."
  }
];

const teaProducts = [
  {
    name: "Da Hong Pao",
    chinese: "大紅袍",
    origin: "Wuyi, Fujian",
    type: "Rock Oolong",
    process: "Withered, bruised, roasted, rested.",
    taste: "Cliff mineral, roasted depth, long returning sweetness.",
    moment: "After an important conversation.",
    ritual: "Gongfu cups, short infusions, quiet attention."
  },
  {
    name: "Longjing",
    chinese: "龍井",
    origin: "Hangzhou, Zhejiang",
    type: "Green Tea",
    process: "Hand pan-fired flat leaf.",
    taste: "Chestnut warmth, spring clarity, flattened leaf precision.",
    moment: "A clean morning before work.",
    ritual: "Glass or white porcelain, watch the leaf fall."
  },
  {
    name: "Bai Hao Yin Zhen",
    chinese: "白毫銀針",
    origin: "Fuding, Fujian",
    type: "White Tea",
    process: "Withered and dried with minimal intervention.",
    taste: "Silver buds, hay sweetness, quiet luminous body.",
    moment: "A late afternoon reset.",
    ritual: "Soft water, longer patience, quiet cups."
  },
  {
    name: "Tie Guan Yin",
    chinese: "鐵觀音",
    origin: "Anxi, Fujian",
    type: "Oolong",
    process: "Rolled, oxidized, shaped, and refined.",
    taste: "Orchid aroma, rolled leaf, bright lingering finish.",
    moment: "Welcoming a guest.",
    ritual: "Warm cups first, then follow the fragrance."
  },
  {
    name: "Pu'er",
    chinese: "普洱",
    origin: "Yunnan",
    type: "Aged Tea",
    process: "Sun-dried, compressed, aged, sometimes fermented.",
    taste: "Earth, wood, dried fruit, mellow depth.",
    moment: "A long conversation after dinner.",
    ritual: "Rinse, awaken, pour slowly."
  },
  {
    name: "High Mountain Oolong",
    chinese: "高山烏龍",
    origin: "Taiwan",
    type: "Oolong",
    process: "Light oxidation, rolling, low roasting.",
    taste: "Cream, alpine air, flower, cool sweetness.",
    moment: "A clear pause between tasks.",
    ritual: "Porcelain gaiwan, repeated short infusions."
  }
];

const giftTypes = [
  "Real Estate Settlement Gifts",
  "Corporate Gifts",
  "VIP Client Gifts",
  "Family Blessing Gifts",
  "Fu Lu Shou Collection",
  "Brotherhood / Oath Collection"
];

const giftPathways = [
  {
    title: "Real Estate Settlement Gift",
    chinese: "交房茶禮",
    for: "New homeowners, premium agents, settlement day.",
    includes: "Tea, gaiwan or cups, blessing scroll, seal card, private message.",
    meaning: "A house receives warmth before furniture arrives.",
    tea: "Da Hong Pao or Bai Hao Yin Zhen",
    figure: "Fu 福"
  },
  {
    title: "Corporate / VIP Gift",
    chinese: "企業貴賓禮",
    for: "Clients, partners, founders, and senior hosts.",
    includes: "Rock tea, ceremonial card, dark lacquer packaging, optional branded insert.",
    meaning: "Respect without shouting, status without noise.",
    tea: "Da Hong Pao",
    figure: "Guan Yu 關羽"
  },
  {
    title: "Family Blessing Gift",
    chinese: "家族祝福禮",
    for: "Parents, elders, birthdays, house gatherings.",
    includes: "White or aged tea, Fu Lu Shou card, soft cloth wrap, blessing note.",
    meaning: "A cup offered slowly says: may your days be long and gently held.",
    tea: "Bai Hao Yin Zhen or Pu'er",
    figure: "Shou 壽"
  },
  {
    title: "Personal Ritual Set",
    chinese: "個人靜心茶席",
    for: "Daily practice, meditation, creative focus, recovery after work.",
    includes: "Tea, tasting cup, sound card, ritual guide, stillness practice.",
    meaning: "A private room made from one cup and one breath.",
    tea: "Longjing or High Mountain Oolong",
    figure: "Lu Yu 陸羽"
  }
];

const entranceRooms = [
  {
    number: "01",
    eyebrow: "Tea State Reflection",
    title: "Notice your current state before choosing a tea.",
    chinese: "先覺察當下狀態，再進入一盞茶。",
    body: "A guided reflection for sleep, stress, focus, mood, and pace. It is not a diagnosis; it is a quiet way to understand what kind of tea ritual may support today.",
    cta: "Discover Your Tea",
    href: "/discover-your-tea/",
    tone: "reflection"
  },
  {
    number: "02",
    eyebrow: "Tea Culture",
    title: "Enter the cultural memory of Chinese tea.",
    chinese: "由神農、陸羽、宋代點茶，到當代茶禪。",
    body: "Begin with myth, medicine, hospitality, scholar practice, Song aesthetics, and the quiet cultural logic behind Chazen.",
    cta: "Explore Tea Culture",
    href: "#tea-history",
    tone: "culture"
  },
  {
    number: "03",
    eyebrow: "Tea Ritual",
    title: "Learn the pace of the gaiwan and the breath.",
    chinese: "茶席不是表演，而是水、器、香氣與時間。",
    body: "Move from vessel warming to leaf, water, pour, taste, and stillness. The ritual room makes the practice visible and calm.",
    cta: "Enter Ritual Room",
    href: "/tea-ritual/",
    tone: "ritual"
  },
  {
    number: "04",
    eyebrow: "Tea Atlas",
    title: "Read origin, climate, and leaf as one map.",
    chinese: "茶不是座標，而是山水、氣候與工藝。",
    body: "Explore tea regions and styles through landscape, craft, aroma, and ritual moments.",
    cta: "Open Tea Atlas",
    href: "/tea-atlas/",
    tone: "atlas"
  },
  {
    number: "05",
    eyebrow: "Journal",
    title: "Read field notes from the house of tea and stillness.",
    chinese: "以文章整理茶文化、茶席與靜心生活。",
    body: "Short editorial notes guide visitors into deeper cultural reading without making the homepage carry every detail.",
    cta: "Read Journal Notes",
    href: "#journal",
    tone: "journal"
  }
] as const;

const journalCards = [
  ["Mindfulness", "The Way of Tea and Mindfulness", "Why the pause before pouring matters as much as the pour."],
  ["Practice", "Why Tea Is a Spiritual Practice", "The cup as a small room for attention, breath, and return."],
  ["History", "Song Dynasty Tea Culture", "Dian Cha, Jian ware, scholar discipline, and the aesthetics of restraint."],
  ["Gifting", "The Meaning of Tea Gifting", "How a gift becomes a memory instead of an object."],
  ["Ritual", "Gaiwan Brewing for Beginners", "A cultural entry into warming, awakening, pouring, and tasting."],
  ["Atlas", "Tea Atlas: Wuyi Rock Tea", "Cliff, mist, mineral, roast, and the taste of mountain stone."]
];

const makeInfo = (content: InfoModalContent) => content;

export function ChazenHomeExperience() {
  const [activeTool, setActiveTool] = useState<TeaObject>(teaObjects[0]);
  const [activeStep, setActiveStep] = useState(ritualSteps[0]);
  const [stepImageFailed, setStepImageFailed] = useState<Record<string, boolean>>({});
  const [activeRegion, setActiveRegion] = useState<TeaOrigin>(teaOrigins[1]);
  const [activeWisdom, setActiveWisdom] = useState(wisdomCards[0]);
  const [videoModal, setVideoModal] = useState<{ title: string; src: string } | null>(null);
  const [infoModal, setInfoModal] = useState<InfoModalContent | null>(null);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const [soundNotice, setSoundNotice] = useState("Sound is off");
  const [soundActive, setSoundActive] = useState(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const soundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRailRef = useRef<HTMLDivElement>(null);
  const imageUrl = (name: string) => withBasePath(`/images/chazen-generated/${name}`);
  const mediaUrl = (path: string) => withBasePath(path);
  const teaCollectionUrl = withBasePath("/tea-collection/");
  const discoverTeaUrl = withBasePath("/discover-your-tea/");
  const scrollToStepRail = () => {
    stepRailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openVideo = (title: string, path: string) => {
    setVideoModal({ title, src: mediaUrl(path) });
  };

  const openObjectModal = (tool: TeaTool) => {
    setInfoModal(
      makeInfo({
        kicker: "Object Study / 器物",
        title: `${tool.english} / ${tool.chinese}`,
        body: [tool.purpose, tool.meaning, tool.note],
        items: [
          { label: "Used When", value: tool.used },
          { label: "Brewing Role", value: tool.brewingRole },
          { label: "Related Sound", value: tool.soundLabel }
        ],
        action: "Return to the table and watch how the object changes the pace of the hand."
      })
    );
  };

  const playSound = (path: string, label: string, loop = false) => {
    if (rainRef.current) {
      rainRef.current.pause();
      rainRef.current = null;
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);

    const audio = new Audio(mediaUrl(path));
    audio.loop = loop;
    audio.volume = loop ? 0.35 : 0.72;
    audio.addEventListener("error", () => {
      setSoundNotice("Audio file coming soon");
      setSoundActive(false);
    });
    audio
      .play()
      .then(() => {
        setSoundNotice(loop ? `${label} is playing softly` : `${label} played once`);
        setSoundActive(true);
        activeAudioRef.current = audio;
        if (loop) rainRef.current = audio;
        if (!loop) {
          soundTimerRef.current = setTimeout(() => setSoundActive(false), 1800);
        }
      })
      .catch(() => {
        setSoundNotice("Audio file coming soon");
        setSoundActive(false);
      });
  };

  const stopSound = () => {
    if (rainRef.current) {
      rainRef.current.pause();
      rainRef.current = null;
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    setSoundActive(false);
    setSoundNotice("Silent Mode");
  };

  useEffect(() => {
    return () => {
      if (rainRef.current) rainRef.current.pause();
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    };
  }, []);

  return (
    <>
      <section id="chazen-entrance" className="museum-section culture-entrance-section">
        <div className="museum-container culture-entrance-panel">
          <div className="culture-entrance-head">
            <p className="museum-kicker">Homepage Entrance / 文化入口</p>
            <h2>Begin with your state. Then enter the culture of tea.</h2>
            <p>
              The homepage is a threshold, not a catalogue. It gives visitors a clear first step:
              reflect on their current state, then choose a cultural room to explore.
            </p>
          </div>
          <div className="culture-room-grid" aria-label="CHAZEN cultural rooms">
            {entranceRooms.map((room) => {
              const href =
                room.href === "/discover-your-tea/"
                  ? discoverTeaUrl
                  : room.href.startsWith("/")
                    ? withBasePath(room.href)
                    : room.href;

              return (
                <article key={room.number} className={`culture-room culture-room-${room.tone}`}>
                  <span>{room.number}</span>
                  <p className="museum-kicker">{room.eyebrow}</p>
                  <h3>{room.title}</h3>
                  <p lang="zh-Hant">{room.chinese}</p>
                  <p>{room.body}</p>
                  <a href={href}>
                    {room.cta} <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
          <div className="culture-entrance-cta">
            <a href={discoverTeaUrl} className="gold-cta compact">
              Discover Your Tea
            </a>
            <a href="#philosophy" className="museum-link-button dark-on-light">
              Read Chazen Philosophy
            </a>
          </div>
        </div>
      </section>

      <section id="ritual-media-room" className="museum-section ritual-media-section">
        <div className="museum-container ritual-media-panel">
          <div className="ritual-media-copy">
            <p className="museum-kicker">Ritual Film & Sound / 茶禪聲影室</p>
            <h2>The ritual should be seen, heard, and felt before it is explained.</h2>
            <p>
              A cultural tea experience needs atmosphere, not only copy. CHAZEN opens a room
              of film, tea ambience, bowl tone, pour sound, and garden rain.
            </p>
            <p lang="zh-Hant">先聽見一聲鉢音，再看見一席茶，才知道茶禪不是普通茶店。</p>
            <div className="ritual-audio-grid" aria-label="CHAZEN sound previews">
              {[
                ["Singing Bowl", "冥想鉢", audioAssets.singingBowl],
                ["Tea Pour", "注水聲", audioAssets.teaPour],
                ["Garden Rain", "庭雨", audioAssets.gardenRain]
              ].map(([label, chinese, src]) => (
                <div key={label} className="ritual-audio-card">
                  <strong>{label}</strong>
                  <span lang="zh-Hant">{chinese}</span>
                  <audio controls preload="metadata" src={withBasePath(src)} />
                </div>
              ))}
            </div>
          </div>
          <div className="ritual-media-stage">
            <video
              controls
              playsInline
              preload="metadata"
              poster={imageUrl("chazen-tea-room-hero-v2.png")}
              src={withBasePath(videoAssets.chazenRitualFilm)}
            />
            <div className="ritual-media-film-list">
              {[
                ["Gaiwan Ritual", videoAssets.gaiwanRitual],
                ["Song Dian Cha", videoAssets.dianCha],
                ["Stillness Room", videoAssets.stillnessRoom]
              ].map(([label, src]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => openVideo(label, src)}
                >
                  <PlayCircle size={15} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="museum-section philosophy-exhibit">
        <div className="museum-container philosophy-panel">
          <div className="philosophy-art-wall" aria-hidden="true">
            <Image
              src={imageUrl("chazen-shanshui-chapter-2.png")}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
              className="philosophy-art-image"
            />
            <span className="ink-circle" />
          </div>
          <div className="philosophy-copy">
            <p className="museum-kicker">Chapter 02 / Philosophy</p>
            <h2>Tea is not just a drink. It is a way of returning.</h2>
            <p lang="zh-Hant">茶不只是飲品，是回到自身的一種方式。</p>
            <div className="cultural-copy-block">
              <p>
                Chazen believes tea is a way to understand your state. Through tea,
                breath, sound, and cultural memory, we help modern people slow down,
                notice sleep, stress, focus, and mood, then return to a calmer way of living.
              </p>
              <p lang="zh-Hant">
                Chazen 相信，茶唔只係飲品，而係一種理解自己狀態嘅方式。
                透過茶、呼吸、聲音同中國文化記憶，我哋希望幫助現代人慢落嚟，
                覺察睡眠、壓力、專注同情緒，再用一盞茶回到安定。
              </p>
            </div>
            <div className="chapter-actions">
              <a href={discoverTeaUrl} className="museum-link-button">
                Discover Your Tea <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="#tea-history" className="museum-link-button">
                Explore Tea Culture <BookOpen size={15} aria-hidden="true" />
              </a>
              <a href="#ritual-media-room" className="museum-link-button">
                Enter the Ritual Room <Volume2 size={15} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="museum-link-button"
                onClick={() =>
                  setInfoModal(
                    makeInfo({
                      kicker: "Origin Story / 茶禪一味",
                      title: "Tea became a path because it held medicine, hospitality, art, and silence.",
                      chinese: "茶不只是飲品，是回到自身的一種方式。",
                      body: [
                        "In Chinese culture, tea moves through many lives: remedy, offering, social etiquette, scholar practice, and quiet discipline.",
                        "CHAZEN uses that cultural memory to help modern visitors notice their state and return through a small ritual of tea, breath, and sound."
                      ],
                      items: [
                        { label: "State", value: "Sleep, stress, focus, mood, and pace." },
                        { label: "Culture", value: "Tea history, vessels, origin, and ritual memory." },
                        { label: "Return", value: "A quieter way to re-enter the day through one cup." }
                      ]
                    })
                  )
                }
              >
                Read the Mission
              </button>
            </div>
          </div>
          <div className="philosophy-caption-panel" aria-hidden="true">
            <span>山水畫</span>
            <strong>Landscape as Breath</strong>
            <p>Mountain, water, mist, and cup steam share one field of attention.</p>
          </div>
        </div>
      </section>

      <TeaHistoryTimeline
        onEnterTimeline={() =>
          setInfoModal(
            makeInfo({
              kicker: "Museum Timeline / 茶之源流",
              title: "Enter the Timeline",
              chinese: "進入茶史",
              body: teaHistoryItems.map((item) => `${item.number} ${item.title} / ${item.chinese}: ${item.copy}`),
              action: "This overlay is a placeholder for a future full-screen tea history room."
            })
          )
        }
      />

      <TeaTableInteractive
        tools={teaObjects}
        activeTool={activeTool}
        imageSrc={imageUrl("chazen-tea-table-topdown-v3.png")}
        onSelect={setActiveTool}
        onLearn={openObjectModal}
        onBrewingRole={(tool) =>
          setInfoModal(
            makeInfo({
              kicker: "Brewing Role / 沖泡角色",
              title: `${tool.english} in the Ritual`,
              chinese: tool.chinese,
              body: [tool.brewingRole, tool.used, tool.meaning],
              items: [
                { label: "Purpose", value: tool.purpose },
                { label: "Cultural Note", value: tool.note }
              ]
            })
          )
        }
        onSound={(tool) => playSound(tool.sound, tool.soundLabel)}
        onVideo={(tool) => openVideo(tool.english === "Singing Bowl" ? "Stillness Room" : "Gaiwan Ritual", tool.video)}
      />

      <section id="gaiwan-ritual" className="museum-section ritual-exhibit">
        <div className="museum-container ritual-panel">
          <div className="ritual-copy-block">
            <p className="museum-kicker">Chapter 05 / Gaiwan Ritual / 蓋碗沖茶</p>
            <h2>Six movements. One return.</h2>
            <p>
              The gaiwan ritual is not a recipe. It is a sequence of temperature,
              fragrance, timing, and restraint.
            </p>
            <p lang="zh-Hant">蓋碗之法，不在繁複，而在水溫、香氣、時間與克制。</p>
            <div className="ritual-intro-actions">
              <button type="button" className="gold-cta compact" onClick={scrollToStepRail}>
                Explore the Six Steps <Compass size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="ritual-cinema-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.number}
                className="ritual-cinema-image-wrap"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={imageUrl(stepImageFailed[activeStep.number] ? activeStep.fallback : activeStep.image)}
                  alt={`${activeStep.number} ${activeStep.title} ${activeStep.chinese}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                  className="ritual-cinema-image"
                  onError={() =>
                    setStepImageFailed((failed) => ({
                      ...failed,
                      [activeStep.number]: true
                    }))
                  }
                />
              </motion.div>
            </AnimatePresence>
            <div className="ritual-cinema-shade" />
            <AnimatePresence mode="wait">
              <motion.article
                key={`${activeStep.number}-story`}
                className="ritual-story"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>{activeStep.number}</span>
                <h2>{activeStep.title}</h2>
                <h3 lang="zh-Hant">{activeStep.chinese}</h3>
                <p>{activeStep.copy}</p>
                <blockquote>
                  Water, leaf, time. Nothing more.
                  <br />
                  <span lang="zh-Hant">水、葉、時。除此之外，皆是雜音。</span>
                </blockquote>
              </motion.article>
            </AnimatePresence>
          </div>

          <div ref={stepRailRef} className="ritual-step-rail" aria-label="Gaiwan ritual steps">
            {ritualSteps.map((step) => (
              <button
                type="button"
                key={step.number}
                className={activeStep.number === step.number ? "is-active" : ""}
                onClick={() => setActiveStep(step)}
                onMouseEnter={() => setActiveStep(step)}
                aria-pressed={activeStep.number === step.number}
              >
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <em lang="zh-Hant">{step.chinese}</em>
              </button>
            ))}
          </div>

          <div className="chapter-actions ritual-actions">
            <button type="button" className="gold-cta compact" onClick={() => openVideo("Gaiwan Ritual", videoAssets.gaiwanRitual)}>
              Watch the Gaiwan Ritual <PlayCircle size={15} aria-hidden="true" />
            </button>
            <button type="button" className="dark-cta compact" onClick={() => playSound(audioAssets.teaPour, "Tea Pouring")}>
              Play Tea Pour Sound <Volume2 size={15} aria-hidden="true" />
            </button>
            <button type="button" className="dark-cta compact" onClick={() => setActiveStep(ritualSteps[0])}>
              Restart Sequence
            </button>
          </div>
        </div>
      </section>

      <section id="chapter-index" className="museum-section chapter-exhibition">
        <div className="museum-container">
          <article className="song-room-card">
            <div className="song-room-image">
              <Image
                src={imageUrl("chazen-song-diancha-v1.png")}
                alt="Dian cha tea whisking in a black Jian ware bowl beside a garden window."
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 54vw"
              />
            </div>
            <div className="song-room-copy">
              <p className="museum-kicker">Chapter 06 / The Song Room / 宋室雅集</p>
              <h2>In the Song dynasty, tea became scholarship, practice, and aesthetic discipline.</h2>
              <p>
                在宋代，茶不只是入口之物，也是文人的修養、器物的審美，與心性的練習。
              </p>
              <div className="song-mini-grid">
                {songCards.map(([title, chinese, copy], index) => (
                  <div key={title}>
                    <span className="song-mini-number">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <span lang="zh-Hant">{chinese}</span>
                    <p>{copy}</p>
                  </div>
                ))}
              </div>
              <div className="song-specimen-strip" aria-label="Song dynasty tea objects">
                {[
                  ["jian", "Jian Ware", "建盞"],
                  ["whisk", "Bamboo Whisk", "茶筅"],
                  ["powder", "Powdered Tea", "茶末"],
                  ["foam", "Tea Foam", "湯花"],
                  ["gathering", "Scholar Gathering", "雅集"]
                ].map(([kind, title, chinese]) => (
                  <div key={kind} className={`song-specimen song-specimen-${kind}`}>
                    <span aria-hidden="true" />
                    <strong>{title}</strong>
                    <em lang="zh-Hant">{chinese}</em>
                  </div>
                ))}
              </div>
              <div className="song-process" aria-label="How dian cha works">
                {[
                  ["01", "Grind Tea", "研茶"],
                  ["02", "Sieve Powder", "羅茶"],
                  ["03", "Add Water", "注湯"],
                  ["04", "Whisk Foam", "擊拂"],
                  ["05", "Read Bowl", "觀盞"]
                ].map(([number, title, chinese]) => (
                  <div key={number}>
                    <span>{number}</span>
                    <strong>{title}</strong>
                    <em lang="zh-Hant">{chinese}</em>
                  </div>
                ))}
              </div>
              <div className="chapter-actions">
                <button type="button" className="museum-link-button dark-on-light" onClick={() => openVideo("Dian Cha", videoAssets.dianCha)}>
                  Watch Dian Cha
                </button>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Object Study / 建盞",
                        title: "Jian Ware",
                        chinese: "建盞",
                        body: [
                          "Jian ware is associated with black-glazed bowls prized in Song tea culture.",
                          "The dark glaze made foam, light, and texture visible during dian cha practice."
                        ],
                        items: [
                          { label: "Material", value: "Iron-rich clay and black glaze." },
                          { label: "Ritual Role", value: "A bowl that reveals the quality of whisked tea." }
                        ]
                      })
                    )
                  }
                >
                  Explore Jian Ware
                </button>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Cultural Article / 宋茶",
                        title: "Song Tea Culture",
                        body: [
                          "Song tea culture joined technique, object connoisseurship, poetry, and silence.",
                          "CHAZEN references this restraint not as nostalgia, but as a contemporary language for attention."
                        ]
                      })
                    )
                  }
                >
                  Read Song Tea Culture
                </button>
              </div>
            </div>
          </article>

          <div className="museum-duo-grid">
            <StillnessPractice
              visualSrc={imageUrl("chazen-hero-gongfu-room-v3.png")}
              onStart={() => setBreathingOpen(true)}
              onPlayBowl={() => playSound(audioAssets.singingBowl, "Singing Bowl")}
              onStop={stopSound}
              onWatchRoom={() => openVideo("Stillness Room", videoAssets.stillnessRoom)}
              onMood={() =>
                setInfoModal(
                  makeInfo({
                    kicker: "Tea Recommendation / 茶與心境",
                    title: "Tea for My Mood",
                    body: [
                      "For clarity: Longjing.",
                      "For depth: Da Hong Pao.",
                      "For softness: Bai Hao Yin Zhen.",
                      "For grounding: Pu'er."
                    ],
                    action: "After the breathing room, CHAZEN can recommend a tea by mood, time of day, and ritual intention."
                  })
                )
              }
            />

            <TeaAtlasMap
              origins={teaOrigins}
              activeOrigin={activeRegion}
              visualSrc={imageUrl("chazen-shanshui-chapter-2.png")}
              onSelect={setActiveRegion}
              onExplore={(origin) =>
                setInfoModal(
                  makeInfo({
                    kicker: "Tea Atlas / 茶之地圖",
                    title: `${origin.name} ${origin.chinese}`,
                    body: [origin.history, origin.process, origin.ritual],
                    items: [
                      { label: "Tea", value: origin.tea },
                      { label: "Landscape", value: origin.landscape },
                      { label: "Climate", value: origin.climate },
                      { label: "Terroir", value: origin.terroir },
                      { label: "Brewing Suggestion", value: origin.brewing }
                    ]
                  })
                )
              }
              onOpenMap={() =>
                setInfoModal(
                  makeInfo({
                    kicker: "Open Tea Map / 茶之地圖",
                    title: "Origin Map",
                    chinese: "茶山與水土",
                    body: teaOrigins.map((origin) => `${origin.name} ${origin.chinese}: ${origin.tea}. ${origin.landscape}`),
                    action: "A future room can expand this into a full interactive East Asia tea map."
                  })
                )
              }
            />
          </div>

          <article className="wisdom-panel">
            <div>
              <p className="museum-kicker">Chapter 09 / Wisdom Collection / 東方智慧 · 傳世典範</p>
              <h2>Character as blessing, memory, and moral form.</h2>
              <div className="wisdom-selected-exhibit">
                <div className="wisdom-image-panel">
                  <Image
                    src={imageUrl("chazen-gift-box-v1.png")}
                    alt="A refined CHAZEN gift table used as a visual setting for wisdom figures and blessing collections."
                    fill
                    sizes="(max-width: 900px) 100vw, 28vw"
                  />
                  <div className="wisdom-selected-portrait" aria-hidden="true">
                    <span className="portrait-scroll" />
                    <span className="portrait-head" />
                    <span className="portrait-robe" />
                    <span className="portrait-seal" lang="zh-Hant">{activeWisdom.character}</span>
                  </div>
                </div>
                <div>
                  <p className="museum-kicker">Selected Figure / 人物標本</p>
                  <h3>{activeWisdom.name}</h3>
                  <strong lang="zh-Hant">{activeWisdom.chinese}</strong>
                  <p>{activeWisdom.story}</p>
                  <dl>
                    <div>
                      <dt>Meaning</dt>
                      <dd>{activeWisdom.meaning}</dd>
                    </div>
                    <div>
                      <dt>Tea Mood</dt>
                      <dd>{activeWisdom.mood}</dd>
                    </div>
                    <div>
                      <dt>Gifting</dt>
                      <dd>{activeWisdom.gift}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="chapter-actions">
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Wisdom Figures / 東方智慧",
                        title: "Explore the Figures",
                        body: wisdomCards.map((card) => `${card.character} ${card.name} / ${card.chinese}: ${card.meaning}. ${card.story}`)
                      })
                    )
                  }
                >
                  Explore the Figures
                </button>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Wisdom Tea / 智慧之茶",
                        title: "Find Your Wisdom Tea",
                        body: [
                          "Blessing asks for white tea.",
                          "Focus asks for Longjing.",
                          "Courage asks for Wuyi rock tea.",
                          "Loyalty asks for aged Pu'er."
                        ]
                      })
                  )
                }
              >
                  Discover the Blessing Collection
                </button>
                <a href="#meaningful-gifts" className="museum-link-button dark-on-light">
                  View Gift Collection
                </a>
              </div>
            </div>
            <div className="wisdom-grid">
              {wisdomCards.map((card) => (
                <button
                  type="button"
                  key={card.name}
                  className={activeWisdom.name === card.name ? "is-active" : ""}
                  onClick={() => setActiveWisdom(card)}
                  aria-pressed={activeWisdom.name === card.name}
                >
                  <span className="wisdom-portrait" aria-hidden="true">
                    <span className="portrait-head" />
                    <span className="portrait-robe" />
                    <em lang="zh-Hant">{card.character}</em>
                  </span>
                  <strong>{card.name}</strong>
                  <em lang="zh-Hant">{card.chinese}</em>
                  <p>{card.meaning}</p>
                  <small>{card.design}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="collection-panel">
            <div className="collection-image">
              <Image
                src={imageUrl("chazen-tea-collection-v1.png")}
                alt="Premium Chinese tea collection with tea canisters, loose leaves, gaiwan, and museum table styling."
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>
            <div className="collection-copy">
              <p className="museum-kicker">Chapter 10 / Tea Collection / 茶品收藏</p>
              <h2>A quiet doorway into leaves, origin, process, taste, and mood.</h2>
              <p>
                The full tea collection now lives as its own exhibit: each tea shown with
                leaf appearance, origin, method, taste, and the ritual moment it belongs to.
              </p>
              <div className="chapter-actions">
                <a
                  href={teaCollectionUrl}
                  className="museum-link-button dark-on-light"
                >
                  Enter Tea Collection
                </a>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Tea Finder / 尋茶",
                        title: "Find Your Tea",
                        body: [
                          "For clarity: Longjing.",
                          "For ceremony: Da Hong Pao.",
                          "For calm: Bai Hao Yin Zhen.",
                          "For grounding: Pu'er.",
                          "For fragrance: Tie Guan Yin or High Mountain Oolong."
                        ]
                      })
                    )
                  }
                >
                  Find Your Tea
                </button>
              </div>
              <div className="product-catalogue product-catalogue-preview">
                {teaProducts.slice(0, 3).map((tea, index) => (
                  <a key={tea.name} href={`${teaCollectionUrl}#${tea.name.toLowerCase().replaceAll(" ", "-").replace("'", "")}`}>
                    <span>{String(index + 1).padStart(2, "0")} / {tea.type}</span>
                    <h3>{tea.name}</h3>
                    <strong lang="zh-Hant">{tea.chinese}</strong>
                    <p>{tea.origin}</p>
                    <small>{tea.taste}</small>
                  </a>
                ))}
              </div>
            </div>
          </article>

          <article className="assessment-preview-panel">
            <div className="assessment-preview-visual" aria-hidden="true">
              <span className="assessment-scroll-card">
                <em>茶</em>
                <strong>Ritual Profile</strong>
              </span>
              <span className="assessment-cup" />
              <span className="assessment-seal">禪</span>
            </div>
            <div className="assessment-preview-copy">
              <p className="museum-kicker">Chapter 11 / Discover Your Tea / 茶禪測驗</p>
              <h2>Choose by pressure, need, ritual, and taste.</h2>
              <p>
                The CHAZEN quiz turns sleep, stress, focus, taste preference,
                and ritual style into a calm tea profile and $25 matched tea pack.
              </p>
              <p lang="zh-Hant">不是只問你喜歡什麼味道，而是覺察壓力、放鬆需要、儀式接受度與當下心境。</p>
              <div className="chapter-actions">
                <a href={discoverTeaUrl} className="gold-cta compact">
                  Start Discover Your Tea
                </a>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Product Preview / 茶禪測驗",
                        title: "Discover Your Tea Quiz",
                        chinese: "茶禪個人化測驗",
                        body: [
                          "The quiz is structured as a free reflection that leads into a $25 AI-matched tea pack.",
                          "It matches pressure, primary need, ritual readiness, and taste direction to a calm tea profile."
                        ],
                        items: [
                          { label: "Inputs", value: "Stress source, sleep, focus, taste, relaxation style, ritual interest, desired feeling." },
                          { label: "Output", value: "Chazen profile, main tea, flower tea, ritual steps, score visualization, matched pack CTA." }
                        ]
                      })
                    )
                  }
                >
                  View Product Logic
                </button>
              </div>
            </div>
          </article>

          <article id="meaningful-gifts" className="gift-panel">
            <div>
              <p className="museum-kicker">Chapter 12 / Meaningful Gifts / 禮之道</p>
              <h2>A gift should not only be received. It should be remembered.</h2>
              <p lang="zh-Hant">禮，不只是送出。是被記住。</p>
              <div className="gift-tags">
                {giftTypes.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="gift-pathway-grid">
                {giftPathways.map((pathway, index) => (
                  <button
                    type="button"
                    key={pathway.title}
                    onClick={() =>
                      setInfoModal(
                        makeInfo({
                          kicker: "Gift Pathway / 禮物方向",
                          title: pathway.title,
                          chinese: pathway.chinese,
                          body: [pathway.for, pathway.meaning],
                          items: [
                            { label: "Includes", value: pathway.includes },
                            { label: "Recommended Tea", value: pathway.tea },
                            { label: "Wisdom Character", value: pathway.figure }
                          ],
                          action: "Private inquiry will shape packaging, tea direction, card wording, and recipient meaning."
                        })
                      )
                    }
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{pathway.title}</strong>
                    <em lang="zh-Hant">{pathway.chinese}</em>
                    <p>{pathway.meaning}</p>
                  </button>
                ))}
              </div>
              <div className="chapter-actions">
                {["Design a Gift Box", "Make Private Inquiry", "View Fu Lu Shou Collection"].map((label) => (
                  <button
                    type="button"
                    key={label}
                    className="museum-link-button dark-on-light"
                    onClick={() =>
                      setInfoModal(
                        makeInfo({
                          kicker: "Private Gifting / 禮之道",
                          title: label,
                          body: [
                            "Checkout is intentionally not enabled yet.",
                            "This future inquiry room will help shape settlement gifts, client gifts, blessing sets, and cultural collections."
                          ],
                          action: "For now, CHAZEN keeps gifting as a curated private inquiry."
                        })
                      )
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="gift-image">
              <Image
                src={imageUrl("chazen-gift-box-v1.png")}
                alt="Premium wooden Chinese tea gift box with ceramic teaware, tea tins, silk cloth, and garden light."
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
          </article>

          <article id="journal" className="journal-panel">
            <div className="journal-image">
              <Image
                src={imageUrl("chazen-shanshui-chapter-2.png")}
                alt="Ink landscape and tea atmosphere for CHAZEN editorial field notes."
                fill
                sizes="(max-width: 900px) 100vw, 36vw"
              />
            </div>
            <div className="journal-head">
              <p className="museum-kicker">Chapter 13 / Journal / 茶禪誌</p>
              <h2>Field notes from the house of tea and stillness.</h2>
              <button
                type="button"
                className="museum-link-button dark-on-light"
                onClick={() =>
                  setInfoModal(
                    makeInfo({
                      kicker: "Field Notes / 茶禪誌",
                      title: "Read Field Notes",
                      body: journalCards.map(([category, title, copy]) => `${category}: ${title}. ${copy}`),
                      action: "A future Journal room can expand these notes into long-form editorial essays."
                    })
                  )
                }
              >
                Read Field Notes
              </button>
            </div>
            <div className="journal-grid">
              {journalCards.map(([category, title, copy], index) => (
                <button
                  type="button"
                  key={title}
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: `${category} / 茶禪誌`,
                        title,
                        body: [copy, "A future article page will expand this preview into a full editorial essay."],
                        action: "Read Article"
                      })
                    )
                  }
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <small>Read Article</small>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="home-brand-footer" aria-label="CHAZEN closing statement">
        <div className="museum-container">
          <p className="display-title">CHAZEN 茶禪</p>
          <h2>Tea. Return. Stillness.</h2>
          <div className="brand-footer-links">
            <a href={withBasePath(buildInquiryPath({ source: "Home closing statement" }))}>
              <Mail size={15} aria-hidden="true" /> Inquiry
            </a>
            <a href="#tea-table">
              <Globe2 size={15} aria-hidden="true" /> Museum
            </a>
            <button type="button" onClick={() => openVideo("Gaiwan Ritual", videoAssets.gaiwanRitual)}>
              <Volume2 size={15} aria-hidden="true" /> Ritual
            </button>
          </div>
        </div>
      </section>

      <SoundDock
        open={soundOpen}
        active={soundActive}
        notice={soundNotice}
        onToggle={() => setSoundOpen((value) => !value)}
        onPlay={playSound}
        onStop={stopSound}
      />

      <VideoModal
        open={Boolean(videoModal)}
        title={videoModal?.title ?? "Film Coming Soon"}
        src={videoModal?.src ?? ""}
        onClose={() => setVideoModal(null)}
      />

      {infoModal && <InfoModal content={infoModal} onClose={() => setInfoModal(null)} />}
      {breathingOpen && <BreathingOverlay onClose={() => setBreathingOpen(false)} />}
    </>
  );
}

function InfoModal({ content, onClose }: { content: InfoModalContent; onClose: () => void }) {
  useModalEffects(onClose);

  return (
    <div className="media-modal-shell info-modal-shell" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <button type="button" className="modal-scrim" aria-label="Close cultural modal" onClick={onClose} />
      <article className="info-modal-panel">
        <div className="media-modal-head">
          <p className="museum-kicker">{content.kicker}</p>
          <button type="button" aria-label="Close cultural modal" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <h2 id="info-modal-title">{content.title}</h2>
        {content.chinese && <h3 lang="zh-Hant">{content.chinese}</h3>}
        <div className="info-modal-copy">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {content.items && (
          <dl className="info-modal-list">
            {content.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {content.action && <p className="info-modal-action">{content.action}</p>}
      </article>
    </div>
  );
}

function BreathingOverlay({ onClose }: { onClose: () => void }) {
  useModalEffects(onClose);

  return (
    <div className="media-modal-shell breathing-shell" role="dialog" aria-modal="true" aria-labelledby="breathing-title">
      <button type="button" className="modal-scrim" aria-label="Close breathing practice" onClick={onClose} />
      <article className="breathing-panel">
        <button type="button" aria-label="Close breathing practice" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
        <div className="breathing-orb" aria-hidden="true" />
        <p className="museum-kicker">3-Minute Practice / 靜心茶室</p>
        <h2 id="breathing-title">Hold the cup. Let the steam set the pace.</h2>
        <p>Inhale for 4. Exhale for 6. Notice aroma. Return to stillness. Drink slowly.</p>
        <p lang="zh-Hant">吸氣，回到茶。呼氣，回到自己。</p>
        <div className="breathing-steps">
          {["捧盞", "隨煙而息", "聞香", "回靜", "慢品"].map((step, index) => (
            <span key={step}>{String(index + 1).padStart(2, "0")} {step}</span>
          ))}
        </div>
      </article>
    </div>
  );
}

function useModalEffects(onClose: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);
}
