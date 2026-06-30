"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const filters = ["All", "Oolong", "Green", "White", "Black / Red", "Pu'er", "Japanese"];

const teas = [
  {
    slug: "da-hong-pao",
    name: "Da Hong Pao",
    chinese: "大紅袍",
    origin: "Wuyi, Fujian",
    family: "Oolong",
    process: "Withered, bruised, oxidized, charcoal roasted, then rested until the roast settles into the leaf.",
    look: "Dark twisted strips with roasted edges and a mineral sheen.",
    taste: "Cliff mineral, orchid, warm roast, dark honey, and returning sweetness.",
    aroma: "Wet stone, orchid, charcoal warmth.",
    ritual: "For ceremony, important guests, and conversations with gravity.",
    note: "A rock tea whose luxury comes from restraint: mountain, roast, and aftertaste.",
    liquor: "#9b4f2d",
    palette: "rock"
  },
  {
    slug: "longjing",
    name: "Longjing",
    chinese: "龍井",
    origin: "Hangzhou, Zhejiang",
    family: "Green",
    process: "Tender spring leaves are hand pan-fired to halt oxidation and preserve clarity.",
    look: "Flat jade leaves pressed by the palm against a warm pan.",
    taste: "Chestnut, bean flower, spring grass, rain, and clean sweetness.",
    aroma: "Toasted chestnut, tender greens, lake air.",
    ritual: "A clear morning tea before work, writing, or decision.",
    note: "Longjing is clarity as a leaf: quiet, flat, luminous, and precise.",
    liquor: "#c9c36a",
    palette: "green"
  },
  {
    slug: "bai-hao-yin-zhen",
    name: "Bai Hao Yin Zhen",
    chinese: "白毫銀針",
    origin: "Fuding, Fujian",
    family: "White",
    process: "Young buds are picked, withered, and dried with minimal intervention.",
    look: "Silver down-covered buds, pale as moonlit needles.",
    taste: "Hay sweetness, pear skin, soft honey, and a quiet luminous body.",
    aroma: "Warm hay, white flower, soft honey.",
    ritual: "For afternoon recovery and gentle conversation.",
    note: "A tea of patience; the luxury is in what is not forced.",
    liquor: "#d8c88f",
    palette: "white"
  },
  {
    slug: "tie-guan-yin",
    name: "Tie Guan Yin",
    chinese: "鐵觀音",
    origin: "Anxi, Fujian",
    family: "Oolong",
    process: "Withered, shaken, partially oxidized, rolled, dried, and refined by roast.",
    look: "Rolled green pearls that unfurl into thick aromatic leaves.",
    taste: "Orchid, cream, green stem, bright mineral, and lingering perfume.",
    aroma: "Orchid, cream, garden air.",
    ritual: "For welcoming a guest with fragrance before speech.",
    note: "A tea that teaches the host to let aroma arrive before explanation.",
    liquor: "#d2b35f",
    palette: "orchid"
  },
  {
    slug: "puer",
    name: "Pu'er",
    chinese: "普洱",
    origin: "Yunnan",
    family: "Pu'er",
    process: "Sun-dried maocha is compressed and aged, sometimes fermented, until time becomes flavor.",
    look: "Compressed dark leaves or loose aged fragments with red-brown depth.",
    taste: "Earth, camphor, old wood, dried fruit, and mellow sweetness.",
    aroma: "Old timber, date, rain on earth.",
    ritual: "After dinner, when time can become slower.",
    note: "Pu'er is less a product than a record of storage, climate, and patience.",
    liquor: "#6f3826",
    palette: "aged"
  },
  {
    slug: "high-mountain-oolong",
    name: "High Mountain Oolong",
    chinese: "高山烏龍",
    origin: "Taiwan",
    family: "Oolong",
    process: "Light oxidation, rolling, careful drying, and gentle roast preserve alpine fragrance.",
    look: "Tightly rolled leaves with cool green-gold sheen.",
    taste: "Cream, flower, cool air, soft stem, and lingering sweetness.",
    aroma: "Alpine flower, cream, cold mist.",
    ritual: "A reset between work and evening.",
    note: "Altitude becomes texture: soft, lifted, and quietly expansive.",
    liquor: "#d7c36c",
    palette: "mountain"
  },
  {
    slug: "lapsang-souchong",
    name: "Lapsang Souchong",
    chinese: "正山小種",
    origin: "Tongmu, Wuyi, Fujian",
    family: "Black / Red",
    process: "Withered pine-smoked leaves are oxidized, dried, and refined into a deep red tea.",
    look: "Dark wiry leaves with pine-smoke depth.",
    taste: "Pine smoke, dried longan, dark sugar, and mountain warmth.",
    aroma: "Pine resin, longan, ember.",
    ritual: "For courage, winter, and protective gifting.",
    note: "The smoke should feel architectural, not loud: a room made of pine and memory.",
    liquor: "#8a3726",
    palette: "ember"
  },
  {
    slug: "uji-matcha",
    name: "Uji Matcha",
    chinese: "宇治抹茶",
    origin: "Uji, Japan",
    family: "Japanese",
    process: "Shade-grown leaves are steamed, dried as tencha, and stone-milled into fine powder.",
    look: "Velvet green powder with a luminous matte surface.",
    taste: "Umami, fresh greens, soft bitterness, cream, and a focused finish.",
    aroma: "Stone mill, sea air, young greens.",
    ritual: "For a threshold moment before meditation or creative work.",
    note: "A bridge to powdered tea culture: focused, tactile, and immediate.",
    liquor: "#4f6f3b",
    palette: "matcha"
  }
];

