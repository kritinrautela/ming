"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/` || pathname?.startsWith(`${href}/`);

  const closeMenu = () => {
    setOpen(false);
    setExpandedItem(null);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <div className="mobile-nav relative lg:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/15 text-porcelain transition hover:bg-porcelain/10"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => {
          setOpen((value) => !value);
          if (open) setExpandedItem(null);
        }}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div
          id="mobile-navigation"
          className="mobile-nav-panel absolute right-0 top-12 z-50 w-[min(86vw,340px)] border border-ink/10 bg-porcelain p-3 shadow-soft"
        >
          <div className="grid gap-1">
            {navItems.map((item) => {
              const submenuId = `mobile-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`;
              const itemIsActive =
                isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)));

              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      item.href === "/tea-test"
                        ? "mobile-nav-tea-test-pill"
                        : `mobile-nav-link${itemIsActive ? " is-active" : ""}`
                    }
                    aria-current={itemIsActive ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {t(item.label, item.labelZh)}
                  </Link>
                );
              }

              const isExpanded = expandedItem === item.href;
              return (
                <div key={item.href} className="mobile-nav-group">
                  <button
                    type="button"
                    className={`mobile-nav-parent${itemIsActive ? " is-active" : ""}`}
                    aria-expanded={isExpanded}
                    aria-controls={submenuId}
                    onClick={() =>
                      setExpandedItem((current) => (current === item.href ? null : item.href))
                    }
                  >
                    <span>{t(item.label, item.labelZh)}</span>
                    <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  {isExpanded ? (
                    <div
                      id={submenuId}
                      className="mobile-nav-submenu"
                      aria-label={t(`${item.label} options`, `${item.labelZh}選項`)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`mobile-nav-child${isActive(child.href) ? " is-active" : ""}`}
                          aria-current={isActive(child.href) ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          {t(child.label, child.labelZh)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <LanguageToggle className="mobile-nav-language-toggle" />
          <Link
            href="/tea-test"
            className="mobile-menu-inquire button-primary mt-3"
            onClick={closeMenu}
          >
            {t("Start Tea Test", "開始茶測試")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
