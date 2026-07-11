"use client";

import { useLanguage } from "@/lib/language";

type SectionHeadingProps = {
  eyebrow: string;
  eyebrowZh?: string;
  title: string;
  titleZh?: string;
  copy?: string;
  copyZh?: string;
};

export function SectionHeading({ eyebrow, eyebrowZh, title, titleZh, copy, copyZh }: SectionHeadingProps) {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{t(eyebrow, eyebrowZh ?? eyebrow)}</p>
      <h2 className="display-title mt-4 text-4xl leading-[1.05] text-ink md:text-6xl">
        {t(title, titleZh ?? title)}
      </h2>
      {copy ? <p className="mt-6 text-lg leading-8 text-ink/66">{t(copy, copyZh ?? copy)}</p> : null}
    </div>
  );
}
