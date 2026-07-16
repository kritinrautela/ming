"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { withBasePath } from "@/lib/media";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";

const teaWorlds = [
  {
    key: "faith",
    title: "信",
    english: "Faith / Trust",
    copy: {
      zh: "第一盞，是信。相信一杯茶，可以讓人從混亂中回到自身。",
      en: "The first cup is Faith. Trusting that a single cup of tea can bring you back to yourself amid the noise."
    },
    support: {
      zh: "信，不是盲目相信，而是願意先停下來，相信自己仍然可以回到清明。",
      en: "Faith isn't blind belief — it's the willingness to pause first, trusting you can still return to clarity."
    },
    cta: { zh: "由一杯茶開始", en: "Begin with trust" },
    href: "/five-cups/faith"
  },
  {
    key: "effort",
    title: "精進",
    english: "Effort / Practice",
    copy: {
      zh: "第二盞，是精進。不是急速前進，而是在日常中持續修習。",
      en: "The second cup is Effort. Not rushing forward, but sustaining a quiet practice day after day."
    },
    support: {
      zh: "真正的精進，不是逼自己更快，而是在每一天的微小儀式裡，慢慢修正自己的節奏。",
      en: "Real effort isn't forcing yourself to move faster — it's gently recalibrating your rhythm through small daily rituals."
    },
    cta: { zh: "進入茶儀式", en: "Enter the ritual" },
    href: "/five-cups/effort"
  },
  {
    key: "mindfulness",
    title: "念",
    english: "Mindfulness / Awareness",
    copy: {
      zh: "第三盞，是念。看見茶色，聞見茶香，也看見自己的念頭。",
      en: "The third cup is Mindfulness. Seeing the color of the tea, smelling its aroma, and seeing your own thoughts."
    },
    support: {
      zh: "念，是在喝茶時知道自己正在喝茶，也知道此刻的心正在往哪裡走。",
      en: "Mindfulness means knowing you're drinking tea while you drink it — and noticing where your mind is drifting."
    },
    cta: { zh: "觀察此刻心境", en: "Observe your tea state" },
    href: "/five-cups/mindfulness"
  },
  {
    key: "stillness",
    title: "定",
    english: "Concentration / Stillness",
    copy: {
      zh: "第四盞，是定。當水聲落下，心也慢慢安住。",
      en: "The fourth cup is Stillness. As the water falls, the mind slowly settles too."
    },
    support: {
      zh: "定，不是沒有念頭，而是不再被每一個念頭帶走。茶湯落下，心也慢慢有了停靠之處。",
      en: "Stillness isn't the absence of thought — it's no longer being swept away by every thought. As the tea pours, the mind finds a place to rest."
    },
    cta: { zh: "尋找安住", en: "Find stillness" },
    href: "/five-cups/stillness"
  },
  {
    key: "wisdom",
    title: "慧",
    english: "Wisdom / Clarity",
    copy: {
      zh: "第五盞，是慧。茶不是答案，而是一面鏡，讓人看清當下真正需要的是什麼。",
      en: "The fifth cup is Wisdom. Tea isn't the answer — it's a mirror, showing you what you truly need right now."
    },
    support: {
      zh: "慧，不是知道更多，而是看得更清楚。當你慢下來，茶會把你真正需要的東西映照出來。",
      en: "Wisdom isn't knowing more — it's seeing more clearly. When you slow down, the tea reflects back what you truly need."
    },
    cta: { zh: "照見所需", en: "See what you need" },
    href: "/five-cups/wisdom"
  }
];

