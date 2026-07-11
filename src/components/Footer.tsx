"use client";

import Link from "next/link";
import { footerItems, site } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="museum-site-footer">
      <div className="container">
        <div className="museum-footer-brand">
          <p className="display-title">{site.name}</p>
          <h2>{t("Tea. Return. Stillness.", "茶。回歸。靜心。")}</h2>
          <p>
            {t(
              "A modern cultural tea house for ritual, origin, stillness, and meaningful gifts.",
              "一間現代茶文化之家，關於儀式、源起、靜心與有意義的贈禮。"
            )}
          </p>
        </div>
        <div className="museum-footer-grid">
          <div>
            <p>{t("Explore", "探索")}</p>
            {footerItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {t(item.label, item.labelZh)}
              </Link>
            ))}
          </div>
          <div>
            <p>{t("Signature Focus", "品牌重點")}</p>
            <span>{t("AI tea state test", "AI 茶心測試")}</span>
            <span>{t("Gaiwan ritual", "蓋碗茶儀式")}</span>
            <span>{t("Chinese tea culture", "中國茶文化")}</span>
            <span>{t("Jian Zhan five cups", "建盞五盞")}</span>
            <span>{t("Cultural gifting", "文化贈禮")}</span>
          </div>
          <div>
            <p>{t("Contact", "聯絡我們")}</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <Link href="/b2b">{t("Private cultural gifting inquiry", "企業文化禮品洽詢")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
