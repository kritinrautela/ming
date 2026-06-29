"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Globe2,
  Mail,
  MapPinned,
  Volume2,
  X
} from "lucide-react";
import { SoundDock } from "@/components/SoundDock";
import { VideoModal } from "@/components/VideoModal";

type TeaTool = {
  number: string;
  english: string;
  chinese: string;
  purpose: string;
  meaning: string;
  used: string;
  note: string;
  sound: string;
  soundLabel: string;
  video: string;
  brewingRole: string;
  x: string;
  y: string;
};

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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/tea-pour.mp3",
    soundLabel: "Tea Pouring",
    video: "/video/gaiwan-ritual.mp4",
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
    sound: "/audio/singing-bowl.mp3",
    soundLabel: "Singing Bowl",
    video: "/video/stillness-room.mp4",
    brewingRole: "It marks the threshold between ordinary time and ritual time.",
    x: "18%",
    y: "32%"
  }
];

const ritualSteps = [
  {
    number: "01",
    title: "Warm the cup",
    chinese: "溫杯",
    copy: "Heat crosses porcelain first. The vessel wakes before the leaf, and the room learns the pace of the hand.",
    image: "chazen-tea-table-topdown-v3.png"
  },
  {
    number: "02",
    title: "Add tea",
    chinese: "投茶",
    copy: "The dry leaf is offered to the eye: twist, roast, stem, fragrance, season, and mountain.",
    image: "chazen-tea-collection-v1.png"
  },
  {
    number: "03",
    title: "Awaken the tea",
    chinese: "醒茶",
    copy: "A brief rinse releases storage, dust, and sleep. What remains is the first clean breath of the tea.",
    image: "chazen-hero-gongfu-room-v3.png"
  },
  {
    number: "04",
    title: "Brew",
    chinese: "沖泡",
    copy: "Water falls with intention. Temperature, angle, seconds, and silence become architecture.",
    image: "chazen-hero-gongfu-room-v3.png"
  },
  {
    number: "05",
    title: "Pour",
    chinese: "出湯",
    copy: "The liquor leaves before it becomes heavy. Timing is the elegance of restraint.",
    image: "chazen-tea-table-topdown-v3.png"
  },
  {
    number: "06",
    title: "Savour",
    chinese: "品茗",
    copy: "The first sip is received before it is judged: aroma, texture, warmth, return.",
    image: "chazen-song-diancha-v1.png"
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
  ["福", "Fu", "Blessing and harmony"],
  ["祿", "Lu", "Focus and prosperity"],
  ["壽", "Shou", "Longevity and time"],
  ["劉備", "Liu Bei", "Benevolence"],
  ["關羽", "Guan Yu", "Loyalty"],
  ["張飛", "Zhang Fei", "Courage"],
  ["陸羽", "Lu Yu", "Tea wisdom"],
  ["蘇軾", "Su Shi", "Scholar elegance"]
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
  const [activeTool, setActiveTool] = useState(teaTools[0]);
  const [activeStep, setActiveStep] = useState(ritualSteps[0]);
  const [activeRegion, setActiveRegion] = useState(atlasRegions[1]);
  const [videoModal, setVideoModal] = useState<{ title: string; src: string } | null>(null);
  const [infoModal, setInfoModal] = useState<InfoModalContent | null>(null);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const [soundNotice, setSoundNotice] = useState("Sound is off");
  const [soundActive, setSoundActive] = useState(false);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const soundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const imageUrl = (name: string) => `${basePath}/images/${name}`;
  const mediaUrl = (path: string) => `${basePath}${path}`;

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
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);

    const audio = new Audio(mediaUrl(path));
    audio.loop = loop;
    audio.volume = loop ? 0.35 : 0.72;
    audio.addEventListener("error", () => {
      setSoundNotice(`${label} audio coming soon`);
      setSoundActive(false);
    });
    audio
      .play()
      .then(() => {
        setSoundNotice(loop ? `${label} is playing softly` : `${label} played once`);
        setSoundActive(true);
        if (loop) rainRef.current = audio;
        if (!loop) {
          soundTimerRef.current = setTimeout(() => setSoundActive(false), 1800);
        }
      })
      .catch(() => {
        setSoundNotice(`${label} audio coming soon`);
        setSoundActive(false);
      });
  };

  const stopSound = () => {
    if (rainRef.current) {
      rainRef.current.pause();
      rainRef.current = null;
    }
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    setSoundActive(false);
    setSoundNotice("Silent Mode");
  };

  useEffect(() => {
    return () => {
      if (rainRef.current) rainRef.current.pause();
      if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    };
  }, []);

  return (
    <>
      <section id="philosophy" className="museum-section philosophy-exhibit">
        <div className="museum-container philosophy-panel">
          <div className="ink-circle" aria-hidden="true" />
          <div className="philosophy-copy">
            <p className="museum-kicker">Chapter 02 / Philosophy</p>
            <h2>Tea is not just a drink. It is a way of returning.</h2>
            <p lang="zh-Hant">茶不只是飲品，是回到自身的一種方式。</p>
            <div className="cultural-copy-block">
              <p>Tea began as medicine. It became hospitality. It became art. It became stillness.</p>
              <p lang="zh-Hant">茶，曾是藥，也是待客之禮，是文人的審美，也是靜心的入口。</p>
            </div>
            <div className="chapter-actions">
              <a href="#tea-history" className="museum-link-button">
                Explore Tea Philosophy <ArrowRight size={15} aria-hidden="true" />
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
                        "CHAZEN treats this movement as a living museum. The cup is small, but it can hold origin, climate, craft, sound, and breath."
                      ],
                      items: [
                        { label: "Medicine", value: "Observation of leaf, body, and balance." },
                        { label: "Hospitality", value: "A guest receives care through temperature, timing, and order." },
                        { label: "Stillness", value: "The ritual creates a threshold between noise and attention." }
                      ]
                    })
                  )
                }
              >
                Read Tea History <BookOpen size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="museum-link-button"
                onClick={() => playSound("/audio/singing-bowl.mp3", "Singing Bowl")}
              >
                Hear the Singing Bowl <Volume2 size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="ink-mountain" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section id="tea-history" className="museum-section history-timeline-section">
        <div className="museum-container">
          <div className="section-title-block">
            <p className="museum-kicker">Chapter 03 / The History of Tea</p>
            <h2>Tea moves from legend to medicine, from scholarship to stillness.</h2>
            <p lang="zh-Hant">茶之源流，從傳說、藥性、文人審美，到當代靜心。</p>
          </div>
          <div className="history-timeline">
            {teaHistory.map(([number, title, chinese, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <strong lang="zh-Hant">{chinese}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="knowledge-grid" aria-label="Tea culture knowledge cards">
            {knowledgeCards.map(([title, chinese, copy, href]) => (
              <article key={title}>
                <span className="seal-mark" aria-hidden="true" />
                <h3>{title}</h3>
                <strong lang="zh-Hant">{chinese}</strong>
                <p>{copy}</p>
                <a href={href} className="text-link-button">
                  Learn More
                </a>
              </article>
            ))}
          </div>
          <div className="chapter-actions">
            <button
              type="button"
              className="museum-link-button dark-on-light"
              onClick={() =>
                setInfoModal(
                  makeInfo({
                    kicker: "Museum Timeline / 茶之源流",
                    title: "Enter the Timeline",
                    chinese: "進入茶史",
                    body: teaHistory.map(([number, title, chinese, copy]) => `${number} ${title} / ${chinese}: ${copy}`),
                    action: "This overlay is a placeholder for a future full-screen tea history room."
                  })
                )
              }
            >
              Enter the Timeline <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section id="tea-table" className="museum-section tea-table-exhibit">
        <div className="museum-container">
          <div className="section-title-block">
            <p className="museum-kicker">Chapter 04 / The Tea Table</p>
            <h2>Every vessel has its place. Every movement is a return.</h2>
            <p lang="zh-Hant">器有其位，動作有序。茶之道，在於回歸本真。</p>
          </div>

          <div className="tea-table-grid">
            <div className="tool-selector" aria-label="Tea table objects">
              {teaTools.map((tool) => (
                <button
                  type="button"
                  key={tool.number}
                  className={activeTool.number === tool.number ? "is-active" : ""}
                  onClick={() => setActiveTool(tool)}
                  aria-pressed={activeTool.number === tool.number}
                >
                  <span>{tool.number}</span>
                  <strong>{tool.english}</strong>
                  <em lang="zh-Hant">{tool.chinese}</em>
                </button>
              ))}
            </div>

            <figure className="table-object-stage">
              <Image
                src={imageUrl("chazen-tea-table-topdown-v3.png")}
                alt="Top-down Chinese tea table with gaiwan, fairness cup, tasting cups, tea tray, tea tools, cloth, and singing bowl."
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className="table-object-image"
              />
              <div className="table-object-shade" />
              <svg className="table-annotation-layer" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M48 42 C44 31 41 24 35 18" />
                <path d="M63 34 C70 25 76 20 85 18" />
                <path d="M72 58 C82 58 88 63 92 71" />
                <path d="M28 60 C17 62 10 68 7 78" />
                <path d="M18 32 C12 26 10 18 13 10" />
              </svg>
              {teaTools.map((tool) => (
                <button
                  type="button"
                  key={tool.number}
                  className={`object-marker ${activeTool.number === tool.number ? "is-active" : ""}`}
                  style={{ left: tool.x, top: tool.y }}
                  onClick={() => {
                    setActiveTool(tool);
                  }}
                  aria-label={`${tool.number} ${tool.english} ${tool.chinese}`}
                  title={`${tool.english} / ${tool.chinese}`}
                >
                  <span>{tool.number}</span>
                  <em>{tool.chinese}</em>
                </button>
              ))}
              <figcaption>
                Object study / Click each numbered vessel / <span lang="zh-Hant">器物標本圖</span>
              </figcaption>
            </figure>

            <article className="selected-object-panel">
              <p className="museum-kicker">Selected Object</p>
              <h3 lang="zh-Hant">{activeTool.chinese}</h3>
              <h4>{activeTool.english}</h4>
              <dl>
                <div>
                  <dt>Purpose</dt>
                  <dd>{activeTool.purpose}</dd>
                </div>
                <div>
                  <dt>Ritual Meaning</dt>
                  <dd>{activeTool.meaning}</dd>
                </div>
                <div>
                  <dt>Used When</dt>
                  <dd>{activeTool.used}</dd>
                </div>
                <div>
                  <dt>Cultural Note</dt>
                  <dd>{activeTool.note}</dd>
                </div>
                <div>
                  <dt>Brewing Role</dt>
                  <dd>{activeTool.brewingRole}</dd>
                </div>
              </dl>
              <div className="object-actions">
                <button type="button" className="museum-link-button dark-on-light" onClick={() => openObjectModal(activeTool)}>
                  Learn This Vessel
                </button>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Brewing Role / 沖泡角色",
                        title: `${activeTool.english} in the Ritual`,
                        chinese: activeTool.chinese,
                        body: [activeTool.brewingRole, activeTool.used, activeTool.meaning],
                        items: [
                          { label: "Purpose", value: activeTool.purpose },
                          { label: "Cultural Note", value: activeTool.note }
                        ]
                      })
                    )
                  }
                >
                  View Brewing Role
                </button>
                <button type="button" className="museum-link-button dark-on-light" onClick={() => playSound(activeTool.sound, activeTool.soundLabel)}>
                  Hear Object Sound
                </button>
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() => openVideo(`${activeTool.english} in Use`, activeTool.video)}
                >
                  Watch in Use
                </button>
              </div>
            </article>
          </div>

          <div className="gaiwan-line-study" aria-hidden="true">
            <span className="line-saucer" />
            <span className="line-bowl" />
            <span className="line-lid" />
            <span className="line-knob" />
          </div>
        </div>
      </section>

      <section id="gaiwan-ritual" className="museum-section ritual-exhibit">
        <div className="museum-container ritual-panel">
          <div className="ritual-nav" aria-label="Gaiwan ritual steps">
            <p className="museum-kicker">Chapter 05 / Gaiwan Ritual / 蓋碗沖茶</p>
            {ritualSteps.map((step) => (
              <button
                type="button"
                key={step.number}
                className={activeStep.number === step.number ? "is-active" : ""}
                onClick={() => setActiveStep(step)}
                aria-pressed={activeStep.number === step.number}
              >
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <em lang="zh-Hant">{step.chinese}</em>
              </button>
            ))}
            <div className="chapter-actions ritual-actions">
              <button type="button" className="dark-cta compact" onClick={() => openVideo("Gaiwan Ritual", "/video/gaiwan-ritual.mp4")}>
                Watch Gaiwan Ritual
              </button>
              <button type="button" className="dark-cta compact" onClick={() => setActiveStep(ritualSteps[0])}>
                Begin Step-by-Step Guide
              </button>
            </div>
          </div>

          <div className="ritual-filmstrip">
            {ritualSteps.map((step) => (
              <button
                type="button"
                key={step.number}
                className={activeStep.number === step.number ? "is-active" : ""}
                onClick={() => setActiveStep(step)}
                aria-label={`${step.number} ${step.title}`}
              >
                <Image
                  src={imageUrl(step.image)}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 72vw, 24vw"
                  className="ritual-film-image"
                />
                <span>{step.number}</span>
              </button>
            ))}
          </div>

          <article className="ritual-story">
            <span>{activeStep.number}</span>
            <h2>{activeStep.title}</h2>
            <h3 lang="zh-Hant">{activeStep.chinese}</h3>
            <p>{activeStep.copy}</p>
            <button
              type="button"
              className="dark-cta compact ritual-step-watch"
              onClick={() => openVideo(`${activeStep.number} ${activeStep.title}`, "/video/gaiwan-ritual.mp4")}
            >
              Watch This Step
            </button>
            <blockquote>
              Water, leaf, time. Nothing more. In six movements, tea becomes a type of listening.
              <br />
              <span lang="zh-Hant">水、葉、時、手、心。六步之間，茶成為一種聆聽。</span>
            </blockquote>
          </article>

          <div className="ritual-ink-wash" aria-hidden="true" />
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
                {songCards.map(([title, chinese, copy]) => (
                  <div key={title}>
                    <strong>{title}</strong>
                    <span lang="zh-Hant">{chinese}</span>
                    <p>{copy}</p>
                  </div>
                ))}
              </div>
              <div className="chapter-actions">
                <button type="button" className="museum-link-button dark-on-light" onClick={() => openVideo("Dian Cha", "/video/dian-cha.mp4")}>
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
            <article id="stillness-mode" className="stillness-panel">
              <p className="museum-kicker">Chapter 08 / Stillness Mode / 靜心茶室</p>
              <h2>Breathe in. Return to the tea. Breathe out. Return to yourself.</h2>
              <p lang="zh-Hant">吸氣，回到茶。呼氣，回到自己。</p>
              <div className="bowl-stage" aria-hidden="true">
                <span className="bowl-rim" />
                <span className="bowl-body" />
                <span className="bowl-smoke" />
              </div>
              <div className="stillness-options">
                {["Breathing Guide", "Tea Meditation", "Sound of Bowl", "Recommended Tea"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="chapter-actions">
                <button type="button" className="dark-cta compact" onClick={() => setBreathingOpen(true)}>
                  Start 60-Second Practice
                </button>
                <button type="button" className="dark-cta compact" onClick={() => playSound("/audio/singing-bowl.mp3", "Singing Bowl")}>
                  Play Singing Bowl
                </button>
                <button
                  type="button"
                  className="dark-cta compact"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Mood Selector / 茶與心境",
                        title: "Tea for My Mood",
                        body: [
                          "For clarity: Longjing.",
                          "For depth: Da Hong Pao.",
                          "For softness: Bai Hao Yin Zhen.",
                          "For grounding: Pu'er."
                        ],
                        action: "A future selector can turn this into a guided recommendation."
                      })
                    )
                  }
                >
                  Tea for My Mood
                </button>
                <button type="button" className="dark-cta compact" onClick={stopSound}>
                  Silent Mode
                </button>
              </div>
            </article>

            <article className="atlas-panel">
              <p className="museum-kicker">Chapter 07 / Tea Atlas / 茶之地圖</p>
              <h2>Origin is not a coordinate. It is climate remembered by leaf.</h2>
              <div className="atlas-map" aria-label="Highlighted tea regions">
                {atlasRegions.map((region) => (
                  <button
                    type="button"
                    key={region.name}
                    className={activeRegion.name === region.name ? "is-active" : ""}
                    onClick={() => setActiveRegion(region)}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
              <div className="atlas-feature">
                <span>Featured Origin</span>
                <strong>
                  {activeRegion.name} {activeRegion.chinese}
                </strong>
                <p>{activeRegion.tea}</p>
                <dl className="atlas-detail-list">
                  <div>
                    <dt>Climate</dt>
                    <dd>{activeRegion.climate}</dd>
                  </div>
                  <div>
                    <dt>Terroir</dt>
                    <dd>{activeRegion.terroir}</dd>
                  </div>
                  <div>
                    <dt>Taste</dt>
                    <dd>{activeRegion.taste}</dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                className="museum-link-button dark-on-light"
                onClick={() =>
                  setInfoModal(
                    makeInfo({
                      kicker: "Tea Atlas / 茶之地圖",
                      title: `${activeRegion.name} ${activeRegion.chinese}`,
                      body: [activeRegion.history, activeRegion.process, activeRegion.ritual],
                      items: [
                        { label: "Tea", value: activeRegion.tea },
                        { label: "Climate", value: activeRegion.climate },
                        { label: "Terroir", value: activeRegion.terroir },
                        { label: "Taste", value: activeRegion.taste }
                      ]
                    })
                  )
                }
              >
                Explore Tea Origins <MapPinned size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="museum-link-button dark-on-light"
                onClick={() =>
                  setInfoModal(
                    makeInfo({
                      kicker: "Open Tea Map / 茶之地圖",
                      title: "Origin Map",
                      chinese: "茶山與水土",
                      body: atlasRegions.map(
                        (region) => `${region.name} ${region.chinese}: ${region.tea}. ${region.climate} ${region.terroir}`
                      ),
                      action: "A future room can expand this into a full interactive East Asia tea map."
                    })
                  )
                }
              >
                Open Tea Map
              </button>
            </article>
          </div>

          <article className="wisdom-panel">
            <div>
              <p className="museum-kicker">Chapter 09 / Wisdom Collection / 東方智慧 · 傳世典範</p>
              <h2>Character as blessing, memory, and moral form.</h2>
              <div className="chapter-actions">
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Wisdom Figures / 東方智慧",
                        title: "Explore the Figures",
                        body: wisdomCards.map(([character, name, meaning]) => `${character} ${name}: ${meaning}.`)
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
              {wisdomCards.map(([character, name, meaning]) => (
                <button
                  type="button"
                  key={character}
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Wisdom Archetype / 傳世典範",
                        title: name,
                        chinese: character,
                        body: [meaning, "In CHAZEN, symbolic figures become a refined language for gifting, reflection, and ritual identity."]
                      })
                    )
                  }
                >
                  <span lang="zh-Hant">{character}</span>
                  <strong>{name}</strong>
                  <p>{meaning}</p>
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
              <h2>A catalogue of leaves with origin, process, taste, and mood.</h2>
              <div className="chapter-actions">
                <button
                  type="button"
                  className="museum-link-button dark-on-light"
                  onClick={() =>
                    setInfoModal(
                      makeInfo({
                        kicker: "Tea Catalogue / 茶品目錄",
                        title: "View Tea Catalogue",
                        body: teaProducts.map((tea) => `${tea.name} ${tea.chinese}: ${tea.origin}. ${tea.taste}`),
                        action: "Catalogue browsing remains cultural for now. Checkout is intentionally not enabled."
                      })
                    )
                  }
                >
                  View Tea Catalogue
                </button>
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
              <div className="product-catalogue">
                {teaProducts.map((tea) => (
                  <div key={tea.name}>
                    <span>{tea.type}</span>
                    <h3>{tea.name}</h3>
                    <strong lang="zh-Hant">{tea.chinese}</strong>
                    <p>{tea.origin}</p>
                    <small>{tea.taste}</small>
                    <button
                      type="button"
                      className="text-link-button"
                      onClick={() =>
                        setInfoModal(
                          makeInfo({
                            kicker: "Tea Story / 茶品故事",
                            title: tea.name,
                            chinese: tea.chinese,
                            body: [tea.process, tea.taste, tea.ritual],
                            items: [
                              { label: "Origin", value: tea.origin },
                              { label: "Best Moment", value: tea.moment }
                            ]
                          })
                        )
                      }
                    >
                      View Tea Story
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article id="meaningful-gifts" className="gift-panel">
            <div>
              <p className="museum-kicker">Chapter 11 / Meaningful Gifts / 禮之道</p>
              <h2>A gift should not only be received. It should be remembered.</h2>
              <p lang="zh-Hant">禮，不只是送出。是被記住。</p>
              <div className="gift-tags">
                {giftTypes.map((item) => (
                  <span key={item}>{item}</span>
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

          <article className="journal-panel">
            <div className="journal-head">
              <p className="museum-kicker">Chapter 12 / Journal / 茶禪誌</p>
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
            <a href="mailto:hello@chazen.example">
              <Mail size={15} aria-hidden="true" /> Inquiry
            </a>
            <a href="#tea-table">
              <Globe2 size={15} aria-hidden="true" /> Museum
            </a>
            <button type="button" onClick={() => openVideo("Gaiwan Ritual", "/video/gaiwan-ritual.mp4")}>
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
        <p className="museum-kicker">60-Second Practice / 靜心茶室</p>
        <h2 id="breathing-title">Breathe in. Return to the tea.</h2>
        <p>Breathe out. Return to yourself.</p>
        <p lang="zh-Hant">吸氣，回到茶。呼氣，回到自己。</p>
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