const testSteps = [
  {
    zh: "選擇你現在的狀態",
    en: "Choose your current state",
    detail: {
      en: "Scattered, tired, restless, or simply curious — begin from where you actually are.",
      zh: "散亂、疲憊、不安，或只是好奇——從你此刻真實的狀態開始。"
    }
  },
  {
    zh: "回答簡單生活問題",
    en: "Answer simple lifestyle questions",
    detail: {
      en: "A few quiet questions about sleep, pace, and what your days ask of you.",
      zh: "幾條關於睡眠、節奏與日常負荷的安靜問題。"
    }
  },
  {
    zh: "Chazen 分析你的茶方向",
    en: "Chazen reads your tea direction",
    detail: {
      en: "Your answers are mapped to one of five tea states, not a sales funnel.",
      zh: "你的答案會對應五種茶心狀態之一，而不是導向購物車。"
    }
  },
  {
    zh: "得到茶推薦與飲用方法",
    en: "Receive a tea and how to brew it",
    detail: {
      en: "One tea, one method, one small ritual to carry into the week.",
      zh: "一款茶、一種泡法、一個可以帶進生活的小儀式。"
    }
  }
];

const exhibitionCards = [
  {
    number: "01",
    title: "The First Cup",
    chinese: "第一杯茶",
    copy: { en: "A beginner's guide to Chinese tea.", zh: "給初學者的中國茶入門指南。" }
  },
  {
    number: "02",
    title: "The Gaiwan Ritual",
    chinese: "蓋碗儀式",
    copy: { en: "Gaiwan, fairness pitcher, Jian Zhan, and ritual steps.", zh: "蓋碗、公道杯、建盞，以及完整的儀式步驟。" }
  },
  {
    number: "03",
    title: "Tea and the Mind",
    chinese: "茶與心境",
    copy: { en: "Sleep, stress, focus, emotion, and tea.", zh: "睡眠、壓力、專注、情緒與茶的關係。" }
  },
  {
    number: "04",
    title: "Dynasties of Tea",
    chinese: "茶的朝代故事",
    copy: { en: "Tang, Song, and Ming tea culture.", zh: "唐、宋、明三代的茶文化故事。" }
  },
  {
    number: "05",
    title: "The Lifetime Tea Box",
    chinese: "一世茶盒",
    copy: { en: "The story of a collectible cultural gift box.", zh: "值得珍藏的文化禮盒故事。" }
  }
];

const ritualSteps = [
  { zh: "溫器", en: "Warm the teaware", copy: { zh: "讓茶具先承接溫度。", en: "Let the teaware take on warmth first." } },
  { zh: "置茶", en: "Add the leaves", copy: { zh: "茶葉落入蓋碗，香氣開始打開。", en: "Leaves settle into the gaiwan; the aroma begins to open." } },
  { zh: "醒茶", en: "Wake the tea", copy: { zh: "第一道水，喚醒茶葉。", en: "The first pour wakes the leaves." } },
  { zh: "聞香", en: "Smell the aroma", copy: { zh: "先聞香，再入口。", en: "Smell the aroma first, then taste." } },
  { zh: "出湯", en: "Pour the tea", copy: { zh: "茶湯流入公道杯，再分入杯中。", en: "Tea flows into the fairness pitcher, then into each cup." } },
  { zh: "慢飲", en: "Sip slowly", copy: { zh: "一口茶，一次呼吸。", en: "One sip, one breath." } }
];

