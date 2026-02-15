"use client";

import { useEffect, useMemo, useState } from "react";
import anchorsData from "@/data/anchors.json";
import copyBlocks from "@/data/copy_blocks.json";
import picksData from "@/data/picks.json";
import type { Lang } from "@/lib/i18n";

type Area = "Hongdae" | "Seongsu" | "Bukchon" | "Gangnam" | "Euljiro";
type Mood = "Eat" | "Coffee" | "Walk" | "Quiet" | "Night" | "Local" | "Unique";
type WithType = "Solo" | "Couple" | "Friends" | "Family";

type PickTemplate = {
  id: string;
  area: Area | "Global";
  moods: Mood[];
  with: WithType[];
  title: { en: string; ko: string };
  whyNow?: { en: string; ko: string };
  doText: { en: string; ko: string };
  risk: { en: string; ko: string };
  planB: { en: string; ko: string };
  mapQuery: { en: string; ko: string };
  anchor?: { en: string; ko: string };
};

type LegacyPick = {
  area: string;
  mood: string;
  companions: string[];
  title: string;
  why_now?: string;
  do: string;
  risk: string;
  plan_b: string;
  map_query: string;
};

type KoEntryPick = {
  area: { id: string; ko?: string; en?: string };
  mood: { id: string; ko?: string; en?: string };
  with: { id: string; ko?: string; en?: string };
  anchor?: { label_ko?: string; label_en?: string; map_query_ko?: string; map_query_en?: string };
  title_ko?: string;
  title_en?: string;
  why_now_ko?: string;
  do_ko?: string;
  risk_ko?: string;
  plan_b_ko?: string;
  map_query_ko?: string;
  map_query_en?: string;
};

type KoDataset = { meta?: unknown; entries?: KoEntryPick[] };

type OutputCard = {
  id: string;
  title: string;
  whyNow: string;
  doThis: string;
  watchOut: string;
  planB: string;
  mapQuery: string;
  mapsUrl: string;
};

const AREAS: Area[] = ["Hongdae", "Seongsu", "Bukchon", "Gangnam", "Euljiro"];
const MOODS: Mood[] = ["Eat", "Coffee", "Walk", "Quiet", "Night", "Local", "Unique"];
const WITH_TYPES: WithType[] = ["Solo", "Couple", "Friends", "Family"];

const anchors = anchorsData as Record<string, Record<string, string[]>>;

function isArea(value: string): value is Area {
  return AREAS.includes(value as Area);
}

function isMood(value: string): value is Mood {
  return MOODS.includes(value as Mood);
}

function isWith(value: string): value is WithType {
  return WITH_TYPES.includes(value as WithType);
}

function normalizeLegacyPick(item: LegacyPick, index: number): PickTemplate | null {
  if (!isArea(item.area) || !isMood(item.mood)) return null;
  const companions = (item.companions ?? []).filter(isWith);
  if (companions.length === 0) return null;

  return {
    id: `legacy-${index}`,
    area: item.area,
    moods: [item.mood],
    with: companions,
    title: { en: item.title, ko: item.title },
    whyNow: item.why_now ? { en: item.why_now, ko: item.why_now } : undefined,
    doText: { en: item.do, ko: item.do },
    risk: { en: item.risk, ko: item.risk },
    planB: { en: item.plan_b, ko: item.plan_b },
    mapQuery: { en: item.map_query, ko: item.map_query },
  };
}

function normalizeKoEntry(item: KoEntryPick, index: number): PickTemplate | null {
  const areaId = item.area?.id;
  const moodId = item.mood?.id;
  const withId = item.with?.id;
  if (!areaId || !moodId || !withId) return null;
  if (!isArea(areaId) || !isMood(moodId) || !isWith(withId)) return null;

  const koAnchor = item.anchor?.label_ko ?? item.anchor?.map_query_ko ?? item.map_query_ko ?? "";
  const enAnchor = item.anchor?.label_en ?? item.anchor?.map_query_en ?? item.map_query_en ?? koAnchor;

  return {
    id: `ko-${index}`,
    area: areaId,
    moods: [moodId],
    with: [withId],
    title: {
      en: item.title_en ?? item.title_ko ?? `${enAnchor} pick`,
      ko: item.title_ko ?? item.title_en ?? `${koAnchor} 픽`,
    },
    whyNow: item.why_now_ko ? { en: item.why_now_ko, ko: item.why_now_ko } : undefined,
    doText: {
      en: item.do_ko ?? "Move now and pick a low-wait option.",
      ko: item.do_ko ?? "지금 이동해 대기 짧은 선택지를 고르세요.",
    },
    risk: {
      en: item.risk_ko ?? "Queue risk can increase.",
      ko: item.risk_ko ?? "대기 위험이 커질 수 있어요.",
    },
    planB: {
      en: item.plan_b_ko ?? "Switch one block away.",
      ko: item.plan_b_ko ?? "한 블록 옆으로 이동해 재선택.",
    },
    mapQuery: {
      en: item.map_query_en ?? item.map_query_ko ?? enAnchor,
      ko: item.map_query_ko ?? item.map_query_en ?? koAnchor,
    },
    anchor: {
      en: enAnchor,
      ko: koAnchor,
    },
  };
}

