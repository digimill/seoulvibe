"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import type { TravelAreaId } from "@/lib/travel-ia";

type AreaOption = {
  id: TravelAreaId;
  name: string;
};

type TraitKey = "nightlife" | "quiet" | "firstTime" | "airport";
type TraitResult = "a" | "b" | "tie";

const TRAIT_SCORES: Record<TravelAreaId, Record<TraitKey, number>> = {
  hongdae: { nightlife: 5, quiet: 1, firstTime: 4, airport: 5 },
  myeongdong: { nightlife: 3, quiet: 2, firstTime: 5, airport: 4 },
  gangnam: { nightlife: 3, quiet: 4, firstTime: 3, airport: 3 },
  seongsu: { nightlife: 2, quiet: 3, firstTime: 2, airport: 2 },
  itaewon: { nightlife: 4, quiet: 2, firstTime: 2, airport: 3 },
  jamsil: { nightlife: 2, quiet: 5, firstTime: 3, airport: 3 },
};

function getCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "두 지역 중 고민되나요?",
      subtitle: "빠른 비교",
      openCompare: "🔍 두 지역 비교하기",
      closeCompare: "비교 닫기",
      question: "어디를 베이스로 할까요?",
      vs: "vs",
      diff: "같은 지역 2개는 비교할 수 없습니다.",
      labels: {
        nightlife: "야간 활동",
        quiet: "소음/정숙",
        firstTime: "첫 방문 편의성",
        airport: "공항 이동 단순성",
      },
      verdict: "짧은 결론",
      open: "지역 열기",
      match: "숙소 위치 매칭",
      unsure: "아직 애매하다면?",
      matchFast: "30초 숙소 매칭으로 좁히기",
      nightTpl: "밤 활동 우선이면 {area}.",
      calmTpl: "조용하고 단순한 베이스는 {area}.",
    };
  }
  if (lang === "ja") {
    return {
      title: "2エリアで迷っていますか？",
      subtitle: "クイック比較",
      openCompare: "🔍 2エリアを比較する",
      closeCompare: "比較を閉じる",
      question: "どこを拠点にしますか？",
      vs: "vs",
      diff: "同じエリア同士は比較できません。",
      labels: {
        nightlife: "夜の活動",
        quiet: "騒音/静かさ",
        firstTime: "初訪問のわかりやすさ",
        airport: "空港移動の単純さ",
      },
      verdict: "短い結論",
      open: "エリアを開く",
      match: "宿の場所をマッチ",
      unsure: "まだ迷うなら？",
      matchFast: "30秒で宿エリアを絞る",
      nightTpl: "夜の活動を優先するなら {area}。",
      calmTpl: "静かでシンプルな拠点なら {area}。",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "在两个区域之间犹豫？",
      subtitle: "快速比较",
      openCompare: "🔍 比较两个区域",
      closeCompare: "关闭比较",
      question: "你要把哪里当作住宿基地？",
      vs: "vs",
      diff: "不能比较同一个区域。",
      labels: {
        nightlife: "夜间活动",
        quiet: "噪音/安静度",
        firstTime: "首访便利性",
        airport: "机场换乘简洁度",
      },
      verdict: "简短结论",
      open: "打开区域",
      match: "匹配住宿位置",
      unsure: "还不确定？",
      matchFast: "30秒快速匹配住宿区域",
      nightTpl: "如果你看重夜生活，选 {area}。",
      calmTpl: "如果你想要安静简单的基地，选 {area}。",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "在兩個區域之間猶豫？",
      subtitle: "快速比較",
      openCompare: "🔍 比較兩個區域",
      closeCompare: "關閉比較",
      question: "你要把哪裡當作住宿基地？",
      vs: "vs",
      diff: "不能比較同一個區域。",
      labels: {
        nightlife: "夜間活動",
        quiet: "噪音/安靜度",
        firstTime: "首訪便利性",
        airport: "機場轉乘簡潔度",
      },
      verdict: "簡短結論",
      open: "打開區域",
      match: "匹配住宿位置",
      unsure: "仍然不確定？",
      matchFast: "30秒快速匹配住宿區域",
      nightTpl: "如果你重視夜生活，選 {area}。",
      calmTpl: "如果你想要安靜簡單的基地，選 {area}。",
    };
  }

  return {
    title: "Not sure between two areas?",
    subtitle: "Quick compare",
    openCompare: "🔍 Compare two areas",
    closeCompare: "Hide quick compare",
    question: "Which area should be your base?",
    vs: "vs",
    diff: "Pick two different areas.",
    labels: {
      nightlife: "Night activity",
      quiet: "Noise level",
      firstTime: "First-time convenience",
      airport: "Airport transfer simplicity",
    },
    verdict: "Short verdict",
    open: "Open area",
    match: "Match your base",
    unsure: "Still unsure?",
    matchFast: "Match your base in 30 sec",
    nightTpl: "Choose {area} if nightlife matters.",
    calmTpl: "Choose {area} if you want a calm, simple base.",
  };
}

function compareTrait(aId: TravelAreaId, bId: TravelAreaId, trait: TraitKey): TraitResult {
  const a = TRAIT_SCORES[aId][trait];
  const b = TRAIT_SCORES[bId][trait];
  if (a === b) return "tie";
  return a > b ? "a" : "b";
}

