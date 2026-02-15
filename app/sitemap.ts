import type { MetadataRoute } from "next";
import { getAreas, getKorea101, getThemes, getTips } from "@/lib/content";
import { LANGS, type Lang } from "@/lib/i18n";
import { problemSeoItems } from "@/lib/problem-seo";
import { getSiteUrl } from "@/lib/site";
import { TOOL_IDS } from "@/lib/tools";

export const dynamic = "force-dynamic";

const TOP_LEVEL_PATHS = ["", "/areas", "/themes", "/tips", "/korea-101", "/tools", "/quick-picks", "/crowded", "/problems", "/kiosk-card-rejected", "/how-much-tmoney", "/olive-young-tourist-guide"] as const;

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
      ...TOOL_IDS.map((tool) => ({
        url: `${siteUrl}/${lang}/tools/${tool}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
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
