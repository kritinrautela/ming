"use client";

import { useLanguage } from "@/lib/language";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`language-toggle ${className ?? ""}`} role="group" aria-label="Choose language">
      <button
        type="button"
        className={language === "en" ? "is-active" : ""}
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={language === "zh" ? "is-active" : ""}
        aria-pressed={language === "zh"}
        onClick={() => setLanguage("zh")}
        lang="zh-Hant"
      >
        中文
      </button>
    </div>
  );
}