function buildPicks(data: unknown): PickTemplate[] {
  if (Array.isArray(data)) {
    return data
      .map((item, index) => normalizeLegacyPick(item as LegacyPick, index))
      .filter((x): x is PickTemplate => x !== null);
  }

  const obj = data as KoDataset;
  if (obj && Array.isArray(obj.entries)) {
    return obj.entries
      .map((item, index) => normalizeKoEntry(item, index))
      .filter((x): x is PickTemplate => x !== null);
  }

  return [];
}

const picks = buildPicks(picksData);

const GLOBAL_FALLBACK: PickTemplate[] = [
  {
    id: "global-seat-first",
    area: "Global",
    moods: ["Eat", "Local"],
    with: ["Solo", "Couple", "Friends", "Family"],
    title: { en: "Seat-first meal near {anchor}", ko: "{anchor} 주변 좌석 우선 식사" },
    doText: { en: "Pick the first place with open seats now.", ko: "지금 빈자리가 보이는 곳으로 먼저 들어가세요." },
    risk: { en: "Top-ranked spots can waste time.", ko: "상위 랭크 매장은 대기로 시간 손실이 큽니다." },
    planB: { en: "Move one street away and retry once.", ko: "한 블록 옆으로 이동해 한 번만 재시도하세요." },
    mapQuery: { en: "{anchor} seoul local restaurant", ko: "{anchor} 현지 식당" },
  },
  {
    id: "global-coffee-reset",
    area: "Global",
    moods: ["Coffee", "Quiet"],
    with: ["Solo", "Couple", "Friends"],
    title: { en: "Quick reset near {anchor}", ko: "{anchor} 근처 빠른 리셋" },
    doText: { en: "Take one calm cafe break for 20 minutes.", ko: "20분만 조용한 카페에서 쉬고 이동하세요." },
    risk: { en: "Popular cafes can stall.", ko: "인기 카페는 대기가 길어질 수 있어요." },
    planB: { en: "Choose a non-signature cafe nearby.", ko: "시그니처 아닌 근처 카페로 전환하세요." },
    mapQuery: { en: "{anchor} seoul quiet cafe", ko: "{anchor} 조용한 카페" },
  },
  {
    id: "global-walk-short",
    area: "Global",
    moods: ["Walk", "Unique", "Quiet"],
    with: ["Solo", "Couple", "Friends", "Family"],
    title: { en: "Short low-regret walk at {anchor}", ko: "{anchor} 짧은 저후회 산책" },
    doText: { en: "Do a short loop and stop.", ko: "짧게 한 바퀴만 돌고 멈추세요." },
    risk: { en: "Long loops can break your schedule.", ko: "긴 산책은 일정이 꼬일 수 있어요." },
    planB: { en: "Cut distance and end near station.", ko: "거리를 줄이고 역 근처에서 종료하세요." },
    mapQuery: { en: "{anchor} seoul walk", ko: "{anchor} 산책" },
  },
  {
    id: "global-night-easy",
    area: "Global",
    moods: ["Night", "Unique"],
    with: ["Solo", "Couple", "Friends"],
    title: { en: "Easy night option near {anchor}", ko: "{anchor} 근처 쉬운 야간 선택" },
    doText: { en: "Enter one venue with immediate seats.", ko: "바로 입장 가능한 한 곳만 선택하세요." },
    risk: { en: "Queueing one place kills momentum.", ko: "한 곳 줄서기는 흐름을 끊습니다." },
    planB: { en: "Switch in 10 minutes.", ko: "10분 안에 전환하세요." },
    mapQuery: { en: "{anchor} seoul night spot", ko: "{anchor} 야간 스팟" },
  },
  {
    id: "global-family-safe",
    area: "Global",
    moods: ["Eat", "Walk", "Quiet"],
    with: ["Family"],
    title: { en: "Family-safe route near {anchor}", ko: "{anchor} 가족용 안전 동선" },
    doText: { en: "Keep route short and seat-first.", ko: "짧고 좌석 우선 동선으로 이동하세요." },
    risk: { en: "Overpacked lanes increase fatigue.", ko: "혼잡 구간은 피로도가 급증해요." },
    planB: { en: "Use one short taxi hop.", ko: "짧은 택시 이동 1회로 전환하세요." },
    mapQuery: { en: "{anchor} seoul family", ko: "{anchor} 가족" },
  },
];

