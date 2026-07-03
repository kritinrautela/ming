import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ChazenMediaPlaceholderProps = {
  asset: string;
  label: string;
  type?: "image" | "video";
  note?: string;
};

type ChazenSubpageHeroProps = {
  eyebrow: string;
  title: string;
  english: string;
  copy: string;
  placeholder: ChazenMediaPlaceholderProps;
};

type ChazenContentSectionProps = {
  eyebrow?: string;
  title: string;
  english?: string;
  copy?: string;
  children?: ReactNode;
  tone?: "paper" | "ivory";
};

type ChazenCtaBandProps = {
  title: string;
  copy: string;
  primary: {
    href: string;
    label: string;
  };
  secondary?: {
    href: string;
    label: string;
  };
  next?: {
    href: string;
    label: string;
  };
};

export function ChazenMediaPlaceholder({
  asset,
  label,
  type = "image",
  note = "Future media placeholder"
}: ChazenMediaPlaceholderProps) {
  return (
    <figure className="chazen-media-placeholder">
      {/* Future media: replace this placeholder with the matching asset from docs/chazen-asset-list.md. */}
      <div aria-hidden="true">
        <span>{type === "video" ? "MP4" : "WEBP"}</span>
        <strong>{asset}</strong>
      </div>
      <figcaption>
        <span>{label}</span>
        <small>{note}</small>
      </figcaption>
    </figure>
  );
}

export function ChazenSubpageHero({ eyebrow, title, english, copy, placeholder }: ChazenSubpageHeroProps) {
  return (
    <section className="chazen-subpage-hero">
      <div className="chazen-subpage-container chazen-subpage-hero-grid">
        <div>
          <p className="chazen-subpage-eyebrow">{eyebrow}</p>
          <h1 lang="zh-Hant">{title}</h1>
          <strong>{english}</strong>
          <p lang="zh-Hant">{copy}</p>
          <div className="chazen-subpage-hero-rule" aria-hidden="true" />
        </div>
        <ChazenMediaPlaceholder {...placeholder} />
      </div>
    </section>
  );
}

export function ChazenContentSection({
  eyebrow,
  title,
  english,
  copy,
  children,
  tone = "ivory"
}: ChazenContentSectionProps) {
  return (
    <section className={`chazen-subpage-section chazen-subpage-section-${tone}`}>
      <div className="chazen-subpage-container">
        <div className="chazen-subpage-heading">
          {eyebrow ? <p className="chazen-subpage-eyebrow">{eyebrow}</p> : null}
          <h2 lang="zh-Hant">{title}</h2>
          {english ? <strong>{english}</strong> : null}
          {copy ? <p lang="zh-Hant">{copy}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ChazenCtaBand({ title, copy, primary, secondary, next }: ChazenCtaBandProps) {
  return (
    <section className="chazen-subpage-cta">
      <div className="chazen-subpage-container">
        <div>
          <p className="chazen-subpage-eyebrow">Next step</p>
          <h2 lang="zh-Hant">{title}</h2>
          <p>{copy}</p>
        </div>
        <div className="chazen-subpage-actions">
          <Link href={primary.href} className="chazen-subpage-button chazen-subpage-button-primary">
            {primary.label} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="chazen-subpage-button">
              {secondary.label}
            </Link>
          ) : null}
          {next ? (
            <Link href={next.href} className="chazen-subpage-button">
              {next.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