const journalEntries = [
  {
    zh: "茶歷史",
    en: "Tea history",
    noteZh: "從神農傳說到宋代點茶",
    noteEn: "From the Shennong legend to the Song whisk",
    href: "/tea-culture"
  },
  {
    zh: "如何沖茶",
    en: "How to brew",
    noteZh: "到沖泡室練習一泡",
    noteEn: "Practice a pour in the Brewing Room",
    href: "/brew-simulator"
  },
  {
    zh: "茶具介紹",
    en: "Teaware guide",
    noteZh: "蓋碗、公道杯與六個步驟",
    noteEn: "Gaiwan, cha hai, and the six steps",
    href: "/tea-ritual"
  },
  {
    zh: "茶與專注",
    en: "Tea & focus",
    noteZh: "先找出你現在的節奏",
    noteEn: "Find your current rhythm first",
    href: "/tea-test"
  },
  {
    zh: "茶與睡眠",
    en: "Tea & sleep",
    noteZh: "在靜心模式放慢晚間",
    noteEn: "Slow the evening in Stillness Mode",
    href: "/stillness-mode"
  },
  {
    zh: "茶與壓力",
    en: "Tea & stress",
    noteZh: "聲音、呼吸與一杯不急的茶",
    noteEn: "Sound, breath, and one unhurried cup",
    href: "/song-room"
  },
  {
    zh: "中國送禮文化",
    en: "Chinese gifting culture",
    noteZh: "把儀式放進一份禮物",
    noteEn: "Putting a ritual inside a gift",
    href: "/gift-box"
  },
  {
    zh: "Chazen 故事",
    en: "The Chazen story",
    noteZh: "以茶，回到當下",
    noteEn: "Tea as a way to return",
    href: "/about"
  }
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOut } }
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } }
};

