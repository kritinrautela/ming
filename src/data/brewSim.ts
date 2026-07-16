export type BrewNote = { en: string; zh: string };

export type BrewVerdictKey = "under" | "ideal" | "over" | "scorched";

export type SimTea = {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  categoryZh: string;
  origin: string;
  originZh: string;
  /** Dry-leaf swatch gradient for the picker. */
  leafSwatch: [string, string];
  /** Liquor colour ramp from first colour (barely steeped) to last (over-steeped). */
  liquorStops: string[];
  /** Water temperature the leaf asks for, in °C. */
  idealTemp: number;
  /** Above this the leaf cooks instead of opening. Null for teas that take a full boil. */
  scorchTemp: number | null;
  /** Seconds to reach a balanced first infusion at ideal temperature with a standard dose. */
  baseTime: number;
  /** How many infusions the leaf gives before it is spent. */
  maxInfusions: number;
  aroma: BrewNote;
  notes: Record<BrewVerdictKey, BrewNote>;
};

export type SimVessel = {
  id: "gaiwan" | "yixing" | "glass";
  name: string;
  nameZh: string;
  /** Heat lost per second of steeping, in °C. */
  coolRate: number;
  /** Extraction multiplier — clay holds heat and rounds the brew. */
  extraction: number;
  character: BrewNote;
};

export const simVessels: SimVessel[] = [
  {
    id: "gaiwan",
    name: "Gaiwan",
    nameZh: "蓋碗",
    coolRate: 0.12,
    extraction: 1,
    character: {
      en: "Lid, bowl, and saucer. Honest and precise — the vessel that hides nothing.",
      zh: "蓋、碗、托。誠實而精準——甚麼都藏不住的器具。"
    }
  },
  {
    id: "yixing",
    name: "Yixing clay pot",
    nameZh: "紫砂壺",
    coolRate: 0.06,
    extraction: 1.12,
    character: {
      en: "Unglazed zisha clay holds its heat and rounds the edges of the brew.",
      zh: "無釉紫砂能鎖住溫度，讓茶湯的稜角變得圓潤。"
    }
  },
  {
    id: "glass",
    name: "Glass pot",
    nameZh: "玻璃壺",
    coolRate: 0.16,
    extraction: 0.94,
    character: {
      en: "Cools quickly, but lets you watch the leaf unfurl — the beginner's teacher.",
      zh: "散熱較快，但能看著茶葉舒展——初學者的老師。"
    }
  }
];

