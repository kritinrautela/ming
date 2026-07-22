"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { navItems } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";

export function Header() {
  const { t } = useLanguage();
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/` || pathname?.startsWith(`${href}/`);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between gap-5">
        <Link href="/" className="site-brand" aria-label="Chazen home">
          <span className="site-brand-en">Chazen</span>
          <span className="site-brand-zh" lang="zh-Hant">茶禪</span>
        </Link>
        <nav ref={navRef} className="hidden items-center gap-7 lg:flex" aria-label={t("Primary", "主導覽")}>
          {navItems.map((item) => {
            const dropdownId = `nav-dropdown-${item.label.toLowerCase().replaceAll(" ", "-")}`;
            const itemIsActive =
              isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)));

            return item.children ? (
              <div
                key={item.href}
                className={`site-nav-item${openDropdown === item.href ? " is-open" : ""}`}
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenDropdown(null);
                  }
                }}
              >
                <button
                  type="button"
                  className={`site-nav-link site-nav-trigger${itemIsActive ? " is-active" : ""}`}
                  aria-expanded={openDropdown === item.href}
                  aria-controls={dropdownId}
                  onClick={() => setOpenDropdown(item.href)}
                  onFocus={() => setOpenDropdown(item.href)}
                >
                  <span>{t(item.label, item.labelZh)}</span>
                  <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div
                  id={dropdownId}
                  className="site-nav-dropdown"
                  aria-label={t(`${item.label} options`, `${item.labelZh}選項`)}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`site-nav-dropdown-link${isActive(child.href) ? " is-active" : ""}`}
                      aria-current={isActive(child.href) ? "page" : undefined}
                    >
                      {t(child.label, child.labelZh)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-link${itemIsActive ? " is-active" : ""}`}
                aria-current={itemIsActive ? "page" : undefined}
              >
                {t(item.label, item.labelZh)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/tea-test" className="header-inquire button-light hidden sm:inline-flex">
            {t("Start Tea Test", "開始茶測試")}
          </Link>
          <button
            type="button"
            className="header-cart-button"
            onClick={openCart}
            aria-label={t("Open cart", "開啟購物車")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="21" r="1.4" />
              <circle cx="18" cy="21" r="1.4" />
            </svg>
            {itemCount > 0 ? <span className="header-cart-badge">{itemCount}</span> : null}
          </button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