type TeaCollectionExperienceProps = {
  basePath: string;
};

export function TeaCollectionExperience({ basePath }: TeaCollectionExperienceProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTea, setSelectedTea] = useState(teas[0]);
  const visibleTeas = useMemo(
    () => teas.filter((tea) => activeFilter === "All" || tea.family === activeFilter),
    [activeFilter]
  );

  return (
    <main className="tea-collection-page tea-collection-cinematic">
      <section className="tea-collection-hero">
        <Image
          src={`${basePath}/images/chazen-tea-collection-v1.png`}
          alt="Premium Chinese tea collection with loose leaves, tea canisters, and teaware."
          fill
          priority
          sizes="100vw"
        />
        <div className="tea-collection-shade" />
        <div className="tea-collection-hero-copy">
          <p className="museum-kicker">Tea Collection / 茶品收藏</p>
          <h1>Leaves as origin, craft, taste, and ritual.</h1>
          <p lang="zh-Hant">茶不是商品格子。是一座座山，一種手藝，一杯時間。</p>
          <a href={`${basePath}/#chapter-index`} className="museum-link-button">
            Return to CHAZEN
          </a>
        </div>
      </section>

      <section className="museum-section tea-catalogue-exhibit">
        <div className="museum-container">
          <div className="tea-catalogue-head">
            <div>
              <p className="museum-kicker">Curated Leaves / 茶葉標本</p>
              <h2>A catalogue arranged like a quiet cabinet, not a shop shelf.</h2>
            </div>
            <div className="tea-filter-tabs" aria-label="Tea filters">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={activeFilter === filter ? "is-active" : ""}
                  onClick={() => {
                    setActiveFilter(filter);
                    const nextTea = teas.find((tea) => filter === "All" || tea.family === filter);
                    if (nextTea) setSelectedTea(nextTea);
                  }}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="tea-catalogue-stage">
            <aside className={`tea-curator-panel tea-${selectedTea.palette}`}>
              <div className="tea-liquor-study" aria-hidden="true">
                <span className="tea-cup-steam" />
                <span className="tea-cup-rim" />
                <span className="tea-cup-liquor" style={{ backgroundColor: selectedTea.liquor }} />
                <span className="tea-cup-body" />
              </div>
              <p className="museum-kicker">Selected Tea / 選中茶品</p>
              <h3>{selectedTea.name}</h3>
              <strong lang="zh-Hant">{selectedTea.chinese}</strong>
              <p>{selectedTea.note}</p>
              <dl>
                <div>
                  <dt>Origin</dt>
                  <dd>{selectedTea.origin}</dd>
                </div>
                <div>
                  <dt>Aroma</dt>
                  <dd>{selectedTea.aroma}</dd>
                </div>
                <div>
                  <dt>Ritual</dt>
                  <dd>{selectedTea.ritual}</dd>
                </div>
              </dl>
            </aside>

            <div className="tea-scroll-gallery">
              {visibleTeas.map((tea, index) => (
                <article
                  id={tea.slug}
                  key={tea.slug}
                  className={`tea-leaf-card tea-${tea.palette} ${selectedTea.slug === tea.slug ? "is-selected" : ""}`}
                >
                  <button type="button" className="tea-leaf-select" onClick={() => setSelectedTea(tea)}>
                    <span className="leaf-specimen" aria-hidden="true">
                      <span className="leaf-dish" />
                      <span className="leaf leaf-one" />
                      <span className="leaf leaf-two" />
                      <span className="leaf leaf-three" />
                      <span className="leaf leaf-four" />
                      <em>{String(index + 1).padStart(2, "0")}</em>
                    </span>
                    <span className="tea-liquor-dot" style={{ backgroundColor: tea.liquor }} aria-hidden="true" />
                    <span className="tea-leaf-copy">
                      <span>{tea.family}</span>
                      <h2>{tea.name}</h2>
                      <strong lang="zh-Hant">{tea.chinese}</strong>
                      <dl>
                        <div>
                          <dt>Dry Leaf</dt>
                          <dd>{tea.look}</dd>
                        </div>
                        <div>
                          <dt>Process</dt>
                          <dd>{tea.process}</dd>
                        </div>
                        <div>
                          <dt>Taste</dt>
                          <dd>{tea.taste}</dd>
                        </div>
                        <div>
                          <dt>Cultural Note</dt>
                          <dd>{tea.note}</dd>
                        </div>
                      </dl>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
