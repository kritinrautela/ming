"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="cz-notfound">
      <p className="cz-notfound-seal" lang="zh-Hant" aria-hidden="true">
        空
      </p>
      <p className="cz-notfound-code">404</p>
      <h1>{t("This page has already emptied its cup.", "這一頁的茶，已經喝完了。")}</h1>
      <p className="cz-notfound-copy">
        {t(
          "The page you were looking for doesn't exist or has moved. Take a breath, then return to the tea room.",
          "你尋找的頁面不存在或已搬遷。先深呼吸，然後回到茶室。"
        )}
      </p>
      <div className="cz-notfound-actions">
        <Link href="/" className="button-primary">
          {t("Return home", "回到首頁")} <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link href="/tea-test" className="button-secondary">
          {t("Start the tea test", "開始茶測試")}
        </Link>
      </div>
    </main>
  );
}
