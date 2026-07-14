"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SectionIndexNav, type SectionIndexItem } from "@/components/SectionIndexNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MoonGateMark, RippleDivider } from "@/components/ChazenMotif";
import { videoAssets, withBasePath } from "@/lib/media";
import { useLanguage } from "@/lib/language";
import { site } from "@/lib/site";

const revealCards = [
  {
    title: { en: "Enter the Tea Courtyard", zh: "步入茶院" },
    copy: {
      en: "Chazen begins as a quiet walk into a Song dynasty inspired tea courtyard — white walls, bamboo shadows, warm wood, tea steam, and a single tea table waiting for stillness.",
      zh: "Chazen 由一場安靜的步行開始，走進宋代風格的茶院——白牆、竹影、溫潤的木、茶煙，以及一張等待靜心的茶桌。"
    }
  },
  {
    title: { en: "Choose Your Tea State", zh: "選擇你的茶心狀態" },
    copy: {
      en: "Five Jian Zhan cups guide the visitor through Faith, Effort, Mindfulness, Concentration, and Wisdom. Each cup becomes a quiet way of returning to oneself.",
      zh: "五盞建盞引導訪客經歷信、精進、念、定、慧。每一盞茶，都是回到自身的安靜方式。"
    }
  },
  {
    title: { en: "Discover Through Ritual", zh: "透過儀式發現自己" },
    copy: {
      en: "Through the AI Tea State Test, tea ritual, and cultural exhibition, Chazen helps each visitor find a tea direction that fits their current rhythm, not just a product to buy.",
      zh: "透過 AI 茶心測試、茶儀式與文化展覽，Chazen 幫助每位訪客找到符合此刻節奏的茶方向，而不只是一件商品。"
    }
  }
];

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
    cta: { zh: "由一杯茶開始", en: "Begin With Trust" },
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
    cta: { zh: "進入茶儀式", en: "Enter the Ritual" },
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
    cta: { zh: "觀察此刻心境", en: "Observe Your Tea State" },
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
    cta: { zh: "尋找安住", en: "Find Stillness" },
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
    cta: { zh: "照見所需", en: "See What You Need" },
    href: "/five-cups/wisdom"
  }
];

const testSteps = [
  { zh: "選擇你現在的狀態", en: "Choose your current state" },
  { zh: "回答簡單生活問題", en: "Answer simple lifestyle questions" },
  { zh: "Chazen 分析你的茶方向", en: "Chazen analyzes your tea direction" },
  { zh: "得到茶推薦與飲用方法", en: "Get a tea recommendation and how to brew it" }
];

const exhibitionCards = [
  { title: "The First Cup", chinese: "第一杯茶", copy: { en: "New beginner guide to Chinese tea.", zh: "給初學者的中國茶入門指南。" } },
  { title: "The Gaiwan Ritual", chinese: "蓋碗儀式", copy: { en: "Gaiwan, fairness pitcher, Jian Zhan, and ritual steps.", zh: "蓋碗、公道杯、建盞，以及完整的儀式步驟。" } },
  { title: "Tea and the Mind", chinese: "茶與心境", copy: { en: "Sleep, stress, focus, emotion, and tea.", zh: "睡眠、壓力、專注、情緒與茶的關係。" } },
  { title: "Dynasties of Tea", chinese: "茶的朝代故事", copy: { en: "Tang, Song, Ming tea culture.", zh: "唐、宋、明三代的茶文化故事。" } },
  { title: "The Lifetime Tea Box", chinese: "一世茶盒", copy: { en: "Collectible cultural gift box story.", zh: "值得珍藏的文化禮盒故事。" } }
];

