"use client";

import Link from "next/link";
import { legalItems, site } from "@/lib/site";
import { useLanguage } from "@/lib/language";
import styles from "./Footer.module.css";

const footerGroups = [
  {
    heading: { en: "Discover", zh: "探索" },
    links: [
      { label: "Tea Test", labelZh: "茶測試", href: "/tea-test" },
      { label: "Tea Ritual", labelZh: "茶儀式", href: "/tea-ritual" },
      { label: "Tea Culture", labelZh: "茶文化", href: "/tea-culture" },
      { label: "Tea Atlas", labelZh: "茶地圖", href: "/tea-atlas" },
      { label: "Song Room", labelZh: "點茶室", href: "/song-room" }
    ]
  },
  {
    heading: { en: "Collection & gifts", zh: "收藏與贈禮" },
    links: [
      { label: "Five Cups", labelZh: "五盞收藏", href: "/five-cups" },
      { label: "Tea Collection", labelZh: "茶品收藏", href: "/tea-collection" },
      { label: "Tea Boxes", labelZh: "茶盒", href: "/tea-boxes" },
      { label: "Gift Box", labelZh: "禮盒", href: "/gift-box" },
      { label: "Business Gifting", labelZh: "企業茶禮", href: "/b2b" }
    ]
  },
  {
    heading: { en: "The house", zh: "茶之家" },
    links: [
      { label: "Our Story", labelZh: "品牌故事", href: "/about" },
      { label: "Stillness Mode", labelZh: "靜心模式", href: "/stillness-mode" },
      { label: "AI Tea Guide", labelZh: "AI 茶導師", href: "/ai-tea-guide" },
      { label: "FAQ", labelZh: "常見問題", href: "/faq" },
      { label: "Contact", labelZh: "聯絡我們", href: "/contact" }
    ]
  }
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="museum-site-footer">
      <div className="container">
        <div className={styles.beginBand}>
          <p className={styles.beginText}>
            {t("Begin with one cup.", "從一盞茶開始。")}
          </p>
          <div className={styles.beginLinks}>
            <Link
              href="/tea-test"
              className={styles.beginLink}
              aria-label={t("Start the Tea Test", "開始茶測試")}
            >
              {t("Start the Tea Test", "開始茶測試")}
            </Link>
            <Link
              href="/brew-simulator"
              className={styles.beginLink}
              aria-label={t("Practice in the Brewing Room", "在沖泡室中練習")}
            >
              {t("Practice in the Brewing Room", "在沖泡室中練習")}
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="museum-footer-top">
          <div className="museum-footer-brand">
            <p className="display-title">
              Chazen <span lang="zh-Hant">茶禪</span>
            </p>
            <p className="museum-footer-line">{t("One cup. One breath. One return.", "一盞茶。一次呼吸。一場回歸。")}</p>
            <p className="museum-footer-copy">
              {t(
                "A modern cultural tea house for ritual, origin, stillness, and meaningful gifts.",
                "一間現代茶文化之家，關於儀式、源起、靜心與有意義的贈禮。"
              )}
            </p>
            <a className="museum-footer-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div className="museum-footer-grid">
            {footerGroups.map((group) => (
              <div key={group.heading.en}>
                <p>{t(group.heading.en, group.heading.zh)}</p>
                {group.links.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.footerLink}>
                    {t(item.label, item.labelZh)}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <p className="museum-footer-seal" lang="zh-Hant" aria-hidden="true">
            茶禪
          </p>
        </div>
        <div className="museum-footer-legal">
          <p>© {new Date().getFullYear()} Chazen 茶禪. {t("All rights reserved.", "版權所有。")}</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t("Legal", "法律資訊")}>
            {legalItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.footerLink}>
                {t(item.label, item.labelZh)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
