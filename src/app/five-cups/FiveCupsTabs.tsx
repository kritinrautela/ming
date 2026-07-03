"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { fiveCups, type CupKey, type FiveCup } from "@/app/five-cups/fiveCupsData";

export function FiveCupsTabs() {
  const [activeKey, setActiveKey] = useState<CupKey>("faith");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const activeCup = useMemo(
    () => fiveCups.find((cup) => cup.key === activeKey) ?? fiveCups[0],
    [activeKey]
  );

  function focusTab(index: number) {
    const nextIndex = (index + fiveCups.length) % fiveCups.length;
    const nextCup = fiveCups[nextIndex];
    setActiveKey(nextCup.key);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="five-cups-section chazen-subpage-section chazen-subpage-section-paper">
      <div className="chazen-subpage-container">
        <div className="chazen-subpage-heading">
          <p className="chazen-subpage-eyebrow">Five Spiritual Faculties</p>
          <h2 lang="zh-Hant">由一盞茶，走回自己</h2>
          <strong>Faith, Diligence, Mindfulness, Stillness, Wisdom</strong>
        </div>

        <div className="five-cups-layout">
          <div className="five-cups-tablist" role="tablist" aria-label="Five Jian Zhan cups">
            {fiveCups.map((cup, index) => {
              const selected = cup.key === activeCup.key;

              return (
                <button
                  key={cup.key}
                  ref={(node) => {
                    buttonRefs.current[index] = node;
                  }}
                  id={`${baseId}-${cup.key}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-${cup.key}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : ""}
                  onClick={() => setActiveKey(cup.key)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                      event.preventDefault();
                      focusTab(index + 1);
                    }

                    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      focusTab(index - 1);
                    }

                    if (event.key === "Home") {
                      event.preventDefault();
                      focusTab(0);
                    }

                    if (event.key === "End") {
                      event.preventDefault();
                      focusTab(fiveCups.length - 1);
                    }
                  }}
                >
                  <span lang="zh-Hant">{cup.tab}</span>
                  <small>{cup.english}</small>
                </button>
              );
            })}
          </div>

          {fiveCups.map((cup) => (
            <CupPanel key={cup.key} cup={cup} baseId={baseId} hidden={cup.key !== activeCup.key} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CupPanel({ cup, baseId, hidden }: { cup: FiveCup; baseId: string; hidden: boolean }) {
  return (
    <article
      id={`${baseId}-${cup.key}-panel`}
      className="five-cups-panel"
      role="tabpanel"
      tabIndex={hidden ? -1 : 0}
      aria-labelledby={`${baseId}-${cup.key}-tab`}
      hidden={hidden}
    >
      <div className="five-cups-visual-wrap">
        <JianZhanVisual asset={cup.asset} label={cup.visualDirection} />
      </div>

      <div className="five-cups-copy">
        <p className="chazen-subpage-eyebrow">{cup.buddhistTerm}</p>
        <h3 lang="zh-Hant">{cup.tab}</h3>
        <strong>{cup.english}</strong>

        <dl className="five-cups-meaning-list">
          <div>
            <dt>Core meaning</dt>
            <dd lang="zh-Hant">{cup.coreMeaning}</dd>
          </div>
          <div>
            <dt>Modern state</dt>
            <dd lang="zh-Hant">{cup.modernState}</dd>
          </div>
          <div>
            <dt>Tea-Zen meaning</dt>
            <dd lang="zh-Hant">{cup.teaZenMeaning}</dd>
          </div>
        </dl>

        <div className="five-cups-poetry" lang="zh-Hant">
          {cup.mainCopy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="five-cups-direction">
          <span>Visual direction</span>
          <p lang="zh-Hant">{cup.visualDirection}</p>
        </div>

        <Link href={cup.cta.href} className="chazen-subpage-button chazen-subpage-button-primary">
          {cup.cta.label} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function JianZhanVisual({ asset, label }: { asset: string; label: string }) {
  return (
    <figure className="five-cups-visual">
      <div className="five-cups-steam" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="five-cups-bowl" aria-hidden="true">
        <span />
      </div>
      <figcaption>
        <span>{asset}</span>
        <small lang="zh-Hant">{label}</small>
      </figcaption>
    </figure>
  );
}
