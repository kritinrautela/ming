"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { useLanguage } from "@/lib/language";

type ChazenMediaPlaceholderProps = {
  asset: string;
  label: string;
  type?: "image" | "video";
  note?: string;
};

type ChazenMediaProps = {
  asset: string;
  alt: string;
  type?: "image" | "video";
};

type ChazenSubpageHeroProps = {
  eyebrow: string;
  eyebrowZh?: string;
  title: string;
  english: string;
  copy: string;
  copyEn?: string;
  placeholder?: ChazenMediaPlaceholderProps;
  media?: ChazenMediaProps;
};

export function ChazenSubpageMedia({ asset, alt, type = "image" }: ChazenMediaProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <figure className="chazen-media-placeholder chazen-media-real">
      {type === "video" ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={`${basePath}/video/${asset}`}
        />
      ) : (
        <Image
          src={`${basePath}/images/${asset}`}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      )}
    </figure>
  );
}

type ChazenContentSectionProps = {
  eyebrow?: string;
  eyebrowZh?: string;
  title: string;
  english?: string;
  copy?: string;
  copyEn?: string;
  children?: ReactNode;
  tone?: "paper" | "ivory";
};

type ChazenCtaBandProps = {
  title: string;
  titleEn?: string;
  copy: string;
  copyZh?: string;
  primary: {
    href: string;
    label: string;
    labelZh?: string;
  };
  secondary?: {
    href: string;
    label: string;
    labelZh?: string;
  };
  next?: {
    href: string;
    label: string;
    labelZh?: string;
  };
};

// Strips leading "Future visual:"/"Future video:" framing from caller-provided
// labels so this never prints as an apology — the caption should read as a
// deliberate curatorial note ("Gaiwan vessel study"), not a confession that a
// file is missing.
function toCaption(label: string) {
  return label.replace(/^Future (visual|video):\s*/i, "");
}

export function ChazenMediaPlaceholder({
  label,
  note
}: ChazenMediaPlaceholderProps) {
  const { t } = useLanguage();

  return (
    <figure className="chazen-media-placeholder" aria-label={toCaption(label)}>
      <div aria-hidden="true">
        <span>{t("In the Making", "製作中")}</span>
      </div>
      <figcaption>
        <span>{toCaption(label)}</span>
        {note ? <small>{note}</small> : null}
      </figcaption>
    </figure>
  );
}

export function ChazenSubpageHero({
  eyebrow,
  eyebrowZh,
  title,
  english,
  copy,
  copyEn,
  placeholder,
  media
}: ChazenSubpageHeroProps) {
  const { t, language } = useLanguage();
  return (
    <section className="chazen-subpage-hero">
      <div className="chazen-subpage-container chazen-subpage-hero-grid">
        <MotionReveal>
          <p className="chazen-subpage-eyebrow">{t(eyebrow, eyebrowZh ?? eyebrow)}</p>
          {language === "zh" ? (
            <>
              <h1 lang="zh-Hant">{title}</h1>
              <strong>{english}</strong>
            </>
          ) : (
            <h1>{english}</h1>
          )}
          <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(copyEn ?? copy, copy)}</p>
          <div className="chazen-subpage-hero-rule" aria-hidden="true" />
        </MotionReveal>
        {media || placeholder ? (
          <MotionReveal delay={0.14}>
            {media ? <ChazenSubpageMedia {...media} /> : placeholder ? <ChazenMediaPlaceholder {...placeholder} /> : null}
          </MotionReveal>
        ) : null}
      </div>
    </section>
  );
}

export function ChazenContentSection({
  eyebrow,
  eyebrowZh,
  title,
  english,
  copy,
  copyEn,
  children,
  tone = "ivory"
}: ChazenContentSectionProps) {
  const { t, language } = useLanguage();
  return (
    <section className={`chazen-subpage-section chazen-subpage-section-${tone}`}>
      <div className="chazen-subpage-container">
        <MotionReveal className="chazen-subpage-heading">
          {eyebrow ? <p className="chazen-subpage-eyebrow">{t(eyebrow, eyebrowZh ?? eyebrow)}</p> : null}
          {language === "zh" || !english ? (
            <>
              <h2 lang="zh-Hant">{title}</h2>
              {english ? <strong>{english}</strong> : null}
            </>
          ) : (
            <h2>{english}</h2>
          )}
          {copy ? <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(copyEn ?? copy, copy)}</p> : null}
        </MotionReveal>
        {children ? <MotionReveal delay={0.12}>{children}</MotionReveal> : null}
      </div>
    </section>
  );
}

export function ChazenCtaBand({ title, titleEn, copy, copyZh, primary, secondary, next }: ChazenCtaBandProps) {
  const { t, language } = useLanguage();
  return (
    <section className="chazen-subpage-cta">
      <div className="chazen-subpage-container">
        <MotionReveal>
          <p className="chazen-subpage-eyebrow">{t("Next step", "下一步")}</p>
          {language === "zh" || !titleEn ? <h2 lang="zh-Hant">{title}</h2> : <h2>{titleEn}</h2>}
          <p>{t(copy, copyZh ?? copy)}</p>
        </MotionReveal>
        <div className="chazen-subpage-actions">
          <Link href={primary.href} className="chazen-subpage-button chazen-subpage-button-primary">
            {t(primary.label, primary.labelZh ?? primary.label)} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="chazen-subpage-button">
              {t(secondary.label, secondary.labelZh ?? secondary.label)}
            </Link>
          ) : null}
          {next ? (
            <Link href={next.href} className="chazen-subpage-button">
              {t(next.label, next.labelZh ?? next.label)}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
