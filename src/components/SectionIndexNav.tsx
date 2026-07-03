"use client";

import { useEffect, useState } from "react";

export type SectionIndexItem = {
  id: string;
  label: string;
  zh: string;
};

type SectionIndexNavProps = {
  items: SectionIndexItem[];
};

export function SectionIndexNav({ items }: SectionIndexNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const updateActiveSection = () => {
      const viewportMarker = window.innerHeight * 0.45;
      let current = sections[0];

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMarker && rect.bottom >= viewportMarker) {
          current = section;
          break;
        }
        if (rect.top <= viewportMarker) {
          current = section;
        }
      }

      if (window.scrollY < window.innerHeight * 0.25) {
        current = sections[0];
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = sections[sections.length - 1];
      }

      setActiveId(current.id);
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      root: null,
      rootMargin: "-42% 0px -42% 0px",
      threshold: [0, 0.2, 0.5, 1]
    });

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  const handleClick = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
    setActiveId(id);
  };

  return (
    <nav className="section-index-nav" aria-label="Homepage section index">
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            className={active ? "is-active" : undefined}
            aria-current={active ? "true" : undefined}
            onClick={() => handleClick(item.id)}
          >
            <span className="section-index-dot" aria-hidden="true" />
            <span className="section-index-copy">
              <strong>{item.label}</strong>
              <small lang="zh-Hant">{item.zh}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
