"use client";

import Image from "next/image";
import { useState } from "react";
import { knowledgeCards, teaHistoryItems } from "@/data/teaHistory";
import { VideoModal } from "@/components/VideoModal";
import { videoAssets, withBasePath } from "@/lib/media";

type TeaHistoryTimelineProps = {
  onEnterTimeline: () => void;
};

const eraDates = ["Mythic", "618-907", "960-1279", "1368-1644", "1644-1912", "Now"];

export function TeaHistoryTimeline({ onEnterTimeline }: TeaHistoryTimelineProps) {
  const [activeItem, setActiveItem] = useState(teaHistoryItems[0]);
  const [videoModal, setVideoModal] = useState<{ title: string; src: string } | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const imageUrl = (name: string) => `${basePath}/images/${name}`;
  const activeIndex = teaHistoryItems.findIndex((item) => item.number === activeItem.number);

  const openChapterVideo = (title: string, videoKey: string) => {
    setVideoModal({ title, src: withBasePath(videoAssets[videoKey as keyof typeof videoAssets]) });
  };

  return (
    <section id="tea-history" className="museum-section history-timeline-section">
      <div className="museum-container">
        <div className="section-title-block">
          <p className="museum-kicker">Chapter 03 / The History of Tea</p>
          <h2>Tea moves from legend to medicine, from scholarship to stillness.</h2>
          <p lang="zh-Hant">茶之源流，從傳說、藥性、文人審美，到當代靜心。</p>
        </div>
        <div className="timeline-gallery">
          <div className="timeline-shadow-stage" aria-live="polite">
            <Image
              src={imageUrl(activeItem.image)}
              alt={activeItem.visualLabel}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className="timeline-shadow-image"
            />
            <div className="timeline-shadow-veil" />
            <div className="timeline-character" lang="zh-Hant" aria-hidden="true">
              {activeItem.character}
            </div>
            <article>
              <span>{activeItem.number}</span>
              <p>{activeItem.visualLabel}</p>
              <h3>{activeItem.title}</h3>
              <strong lang="zh-Hant">{activeItem.chinese}</strong>
              {activeItem.figure ? <em className="timeline-figure">{activeItem.figure}</em> : null}
              <dl className="timeline-era-meta">
                <div>
                  <dt>Context</dt>
                  <dd>{activeItem.context}</dd>
                </div>
                <div>
                  <dt>Object</dt>
                  <dd>{activeItem.object}</dd>
                </div>
              </dl>
              <p>{activeItem.story}</p>
              <small>{activeItem.chazenMeaning}</small>
            </article>
          </div>

          <div className="history-timeline-cabinet">
            <div className="dynasty-rail" aria-label="Interactive tea history timeline">
              <span className="dynasty-rail-line" aria-hidden="true" />
              <span
                className="dynasty-rail-progress"
                style={{ height: `${((activeIndex + 1) / teaHistoryItems.length) * 100}%` }}
                aria-hidden="true"
              />
              {teaHistoryItems.map((item, index) => (
                <button
                  type="button"
                  key={item.number}
                  className={activeItem.number === item.number ? "is-active" : ""}
                  onClick={() => setActiveItem(item)}
                  onMouseEnter={() => setActiveItem(item)}
                  onFocus={() => setActiveItem(item)}
                  aria-pressed={activeItem.number === item.number}
                >
                  <span className="dynasty-marker">{item.number}</span>
                  <span className="dynasty-date">{eraDates[index]}</span>
                  <strong>{item.title}</strong>
                  <em lang="zh-Hant">{item.chinese}</em>
                </button>
              ))}
            </div>
            <article className="dynasty-story-card">
              <p className="museum-kicker">Selected Era / 年代標本</p>
              <div className="dynasty-story-portrait" aria-hidden="true">
                <span lang="zh-Hant">{activeItem.character}</span>
              </div>
              <h3>{activeItem.title}</h3>
              <strong lang="zh-Hant">{activeItem.chinese}</strong>
              {activeItem.figure ? <em className="timeline-figure">{activeItem.figure}</em> : null}
              <p>{activeItem.story}</p>
              <dl>
                <div>
                  <dt>Object</dt>
                  <dd>{activeItem.object}</dd>
                </div>
                <div>
                  <dt>CHAZEN Meaning</dt>
                  <dd>{activeItem.chazenMeaning}</dd>
                </div>
              </dl>
              {activeItem.video ? (
                <button
                  type="button"
                  className="museum-link-button"
                  onClick={() => openChapterVideo(activeItem.title, activeItem.video!)}
                >
                  Watch this chapter <span lang="zh-Hant">觀看此篇</span>
                </button>
              ) : null}
            </article>
          </div>
        </div>
        <div className="knowledge-grid" aria-label="Tea culture knowledge cards">
          {knowledgeCards.map((card) => (
            <article key={card.title}>
              <span className="seal-mark" aria-hidden="true" />
              <h3>{card.title}</h3>
              <strong lang="zh-Hant">{card.chinese}</strong>
              <p>{card.copy}</p>
              <a href={card.href} className="text-link-button">
                Learn More
              </a>
            </article>
          ))}
        </div>
        <div className="chapter-actions">
          <button type="button" className="museum-link-button dark-on-light" onClick={onEnterTimeline}>
            Enter the Timeline <span lang="zh-Hant">進入茶史</span>
          </button>
        </div>
      </div>
      <VideoModal
        open={videoModal !== null}
        title={videoModal?.title ?? ""}
        src={videoModal?.src ?? ""}
        onClose={() => setVideoModal(null)}
      />
    </section>
  );
}
