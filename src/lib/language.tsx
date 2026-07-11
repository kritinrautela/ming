"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "zh";

const STORAGE_KEY = "chazen-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Pick the right string for the current language. */
  t: (en: string, zh: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") {
      return stored;
    }
  } catch {
    // Private browsing or storage disabled: fall through to browser detection.
  }

  const browserLanguages = window.navigator.languages ?? [window.navigator.language];
  const prefersChinese = browserLanguages.some((lang) => lang?.toLowerCase().startsWith("zh"));

  return prefersChinese ? "zh" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server-rendered/static markup always starts in English; the real
  // (possibly browser-detected or saved) language is applied client-side
  // right after mount, so there's no server/client markup mismatch.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    setLanguageState(detectInitialLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
  }, [language]);

  function setLanguage(next: Language) {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or storage disabled: the choice still applies this session.
    }
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "zh" : "en");
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (en: string, zh: string) => (language === "zh" ? zh : en)
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
