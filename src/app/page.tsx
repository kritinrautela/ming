"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SectionIndexNav, type SectionIndexItem } from "@/components/SectionIndexNav";
import { videoAssets, withBasePath } from "@/lib/media";

const revealCards = [
  {
    title: "Enter the Tea Courtyard",
    copy:
      "Chazen begins as a quiet walk into a Song dynasty inspired tea courtyard — white walls, bamboo shadows, warm wood, tea steam, and a single tea table waiting for stillness."
  },
  {
    title: "Choose Your Tea State",
    copy:
      "Five Jian Zhan cups guide the visitor through Faith, Effort, Mindfulness, Concentration, and Wisdom. Each cup becomes a quiet way of returning to oneself."
  },
  {
    title: "Discover Through Ritual",
    copy:
      "Through the AI Tea State Test, tea ritual, and cultural exhibition, Chazen helps each visitor find a tea direction that fits their current rhythm, not just a product to buy."
  }
];

const teaWorlds = [
  {
    key: "faith",
    title: "信",
    english: "Faith / Trust",
    copy: "第一盞，是信。相信一杯茶，可以讓人從混亂中回到自身。",
    support: "信，不是盲目相信，而是願意先停下來，相信自己仍然可以回到清明。",
    cta: "由一杯茶開始",
    ctaEnglish: "Begin With Trust",
    href: "/five-cups"
  },
  {
    key: "effort",
    title: "精進",
    english: "Effort / Practice",
    copy: "第二盞，是精進。不是急速前進，而是在日常中持續修習。",
    support: "真正的精進，不是逼自己更快，而是在每一天的微小儀式裡，慢慢修正自己的節奏。",
    cta: "進入茶儀式",
    ctaEnglish: "Enter the Ritual",
    href: "/five-cups"
  },
  {
    key: "mindfulness",
    title: "念",
    english: "Mindfulness / Awareness",
    copy: "第三盞，是念。看見茶色，聞見茶香，也看見自己的念頭。",
    support: "念，是在喝茶時知道自己正在喝茶，也知道此刻的心正在往哪裡走。",
    cta: "觀察此刻心境",
    ctaEnglish: "Observe Your Tea State",
    href: "/five-cups"
  },
  {
    key: "stillness",
    title: "定",
    english: "Concentration / Stillness",
    copy: "第四盞，是定。當水聲落下，心也慢慢安住。",
    support: "定，不是沒有念頭，而是不再被每一個念頭帶走。茶湯落下，心也慢慢有了停靠之處。",
    cta: "尋找安住",
    ctaEnglish: "Find Stillness",
    href: "/five-cups"
  },
  {
    key: "wisdom",
    title: "慧",
    english: "Wisdom / Clarity",
    copy: "第五盞，是慧。茶不是答案，而是一面鏡，讓人看清當下真正需要的是什麼。",
    support: "慧，不是知道更多，而是看得更清楚。當你慢下來，茶會把你真正需要的東西映照出來。",
    cta: "開始茶測試",
    ctaEnglish: "Start Tea Test",
    href: "/five-cups"
  }
];

const testSteps = [
  "選擇你現在的狀態",
  "回答簡單生活問題",
  "Chazen 分析你的茶方向",
  "得到茶推薦與飲用方法"
];

const exhibitionCards = [
  ["The First Cup", "第一杯茶", "New beginner guide to Chinese tea."],
  ["The Gaiwan Ritual", "蓋碗儀式", "Gaiwan, fairness pitcher, Jian Zhan, and ritual steps."],
  ["Tea and the Mind", "茶與心境", "Sleep, stress, focus, emotion, and tea."],
  ["Dynasties of Tea", "茶的朝代故事", "Tang, Song, Ming tea culture."],
  ["The Lifetime Tea Box", "一世茶盒", "Collectible cultural gift box story."]
];

const ritualSteps = [
  ["溫器", "讓茶具先承接溫度。"],
  ["置茶", "茶葉落入蓋碗，香氣開始打開。"],
  ["醒茶", "第一道水，喚醒茶葉。"],
  ["聞香", "先聞香，再入口。"],
  ["出湯", "茶湯流入公道杯，再分入杯中。"],
  ["慢飲", "一口茶，一次呼吸。"]
];