const ritualSteps = [
  { zh: "溫器", en: "Warm the Teaware", copy: { zh: "讓茶具先承接溫度。", en: "Let the teaware take on warmth first." } },
  { zh: "置茶", en: "Add the Leaves", copy: { zh: "茶葉落入蓋碗，香氣開始打開。", en: "Tea leaves settle into the gaiwan, and the aroma begins to open." } },
  { zh: "醒茶", en: "Wake the Tea", copy: { zh: "第一道水，喚醒茶葉。", en: "The first pour wakes the leaves." } },
  { zh: "聞香", en: "Smell the Aroma", copy: { zh: "先聞香，再入口。", en: "Smell the aroma first, then taste." } },
  { zh: "出湯", en: "Pour the Tea", copy: { zh: "茶湯流入公道杯，再分入杯中。", en: "The tea flows into the fairness pitcher, then into each cup." } },
  { zh: "慢飲", en: "Sip Slowly", copy: { zh: "一口茶，一次呼吸。", en: "One sip, one breath." } }
];

const timelineItems = [
  {
    title: { zh: "神農傳說", en: "The Legend of Shennong" },
    copy: {
      zh: "傳說中，茶的起源與神農嘗百草有關。茶從一片葉開始，逐漸成為中國文化中重要的一部分。",
      en: "Legend traces tea's origin to Shennong tasting a hundred herbs. From a single leaf, tea grew into an essential part of Chinese culture."
    }
  },
  {
    title: { zh: "唐代 — 陸羽《茶經》", en: "Tang Dynasty — Lu Yu's Classic of Tea" },
    copy: {
      zh: "唐代茶文化逐漸成形，陸羽寫下《茶經》，令茶不再只是飲品，而成為一套有系統的文化。",
      en: "Tea culture took shape in the Tang dynasty as Lu Yu wrote the Classic of Tea, turning tea from a simple drink into a systematic culture."
    }
  },
  {
    title: { zh: "宋代 — 點茶與文人美學", en: "Song Dynasty — Whisked Tea and Literati Aesthetics" },
    copy: {
      zh: "宋代盛行點茶，茶與美學、文人生活、器物文化連在一起。",
      en: "Whisked tea flourished in the Song dynasty, intertwining tea with aesthetics, literati life, and the culture of fine objects."
    }
  },
  {
    title: { zh: "明代 — 散茶", en: "Ming Dynasty — Loose-Leaf Tea" },
    copy: {
      zh: "明代之後，散茶逐漸流行，飲茶方式變得更接近日常。",
      en: "After the Ming dynasty, loose-leaf tea grew popular, and tea drinking became part of everyday life."
    }
  },
  {
    title: { zh: "Modern Chazen", en: "Modern Chazen" },
    copy: {
      zh: "Chazen 將中國茶文化帶入現代生活，以 AI 茶測試、茶儀式與文化內容，幫助人重新認識茶。",
      en: "Chazen brings Chinese tea culture into modern life — using the AI Tea Test, tea ritual, and cultural content to help people rediscover tea."
    }
  }
];

const exploreLinks = [
  {
    id: "tea-atlas",
    number: "01",
    title: { en: "Find Your Tea Direction", zh: "找到你的茶方向" },
    copy: { en: "Five teas, mapped to how you feel.", zh: "五款茶，對應五種心境。" },
    cta: { en: "Explore the Atlas", zh: "探索茶地圖" },
    href: "/tea-atlas"
  },
  {
    id: "tea-boxes",
    number: "02",
    title: { en: "Begin or Continue", zh: "開始，或延續" },
    copy: { en: "From a first pack to a lifetime collection.", zh: "從初次體驗到一世珍藏。" },
    cta: { en: "See Tea Boxes", zh: "查看茶盒" },
    href: "/tea-boxes"
  },
  {
    id: "b2b",
    number: "03",
    title: { en: "The First Evening", zh: "第一個夜晚" },
    copy: { en: "A memorable gift for settlements, clients, and teams.", zh: "適合交收、客戶與團隊的難忘禮物。" },
    cta: { en: "Enquire for Business", zh: "查詢企業合作" },
    href: "/b2b"
  }
];