function areaByResult(result: TraitResult, aId: TravelAreaId, bId: TravelAreaId): TravelAreaId {
  if (result === "a") return aId;
  if (result === "b") return bId;
  return aId;
}

function fillTemplate(template: string, areaName: string) {
  return template.replace("{area}", areaName);
}

export function AreasQuickCompare({ lang, areas }: { lang: Lang; areas: AreaOption[] }) {
  const c = getCopy(lang);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const [aId, setAId] = useState<TravelAreaId>(areas[0]?.id ?? "hongdae");
  const [bId, setBId] = useState<TravelAreaId>(areas[1]?.id ?? "gangnam");
  const [focusTrait, setFocusTrait] = useState<TraitKey>("nightlife");

  const byId = useMemo(() => new Map(areas.map((item) => [item.id, item])), [areas]);
  const invalid = aId === bId;

  const result = useMemo(() => {
    if (invalid) return null;
    const nightlife = compareTrait(aId, bId, "nightlife");
    const quiet = compareTrait(aId, bId, "quiet");
    const firstTime = compareTrait(aId, bId, "firstTime");
    const airport = compareTrait(aId, bId, "airport");
    return { nightlife, quiet, firstTime, airport };
  }, [aId, bId, invalid]);

  const rows: Array<{ key: TraitKey; label: string; result: TraitResult }> = result
    ? [
        { key: "nightlife", label: c.labels.nightlife, result: result.nightlife },
        { key: "quiet", label: c.labels.quiet, result: result.quiet },
        { key: "firstTime", label: c.labels.firstTime, result: result.firstTime },
        { key: "airport", label: c.labels.airport, result: result.airport },
      ]
    : [];
  const calmSimpleWinner = useMemo(() => {
    const aScore = TRAIT_SCORES[aId].quiet + TRAIT_SCORES[aId].firstTime;
    const bScore = TRAIT_SCORES[bId].quiet + TRAIT_SCORES[bId].firstTime;
    return aScore >= bScore ? aId : bId;
  }, [aId, bId]);

  useEffect(() => {
    const compare = searchParams.get("compare");
    const focus = searchParams.get("focus") as TraitKey | null;
    if (compare === "1") setOpen(true);
    if (focus && ["nightlife", "quiet", "firstTime", "airport"].includes(focus)) setFocusTrait(focus);
  }, [searchParams]);

  return (
    <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.subtitle}</p>
      <h3 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">{c.title}</h3>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-black text-zinc-900"
        >
          {open ? c.closeCompare : c.openCompare}
        </button>
      </div>
      {open ? (
        <>
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-zinc-500">{c.question}</p>
            <div className="mt-2 grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <select value={aId} onChange={(event) => setAId(event.target.value as TravelAreaId)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900">
                {areas.map((area) => (
                  <option key={`a-${area.id}`} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
              <span className="text-center text-xs font-black uppercase tracking-[0.12em] text-zinc-500">{c.vs}</span>
              <select value={bId} onChange={(event) => setBId(event.target.value as TravelAreaId)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900">
                {areas.map((area) => (
                  <option key={`b-${area.id}`} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {invalid ? (
            <p className="mt-4 text-sm font-semibold text-rose-700">{c.diff}</p>
          ) : result ? (
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-800">
              <div className="divide-y divide-zinc-200">
                {rows.map((row) => {
                  const aWin = row.result === "a";
                  const bWin = row.result === "b";
                  const tie = row.result === "tie";
                  return (
                    <div key={row.key} className={`py-2.5 ${focusTrait === row.key ? "rounded-md bg-zinc-100 px-2" : ""}`}>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-zinc-500">{row.label}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <span className={`rounded-md px-2 py-1 font-black ${aWin || tie ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                          {byId.get(aId)?.name} {aWin || tie ? "✓" : ""}
                        </span>
                        <span className={`rounded-md px-2 py-1 font-black ${bWin || tie ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                          {byId.get(bId)?.name} {bWin || tie ? "✓" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-700">{c.verdict}</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">
                  {fillTemplate(c.nightTpl, byId.get(areaByResult(result.nightlife, aId, bId))?.name ?? "")}
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-900">
                  {fillTemplate(c.calmTpl, byId.get(calmSimpleWinner)?.name ?? "")}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <Link href={`/${lang}/areas/${aId}`} className="rounded-full border border-zinc-300 px-4 py-2.5 text-zinc-700">
              {c.open}: {byId.get(aId)?.name}
            </Link>
            <Link href={`/${lang}/areas/${bId}`} className="rounded-full border border-zinc-300 px-4 py-2.5 text-zinc-700">
              {c.open}: {byId.get(bId)?.name}
            </Link>
            <Link href={`/${lang}/plan/where-to-stay`} className="rounded-full border border-zinc-900 px-4 py-2.5 text-zinc-900">
              {c.match}
            </Link>
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            {c.unsure}{" "}
            <Link href={`/${lang}/plan/where-to-stay`} className="underline decoration-zinc-400 underline-offset-4">
              {c.matchFast}
            </Link>
          </p>
        </>
      ) : null}
    </section>
  );
}
