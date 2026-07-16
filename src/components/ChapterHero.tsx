"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import { useLanguage } from "@/lib/language";

type ChapterHeroProps = {
  chapter: string;
  chapterZh?: string;
  title: string;
  chinese: string;
  copy: string;
  copyZh?: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
};

export function ChapterHero({
  chapter,
  chapterZh,
  title,
  chinese,
  copy,
  copyZh,
  children,
  image = "chazen-arrival-room.avif",
  imageAlt = ""
}: ChapterHeroProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const { t } = useLanguage();

  return (
    <section className="chapter-hero">
      <Image
        src={`${basePath}/images/${image}`}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="chapter-hero-image"
      />
      <div className="chapter-hero-shade" />
      <div className="container relative z-10 grid min-h-[calc(100svh-8rem)] items-end py-16">
        <MotionReveal className="max-w-5xl">
          <p className="hero-label">{t(chapter, chapterZh ?? chapter)}</p>
          <h1 className="display-title mt-6 max-w-5xl text-[clamp(4rem,10vw,10rem)] leading-[0.86] text-porcelain">
            {title}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_0.55fr] lg:items-end">
            <p className="display-title text-4xl leading-tight text-porcelain/90 md:text-6xl">
              {chinese}
            </p>
            <div className="border-l border-porcelain/20 pl-6">
              <p className="max-w-xl text-base leading-8 text-porcelain/75">{t(copy, copyZh ?? copy)}</p>
              {children ? <div className="mt-8">{children}</div> : null}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
