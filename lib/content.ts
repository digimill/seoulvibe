import { readFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type { Area, ContentImage, Korea101, LocaleContent, Theme, Tip } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

const FALLBACK_IMAGE: ContentImage = {
  src: "/images/hero-seoul.jpg",
  alt: "Seoul city skyline",
};

function getContentPath(lang: Lang): string {
  return path.join(process.cwd(), "data", lang, "content.json");
}

function getLegacyPath(lang: Lang, kind: "areas" | "themes" | "tips"): string {
  return path.join(process.cwd(), "data", lang, `${kind}.json`);
}

function onlyPublished<T extends { status?: string }>(items: T[]): T[] {
  return items.filter((item) => !item.status || item.status === "published");
}

function createFallbackImage(src: string, alt: string): ContentImage {
  return { src, alt };
}

function loadLegacyAreasImage(area: Area): ContentImage {
  return createFallbackImage(`/images/areas/${area.id}.jpg`, `${area.name} in Seoul`);
}

function loadLegacyThemesImage(theme: Theme): ContentImage {
  return createFallbackImage(`/images/themes/${theme.id}.jpg`, `${theme.title} in Seoul`);
}

function loadLegacyTipsImage(tip: Tip): ContentImage {
  return createFallbackImage(`/images/tips/${tip.id}.jpg`, `${tip.title} in Seoul`);
}

async function loadLegacyContent(lang: Lang): Promise<LocaleContent> {
  const [areasRaw, themesRaw, tipsRaw] = await Promise.all([
    readFile(getLegacyPath(lang, "areas"), "utf-8"),
    readFile(getLegacyPath(lang, "themes"), "utf-8"),
    readFile(getLegacyPath(lang, "tips"), "utf-8"),
  ]);

  const legacyAreas = JSON.parse(areasRaw) as Area[];
  const legacyThemes = JSON.parse(themesRaw) as Theme[];
  const legacyTips = JSON.parse(tipsRaw) as Tip[];

  return {
    hero: FALLBACK_IMAGE,
    areas: legacyAreas.map((area) => ({ ...area, image: area.image ?? loadLegacyAreasImage(area) })),
    themes: legacyThemes.map((theme) => ({ ...theme, image: theme.image ?? loadLegacyThemesImage(theme) })),
    tips: legacyTips.map((tip) => ({ ...tip, image: tip.image ?? loadLegacyTipsImage(tip) })),
    korea101: [],
  };
}

async function loadContent(lang: Lang): Promise<LocaleContent> {
  noStore();

  try {
    const raw = await readFile(getContentPath(lang), "utf-8");
    const parsed = JSON.parse(raw) as LocaleContent;

    return {
      hero: parsed.hero,
      areas: Array.isArray(parsed.areas) ? parsed.areas : [],
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      korea101: Array.isArray(parsed.korea101) ? parsed.korea101 : [],
    };
  } catch {
    try {
      return await loadLegacyContent(lang);
    } catch {
      return {
        hero: FALLBACK_IMAGE,
        areas: [],
        themes: [],
        tips: [],
        korea101: [],
      };
    }
  }
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[], base: T[]): T[] {
  const primaryMap = new Map(primary.map((item) => [item.id, item]));
  const secondaryMap = new Map(secondary.map((item) => [item.id, item]));
  const baseMap = new Map(base.map((item) => [item.id, item]));

  const orderedIds = Array.from(new Set([...base.map((item) => item.id), ...secondary.map((item) => item.id), ...primary.map((item) => item.id)]));

  return orderedIds
    .map((id) => primaryMap.get(id) ?? secondaryMap.get(id) ?? baseMap.get(id))
    .filter((item): item is T => Boolean(item));
}

async function loadContentAligned(lang: Lang): Promise<LocaleContent> {
  const [primary, english, korean] = await Promise.all([loadContent(lang), loadContent("en"), loadContent("ko")]);
  const secondary = lang === "en" ? korean : english;

  return {
    hero: primary.hero ?? secondary.hero ?? korean.hero ?? FALLBACK_IMAGE,
    areas: mergeById(primary.areas, secondary.areas, korean.areas),
    themes: mergeById(primary.themes, secondary.themes, korean.themes),
    tips: mergeById(primary.tips, secondary.tips, korean.tips),
    korea101: mergeById(primary.korea101, secondary.korea101, korean.korea101),
  };
}

export async function getHeroImage(lang: Lang): Promise<ContentImage> {
  const content = await loadContentAligned(lang);
  return content.hero ?? FALLBACK_IMAGE;
}

export async function getAreas(lang: Lang): Promise<Area[]> {
  const content = await loadContentAligned(lang);
  return onlyPublished(content.areas).map((area) => ({
    ...area,
    image: area.image ?? FALLBACK_IMAGE,
  }));
}

export async function getThemes(lang: Lang): Promise<Theme[]> {
  const content = await loadContentAligned(lang);
  return onlyPublished(content.themes).map((theme) => ({
    ...theme,
    image: theme.image ?? FALLBACK_IMAGE,
  }));
}

export async function getTips(lang: Lang): Promise<Tip[]> {
  const content = await loadContentAligned(lang);
  return onlyPublished(content.tips).map((tip) => ({
    ...tip,
    image: tip.image ?? FALLBACK_IMAGE,
  }));
}

export async function getKorea101(lang: Lang): Promise<Korea101[]> {
  const content = await loadContentAligned(lang);
  return onlyPublished(content.korea101).map((item) => ({
    ...item,
    image: item.image ?? FALLBACK_IMAGE,
  }));
}
