"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import {
  RIGHT_NOW_LOCATIONS,
  RIGHT_NOW_SITUATIONS,
  RIGHT_NOW_TIMES,
  type RightNowLocation,
  type RightNowSituation,
  type RightNowTime,
  resolveRightNowRecommendation,
} from "@/lib/right-now-helper";

type Step = 1 | 2 | 3 | 4;

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Right Now Helper",
      subtitle: "10초 안에 지금 할 행동만 정합니다.",
      step1: "1. 지금 어디예요?",
      step2: "2. 지금 무슨 상황인가요?",
      step3: "3. 시간대 선택",
      result: "결과",
      action: "🔥 지금 할 것",
      move: "➡ 여기로 이동",
      avoid: "⚠ 피할 것",
      retry: "다른 상황 다시 보기",
      labels: {
        Hongdae: "홍대",
        Seongsu: "성수",
        Bukchon: "북촌",
        Gangnam: "강남",
        Myeongdong: "명동",
        Airport: "공항",
        Other: "기타",
        "Too crowded": "너무 붐빔",
        Hungry: "배고픔",
        Tired: "피곤함",
        "Waiting in line": "줄이 너무 김",
        "It's raining": "비가 옴",
        "Just arrived": "방금 도착",
        "No plan": "아무 계획 없음",
        Afternoon: "오후",
        Evening: "저녁",
        "Late night": "심야",
      } as Record<string, string>,
    };
  }
  return {
    title: "Right Now Helper",
    subtitle: "No article. One immediate move in under 10 seconds.",
    step1: "1. Where are you?",
    step2: "2. What's happening?",
    step3: "3. Time of day",
    result: "Result",
    action: "🔥 Do this now",
    move: "➡ Move here instead",
    avoid: "⚠ Avoid",
    retry: "Try another situation",
    labels: Object.fromEntries(
      [...RIGHT_NOW_LOCATIONS, ...RIGHT_NOW_SITUATIONS, ...RIGHT_NOW_TIMES].map((x) => [x, x]),
    ) as Record<string, string>,
  };
}

function OptionGrid({
  options,
  selected,
  onSelect,
  labelMap,
}: {
  options: readonly string[];
  selected?: string;
  onSelect: (value: string) => void;
  labelMap: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((value) => {
        const active = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"}`}
          >
            {labelMap[value] ?? value}
          </button>
        );
      })}
    </div>
  );
}

export function RightNowDecisionTool({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [step, setStep] = useState<Step>(1);
  const [location, setLocation] = useState<RightNowLocation | null>(null);
  const [situation, setSituation] = useState<RightNowSituation | null>(null);
  const [time, setTime] = useState<RightNowTime>("Evening");

  const result = useMemo(() => {
    if (!location || !situation) return null;
    return resolveRightNowRecommendation(location, situation, time);
  }, [location, situation, time]);

  return (
    <section className="rounded-3xl border border-zinc-900 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-600">{c.subtitle}</p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 min-h-[22rem] overflow-hidden">
        {step === 1 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{c.step1}</p>
            <OptionGrid
              options={RIGHT_NOW_LOCATIONS}
              selected={location ?? undefined}
              labelMap={c.labels}
              onSelect={(value) => {
                setLocation(value as RightNowLocation);
                setStep(2);
              }}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{c.step2}</p>
            <OptionGrid
              options={RIGHT_NOW_SITUATIONS}
              selected={situation ?? undefined}
              labelMap={c.labels}
              onSelect={(value) => {
                setSituation(value as RightNowSituation);
                setStep(3);
              }}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <p className="mb-3 text-sm font-black text-zinc-900">{c.step3}</p>
            <OptionGrid
              options={RIGHT_NOW_TIMES}
              selected={time}
              labelMap={c.labels}
              onSelect={(value) => setTime(value as RightNowTime)}
            />
            <button
              type="button"
              onClick={() => setStep(4)}
              className="mt-4 w-full rounded-2xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-black text-white"
            >
              {c.result}
            </button>
          </>
        ) : null}

        {step === 4 && result ? (
          <article className="space-y-3">
            <p className="text-sm font-black text-zinc-900">{c.result}</p>
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-black text-zinc-500">{c.action}</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">{result.action}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-black text-zinc-500">{c.move}</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">{result.move}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-black text-zinc-500">{c.avoid}</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">{result.avoid}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSituation(null);
                setTime("Evening");
                setStep(2);
              }}
              className="mt-2 w-full rounded-2xl border border-zinc-900 px-4 py-3 text-sm font-black text-zinc-900"
            >
              {c.retry}
            </button>
          </article>
        ) : null}
      </div>
    </section>
  );
}
