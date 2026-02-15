"use client";

import { useEffect, useMemo, useState } from "react";
import rulesData from "@/data/quick_picks_rules.json";
import type { Lang } from "@/lib/i18n";

type Area = "Hongdae" | "Seongsu" | "Bukchon" | "Gangnam" | "Euljiro";
type Mood = "Eat" | "Coffee" | "Walk" | "Quiet" | "Night" | "Local" | "Unique";
type WithType = "Solo" | "Couple" | "Friends" | "Family";

type Rule = {
  title_ko: string;
  title_en: string;
  queries_ko: string[];
  queries_en: string[];
  do_ko: string;
  do_en: string;
  risk_ko: string;
  risk_en: string;
  plan_b_ko: string;
  plan_b_en: string;
};

type RuleMap = Record<Area, Record<Mood, Rule>>;

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

const RULES = rulesData as RuleMap;

const WHY_POOL_KO = [
  "지금 이동하면 대기 리스크를 줄일 수 있어요.",
  "지금 시간대에 실패 확률이 낮은 선택입니다.",
  "동선이 단순해서 체감 효율이 좋아요.",
  "지금 고르면 일정 복구가 쉬워요.",
  "후회가 적은 안전한 선택입니다.",
];
const WHY_POOL_EN = [
  "This lowers queue risk right now.",
  "This is a low-regret move at this hour.",
  "Simple route, lower chance of failure.",
  "Good pick to recover schedule fast.",
  "Safe option with practical upside now.",
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
        Family: "가족"
      } as Record<string, string>,
      withAddon: {
        Solo: "혼자 이동 기준으로 동선 낭비를 줄이세요.",
        Couple: "취향이 갈리면 좌석 확보를 먼저 하세요.",
        Friends: "인원이 많으면 줄 없는 곳을 우선하세요.",
        Family: "계단/대기 리스크 낮은 동선을 우선하세요."
      } as Record<WithType, string>
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
    withAddon: {
      Solo: "Optimize for solo movement and speed.",
      Couple: "If tastes split, lock seats first.",
      Friends: "For groups, avoid high-queue spots.",
      Family: "Prioritize low-wait, low-stairs options."
    } as Record<WithType, string>
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

function emitEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (!w.gtag) return;
  w.gtag("event", name, params ?? {});
}

function optionButton(active: boolean) {
  return `rounded-2xl border px-4 py-4 text-left text-sm font-black transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"}`;
}

function pickWhy(seed: string, lang: Lang, idx: number) {
  const pool = lang === "ko" ? WHY_POOL_KO : WHY_POOL_EN;
  return pool[hashString(`${seed}:why:${idx}`) % pool.length];
}

function selectQueries(rule: Rule, lang: Lang, seed: string) {
  const queries = lang === "ko" ? rule.queries_ko : rule.queries_en;
  const ranked = [...queries].sort((a, b) => hashString(`${seed}:${a}`) - hashString(`${seed}:${b}`));
  const unique = Array.from(new Set(ranked));
  if (unique.length >= 3) return unique.slice(0, 3);
  if (unique.length === 2) return unique;
  return [unique[0] ?? (lang === "ko" ? "근처 추천" : "nearby pick"), unique[0] ?? (lang === "ko" ? "근처 추천" : "nearby pick")];
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

    const rule = RULES[area]?.[mood];
    if (!rule) return [];

    const localSeed = `${seed}:${area}:${mood}:${withType}`;
    const queries = selectQueries(rule, lang, localSeed);

    const baseTitle = lang === "ko" ? rule.title_ko : rule.title_en;
    const baseDo = lang === "ko" ? rule.do_ko : rule.do_en;
    const baseRisk = lang === "ko" ? rule.risk_ko : rule.risk_en;
    const basePlanB = lang === "ko" ? rule.plan_b_ko : rule.plan_b_en;

    return queries.map((query, idx) => ({
      id: `${area}-${mood}-${withType}-${idx}`,
      title: `${baseTitle} · ${query}`,
      whyNow: pickWhy(localSeed, lang, idx),
      doThis: `${baseDo} ${t.withAddon[withType]}`,
      watchOut: baseRisk,
      planB: basePlanB,
      mapQuery: query,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    }));
  }, [area, mood, withType, seed, lang, t.withAddon]);

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
