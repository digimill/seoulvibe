import type { MetadataRoute } from "next";
import { getAreas, getKorea101, getThemes, getTips } from "@/lib/content";
import { LANGS, type Lang } from "@/lib/i18n";
import { problemSeoItems } from "@/lib/problem-seo";
import { getSiteUrl } from "@/lib/site";
import { TOOL_IDS } from "@/lib/tools";
import { TRAVEL_AREA_IDS } from "@/lib/travel-ia";

export const dynamic = "force-dynamic";

const TOP_LEVEL_PATHS = ["", "/plan", "/now", "/areas", "/themes", "/tips", "/korea-101", "/tools", "/crowded", "/problems", "/kiosk-card-rejected", "/how-much-tmoney", "/olive-young-tourist-guide"] as const;

const PLAN_SUB_PATHS = ["/where-to-stay", "/3-day-template", "/airport-to-city", "/daily-budget"] as const;
const NOW_SUB_PATHS = ["/kiosk", "/card-payment", "/subway-help", "/t-money", "/crowd-escape", "/spend-log"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const urls: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    for (const topPath of TOP_LEVEL_PATHS) {
      urls.push({
        url: `${siteUrl}/${lang}${topPath}`,
        changeFrequency: "weekly",
        priority: topPath === "" ? 1 : 0.8,
      });
    }

    urls.push(
      ...PLAN_SUB_PATHS.map((path) => ({
        url: `${siteUrl}/${lang}/plan${path}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...NOW_SUB_PATHS.map((path) => ({
        url: `${siteUrl}/${lang}/now${path}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...TOOL_IDS.map((tool) => ({
        url: `${siteUrl}/${lang}/tools/${tool}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...TRAVEL_AREA_IDS.map((areaId) => ({
        url: `${siteUrl}/${lang}/areas/${areaId}`,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    );

    const [areas, themes, tips, korea101] = await Promise.all([
      getAreas(lang as Lang),
      getThemes(lang as Lang),
      getTips(lang as Lang),
      getKorea101(lang as Lang),
    ]);

    urls.push(
      ...areas.map((item) => ({
        url: `${siteUrl}/${lang}/areas/${item.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...themes.map((item) => ({
        url: `${siteUrl}/${lang}/themes/${item.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...tips.map((item) => ({
        url: `${siteUrl}/${lang}/tips/${item.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...korea101.map((item) => ({
        url: `${siteUrl}/${lang}/korea-101/${item.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  }

  for (const lang of LANGS) {
    urls.push(
      ...problemSeoItems.map((item) => ({
        url: `${siteUrl}/${lang}/problems/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    );
  }

  return urls;
}
