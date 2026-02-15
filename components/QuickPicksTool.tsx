"use client";

import { useEffect, useMemo, useState } from "react";
import picksData from "@/data/picks.json";
import type { Lang } from "@/lib/i18n";

type Area = "Hongdae" | "Seongsu" | "Bukchon" | "Gangnam" | "Euljiro";
type Mood = "Eat" | "Coffee" | "Walk" | "Quiet" | "Night" | "Local" | "Unique";
type WithType = "Solo" | "Couple" | "Friends" | "Family";

type RawEntry = {
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
  tags?: string[];
};

type DatasetObject = {
  entries?: RawEntry[];
};

type NormalizedPick = {
  id: string;
  area: Area;
  mood: Mood;
  withType: WithType;
  titleKo: string;
  titleEn: string;
  whyNowKo: string;
  doKo: string;
  riskKo: string;
  planBKo: string;
  mapQueryKo: string;
  mapQueryEn: string;
  anchorKo: string;
  anchorEn: string;
  tags: string[];
};

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

function isArea(v: string): v is Area {
  return AREAS.includes(v as Area);
}
function isMood(v: string): v is Mood {
  return MOODS.includes(v as Mood);
}
function isWith(v: string): v is WithType {
  return WITH_TYPES.includes(v as WithType);
}

function normalizeEntries(raw: unknown): NormalizedPick[] {
  const entries = Array.isArray(raw)
    ? (raw as RawEntry[])
    : Array.isArray((raw as DatasetObject)?.entries)
      ? ((raw as DatasetObject).entries as RawEntry[])
      : [];

  return entries
    .map((item, index) => {
      const area = item.area?.id;
      const mood = item.mood?.id;
      const withType = item.with?.id;
      if (!area || !mood || !withType || !isArea(area) || !isMood(mood) || !isWith(withType)) return null;

      const anchorKo = item.anchor?.label_ko ?? item.anchor?.map_query_ko ?? item.map_query_ko ?? "";
      const anchorEn = item.anchor?.label_en ?? item.anchor?.map_query_en ?? item.map_query_en ?? anchorKo;
      const mapQueryKo = item.map_query_ko ?? item.anchor?.map_query_ko ?? anchorKo;
      const mapQueryEn = item.map_query_en ?? item.anchor?.map_query_en ?? anchorEn;

      if (!mapQueryKo || !anchorKo) return null;

      return {
        id: `entry-${index}`,
        area,
        mood,
        withType,
        titleKo: item.title_ko ?? `${anchorKo} 픽`,
        titleEn: item.title_en ?? `${anchorEn} pick`,
        whyNowKo: item.why_now_ko ?? "지금 이동하면 대기 리스크를 줄일 수 있어요.",
        doKo: item.do_ko ?? "지금 바로 이동해서 입장 가능한 곳부터 선택하세요.",
        riskKo: item.risk_ko ?? "대기 줄이 길어질 수 있어요.",
        planBKo: item.plan_b_ko ?? "한 블록 옆으로 이동해 재선택하세요.",
        mapQueryKo,
        mapQueryEn,
        anchorKo,
        anchorEn,
        tags: item.tags ?? [],
      } satisfies NormalizedPick;
    })
    .filter((x): x is NormalizedPick => x !== null);
}

const PICKS = normalizeEntries(picksData);

const FALLBACK: NormalizedPick[] = [
  {
    id: "fallback-1",
    area: "Hongdae",
    mood: "Eat",
    withType: "Solo",
    titleKo: "연남동 좌석 우선 식사",
    titleEn: "Seat-first meal in Yeonnam",
    whyNowKo: "혼잡 시간대엔 좌석 우선이 후회가 적어요.",
    doKo: "메인 거리 말고 골목 2번째 매장부터 보세요.",
    riskKo: "유명 매장은 대기가 급증해요.",
    planBKo: "대기 10분 넘으면 바로 옆 골목으로 이동.",
    mapQueryKo: "연남동 식당",
    mapQueryEn: "Yeonnam restaurant",
    anchorKo: "연남동",
    anchorEn: "Yeonnam",
    tags: ["fallback"],
  },
  {
    id: "fallback-2",
    area: "Seongsu",
    mood: "Coffee",
    withType: "Couple",
    titleKo: "성수 조용한 커피 리셋",
    titleEn: "Seongsu quiet coffee reset",
    whyNowKo: "짧게 쉬고 동선을 다시 잡기 좋아요.",
    doKo: "좌석 있는 카페 먼저 들어가 20분만 쉬세요.",
    riskKo: "시그니처 메뉴 줄이 길 수 있어요.",
    planBKo: "브랜드 대신 소형 로스터리로 전환.",
    mapQueryKo: "성수 조용한 카페",
    mapQueryEn: "Seongsu quiet cafe",
    anchorKo: "성수",
    anchorEn: "Seongsu",
    tags: ["fallback"],
  },
  {
    id: "fallback-3",
    area: "Euljiro",
    mood: "Night",
    withType: "Friends",
    titleKo: "을지로 빠른 야간 선택",
    titleEn: "Euljiro quick night pick",
    whyNowKo: "대기 없는 1차 선택이 체감 만족도가 높아요.",
    doKo: "즉시 입장 가능한 곳 한 곳만 고르세요.",
    riskKo: "핫플 줄에 시간을 다 쓸 수 있어요.",
    planBKo: "10분 넘기면 다음 골목으로 이동.",
    mapQueryKo: "을지로 노가리골목",
    mapQueryEn: "Euljiro nogari alley",
    anchorKo: "을지로",
    anchorEn: "Euljiro",
    tags: ["fallback"],
  },
];

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

function emitEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (!w.gtag) return;
  w.gtag("event", name, params ?? {});
}

function optionButton(active: boolean) {
  return `rounded-2xl border px-4 py-4 text-left text-sm font-black transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"}`;
}

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
  };
}

function selectCandidates(area: Area, mood: Mood, withType: WithType) {
  const level1 = PICKS.filter((x) => x.area === area && x.mood === mood && x.withType === withType);
  const level2 = PICKS.filter((x) => x.area === area && x.mood === mood);
  const level3 = PICKS.filter((x) => x.area === area);

  const merged: NormalizedPick[] = [];
  const pushUnique = (arr: NormalizedPick[]) => {
    for (const item of arr) {
      if (!merged.find((x) => x.id === item.id)) merged.push(item);
    }
  };

  pushUnique(level1);
  if (merged.length < 2) pushUnique(level2);
  if (merged.length < 2) pushUnique(level3);
  if (merged.length < 2) pushUnique(FALLBACK);

  return merged;
}

function chooseDiverse(seed: string, candidates: NormalizedPick[], count: number) {
  const sorted = [...candidates].sort((a, b) => hashString(`${seed}:${a.id}`) - hashString(`${seed}:${b.id}`));
  const picked: NormalizedPick[] = [];
  const seenAnchor = new Set<string>();

  for (const item of sorted) {
    const key = item.anchorKo;
    if (!seenAnchor.has(key)) {
      picked.push(item);
      seenAnchor.add(key);
    }
    if (picked.length === count) break;
  }

  if (picked.length < 2) {
    for (const item of sorted) {
      if (!picked.find((x) => x.id === item.id)) picked.push(item);
      if (picked.length >= 2) break;
    }
  }

  return picked.slice(0, count);
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

    const candidates = selectCandidates(area, mood, withType);
    const selected = chooseDiverse(`${seed}:${area}:${mood}:${withType}`, candidates, 3);

    return selected.map((item) => {
      const title = lang === "ko" ? item.titleKo : item.titleEn;
      const whyNow = lang === "ko" ? item.whyNowKo : item.whyNowKo;
      const doThis = lang === "ko" ? item.doKo : item.doKo;
      const risk = lang === "ko" ? item.riskKo : item.riskKo;
      const planB = lang === "ko" ? item.planBKo : item.planBKo;
      const mapQuery = lang === "ko" ? item.mapQueryKo : item.mapQueryEn;

      return {
        id: item.id,
        title,
        whyNow,
        doThis,
        watchOut: risk,
        planB,
        mapQuery,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
      };
    });
  }, [area, mood, withType, seed, lang]);

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
                <button key={item} type="button" className={optionButton(area === item)} onClick={() => { setArea(item); setStep(2); }}>
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
                <button key={item} type="button" className={optionButton(mood === item)} onClick={() => { setMood(item); setStep(3); }}>
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
                <button key={item} type="button" className={optionButton(withType === item)} onClick={() => setWithType(item)}>
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
                <p className="mt-2 text-sm font-semibold text-zinc-700"><span className="font-black text-zinc-900">{t.why}: </span>{card.whyNow}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-700"><span className="font-black text-zinc-900">{t.doThis}: </span>{card.doThis}</p>
                <p className="mt-1 text-sm font-semibold text-red-700"><span className="font-black">{t.watchOut}: </span>{card.watchOut}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-700"><span className="font-black text-zinc-900">{t.planB}: </span>{card.planB}</p>
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
