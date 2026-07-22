"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language";
import styles from "./ChazenImageGallery.module.css";

export type ChazenGalleryItem = {
  asset: string;
  alt: string;
  altZh?: string;
  label: string;
  labelZh?: string;
  shape?: "portrait" | "square" | "wide" | "feature";
};

type ChazenImageGalleryProps = {
  items: ChazenGalleryItem[];
};

export function ChazenImageGallery({ items }: ChazenImageGalleryProps) {
  const { t, language } = useLanguage();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className={styles.gallery}>
      {items.map((item, index) => (
        <figure
          key={item.asset}
          className={`${styles.item} ${styles[item.shape ?? "portrait"]}`}
        >
          <Image
            src={`${basePath}/images/${item.asset}`}
            alt={t(item.alt, item.altZh ?? item.alt)}
            fill
            sizes={
              item.shape === "feature" || item.shape === "wide"
                ? "(min-width: 1100px) 58vw, (min-width: 700px) 66vw, 100vw"
                : "(min-width: 1100px) 28vw, (min-width: 700px) 33vw, 100vw"
            }
          />
          <figcaption lang={language === "zh" ? "zh-Hant" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{t(item.label, item.labelZh ?? item.label)}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
