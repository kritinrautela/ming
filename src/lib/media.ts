const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const publicBasePath = configuredBasePath.replace(/\/$/, "");

export const audioAssets = {
  singingBowl: "/audio/singing-bowl.mp3",
  teaPour: "/audio/tea-pour.mp3",
  boilingWater: "/audio/boiling-water.mp3",
  gardenRain: "/audio/garden-rain.mp3",
  bambooWind: "/audio/bamboo-wind.mp3",
  templeBell: "/audio/temple-bell.mp3",
  teaRoomAmbient: "/audio/tea-room-ambient.mp3"
} as const;

export const videoAssets = {
  chazenHomeHero: "/videos/chazen-home-hero.mp4",
  chazenRitualFilm: "/video/chazen-ritual-film.mp4",
  gaiwanRitual: "/video/gaiwan-ritual.mp4",
  dianCha: "/video/dian-cha.mp4",
  stillnessRoom: "/video/stillness-room.mp4"
} as const;

export const expectedMediaAssets = [
  ...Object.values(audioAssets),
  ...Object.values(videoAssets)
] as const;

export function withBasePath(path: string) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!publicBasePath) return normalizedPath;
  if (normalizedPath === publicBasePath || normalizedPath.startsWith(`${publicBasePath}/`)) {
    return normalizedPath;
  }

  return `${publicBasePath}${normalizedPath}`;
}