const membershipTiers = [
  {
    title: { en: "Free Member", zh: "免費會員" },
    price: { en: "Free", zh: "免費" },
    benefits: [
      { en: "Included after first purchase", zh: "首次購買後自動加入" },
      { en: "Birthday tea note and offer", zh: "生日茶語與優惠" },
      { en: "Early product and journal updates", zh: "搶先獲得新品與文章更新" }
    ]
  },
  {
    title: { en: "Community Member", zh: "社群會員" },
    price: { en: "A$28 / month", zh: "A$28 / 月" },
    benefits: [
      { en: "Monthly member offer", zh: "每月會員優惠" },
      { en: "WhatsApp community access", zh: "WhatsApp 社群通道" },
      { en: "Seasonal tea prompts and simple rituals", zh: "季節茶語與簡易儀式提示" }
    ]
  },
  {
    title: { en: "Premium Ritual Member", zh: "尊享儀式會員" },
    price: { en: "A$38 / month", zh: "A$38 / 月" },
    benefits: [
      { en: "Premium member perks", zh: "尊享會員專屬禮遇" },
      { en: "Limited teacup gift moments", zh: "限量茶杯贈禮時刻" },
      { en: "Deeper ritual and culture content", zh: "更深入的儀式與文化內容" }
    ]
  }
];

const journalCategories = [
  { zh: "茶歷史", en: "Tea History" },
  { zh: "茶與睡眠", en: "Tea & Sleep" },
  { zh: "茶與專注", en: "Tea & Focus" },
  { zh: "茶與壓力", en: "Tea & Stress" },
  { zh: "如何沖茶", en: "How to Brew" },
  { zh: "茶具介紹", en: "Teaware Guide" },
  { zh: "中國送禮文化", en: "Chinese Gifting Culture" },
  { zh: "Chazen 故事", en: "The Chazen Story" }
];

const sectionIndexItems: SectionIndexItem[] = [
  { id: "entrance", label: "Entrance", zh: "入室" },
  { id: "five-cups", label: "Five Cups", zh: "五盞" },
  { id: "tea-test", label: "Tea Test", zh: "茶測試" },
  { id: "ritual", label: "Ritual", zh: "茶儀式" },
  { id: "culture", label: "Culture", zh: "茶文化" },
  { id: "philosophy", label: "Philosophy", zh: "理念" },
  { id: "tea-atlas", label: "Tea Atlas", zh: "茶地圖" },
  { id: "tea-boxes", label: "Tea Boxes", zh: "茶盒" },
  { id: "membership", label: "Membership", zh: "會員" },
  { id: "b2b", label: "B2B Gifts", zh: "企業茶禮" },
  { id: "journal", label: "Journal", zh: "文章" }
];