const timelineItems = [
  ["神農傳說", "傳說中，茶的起源與神農嘗百草有關。茶從一片葉開始，逐漸成為中國文化中重要的一部分。"],
  ["唐代 — 陸羽《茶經》", "唐代茶文化逐漸成形，陸羽寫下《茶經》，令茶不再只是飲品，而成為一套有系統的文化。"],
  ["宋代 — 點茶與文人美學", "宋代盛行點茶，茶與美學、文人生活、器物文化連在一起。"],
  ["明代 — 散茶", "明代之後，散茶逐漸流行，飲茶方式變得更接近日常。"],
  ["Modern Chazen", "Chazen 將中國茶文化帶入現代生活，以 AI 茶測試、茶儀式與文化內容，幫助人重新認識茶。"]
];

const atlasCards = [
  ["Green Tea 綠茶", "清新、明亮、輕盈", "日間、專注、清爽", "中等"],
  ["White Tea 白茶", "溫和、乾淨、柔和", "放鬆、晚上、慢節奏", "容易"],
  ["Oolong 烏龍", "花香、焙火、層次", "專注、平靜能量、下午", "中等"],
  ["Black Tea 紅茶", "溫暖、厚實、穩定", "早上、低能量、需要精神", "容易"],
  ["Pu-erh 普洱", "沉穩、厚重、陳香", "飯後、深度放鬆、收藏", "中等至高"]
];

const teaBoxes = [
  ["AI Tea Test", "適合第一次接觸 Chazen 的人，幫助你了解自己現在適合咩茶。"],
  ["Starter Tea Box", "適合想開始學中國茶文化的新手，包含入門茶款、簡單教學，可配旅行茶具。"],
  ["Lifetime Tea Box", "適合收藏、送禮、文化禮盒，以中國傳說、人物、祝福文化為主題。"],
  ["B2B Tea Box", "適合公司、客戶、地產 settlement gift、節日禮物，可客製化企業文化禮盒。"]
];

