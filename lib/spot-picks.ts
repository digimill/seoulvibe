import spotPicksKo from "@/data/spot-picks.ko.json";
import spotPicksEn from "@/data/spot-picks.en.json";
import spotPicksJa from "@/data/spot-picks.ja.json";
import spotPicksZhCn from "@/data/spot-picks.zh-cn.json";
import spotPicksZhTw from "@/data/spot-picks.zh-tw.json";
import spotPicksZhHk from "@/data/spot-picks.zh-hk.json";
import type { Lang } from "@/lib/i18n";

export type SpotPick = {
  id: string;
  area: string;
  name: string;
  summary: string;
  price: string;
  closed: string;
  map_query: string;
};

export function getSpotPicks(_lang: Lang): SpotPick[] {
  if (_lang === "en") return spotPicksEn as SpotPick[];
  if (_lang === "ja") return spotPicksJa as SpotPick[];
  if (_lang === "zh-cn") return spotPicksZhCn as SpotPick[];
  if (_lang === "zh-tw") return spotPicksZhTw as SpotPick[];
  if (_lang === "zh-hk") return spotPicksZhHk as SpotPick[];
  return spotPicksKo as SpotPick[];
}

export function pickRandomSpots<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function toGoogleMapSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} Seoul`)}`;
}

export function toPerplexitySearchUrl(query: string, lang: Lang): string {
  const languageHints: Record<Lang, string> = {
    ko: "한국어로 검색하고 한국어로 답변",
    en: "Search in English and answer in English",
    ja: "日本語で検索して日本語で回答",
    "zh-cn": "请用简体中文搜索并用简体中文回答",
    "zh-tw": "請用繁體中文搜尋並用繁體中文回答",
    "zh-hk": "請用繁體中文（香港）搜尋並以繁體中文（香港）回答",
  };

  return `https://www.perplexity.ai/search?q=${encodeURIComponent(`${query} ${languageHints[lang]}`)}`;
}
