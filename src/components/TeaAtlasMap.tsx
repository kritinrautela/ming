"use client";

import type { TeaOrigin } from "@/data/teaOrigins";

type TeaAtlasMapProps = {
  origins: TeaOrigin[];
  activeOrigin: TeaOrigin;
  onSelect: (origin: TeaOrigin) => void;
  onExplore: (origin: TeaOrigin) => void;
  onOpenMap: () => void;
};

export function TeaAtlasMap({ origins, activeOrigin, onSelect, onExplore, onOpenMap }: TeaAtlasMapProps) {
  const originClass = activeOrigin.name.toLowerCase().replaceAll(" ", "-");

  return (
    <article className={`atlas-panel atlas-origin-${originClass}`}>
      <p className="museum-kicker">Chapter 07 / Tea Atlas / 茶之地圖</p>
      <h2>Origin is not a coordinate. It is climate remembered by leaf.</h2>
      <div className="atlas-visual-study">
        <div className="atlas-map" aria-label="Highlighted tea regions">
          <span className="atlas-paper-grain" aria-hidden="true" />
          <span className="atlas-route atlas-route-one" aria-hidden="true" />
          <span className="atlas-route atlas-route-two" aria-hidden="true" />
          {origins.map((origin) => (
            <button
              type="button"
              key={origin.name}
              className={activeOrigin.name === origin.name ? "is-active" : ""}
              onClick={() => onSelect(origin)}
              aria-pressed={activeOrigin.name === origin.name}
            >
              {origin.name}
            </button>
          ))}
        </div>
        <div className="atlas-cup-study" aria-hidden="true">
          <span className="atlas-cup-steam" />
          <span className="atlas-cup-bowl" />
          <span className="atlas-cup-tea" style={{ backgroundColor: activeOrigin.liquor }} />
          <span className="atlas-cup-saucer" />
          <small>{activeOrigin.tea}</small>
        </div>
      </div>
      <div className="atlas-feature">
        <span>Featured Origin</span>
        <strong>
          {activeOrigin.name} {activeOrigin.chinese}
        </strong>
        <p>{activeOrigin.tea}</p>
        <dl className="atlas-detail-list">
          <div>
            <dt>Origin Story</dt>
            <dd>{activeOrigin.history}</dd>
          </div>
          <div>
            <dt>Climate</dt>
            <dd>{activeOrigin.climate}</dd>
          </div>
          <div>
            <dt>Terroir</dt>
            <dd>{activeOrigin.terroir}</dd>
          </div>
          <div>
            <dt>Taste / Aroma</dt>
            <dd>{activeOrigin.taste} Aroma: {activeOrigin.aroma}.</dd>
          </div>
          <div>
            <dt>Ritual Moment</dt>
            <dd>{activeOrigin.moment}</dd>
          </div>
        </dl>
      </div>
      <div className="chapter-actions">
        <button type="button" className="museum-link-button dark-on-light" onClick={() => onExplore(activeOrigin)}>
          Explore Tea Origins
        </button>
        <button type="button" className="museum-link-button dark-on-light" onClick={onOpenMap}>
          Open Tea Map
        </button>
      </div>
    </article>
  );
}