function SectionMark({
  label,
  labelZh,
  tone = "dark"
}: {
  label: string;
  labelZh: string;
  tone?: "dark" | "light";
}) {
  const { t } = useLanguage();
  return (
    <p className={`cz-mark cz-mark-${tone}`}>
      <span className="cz-mark-dot" aria-hidden="true" />
      {t(label, labelZh)}
    </p>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();

  // The Metadata API (layout.tsx) sets the default English title for crawlers/initial paint.
  // This only overrides it client-side for the zh toggle state, and matches the same
  // English string when reverting, so it never drifts from the metadata default.
  useEffect(() => {
    document.title =
      language === "zh"
        ? "Chazen 茶禪｜現代中國茶文化"
        : `${site.name} | One Cup. One Breath. One Return.`;
  }, [language]);

  const reveal = reduceMotion
    ? {}
    : ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const);

  return (
    <main className="cz-home">
      {/* ————— Hero ————— */}
      <section className="cz-hero">
        <Image
          src={withBasePath("/images/chazen-hero-gongfu-room-v3.jpg")}
          alt={t(
            "A gongfu tea table in a quiet, warmly lit tea room.",
            "溫暖燈光下安靜茶室裡的功夫茶席。"
          )}
          fill
          priority
          sizes="100vw"
          className="cz-hero-image"
        />
        <div className="cz-hero-veil" aria-hidden="true" />
        <p className="cz-hero-seal" lang="zh-Hant" aria-hidden="true">
          茶禪
        </p>
        <motion.div
          className="cz-hero-content"
          variants={stagger}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
        >
          <motion.p className="cz-hero-eyebrow" variants={fadeUp}>
            {t("A modern Chinese tea house", "現代中國茶文化之家")}
          </motion.p>
          <motion.h1 variants={fadeUp}>
            {language === "zh" ? (
              <span lang="zh-Hant">一盞茶。一次呼吸。一場回歸。</span>
            ) : (
              <>
                One cup. One breath. <em>One return.</em>
              </>
            )}
          </motion.h1>
          <motion.p className="cz-hero-lead" variants={fadeUp}>
            {t(
              "Chazen turns Chinese tea culture into a quiet daily practice — ritual, sound, and teas chosen for the state of your mind, not the size of your cart.",
              "Chazen 將中國茶文化化為安靜的日常修習——儀式、聲音，以及依你的心境而選的茶，而非購物車的大小。"
            )}
          </motion.p>
          <motion.div className="cz-hero-actions" variants={fadeUp}>
            <Link href="/tea-test" className="button-primary">
              {t("Start the tea test", "開始茶測試")} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/five-cups" className="button-ghost">
              {t("Meet the five cups", "認識五盞")}
            </Link>
          </motion.div>
        </motion.div>
        <a className="cz-hero-scroll" href="#cz-manifesto" aria-label={t("Scroll to content", "捲動至內容")}>
          <ArrowDown size={16} aria-hidden="true" />
          <span>{t("Enter slowly", "慢慢進入")}</span>
        </a>
      </section>

      {/* ————— Manifesto ————— */}
      <section className="cz-manifesto" id="cz-manifesto">
        <motion.div className="cz-manifesto-grid" variants={stagger} {...reveal}>
          <motion.div variants={fadeUp}>
            <SectionMark label="Why Chazen" labelZh="為何是茶禪" />
          </motion.div>
          <motion.blockquote variants={fadeUp}>
            {language === "zh" ? (
              <p lang="zh-Hant">
                喝茶不是逃避世界，<br />
                而是<mark>回到自己</mark>的一種方式。
              </p>
            ) : (
              <p>
                Tea is not an escape from the world — it is a way of{" "}
                <mark>returning to yourself</mark> while the world keeps moving.
              </p>
            )}
            <footer>
              {t(
                "Rooted in Song dynasty tea practice. Made for modern attention.",
                "根植於宋代茶事，為現代的注意力而設。"
              )}
            </footer>
          </motion.blockquote>
        </motion.div>
      </section>

      {/* ————— Five Cups ————— */}
      <section className="cz-cups">
        <motion.div className="cz-cups-heading" variants={stagger} {...reveal}>
          <motion.div variants={fadeUp}>
            <SectionMark label="The Five Cups" labelZh="五盞" tone="light" />
          </motion.div>
          <motion.h2 variants={fadeUp}>
            {language === "zh" ? (
              <span lang="zh-Hant">五盞建盞，五條回到自身的路</span>
            ) : (
              <>Five cups, five ways back to the self</>
            )}
          </motion.h2>
          <motion.p variants={fadeUp}>
            {t(
              "Faith, Effort, Mindfulness, Stillness, Wisdom — each Jian Zhan cup is a doorway, not a product tier.",
              "信、精進、念、定、慧——每一盞建盞都是一道門，而不是商品階梯。"
            )}
          </motion.p>
        </motion.div>
        <motion.div className="cz-cups-row" variants={stagger} {...reveal}>
          {teaWorlds.map((world, index) => (
            <motion.article className="cz-cup" key={world.key} variants={fadeUp}>
              <Link href={world.href} className="cz-cup-link">
                <span className="cz-cup-index">0{index + 1}</span>
                <span className="cz-cup-char" lang="zh-Hant" aria-hidden="true">
                  {world.title}
                </span>
                <h3>{language === "zh" ? <span lang="zh-Hant">{world.title}</span> : world.english}</h3>
                {language === "zh" ? <strong>{world.english}</strong> : null}
                <p lang={language === "zh" ? "zh-Hant" : undefined}>
                  {language === "zh" ? world.copy.zh : world.copy.en}
                </p>
                <p className="cz-cup-support" lang={language === "zh" ? "zh-Hant" : undefined}>
                  {language === "zh" ? world.support.zh : world.support.en}
                </p>
                <span className="cz-cup-cta">
                  {language === "zh" ? world.cta.zh : world.cta.en} <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ————— Tea Test ————— */}
      <section className="cz-test">
        <div className="cz-test-grid">
          <motion.div className="cz-test-copy" variants={stagger} {...reveal}>
            <motion.div variants={fadeUp}>
              <SectionMark label="The Tea Test" labelZh="茶測試" />
            </motion.div>
            <motion.h2 variants={fadeUp}>
              {language === "zh" ? (
                <span lang="zh-Hant">從此刻的心境，找到你的茶</span>
              ) : (
                <>Begin with how you feel, not what to buy</>
              )}
            </motion.h2>
            <motion.p className="cz-lead" variants={fadeUp}>
              {t(
                "A three-minute guided assessment that reads your current state and points you to one tea direction — with the ritual to match.",
                "三分鐘的引導式測試，讀取你此刻的狀態，指向一個茶方向——並附上相應的儀式。"
              )}
            </motion.p>
            <motion.ol className="cz-test-steps" variants={stagger}>
              {testSteps.map((step, index) => (
                <motion.li key={step.en} variants={fadeUp}>
                  <span className="cz-step-number">0{index + 1}</span>
                  <div>
                    <h3 lang={language === "zh" ? "zh-Hant" : undefined}>{t(step.en, step.zh)}</h3>
                    <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(step.detail.en, step.detail.zh)}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
            <motion.div variants={fadeUp}>
              <Link href="/tea-test" className="button-primary">
                {t("Take the tea test", "進行茶測試")} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
          <div className="cz-test-media">
            <Image
              src={withBasePath("/images/chazen-tea-table-topdown-v3.jpg")}
              alt={t(
                "Top-down view of a tea table with gaiwan, cups, and utensils.",
                "俯瞰茶桌：蓋碗、茶杯與茶具。"
              )}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ————— Culture ————— */}
      <section className="cz-culture">
        <div className="cz-culture-grid">
          <div className="cz-culture-media">
            <Image
              src={withBasePath("/images/chazen-shanshui-chapter-2.jpg")}
              alt={t(
                "Ink-wash shanshui landscape painting in warm tones.",
                "暖色調的山水墨畫。"
              )}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
            />
            <p className="cz-culture-caption" lang="zh-Hant" aria-hidden="true">
              山水 · 茶境
            </p>
          </div>
          <motion.div className="cz-culture-copy" variants={stagger} {...reveal}>
            <motion.div variants={fadeUp}>
              <SectionMark label="A Living Exhibition" labelZh="茶文化展" />
            </motion.div>
            <motion.h2 variants={fadeUp}>
              {language === "zh" ? (
                <span lang="zh-Hant">一座可以慢慢逛的茶文化展</span>
              ) : (
                <>A living exhibition of Chinese tea culture</>
              )}
            </motion.h2>
            <motion.ul className="cz-culture-index" variants={stagger}>
              {exhibitionCards.map((card) => (
                <motion.li key={card.number} variants={fadeUp}>
                  <Link href="/tea-culture" className="cz-culture-item">
                    <span className="cz-culture-number">{card.number}</span>
                    <span className="cz-culture-titles">
                      <span className="cz-culture-title">
                        {language === "zh" ? <span lang="zh-Hant">{card.chinese}</span> : card.title}
                      </span>
                      <span className="cz-culture-sub" lang={language === "zh" ? undefined : "zh-Hant"}>
                        {language === "zh" ? card.title : card.chinese}
                      </span>
                    </span>
                    <span className="cz-culture-copy-line" lang={language === "zh" ? "zh-Hant" : undefined}>
                      {language === "zh" ? card.copy.zh : card.copy.en}
                    </span>
                    <ArrowRight size={15} aria-hidden="true" className="cz-culture-arrow" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <Link href="/tea-culture" className="button-secondary">
                {t("Enter the exhibition", "進入茶文化展")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ————— Ritual ————— */}
      <section className="cz-ritual">
        <div className="cz-ritual-grid">
          <div className="cz-ritual-media">
            <Image
              src={withBasePath("/images/chazen-song-diancha-v1.jpg")}
              alt={t(
                "Song dynasty style whisked tea preparation in a dark bowl.",
                "宋代點茶：黑釉盞中的擊拂茶湯。"
              )}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
          <motion.div className="cz-ritual-copy" variants={stagger} {...reveal}>
            <motion.div variants={fadeUp}>
              <SectionMark label="The Ritual" labelZh="茶儀式" />
            </motion.div>
            <motion.h2 variants={fadeUp}>
              {language === "zh" ? (
                <span lang="zh-Hant">茶之前的儀式</span>
              ) : (
                <>The ritual before the tea</>
              )}
            </motion.h2>
            <motion.p className="cz-lead" variants={fadeUp}>
              {t(
                "Six small movements. None of them are about finishing quickly.",
                "六個小小的動作，沒有一個是為了快點結束。"
              )}
            </motion.p>
            <motion.ol className="cz-ritual-steps" variants={stagger}>
              {ritualSteps.map((step, index) => (
                <motion.li key={step.en} variants={fadeUp}>
                  <span className="cz-step-number">0{index + 1}</span>
                  <h3>
                    {language === "zh" ? (
                      <span lang="zh-Hant">{step.zh}</span>
                    ) : (
                      step.en
                    )}
                  </h3>
                  <p lang={language === "zh" ? "zh-Hant" : undefined}>
                    {language === "zh" ? step.copy.zh : step.copy.en}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
            <motion.div className="cz-ritual-actions" variants={fadeUp}>
              <Link href="/tea-ritual" className="button-secondary">
                {t("Learn the full ritual", "學習完整儀式")}
              </Link>
              <Link href="/brew-simulator" className="cz-text-link">
                {t("Practice a pour in the Brewing Room", "先到沖泡室練習一泡")} <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link href="/stillness-mode" className="cz-text-link">
                {t("Or simply sit in stillness", "或者，只是靜靜地坐一會")} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ————— Gifting ————— */}
      <section className="cz-gift">
        <div className="cz-gift-grid">
          <motion.div className="cz-gift-copy" variants={stagger} {...reveal}>
            <motion.div variants={fadeUp}>
              <SectionMark label="Meaningful Gifting" labelZh="有意義的贈禮" tone="light" />
            </motion.div>
            <motion.h2 variants={fadeUp}>
              {language === "zh" ? (
                <span lang="zh-Hant">送的不止是茶，是一段安靜的時間</span>
              ) : (
                <>A gift of tea is a gift of quiet time</>
              )}
            </motion.h2>
            <motion.p variants={fadeUp}>
              {t(
                "Cultural gift boxes for settlements, clients, and the people you want to slow down with — tea, teaware, ritual cards, and a sound ritual in one box.",
                "適合交收、客戶與想一起慢下來的人——茶葉、茶具、儀式卡與聲音儀式，盡在一盒。"
              )}
            </motion.p>
            <motion.div className="cz-gift-actions" variants={fadeUp}>
              <Link href="/gift-box" className="button-light">
                {t("Explore the gift box", "探索禮盒")}
              </Link>
              <Link href="/b2b" className="cz-text-link cz-text-link-light">
                {t("Business gifting", "企業茶禮")} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
          <div className="cz-gift-media">
            <Image
              src={withBasePath("/images/chazen-gift-box-v1.jpg")}
              alt={t(
                "Chazen cultural gift box with tea, teaware, and ritual cards.",
                "Chazen 文化禮盒：茶葉、茶具與儀式卡。"
              )}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ————— Journal ————— */}
      <section className="cz-journal">
        <motion.div className="cz-journal-inner" variants={stagger} {...reveal}>
          <motion.div variants={fadeUp}>
            <SectionMark label="The Tea Journal" labelZh="茶誌" />
          </motion.div>
          <motion.h2 variants={fadeUp}>
            {language === "zh" ? (
              <span lang="zh-Hant">慢慢讀，慢慢懂茶</span>
            ) : (
              <>Read slowly, learn tea slowly</>
            )}
          </motion.h2>
          <motion.div className="cz-journal-index" variants={stagger}>
            {journalEntries.map((entry) => (
              <motion.span key={entry.en} variants={fadeUp}>
                <Link href={entry.href} className="cz-journal-row">
                  <span className="cz-journal-row-title" lang={language === "zh" ? "zh-Hant" : undefined}>
                    {t(entry.en, entry.zh)}
                  </span>
                  <span className="cz-journal-row-note" lang={language === "zh" ? "zh-Hant" : undefined}>
                    {t(entry.noteEn, entry.noteZh)}
                  </span>
                  <ArrowRight size={15} aria-hidden="true" className="cz-journal-row-arrow" />
                </Link>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