const journalCategories = [
  "茶歷史",
  "茶與睡眠",
  "茶與專注",
  "茶與壓力",
  "如何沖茶",
  "茶具介紹",
  "中國送禮文化",
  "Chazen 故事"
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
  eyebrow?: string;
  title: string;
  english: string;
  copy?: string;
}) {
  return (
    <div className="chazen-motion-heading">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2 lang="zh-Hant">{title}</h2>
      <strong>{english}</strong>
      {copy ? <span>{copy}</span> : null}
    </div>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fixedCardsRef = useRef<HTMLDivElement>(null);
  const fixedCardsGridRef = useRef<HTMLDivElement>(null);
  const cardsTriggerRef = useRef<HTMLDivElement>(null);
  const presentingRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.title = "Chazen | Modern Chinese Tea Culture";
  }, []);

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

    const tick = () => {
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

      raf = requestAnimationFrame(tick);
    };

    resizeParticles();
    drawParticles();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resizeParticles);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(particleRaf);
      window.removeEventListener("resize", resizeParticles);
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
          <a href="#" className="chazen-motion-logo">
            <span>Chazen</span>
            <small>茶禪</small>
          </a>
          <div>
            <a href={withBasePath("/tea-test")}>Tea Test</a>
            <a href={withBasePath("/tea-ritual")}>Ritual</a>
            <a href={withBasePath("/tea-culture")}>Culture</a>
            <a href={withBasePath("/tea-boxes")}>Tea Boxes</a>
            <a href={withBasePath("/b2b")}>B2B Gifts</a>
            <a href={withBasePath("/five-cups")}>Five Cups</a>
          </div>
          <a href={withBasePath("/tea-test")} className="chazen-nav-cta">
            Start Tea Test
          </a>
        </nav>

        <section ref={heroRef} className="chazen-motion-hero chazen-home-hero" aria-labelledby="home-title">
          <div className="chazen-motion-hero-inner chazen-home-hero-content">
            <p className="chazen-motion-kicker">Modern Chinese Tea Culture</p>
            <h1 id="home-title" lang="zh-Hant">
              茶禪 <span>Chazen</span>
            </h1>
            <strong>A cultural tea experience for modern life.</strong>
            <div className="chazen-hero-copy">
              <p lang="zh-Hant">透過一杯茶，重新安住、覺察、放鬆，並找到此刻最適合你的茶。</p>
            </div>
            <div className="chazen-motion-actions chazen-home-hero-actions">
              <a href={withBasePath("/tea-test")} className="chazen-primary-btn">
                Start AI Tea Test <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href={withBasePath("/tea-ritual")} className="chazen-secondary-btn">Explore Tea Ritual</a>
            </div>
            <a href={withBasePath("/five-cups")} className="chazen-five-cups-link" lang="zh-Hant">
              五盞建盞 · 信、精進、念、定、慧
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
              <article key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="chazen-scroll-spacer" />
        <div ref={cardsTriggerRef} className="chazen-cards-trigger" />
        <section className="chazen-presenting">
          <div ref={presentingRef} className="chazen-presenting-inner">
            <p>Presenting</p>
            <h2>The Five Jian Zhan Faculties</h2>
            <span lang="zh-Hant">信、精進、念、定、慧：五盞茶，五種回到自身的方法。</span>
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
            eyebrow="Five Jian Zhan Faculties"
            title="五盞建盞，五種回到自身的方法"
            english="Five Jian Zhan Cups, Five Ways Back to the Self"
            copy="Chazen 以五盞建盞對應佛教五根：信、精進、念、定、慧。每一盞茶，不只是味道，也是一種看見自己的方式。 Inspired by the Five Spiritual Faculties — Faith, Effort, Mindfulness, Concentration, and Wisdom — each cup becomes a quiet doorway into self-understanding."
          />
          <div className="chazen-world-grid">
            {teaWorlds.map((world) => (
              <article key={world.key} className={`chazen-world-card world-${world.key}`}>
                <div className="jian-cup-orbit" aria-hidden="true"><span /></div>
                <h3 lang="zh-Hant">{world.title}</h3>
                <strong>{world.english}</strong>
                <p lang="zh-Hant">{world.copy}</p>
                <p className="chazen-world-support" lang="zh-Hant">{world.support}</p>
                <a href={withBasePath(world.href)}>
                  <span lang="zh-Hant">{world.cta}</span>
                  <small>{world.ctaEnglish}</small>
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
            copy="選擇你現在的狀態，回答幾個簡單問題，Chazen 會為你分析適合的茶方向與飲用方式。"
          />
          <div className="chazen-step-grid">
            {testSteps.map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <p lang="zh-Hant">{step}</p>
              </article>
            ))}
          </div>
          <aside className="chazen-result-card">
            <p>Current State: Overthinking / Restless</p>
            <h3>Tea Direction: Warm roasted oolong</h3>
            <span lang="zh-Hant">Why: 適合需要慢下來，但又不想太沉重的晚上。</span>
            <a href={withBasePath("/tea-test")} className="chazen-primary-btn">
              Start My Tea Test
            </a>
          </aside>
        </div>
      </section>

      <section id="culture" className="chazen-motion-section chazen-exhibition-section">
        <div className="chazen-motion-container">
          <SectionHeading title="一場關於中國茶文化的互動展覽" english="A Living Exhibition of Chinese Tea Culture" />
          <div className="chazen-exhibit-grid">
            {exhibitionCards.map(([title, chinese, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <strong lang="zh-Hant">{chinese}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-ritual-layout">
          <SectionHeading title="茶入口之前，先有一場儀式" english="The Ritual Before the Tea" />
          <div className="chazen-ritual-steps">
            {ritualSteps.map(([title, copy], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <h3 lang="zh-Hant">{title}</h3>
                <p lang="zh-Hant">{copy}</p>
              </article>
            ))}
          </div>
          <div className="chazen-motion-actions">
            <a href={withBasePath("/tea-ritual")} className="chazen-primary-btn">Watch Full Ritual</a>
            <a href={withBasePath("/tea-culture")} className="chazen-secondary-btn">Beginner Guide</a>
          </div>
        </div>
      </section>

      <section id="philosophy" className="chazen-motion-section">
        <div className="chazen-motion-container">
          <SectionHeading title="茶，不只是飲品" english="Tea Is Not Only a Drink" />
          <div className="chazen-philosophy-grid">
            {[
              ["Tea for Mind", "不同的茶，有不同的節奏。有些適合專注，有些適合放鬆，有些適合在晚上慢慢飲。"],
              ["Tea as Culture", "中國茶文化承載歷史、禮儀、哲學與人與人之間的連結。"],
              ["Tea as Daily Practice", "飲茶不一定複雜。可以用蓋碗，也可以用杯；可以正式，也可以自然地融入生活。"]
            ].map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p lang="zh-Hant">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chazen-motion-section" aria-label="Tea culture timeline">
        <div className="chazen-motion-container">
          <SectionHeading title="茶，如何穿過中國歷史" english="Tea Through Chinese History" />
          <div className="chazen-timeline-scroll">
            {timelineItems.map(([title, copy]) => (
              <article key={title}>
                <h3 lang="zh-Hant">{title}</h3>
                <p lang="zh-Hant">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tea-atlas" className="chazen-motion-section">
        <div className="chazen-motion-container">
          <SectionHeading title="找到你的茶方向" english="Find Your Tea Direction" />
          <div className="chazen-atlas-grid">
            {atlasCards.map(([name, feeling, suitable, difficulty]) => (
              <article key={name}>
                <h3>{name}</h3>
                <dl>
                  <dt>Feeling</dt>
                  <dd lang="zh-Hant">{feeling}</dd>
                  <dt>Suitable for</dt>
                  <dd lang="zh-Hant">{suitable}</dd>
                  <dt>Beginner difficulty</dt>
                  <dd lang="zh-Hant">{difficulty}</dd>
                </dl>
              </article>
            ))}
          </div>
          <a href={withBasePath("/tea-test")} className="chazen-wide-cta">
            Not sure where to begin? Start the Tea Test
          </a>
        </div>
      </section>

      <section id="tea-boxes" className="chazen-motion-section">
        <div className="chazen-motion-container">
          <SectionHeading title="開始，或延續你的茶旅程" english="Begin or Continue Your Tea Journey" />
          <div className="chazen-box-grid">
            {teaBoxes.map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p lang="zh-Hant">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-membership">
          <SectionHeading title="每個月，延續你的茶文化旅程" english="Continue Your Tea Journey Month by Month" />
          {[
            ["Free Member", "第一次購買後自動加入、生日優惠、產品更新。"],
            ["$28/month Community Member", "每月優惠、WhatsApp community、member chat。"],
            ["$38/month Premium Ritual Member", "限量茶杯禮物、premium member perks、更多文化內容。"]
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p lang="zh-Hant">{copy}</p>
            </article>
          ))}
          <a href="#" className="chazen-primary-btn">Explore Membership</a>
        </div>
      </section>

      <section id="b2b" className="chazen-motion-section">
        <div className="chazen-motion-container chazen-b2b-layout">
          <SectionHeading
            title="為重要關係準備的文化禮盒"
            english="Cultural Gifts for Meaningful Relationships"
          />
          <div className="chazen-b2b-tags">
            {["Corporate gifts / 企業禮品", "Client appreciation / 客戶答謝", "Real estate settlement gifts / 地產交收禮物", "Festival gifts / 節日禮盒", "Business partners / 商業夥伴禮物", "Cultural events / 文化活動禮品"].map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a href={withBasePath("/b2b")} className="chazen-primary-btn">Enquire for B2B Gift Box</a>
        </div>
      </section>

      <section id="journal" className="chazen-motion-section">
        <div className="chazen-motion-container">
          <SectionHeading title="繼續認識茶" english="Learn More About Tea" />
          <div className="chazen-journal-grid">
            {journalCategories.map((category) => (
              <a key={category} href={withBasePath("/tea-atlas/")} lang="zh-Hant">{category}</a>
            ))}
          </div>
          <a href={withBasePath("/tea-atlas/")} className="chazen-wide-cta">Read the Journal</a>
        </div>
      </section>

      <footer className="chazen-motion-footer">
        <div className="chazen-motion-container">
          <h2>Chazen <span>茶禪</span></h2>
          <p>Chazen is a modern Chinese tea culture experience designed for calm, connection, and self-understanding.</p>
          <p lang="zh-Hant">Chazen 是一個現代中國茶文化體驗品牌，為平靜、連結與自我理解而設。</p>
          <div>
            <a href={withBasePath("/tea-test")}>Tea Test</a>
            <a href={withBasePath("/tea-ritual")}>Tea Ritual</a>
            <a href={withBasePath("/tea-culture")}>Tea Culture</a>
            <a href={withBasePath("/tea-boxes")}>Tea Boxes</a>
            <a href={withBasePath("/b2b")}>B2B Gifts</a>
            <a href={withBasePath("/five-cups")}>Five Cups</a>
          </div>
          <div aria-label="Signature focus">
            <span>AI tea state test</span>
            <span>Gaiwan ritual</span>
            <span>Chinese tea culture</span>
            <span>Jian Zhan five cups</span>
            <span>Cultural gifting</span>
          </div>
          <form>
            <input type="email" placeholder="Email for tea notes" aria-label="Email for newsletter" />
            <button type="submit">Join</button>
          </form>
          <small>hello@chazentea.com.au · Instagram · YouTube</small>
        </div>
      </footer>
    </main>
  );
}
