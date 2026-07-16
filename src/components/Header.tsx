"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { navItems } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/` || pathname?.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between gap-5">
        <Link href="/" className="site-brand" aria-label="Chazen home">
          <span className="site-brand-en">Chazen</span>
          <span className="site-brand-zh" lang="zh-Hant">茶禪</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label={t("Primary", "主導覽")}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {t(item.label, item.labelZh)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/tea-test" className="header-inquire button-light hidden sm:inline-flex">
            {t("Start Tea Test", "開始茶測試")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
