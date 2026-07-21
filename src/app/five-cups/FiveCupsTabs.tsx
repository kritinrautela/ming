"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { fiveCups, type CupKey, type FiveCup } from "@/app/five-cups/fiveCupsData";
import { useLanguage } from "@/lib/language";

export function FiveCupsTabs() {
  const { t, language } = useLanguage();
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
          <p className="chazen-subpage-eyebrow">{t("Five Spiritual Faculties", "五根")}</p>
          {language === "zh" ? (
            <>
              <h2 lang="zh-Hant">由一盞茶，走回自己</h2>
              <strong>Faith, Diligence, Mindfulness, Stillness, Wisdom</strong>
            </>
          ) : (
            <h2>Faith, Diligence, Mindfulness, Stillness, Wisdom</h2>
          )}
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
                  {language === "zh" ? (
                    <>
                      <span lang="zh-Hant">{cup.tab}</span>
                      <small>{cup.english}</small>
                    </>
                  ) : (
                    <span>{cup.english}</span>
                  )}
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
  const { t, language } = useLanguage();
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
        <JianZhanVisual
          asset={cup.asset}
          alt={cup.visualDirectionEn}
          title={language === "zh" ? cup.tab : cup.english}
          label={t(cup.teaZenMeaningEn, cup.teaZenMeaning)}
        />
      </div>

      <div className="five-cups-copy">
        <p className="chazen-subpage-eyebrow">{cup.buddhistTerm}</p>
        {language === "zh" ? (
          <>
            <h3 lang="zh-Hant">{cup.tab}</h3>
            <strong>{cup.english}</strong>
          </>
        ) : (
          <h3>{cup.english}</h3>
        )}

        <dl className="five-cups-meaning-list">
          <div>
            <dt>{t("Core meaning", "核心含義")}</dt>
            <dd lang={language === "zh" ? "zh-Hant" : undefined}>{t(cup.coreMeaningEn, cup.coreMeaning)}</dd>
          </div>
          <div>
            <dt>{t("Modern state", "現代狀態")}</dt>
            <dd lang={language === "zh" ? "zh-Hant" : undefined}>{t(cup.modernStateEn, cup.modernState)}</dd>
          </div>
          <div>
            <dt>{t("Tea-Zen meaning", "茶禪含義")}</dt>
            <dd lang={language === "zh" ? "zh-Hant" : undefined}>{t(cup.teaZenMeaningEn, cup.teaZenMeaning)}</dd>
          </div>
        </dl>

        <div className="five-cups-poetry" lang={language === "zh" ? "zh-Hant" : undefined}>
          {(language === "zh" ? cup.mainCopy : cup.mainCopyEn).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <Link href={cup.cta.href} className="chazen-subpage-button chazen-subpage-button-primary">
          {t(cup.cta.label, cup.cta.labelZh)} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function JianZhanVisual({
  asset,
  alt,
  title,
  label
}: {
  asset: string;
  alt: string;
  title: string;
  label: string;
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <figure className="five-cups-visual">
      <Image
        src={`${basePath}/images/${asset}`}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="five-cups-visual-image"
      />
      <div className="five-cups-visual-shade" aria-hidden="true" />
      <figcaption>
        <span>{title}</span>
        <small>{label}</small>
      </figcaption>
    </figure>
  );
}
