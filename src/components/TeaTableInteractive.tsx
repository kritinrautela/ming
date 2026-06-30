"use client";

import Image from "next/image";
import type { TeaObject } from "@/data/teaObjects";

type TeaTableInteractiveProps = {
  tools: TeaObject[];
  activeTool: TeaObject;
  imageSrc: string;
  onSelect: (tool: TeaObject) => void;
  onLearn: (tool: TeaObject) => void;
  onBrewingRole: (tool: TeaObject) => void;
  onSound: (tool: TeaObject) => void;
  onVideo: (tool: TeaObject) => void;
};

export function TeaTableInteractive({
  tools,
  activeTool,
  imageSrc,
  onSelect,
  onLearn,
  onBrewingRole,
  onSound,
  onVideo
}: TeaTableInteractiveProps) {
  return (
    <section id="tea-table" className="museum-section tea-table-exhibit">
      <div className="museum-container">
        <div className="section-title-block">
          <p className="museum-kicker">Chapter 04 / The Tea Table / 茶席器物</p>
          <h2>The table is the ritual before the first pour.</h2>
          <p>
            A gongfu tea table is not decoration. It is an ordered field of heat, water,
            vessel, sound, and attention.
          </p>
          <p lang="zh-Hant">茶席不是陳列，而是水、火、器、聲與心的秩序。</p>
        </div>

        <div className="tea-table-grid">
          <div className="tool-selector" aria-label="Tea table objects">
            <p className="tool-selector-label">Object Index / 器物目錄</p>
            {tools.map((tool) => (
              <button
                type="button"
                key={tool.number}
                className={activeTool.number === tool.number ? "is-active" : ""}
                onClick={() => onSelect(tool)}
                aria-pressed={activeTool.number === tool.number}
              >
                <span>{tool.number}</span>
                <strong>
                  {tool.english}
                  <em lang="zh-Hant">{tool.chinese}</em>
                </strong>
              </button>
            ))}
          </div>

          <figure className="table-object-stage">
            <Image
              src={imageSrc}
              alt="Top-down Chinese tea table with gaiwan, fairness cup, tasting cups, tea tray, tea tools, cloth, and singing bowl."
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className="table-object-image"
            />
            <div className="table-object-shade" />
            <div className="table-object-title">
              <span>Top View</span>
              <strong>Gongfu Tea Table</strong>
              <em lang="zh-Hant">工夫茶席俯視圖</em>
            </div>
            <svg className="table-annotation-layer" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M48 42 C44 31 41 24 35 18" />
              <path d="M63 34 C70 25 76 20 85 18" />
              <path d="M72 58 C82 58 88 63 92 71" />
              <path d="M28 60 C17 62 10 68 7 78" />
              <path d="M18 32 C12 26 10 18 13 10" />
            </svg>
            {tools.map((tool) => (
              <button
                type="button"
                key={tool.number}
                className={`object-marker ${activeTool.number === tool.number ? "is-active" : ""}`}
                style={{ left: tool.x, top: tool.y }}
                onClick={() => onSelect(tool)}
                aria-label={`${tool.number} ${tool.english} ${tool.chinese}`}
                title={`${tool.english} / ${tool.chinese}`}
              >
                <span>{tool.number}</span>
                <em>{tool.english}</em>
              </button>
            ))}
            <figcaption>
              Click a numbered object to read its purpose, ritual meaning, and moment of use.
            </figcaption>
          </figure>

          <article className="selected-object-panel">
            <p className="museum-kicker">Selected Object / 器物標籤</p>
            <span className="object-accession">{activeTool.number}</span>
            <h3 lang="zh-Hant">{activeTool.chinese}</h3>
            <h4>{activeTool.english}</h4>
            <div className={`object-specimen specimen-${activeTool.number}`} aria-hidden="true">
              <span className="specimen-shadow" />
              <span className="specimen-form specimen-form-a" />
              <span className="specimen-form specimen-form-b" />
              <span className="specimen-form specimen-form-c" />
            </div>
            <dl>
              <div>
                <dt>Purpose</dt>
                <dd>{activeTool.purpose}</dd>
              </div>
              <div>
                <dt>How To Use</dt>
                <dd>{activeTool.used}</dd>
              </div>
              <div>
                <dt>Ritual Meaning</dt>
                <dd>{activeTool.meaning}</dd>
              </div>
              <div>
                <dt>Brewing Role</dt>
                <dd>{activeTool.brewingRole}</dd>
              </div>
              <div>
                <dt>Cultural Note</dt>
                <dd>{activeTool.note}</dd>
              </div>
            </dl>
            <div className="object-actions">
              <button type="button" className="museum-link-button dark-on-light" onClick={() => onLearn(activeTool)}>
                Learn This Vessel
              </button>
              <button type="button" className="museum-link-button dark-on-light" onClick={() => onBrewingRole(activeTool)}>
                View Brewing Role
              </button>
              <button type="button" className="museum-link-button dark-on-light" onClick={() => onSound(activeTool)}>
                Hear Object Sound
              </button>
              <button type="button" className="museum-link-button dark-on-light" onClick={() => onVideo(activeTool)}>
                Watch Gaiwan Ritual
              </button>
            </div>
          </article>
        </div>

        <div className="gaiwan-line-study" aria-hidden="true">
          <span className="line-saucer" />
          <span className="line-bowl" />
          <span className="line-lid" />
          <span className="line-knob" />
        </div>
      </div>
    </section>
  );
}