function SectionHeading({
  eyebrow,
  title,
  english,
  copy
}: {
  eyebrow?: { en: string; zh: string };
  title: string;
  english: string;
  copy?: { en: string; zh: string };
}) {
  const { language } = useLanguage();
  return (
    <div className="chazen-motion-heading">
      {eyebrow ? <p>{language === "zh" ? eyebrow.zh : eyebrow.en}</p> : null}
      {language === "zh" ? <h2 lang="zh-Hant">{title}</h2> : <h2>{english}</h2>}
      {language === "zh" ? <strong>{english}</strong> : null}
      {copy ? <span lang={language === "zh" ? "zh-Hant" : undefined}>{language === "zh" ? copy.zh : copy.en}</span> : null}
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fixedCardsRef = useRef<HTMLDivElement>(null);
  const fixedCardsGridRef = useRef<HTMLDivElement>(null);
  const cardsTriggerRef = useRef<HTMLDivElement>(null);
  const presentingRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  // The Metadata API (layout.tsx) sets the default English title for crawlers/initial paint.
  // This only overrides it client-side for the zh toggle state, and matches the same
  // English string when reverting, so it never drifts from the metadata default.
  useEffect(() => {
    document.title =
      language === "zh"
        ? "Chazen 茶禪｜現代中國茶文化"
        : `${site.name} | One Cup. One Breath. One Return.`;
  }, [language]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    const panel = panelRef.current;
    const fixedCards = fixedCardsRef.current;
    const cardsGrid = fixedCardsGridRef.current;
    const trigger = cardsTriggerRef.current;
    const presenting = presentingRef.current;
    const canvas = particlesRef.current;
    const ctx = canvas?.getContext("2d");

    if (!root || !hero || !panel || !fixedCards || !cardsGrid || !trigger || !presenting || !canvas || !ctx) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let particleRaf = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; opacity: number }> = [];

    const resizeParticles = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const count = Math.max(32, Math.floor((window.innerWidth * window.innerHeight) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18 * dpr,
        vy: (-0.05 - Math.random() * 0.16) * dpr,
        r: (Math.random() * 1.9 + 0.5) * dpr,
        opacity: Math.random() * 0.32 + 0.12
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 161, 91, ${particle.opacity})`;
        ctx.fill();
      }
      particleRaf = requestAnimationFrame(drawParticles);
    };

    // The frame calculation is shared: the default path re-runs it every
    // animation frame for smooth scroll-tied motion; the reduced-motion path
    // (below) instead re-runs it only in direct response to scroll/resize
    // events, with no self-perpetuating loop — content still reveals on
    // scroll, it just doesn't animate independently of user input.
    const updateFrame = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const heroFade = Math.max(0, 1 - scrollY / (vh * 0.45));
      const panelY = Math.max(0, vh - scrollY);

      hero.style.opacity = `${heroFade}`;
      panel.style.transform = `translate3d(0, ${panelY}px, 0)`;

      const rect = trigger.getBoundingClientRect();
      const triggerTop = rect.top + scrollY;
      const start = triggerTop - vh * 0.55;
      const end = triggerTop + rect.height - vh * 0.28;
      const range = Math.max(1, end - start);
      const progress = Math.max(0, Math.min(1, (scrollY - start) / range));
      const active = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.28;
      const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
      const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.28 - scrollY) / (vh * 0.28)));
      const opacity = active ? Math.min(fadeIn, fadeOut) : 0;
      const reveal = progress * 126;
      const mask =
        window.innerWidth < 768
          ? `linear-gradient(to bottom, black ${reveal}%, transparent ${reveal + 24}%)`
          : `linear-gradient(to right, black ${reveal}%, transparent ${reveal + 18}%)`;

      fixedCards.style.opacity = `${opacity}`;
      fixedCards.style.pointerEvents = opacity > 0.12 ? "auto" : "none";
      cardsGrid.style.maskImage = mask;
      cardsGrid.style.webkitMaskImage = mask;

      if (presenting.getBoundingClientRect().top < vh * 0.72) {
        presenting.classList.add("is-visible");
      }
    };

    const tick = () => {
      updateFrame();
      raf = requestAnimationFrame(tick);
    };

    if (prefersReducedMotion) {
      // Skip the ambient particle drift and the persistent per-frame scroll
      // loop entirely. The reveal itself still works — it's just driven
      // directly by scroll/resize events instead of an autonomous loop.
      updateFrame();
      window.addEventListener("scroll", updateFrame, { passive: true });
      window.addEventListener("resize", updateFrame);
    } else {
      resizeParticles();
      drawParticles();
      raf = requestAnimationFrame(tick);
      window.addEventListener("resize", resizeParticles);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(particleRaf);
      window.removeEventListener("resize", resizeParticles);
      window.removeEventListener("scroll", updateFrame);
      window.removeEventListener("resize", updateFrame);
    };
  }, []);

  return (
    <main className="chazen-motion-home">
      <SectionIndexNav items={sectionIndexItems} />

      <div ref={rootRef} className="chazen-scroll-format" id="entrance">
        <div className="chazen-motion-bg chazen-home-video-layer" aria-hidden="true">
          <video
            className="chazen-home-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src={withBasePath(videoAssets.chazenHomeHero)}
          />
          <div className="chazen-motion-bg-fallback" />
          <div className="chazen-motion-overlay chazen-home-video-overlay" />
        </div>
        <canvas ref={particlesRef} className="chazen-particles" aria-hidden="true" />

        <nav className="chazen-motion-nav" aria-label="Homepage navigation">
          <a href={withBasePath("/")} className="chazen-motion-logo">
            <span>Chazen</span>
            <small>茶禪</small>
          </a>
          <div>
            <a href={withBasePath("/tea-test")}>{t("Tea Test", "茶測試")}</a>
            <a href={withBasePath("/tea-ritual")}>{t("Ritual", "茶儀式")}</a>
            <a href={withBasePath("/tea-collection")}>{t("Tea", "茶品")}</a>
            <a href={withBasePath("/tea-culture")}>{t("Culture", "茶文化")}</a>
            <a href={withBasePath("/five-cups")}>{t("Five Cups", "五盞")}</a>
            <a href={withBasePath("/b2b")}>{t("Gifting", "文化贈禮")}</a>
          </div>
          <span className="chazen-nav-actions">
            <LanguageToggle />
            <a href={withBasePath("/tea-test")} className="chazen-nav-cta">
              {t("Start Tea Test", "開始茶測試")}
            </a>
          </span>
        </nav>

        <section ref={heroRef} className="chazen-motion-hero chazen-home-hero" aria-labelledby="home-title">
          <div className="chazen-motion-hero-inner chazen-home-hero-content">
            <MoonGateMark className="chazen-hero-motif" />
            <p className="chazen-motion-kicker">{t("Modern Chinese Tea Culture", "現代中國茶文化")}</p>
            <h1 id="home-title" lang="zh-Hant">
              茶禪 <span>Chazen</span>
            </h1>
            <strong>{t("A cultural tea experience for modern life.", "為現代生活而設的茶文化體驗。")}</strong>
            <div className="chazen-hero-copy">
              <p lang={language === "zh" ? "zh-Hant" : undefined}>
                {t(
                  "Through a single cup of tea, return to stillness, awareness, and calm — and find the tea that fits this moment.",
                  "透過一杯茶，重新安住、覺察、放鬆，並找到此刻最適合你的茶。"
                )}
              </p>
            </div>
            <div className="chazen-motion-actions chazen-home-hero-actions">
              <a href={withBasePath("/tea-test")} className="chazen-primary-btn">
                {t("Start Tea Test", "開始茶測試")} <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href={withBasePath("/tea-ritual")} className="chazen-secondary-btn">
                {t("Explore Tea Ritual", "探索茶儀式")}
              </a>
            </div>
            <a href={withBasePath("/five-cups")} className="chazen-five-cups-link" lang="zh-Hant">
              {t("Five Jian Zhan Cups · Faith, Effort, Mindfulness, Stillness, Wisdom", "五盞建盞 · 信、精進、念、定、慧")}
            </a>
          </div>
          <a className="chazen-scroll-arrow" href="#five-cups" aria-label="Scroll to tea worlds">
            <ArrowDown size={24} aria-hidden="true" />
          </a>
        </section>

        <div ref={panelRef} className="chazen-courtyard-panel" aria-hidden="true">
          <span className="lattice-shadow" />
          <span className="steam-line steam-line-one" />
          <span className="steam-line steam-line-two" />
        </div>

        <div ref={fixedCardsRef} className="chazen-fixed-cards">
          <div ref={fixedCardsGridRef} className="chazen-fixed-card-grid">
            {revealCards.map((card) => (
              <article key={card.title.en}>
                <h3>{t(card.title.en, card.title.zh)}</h3>
                <p>{t(card.copy.en, card.copy.zh)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="chazen-scroll-spacer" />
        <div ref={cardsTriggerRef} className="chazen-cards-trigger" />
        <section className="chazen-presenting">
          <div ref={presentingRef} className="chazen-presenting-inner">
            <p>{t("Presenting", "呈獻")}</p>
            <h2>{t("The Five Jian Zhan Faculties", "五盞建盞")}</h2>
            <span lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Faith, Effort, Mindfulness, Stillness, Wisdom: five cups, five ways back to yourself.",
                "信、精進、念、定、慧：五盞茶，五種回到自身的方法。"
              )}
            </span>
            <div>
              {["信 Trust", "精進 Practice", "念 Awareness", "定 Stillness", "慧 Clarity"].map((item) => (
                <em key={item}>{item}</em>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section id="five-cups" className="chazen-motion-section chazen-worlds-section">
        <div className="chazen-motion-container">
          <SectionHeading
            eyebrow={{ en: "Five Jian Zhan Faculties", zh: "五盞建盞" }}
            title="五盞建盞，五種回到自身的方法"
            english="Five Jian Zhan Cups, Five Ways Back to the Self"
            copy={{
              zh: "Chazen 以五盞建盞對應佛教五根：信、精進、念、定、慧。每一盞茶，不只是味道，也是一種看見自己的方式。",
              en: "Inspired by the Five Spiritual Faculties — Faith, Effort, Mindfulness, Concentration, and Wisdom — each cup becomes a quiet doorway into self-understanding."
            }}
          />
          <div className="chazen-world-grid">
            {teaWorlds.map((world) => (
              <article key={world.key} className={`chazen-world-card world-${world.key}`}>
                <div className="jian-cup-orbit" aria-hidden="true"><span /></div>
                <h3 lang="zh-Hant">{world.title}</h3>
                <strong>{world.english}</strong>
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(world.copy.en, world.copy.zh)}</p>
                <p className="chazen-world-support" lang={language === "zh" ? "zh-Hant" : undefined}>
                  {t(world.support.en, world.support.zh)}
                </p>
                <a href={withBasePath(world.href)}>
                  <span lang={language === "zh" ? "zh-Hant" : undefined}>{t(world.cta.en, world.cta.zh)}</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tea-test" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-test-layout">
          <SectionHeading
            title="由你此刻的感覺開始"
            english="Begin With How You Feel"
            copy={{
              zh: "選擇你現在的狀態，回答幾個簡單問題，Chazen 會為你分析適合的茶方向與飲用方式。",
              en: "Choose your current state, answer a few simple questions, and Chazen will analyze the tea direction and brewing style that fits you."
            }}
          />
          <div className="chazen-step-grid">
            {testSteps.map((step, index) => (
              <article key={step.en}>
                <span>{index + 1}</span>
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(step.en, step.zh)}</p>
              </article>
            ))}
          </div>
          <aside className="chazen-result-card">
            <p>{t("Example result · Current State: Overthinking / Restless", "範例結果 · 目前狀態：思慮過多／不安")}</p>
            <h3>{t("Tea Direction: Warm roasted oolong", "茶方向：溫和焙火烏龍")}</h3>
            <span lang={language === "zh" ? "zh-Hant" : undefined}>
              {t(
                "Why: suited to evenings when you need to slow down without feeling too heavy.",
                "原因：適合需要慢下來，但又不想太沉重的晚上。"
              )}
            </span>
            <a href={withBasePath("/tea-test")} className="chazen-primary-btn">
              {t("Start Tea Test", "開始茶測試")}
            </a>
          </aside>
        </div>
      </section>

      <section id="culture" className="chazen-motion-section chazen-exhibition-section">
        <div className="chazen-motion-container">
          <SectionHeading title="一場關於中國茶文化的互動展覽" english="A Living Exhibition of Chinese Tea Culture" />
          <div className="chazen-exhibit-grid">
            {exhibitionCards.map((card, index) => (
              <article key={card.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {language === "zh" ? (
                  <h3 lang="zh-Hant">{card.chinese}</h3>
                ) : (
                  <h3>{card.title}</h3>
                )}
                <p>{t(card.copy.en, card.copy.zh)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-ritual-layout">
          <SectionHeading title="茶入口之前，先有一場儀式" english="The Ritual Before the Tea" />
          <div className="chazen-ritual-steps">
            {ritualSteps.map((step, index) => (
              <article key={step.zh}>
                <span>{index + 1}</span>
                {language === "zh" ? <h3 lang="zh-Hant">{step.zh}</h3> : <h3>{step.en}</h3>}
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(step.copy.en, step.copy.zh)}</p>
              </article>
            ))}
          </div>
          <div className="chazen-motion-actions">
            <a href={withBasePath("/tea-ritual")} className="chazen-primary-btn">
              {t("Watch Full Ritual", "觀看完整儀式")}
            </a>
            <a href={withBasePath("/tea-culture")} className="chazen-secondary-btn">
              {t("Beginner Guide", "初學者指南")}
            </a>
          </div>
        </div>
      </section>

      <section id="philosophy" className="chazen-motion-section">
        <div className="chazen-motion-container">
          <SectionHeading title="茶，不只是飲品" english="Tea Is Not Only a Drink" />
          <div className="chazen-philosophy-grid">
            {[
              {
                title: { en: "Tea for Mind", zh: "茶與心" },
                copy: {
                  zh: "不同的茶，有不同的節奏。有些適合專注，有些適合放鬆，有些適合在晚上慢慢飲。",
                  en: "Different teas carry different rhythms. Some suit focus, some suit relaxing, some are best sipped slowly at night."
                }
              },
              {
                title: { en: "Tea as Culture", zh: "茶與文化" },
                copy: {
                  zh: "中國茶文化承載歷史、禮儀、哲學與人與人之間的連結。",
                  en: "Chinese tea culture carries history, etiquette, philosophy, and the connections between people."
                }
              },
              {
                title: { en: "Tea as Daily Practice", zh: "茶與日常修習" },
                copy: {
                  zh: "飲茶不一定複雜。可以用蓋碗，也可以用杯；可以正式，也可以自然地融入生活。",
                  en: "Drinking tea doesn't need to be complicated. Use a gaiwan or a simple cup; make it formal, or fold it naturally into daily life."
                }
              }
            ].map((item) => (
              <article key={item.title.en}>
                <h3>{t(item.title.en, item.title.zh)}</h3>
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chazen-motion-section" aria-label="Tea culture timeline">
        <div className="chazen-motion-container">
          <SectionHeading title="茶，如何穿過中國歷史" english="Tea Through Chinese History" />
          <div className="chazen-timeline-scroll">
            {timelineItems.map((item) => (
              <article key={item.title.en}>
                {language === "zh" ? (
                  <h3 lang="zh-Hant">{item.title.zh}</h3>
                ) : (
                  <h3>{item.title.en}</h3>
                )}
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.copy.en, item.copy.zh)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RippleDivider />

      <section id="explore" className="chazen-motion-section chazen-explore-section">
        <div className="chazen-motion-container">
          <SectionHeading
            title="由此延伸"
            english="Continue the Ritual"
            copy={{
              en: "A few ways to go further — chosen for what fits you, not everything at once.",
              zh: "幾種延伸的方式——選擇適合你的，而不是一次擁有全部。"
            }}
          />
          <div className="chazen-explore-grid">
            {exploreLinks.map((link) => (
              <article key={link.id} id={link.id} className="chazen-explore-card">
                <span className="chazen-explore-number">{link.number}</span>
                <h3>{t(link.title.en, link.title.zh)}</h3>
                <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(link.copy.en, link.copy.zh)}</p>
                <a href={withBasePath(link.href)}>
                  {t(link.cta.en, link.cta.zh)} <ArrowRight size={14} aria-hidden="true" />
                </a>
              </article>
            ))}
            <article id="journal" className="chazen-explore-card chazen-explore-card-journal">
              <span className="chazen-explore-number">04</span>
              <h3>{t("Learn More About Tea", "繼續認識茶")}</h3>
              <div className="chazen-journal-grid">
                {journalCategories.map((category) => (
                  <span key={category.en} lang={language === "zh" ? "zh-Hant" : undefined}>
                    {t(category.en, category.zh)}
                  </span>
                ))}
              </div>
              <a href={withBasePath("/tea-culture")}>
                {t("Read Tea Culture", "閱讀茶文化")} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>
      </section>

      <RippleDivider />

      <section id="membership" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-membership">
          <SectionHeading title="每個月，延續你的茶文化旅程" english="Continue Your Tea Journey Month by Month" />
          {membershipTiers.map((tier) => (
            <article key={tier.title.en}>
              <span className="chazen-product-price">{t(tier.price.en, tier.price.zh)}</span>
              <h3>{t(tier.title.en, tier.title.zh)}</h3>
              <ul className="chazen-product-list">
                {tier.benefits.map((benefit) => (
                  <li key={benefit.en}>{t(benefit.en, benefit.zh)}</li>
                ))}
              </ul>
            </article>
          ))}
          <a href={withBasePath("/tea-test")} className="chazen-primary-btn">
            {t("Start Tea Test", "開始茶測試")}
          </a>
        </div>
      </section>

      <footer className="chazen-motion-footer">
        <div className="chazen-motion-container">
          <h2>Chazen <span>茶禪</span></h2>
          <p>
            {t(
              "Chazen is a modern Chinese tea culture experience designed for calm, connection, and self-understanding.",
              "Chazen 是一個現代中國茶文化體驗品牌，為平靜、連結與自我理解而設。"
            )}
          </p>
          <div>
            <a href={withBasePath("/tea-test")}>{t("Tea Test", "茶測試")}</a>
            <a href={withBasePath("/tea-ritual")}>{t("Tea Ritual", "茶儀式")}</a>
            <a href={withBasePath("/tea-culture")}>{t("Tea Culture", "茶文化")}</a>
            <a href={withBasePath("/tea-collection")}>{t("Tea Collection", "茶葉收藏")}</a>
            <a href={withBasePath("/tea-boxes")}>{t("Tea Boxes", "茶盒")}</a>
            <a href={withBasePath("/five-cups")}>{t("Five Cups", "五盞")}</a>
            <a href={withBasePath("/song-room")}>{t("Song Room", "宋室")}</a>
            <a href={withBasePath("/stillness-mode")}>{t("Stillness Mode", "靜心模式")}</a>
            <a href={withBasePath("/ai-tea-guide")}>{t("AI Tea Guide", "AI 茶指南")}</a>
            <a href={withBasePath("/gift-box")}>{t("Gift Box", "禮盒")}</a>
            <a href={withBasePath("/tea-atlas")}>{t("Tea Atlas", "茶地圖")}</a>
            <a href={withBasePath("/b2b")}>{t("B2B Gifts", "企業茶禮")}</a>
            <a href={withBasePath("/about")}>{t("About", "關於我們")}</a>
          </div>
          <div aria-label="Signature focus">
            <span>{t("AI tea state test", "AI 茶心測試")}</span>
            <span>{t("Gaiwan ritual", "蓋碗茶儀式")}</span>
            <span>{t("Chinese tea culture", "中國茶文化")}</span>
            <span>{t("Jian Zhan five cups", "建盞五盞")}</span>
            <span>{t("Cultural gifting", "文化贈禮")}</span>
          </div>
          <form
            action={`mailto:${site.email}?subject=${encodeURIComponent("Chazen Tea Notes Signup")}`}
            method="post"
            encType="text/plain"
          >
            <input
              type="email"
              name="email"
              required
              placeholder={t("Email for tea notes", "電郵訂閱茶語")}
              aria-label={t("Email for newsletter", "訂閱電郵")}
            />
            <button type="submit">{t("Join for Tea Notes", "訂閱茶語")}</button>
          </form>
          <small>{site.email} · Instagram · YouTube</small>
        </div>
      </footer>
    </main>
  );
}
