import type { Area, Theme, Tip } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";
import spotImageMap from "@/data/spot-images.json";

export type CuratedSpot = {
  name: string;
  href: string;
  source: "area" | "theme" | "tip";
  sourceTitle: string;
  note: string;
  image?: { src: string; alt: string };
  photoQuery: string;
};

export function buildCuratedSpots(areas: Area[], themes: Theme[], tips: Tip[], limit = 9): CuratedSpot[] {
  const spots: CuratedSpot[] = [
    ...areas.flatMap((area) =>
      (area.real_spots ?? []).map((spot) => {
        const link = toSpotLink(spot);
        return {
          ...link,
          source: "area" as const,
          sourceTitle: area.name,
          note: area.hook ?? area.summary,
          image: resolveSpotImage(link.name) ?? area.image,
          photoQuery: `${link.name} Seoul`,
        };
      }),
    ),
    ...themes.flatMap((theme) =>
      (theme.real_spots ?? []).map((spot) => {
        const link = toSpotLink(spot);
        return {
          ...link,
          source: "theme" as const,
          sourceTitle: theme.title,
          note: theme.highlight ?? theme.summary,
          image: resolveSpotImage(link.name) ?? theme.image,
          photoQuery: `${link.name} Seoul`,
        };
      }),
    ),
    ...tips.flatMap((tip) =>
      (tip.real_spots ?? []).map((spot) => {
        const link = toSpotLink(spot);
        return {
          ...link,
          source: "tip" as const,
          sourceTitle: tip.title,
          note: tip.quick_fix ?? tip.summary,
          image: resolveSpotImage(link.name) ?? tip.image,
          photoQuery: `${link.name} Seoul`,
        };
      }),
    ),
  ];

  return spots
    .filter((spot, index, arr) => arr.findIndex((item) => item.name === spot.name) === index)
    .slice(0, limit);
}

function resolveSpotImage(spotName: string): { src: string; alt: string } | undefined {
  const src = spotImageMap[spotName as keyof typeof spotImageMap];
  if (!src) return undefined;
  return { src, alt: `${spotName} in Seoul` };
}

export function getPlacesLanguageCode(lang: Lang): string {
  if (lang === "ko") return "ko";
  if (lang === "ja") return "ja";
  if (lang === "zh-cn") return "zh-CN";
  if (lang === "zh-tw") return "zh-TW";
  if (lang === "zh-hk") return "zh-HK";
  return "en";
}