function ui(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Quick Picks",
      subtitle: "10초 안에 후회 적은 선택 2~3개를 고릅니다.",
      step1: "1) 지역",
      step2: "2) 지금 기분",
      step3: "3) 함께",
      show: "결과 보기",
      retry: "다시 고르기",
      why: "Why now",
      doThis: "Do this",
      watchOut: "Watch out",
      planB: "Plan B",
      maps: "Open in Maps",
      labels: {
        Hongdae: "홍대",
        Seongsu: "성수",
        Bukchon: "북촌",
        Gangnam: "강남",
        Euljiro: "을지로",
        Eat: "먹기",
        Coffee: "커피",
        Walk: "산책",
        Quiet: "조용히",
        Night: "밤",
        Local: "로컬",
        Unique: "유니크",
        Solo: "혼자",
        Couple: "커플",
        Friends: "친구",
        Family: "가족",
      } as Record<string, string>,
      riskAddon: ["10분 넘으면 바로 바꾸세요.", "역 출구 혼잡 구간은 피하세요.", "같은 구역 안에서만 플랜B를 고르세요."],
    };
  }
  return {
    title: "Quick Picks",
    subtitle: "Shortlist 2-3 low-regret options in under 10 seconds.",
    step1: "1) Area",
    step2: "2) Mood",
    step3: "3) With",
    show: "Show picks",
    retry: "Try again",
    why: "Why now",
    doThis: "Do this",
    watchOut: "Watch out",
    planB: "Plan B",
    maps: "Open in Maps",
    labels: Object.fromEntries([...AREAS, ...MOODS, ...WITH_TYPES].map((x) => [x, x])) as Record<string, string>,
    riskAddon: copyBlocks.risk_addon,
  };
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function getDailySeed() {
  const today = new Date().toISOString().slice(0, 10);
  const key = `sv-quick-picks-seed-${today}`;
  const existing = localStorage.getItem(key);
  if (existing) return `${today}:${existing}`;
  const created = String(Math.floor(Math.random() * 1_000_000_000));
  localStorage.setItem(key, created);
  return `${today}:${created}`;
}

function randomBySeed<T>(items: T[], seedKey: string, salt: string) {
  if (items.length === 0) return null;
  const index = hashString(`${seedKey}:${salt}`) % items.length;
  return items[index] as T;
}

function pickAnchors(area: Area, mood: Mood) {
  return anchors[area]?.[mood] ?? anchors[area]?.default ?? anchors.Other?.default ?? ["nearest station side"];
}

function uniquePush(target: PickTemplate[], items: PickTemplate[]) {
  for (const item of items) {
    if (!target.find((x) => x.id === item.id)) target.push(item);
  }
}

function pickCandidates(area: Area, mood: Mood, withType: WithType) {
  const level1 = picks.filter((item) => item.area === area && item.moods.includes(mood) && item.with.includes(withType));
  const level2 = picks.filter((item) => item.area === area && item.moods.includes(mood));
  const level3 = picks.filter((item) => item.area === area);
  const level4 = GLOBAL_FALLBACK;

  const merged: PickTemplate[] = [];
  uniquePush(merged, level1);
  if (merged.length < 2) uniquePush(merged, level2);
  if (merged.length < 2) uniquePush(merged, level3);
  if (merged.length < 2) uniquePush(merged, level4);
  if (merged.length < 2) uniquePush(merged, GLOBAL_FALLBACK);

  return merged;
}

function emitEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (!w.gtag) return;
  w.gtag("event", name, params ?? {});
}

function optionButton(active: boolean) {
  return `rounded-2xl border px-4 py-4 text-left text-sm font-black transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"}`;
}

function localized(text: { en: string; ko: string }, lang: Lang) {
  return lang === "ko" ? text.ko : text.en;
}

