import type { MetadataRoute } from "next";
import { getAreas, getKorea101, getThemes, getTips } from "@/lib/content";
import { LANGS, type Lang } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const TOP_LEVEL_PATHS = ["", "/areas", "/themes", "/tips", "/korea-101"] as const;

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

  return urls;
}

