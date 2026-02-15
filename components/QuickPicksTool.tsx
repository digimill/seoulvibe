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
  title_template: string;
  do_template: string;
  risk: string;
  plan_b: string;
  map_query: string;
  why_now?: string;
};

type RawPick = {
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
const rawPicks = picksData as RawPick[];

const GLOBAL_FALLBACK: PickTemplate[] = [
  {
    id: "global-seat-first",
    area: "Global",
    moods: ["Eat", "Local"],
    with: ["Solo", "Couple", "Friends", "Family"],
    title_template: "Seat-first meal near {anchor}",
    do_template: "Pick the first place with open seats now.",
    risk: "Top-ranked spots can waste time.",
    plan_b: "Move one street away and retry once.",
    map_query: "{anchor} seoul local restaurant",
  },
  {
    id: "global-coffee-reset",
    area: "Global",
    moods: ["Coffee", "Quiet"],
    with: ["Solo", "Couple", "Friends"],
    title_template: "Quick reset near {anchor}",
    do_template: "Take one calm cafe break for 20 minutes.",
    risk: "Popular cafes can stall.",
    plan_b: "Choose a non-signature cafe nearby.",
    map_query: "{anchor} seoul quiet cafe",
  },
  {
    id: "global-walk-short",
    area: "Global",
    moods: ["Walk", "Unique", "Quiet"],
    with: ["Solo", "Couple", "Friends", "Family"],
    title_template: "Short low-regret walk at {anchor}",
    do_template: "Do a short loop and stop.",
    risk: "Long loops can break your schedule.",
    plan_b: "Cut distance and end near station.",
    map_query: "{anchor} seoul walk",
  },
  {
    id: "global-night-easy",
    area: "Global",
    moods: ["Night", "Unique"],
    with: ["Solo", "Couple", "Friends"],
    title_template: "Easy night option near {anchor}",
    do_template: "Enter one venue with immediate seats.",
    risk: "Queueing one place kills momentum.",
    plan_b: "Switch in 10 minutes.",
    map_query: "{anchor} seoul night spot",
  },
  {
    id: "global-family-safe",
    area: "Global",
    moods: ["Eat", "Walk", "Quiet"],
    with: ["Family"],
    title_template: "Family-safe route near {anchor}",
    do_template: "Keep route short and seat-first.",
    risk: "Overpacked lanes increase fatigue.",
    plan_b: "Use one short taxi hop.",
    map_query: "{anchor} seoul family",
  },
];

function normalizePick(item: RawPick, index: number): PickTemplate | null {
  const area = item.area as Area;
  const mood = item.mood as Mood;
  const companions = (item.companions ?? []).filter((x): x is WithType => WITH_TYPES.includes(x as WithType));
  if (!AREAS.includes(area) || !MOODS.includes(mood) || companions.length === 0) return null;

  return {
    id: `raw-${index}`,
    area,
    moods: [mood],
    with: companions,
    title_template: item.title || "Quick pick near {anchor}",
    do_template: item.do || "Move now and pick a low-wait option.",
    risk: item.risk || "Crowd can spike suddenly.",
    plan_b: item.plan_b || "Switch one block away.",
    map_query: item.map_query || "{anchor} seoul",
    why_now: item.why_now,
  };
}

const picks = rawPicks
  .map((item, index) => normalizePick(item, index))
  .filter((x): x is PickTemplate => x !== null);

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
  uniquePush(merged, level2);
  uniquePush(merged, level3);
  uniquePush(merged, level4);

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

    const pickCount = sorted.length >= 3 ? 3 : sorted.length >= 2 ? 2 : 0;
    const selected = sorted.slice(0, pickCount);

    const whyPool = copyBlocks.why_now;
    const riskAddonPool = copyBlocks.risk_addon;

    return selected.map((item, index) => {
      const anchor =
        randomBySeed(pickAnchors(area, mood), seed, `${item.id}:anchor:${index}`) ??
        "nearest station side";
      const whyNow =
        randomBySeed(whyPool, seed, `${item.id}:why:${index}`) ??
        item.why_now ??
        "Low regret option right now.";
      const riskAddon = randomBySeed(riskAddonPool, seed, `${item.id}:risk:${index}`) ?? "";
      const title = item.title_template.replaceAll("{anchor}", anchor);
      const doThis = item.do_template.replaceAll("{anchor}", anchor);
      const mapQuery = item.map_query.replaceAll("{anchor}", anchor);
      return {
        id: item.id,
        title,
        whyNow,
        doThis,
        watchOut: riskAddon ? `${item.risk} ${riskAddon}` : item.risk,
        planB: item.plan_b,
        mapQuery,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
      };
    });
  }, [area, mood, withType, seed]);

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