export const simTeas: SimTea[] = [
  {
    id: "longjing",
    name: "Longjing",
    nameZh: "龍井",
    category: "Green tea",
    categoryZh: "綠茶",
    origin: "Hangzhou, Zhejiang",
    originZh: "浙江杭州",
    leafSwatch: ["#7a8a52", "#4c5c33"],
    liquorStops: ["#f2efd7", "#e5e3b2", "#d3d284", "#b7b95f", "#8f9347"],
    idealTemp: 80,
    scorchTemp: 88,
    baseTime: 45,
    maxInfusions: 4,
    aroma: {
      en: "Toasted chestnut, fresh soybean, spring rain on stone.",
      zh: "炒栗、鮮豆香，春雨落在石上的氣息。"
    },
    notes: {
      under: {
        en: "Thin and shy — the chestnut sweetness has not opened yet. Give the next pour a little more time.",
        zh: "偏薄、含蓄——栗香的甜味還未打開。下一泡多給一點時間。"
      },
      ideal: {
        en: "Jade-pale and sweet, chestnut first, then a cool green finish. This is Longjing in balance.",
        zh: "湯色如玉、入口回甘，先是栗香，後是清涼的綠意。這就是平衡的龍井。"
      },
      over: {
        en: "Grassy bitterness has crept over the sweetness. Shorter steeps let this leaf stay gentle.",
        zh: "青澀的苦味蓋過了甜。縮短浸泡，讓這片葉子保持溫柔。"
      },
      scorched: {
        en: "The water was too hot — the young leaf cooked, and the brew turned dull and vegetal. Try 80°C.",
        zh: "水太熱了——嫩葉被燙熟，茶湯變得沉悶帶菜味。試試 80°C。"
      }
    }
  },
  {
    id: "baimudan",
    name: "White Peony",
    nameZh: "白牡丹",
    category: "White tea",
    categoryZh: "白茶",
    origin: "Fuding, Fujian",
    originZh: "福建福鼎",
    leafSwatch: ["#a8a184", "#6e6a52"],
    liquorStops: ["#f6f0da", "#efe1b4", "#e3cc8b", "#d0b169", "#b3924e"],
    idealTemp: 85,
    scorchTemp: 93,
    baseTime: 60,
    maxInfusions: 5,
    aroma: {
      en: "Dried apricot, white flowers, warm hay in late sun.",
      zh: "杏乾、白花香，午後暖陽下的乾草味。"
    },
    notes: {
      under: {
        en: "Barely more than scented water. White tea is patient — let it sit longer than feels polite.",
        zh: "只比帶香的水多一點。白茶講耐性——讓它泡得比你以為的更久。"
      },
      ideal: {
        en: "Champagne-gold, quietly sweet, apricot and hay unfolding slowly. Nothing loud, everything present.",
        zh: "香檳金的湯色，安靜的甜，杏與乾草緩緩展開。不喧嘩，卻樣樣都在。"
      },
      over: {
        en: "A drying edge appears past the sweetness. Still drinkable — white tea forgives — but pull it earlier.",
        zh: "甜味之後出現乾澀。仍能入口——白茶寬容——但下次早一點出湯。"
      },
      scorched: {
        en: "Boiling water flattened the downy sweetness into stew. Keep it under 90°C for the buds' sake.",
        zh: "沸水把毫香的甜燙成了悶味。為了芽頭，請保持 90°C 以下。"
      }
    }
  },
  {
    id: "tieguanyin",
    name: "Tieguanyin",
    nameZh: "鐵觀音",
    category: "Oolong tea",
    categoryZh: "烏龍茶",
    origin: "Anxi, Fujian",
    originZh: "福建安溪",
    leafSwatch: ["#4d6b45", "#2e4630"],
    liquorStops: ["#f2eec9", "#e9e2a3", "#ddd07d", "#c9b95e", "#a89a4b"],
    idealTemp: 95,
    scorchTemp: null,
    baseTime: 40,
    maxInfusions: 6,
    aroma: {
      en: "Orchid, fresh cream, mountain air after mist.",
      zh: "蘭花、鮮奶油，霧散後的山間空氣。"
    },
    notes: {
      under: {
        en: "The orchid is only a rumour. Rolled leaves need heat and a few more breaths to open.",
        zh: "蘭香只是傳聞。緊結的球形葉需要熱度，也需要多幾口呼吸的時間。"
      },
      ideal: {
        en: "Orchid rising off a golden-green cup, creamy body, a finish that keeps returning. The iron goddess, awake.",
        zh: "金綠色的杯面升起蘭香，湯感如乳，餘韻不斷回來。鐵觀音，醒了。"
      },
      over: {
        en: "The florals turned sharp and the body thinned. Tieguanyin rewards short, hot, frequent steeps.",
        zh: "花香變得尖銳，湯感轉薄。鐵觀音喜歡又快、又熱、又頻密的沖泡。"
      },
      scorched: {
        en: "This leaf takes a full boil without complaint.",
        zh: "這款茶葉可以承受滾水，毫無怨言。"
      }
    }
  },
  {
    id: "dahongpao",
    name: "Da Hong Pao",
    nameZh: "大紅袍",
    category: "Rock oolong",
    categoryZh: "岩茶",
    origin: "Wuyi Mountains, Fujian",
    originZh: "福建武夷山",
    leafSwatch: ["#5c4433", "#33261c"],
    liquorStops: ["#f0dfba", "#e2bd7f", "#cd9755", "#b4753a", "#8f5527"],
    idealTemp: 98,
    scorchTemp: null,
    baseTime: 30,
    maxInfusions: 7,
    aroma: {
      en: "Roasted stone, dark caramel, orchid buried in minerals.",
      zh: "焙火岩韻、深色焦糖，藏在礦物之下的蘭香。"
    },
    notes: {
      under: {
        en: "Only the roast shows; the rock beneath it hasn't spoken. Wuyi leaf wants boiling water and nerve.",
        zh: "只嚐到焙火，岩石深處還未開口。武夷茶要滾水，也要膽量。"
      },
      ideal: {
        en: "Amber and mineral, caramel over wet stone, the long yan yun finish the cliffs are famous for.",
        zh: "琥珀與礦感，濕石上的焦糖，還有武夷山崖聞名的悠長岩韻。"
      },
      over: {
        en: "Tar and char lean over the caramel. Big leaf, big roast — but it still asks you to pour on time.",
        zh: "焦味與炭味壓過了焦糖。葉大火重——但它仍要求你準時出湯。"
      },
      scorched: {
        en: "Rock tea laughs at boiling water.",
        zh: "岩茶對滾水一笑置之。"
      }
    }
  },
  {
    id: "dianhong",
    name: "Dianhong",
    nameZh: "滇紅",
    category: "Black tea",
    categoryZh: "紅茶",
    origin: "Yunnan",
    originZh: "雲南",
    leafSwatch: ["#6b4226", "#3c2415"],
    liquorStops: ["#f3ddb0", "#e4b271", "#d18b45", "#b3652c", "#8a481f"],
    idealTemp: 92,
    scorchTemp: null,
    baseTime: 25,
    maxInfusions: 5,
    aroma: {
      en: "Malt, sweet potato, a low note of dark honey.",
      zh: "麥芽、蜜薯，一縷低沉的黑蜜香。"
    },
    notes: {
      under: {
        en: "Sweet water with a promise of malt. Golden buds give quickly — but not this quickly.",
        zh: "帶著麥芽承諾的甜水。金芽出湯很快——但沒有這麼快。"
      },
      ideal: {
        en: "Copper-bright, malt and honey with no astringency at all. Yunnan sun in a small cup.",
        zh: "湯色亮如紅銅，麥芽與蜜香，毫無澀感。一小杯裡的雲南陽光。"
      },
      over: {
        en: "Tannin has tightened the honey into leather. Dianhong is generous, but it counts the seconds.",
        zh: "單寧把蜜香收緊成皮革味。滇紅慷慨，但它在數著秒。"
      },
      scorched: {
        en: "Black tea stands up to the kettle at a full roll.",
        zh: "紅茶經得起大滾的水。"
      }
    }
  },
  {
    id: "shoupuerh",
    name: "Shou Pu-erh",
    nameZh: "熟普洱",
    category: "Dark tea",
    categoryZh: "黑茶",
    origin: "Menghai, Yunnan",
    originZh: "雲南勐海",
    leafSwatch: ["#4a3527", "#241a12"],
    liquorStops: ["#dbb98a", "#b07f4c", "#84512a", "#5c331a", "#3a1f10"],
    idealTemp: 100,
    scorchTemp: null,
    baseTime: 20,
    maxInfusions: 8,
    aroma: {
      en: "Forest floor, aged wood, dark dates and cellar air.",
      zh: "森林地表、陳年木質，黑棗與窖藏的氣息。"
    },
    notes: {
      under: {
        en: "Thin mahogany water. Ripe pu-erh has decades of patience — it expects a little of yours.",
        zh: "偏薄的紅木色茶水。熟普有數十年的耐性——它也期待你的一點點。"
      },
      ideal: {
        en: "Deep garnet, thick and smooth, dates and old wood with a clean sweet tail. The cellar opens.",
        zh: "深石榴紅，湯感稠滑，棗香與陳木之後是乾淨的甜尾。窖藏打開了。"
      },
      over: {
        en: "Ink-dark and heavy — muddy rather than deep. Even the oldest leaf keeps a schedule.",
        zh: "濃黑而沉重——是濁，不是深。再老的葉子也有它的時刻表。"
      },
      scorched: {
        en: "Only a hard boil wakes leaf this dark.",
        zh: "只有滾透的水才叫得醒這麼深色的葉子。"
      }
    }
  }
];