export function QuickPicksTool({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const [area, setArea] = useState<Area | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [withType, setWithType] = useState<WithType | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [seed, setSeed] = useState<string>("");

  useEffect(() => {
    setSeed(getDailySeed());
    emitEvent("quick_picks_open");
  }, []);

  const results = useMemo<OutputCard[]>(() => {
    if (!area || !mood || !withType || !seed) return [];

    const candidates = pickCandidates(area, mood, withType);
    const sorted = [...candidates].sort(
      (a, b) =>
        hashString(`${seed}:${area}:${mood}:${withType}:${a.id}`) -
        hashString(`${seed}:${area}:${mood}:${withType}:${b.id}`),
    );

    const selected = sorted.slice(0, sorted.length >= 3 ? 3 : 2);

    return selected.map((item, index) => {
      const anchorFromRow = item.anchor ? localized(item.anchor, lang) : null;
      const anchor =
        anchorFromRow ??
        randomBySeed(pickAnchors(area, mood), seed, `${item.id}:anchor:${index}`) ??
        "nearest station side";

      const fallbackWhy = randomBySeed(copyBlocks.why_now, seed, `${item.id}:why:${index}`) ?? "Low regret option right now.";
      const whyNow = (lang === "ko" ? item.whyNow?.ko : item.whyNow?.en) ?? fallbackWhy;

      const riskAddon = randomBySeed(t.riskAddon, seed, `${item.id}:risk:${index}`) ?? "";
      const title = localized(item.title, lang).replaceAll("{anchor}", anchor);
      const doThis = localized(item.doText, lang).replaceAll("{anchor}", anchor);
      const mapQuery = localized(item.mapQuery, lang).replaceAll("{anchor}", anchor);
      const watchOutBase = localized(item.risk, lang);

      return {
        id: item.id,
        title,
        whyNow,
        doThis,
        watchOut: riskAddon ? `${watchOutBase} ${riskAddon}` : watchOutBase,
        planB: localized(item.planB, lang),
        mapQuery,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
      };
    });
  }, [area, mood, withType, seed, lang, t.riskAddon]);

  useEffect(() => {
    if (step === 4 && results.length > 0) {
      emitEvent("quick_picks_result_impression", { returned_count: results.length });
    }
  }, [step, results.length]);

  return (
    <section className="rounded-3xl border border-zinc-900 bg-white p-5 sm:p-7">
      <h1 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">{t.title}</h1>
      <p className="mt-1 text-sm font-semibold text-zinc-600">{t.subtitle}</p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 min-h-[24rem]">
        {step === 1 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{t.step1}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AREAS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={optionButton(area === item)}
                  onClick={() => {
                    setArea(item);
                    setStep(2);
                  }}
                >
                  {t.labels[item]}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{t.step2}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MOODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={optionButton(mood === item)}
                  onClick={() => {
                    setMood(item);
                    setStep(3);
                  }}
                >
                  {t.labels[item]}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{t.step3}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WITH_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={optionButton(withType === item)}
                  onClick={() => setWithType(item)}
                >
                  {t.labels[item]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (!area || !mood || !withType) return;
                emitEvent("quick_picks_submit", { area, mood, with: withType });
                setStep(4);
              }}
              className="mt-4 w-full rounded-2xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-black text-white"
            >
              {t.show}
            </button>
          </>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3">
            {results.map((card) => (
              <article key={card.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <h2 className="text-lg font-black tracking-tight text-zinc-950">{card.title}</h2>
                <p className="mt-2 text-sm font-semibold text-zinc-700">
                  <span className="font-black text-zinc-900">{t.why}: </span>
                  {card.whyNow}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-700">
                  <span className="font-black text-zinc-900">{t.doThis}: </span>
                  {card.doThis}
                </p>
                <p className="mt-1 text-sm font-semibold text-red-700">
                  <span className="font-black">{t.watchOut}: </span>
                  {card.watchOut}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-700">
                  <span className="font-black text-zinc-900">{t.planB}: </span>
                  {card.planB}
                </p>
                <a
                  href={card.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => emitEvent("quick_picks_maps_click", { map_query: card.mapQuery })}
                  className="mt-3 inline-flex rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-black text-white"
                >
                  {t.maps}
                </a>
              </article>
            ))}

            <button
              type="button"
              onClick={() => {
                setMood(null);
                setWithType(null);
                setStep(2);
              }}
              className="w-full rounded-2xl border border-zinc-900 px-4 py-3 text-sm font-black text-zinc-900"
            >
              {t.retry}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