/** Dose presets in grams for a standard ~120ml gongfu vessel. */
export const dosePresets = [
  { grams: 3.5, label: { en: "Light", zh: "輕量" } },
  { grams: 5, label: { en: "Standard", zh: "標準" } },
  { grams: 7, label: { en: "Generous", zh: "厚量" } }
] as const;

/**
 * Per-infusion extraction multipliers. The second and third steeps run faster
 * because the leaf is already open; later steeps slow down as it spends itself.
 */
export function infusionRate(infusion: number): number {
  const curve = [1, 1.25, 1.15, 0.92, 0.74, 0.6, 0.48, 0.4];
  return curve[Math.min(infusion - 1, curve.length - 1)];
}

/** Suggested steep time in seconds for a given infusion of a tea. */
export function suggestedTime(tea: SimTea, infusion: number): number {
  return Math.round(tea.baseTime / infusionRate(infusion));
}

/**
 * Arrhenius-flavoured temperature factor: extraction roughly doubles for every
 * +10°C over the leaf's ideal temperature and halves for every -10°C under it.
 */
export function tempFactor(temp: number, idealTemp: number): number {
  return Math.pow(2, (temp - idealTemp) / 10);
}

export const IDEAL_WINDOW: [number, number] = [0.82, 1.18];

export function verdictFor(strength: number, scorched: boolean): BrewVerdictKey {
  if (scorched) return "scorched";
  if (strength < IDEAL_WINDOW[0]) return "under";
  if (strength > IDEAL_WINDOW[1]) return "over";
  return "ideal";
}

/** Interpolate the liquor colour ramp by brew strength (0 → ~1.6). */
export function liquorColor(stops: string[], strength: number): string {
  const clamped = Math.max(0, Math.min(strength / 1.5, 1));
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(Math.floor(scaled), stops.length - 2);
  const f = scaled - i;
  return mixHex(stops[i], stops[i + 1], f);
}

export function mixHex(a: string, b: string, f: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const ch = (x: number, y: number) => Math.round(x + (y - x) * f);
  return `#${[ch(pa[0], pb[0]), ch(pa[1], pb[1]), ch(pa[2], pb[2])]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
