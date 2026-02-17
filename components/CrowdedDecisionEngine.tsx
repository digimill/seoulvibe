"use client";

import { useState } from "react";
import crowdedRules from "@/data/crowded-rules.json";
import type { Lang } from "@/lib/i18n";

type AreaRule = (typeof crowdedRules.areas)[number];
type AreaKey = AreaRule["key"];

function isKorean(lang: Lang) {
  return lang === "ko";
}

function pickText(values: { ko: string[]; default: string[] }, ko: boolean) {
  return ko ? values.ko : values.default;
}

export function CrowdedDecisionEngine({ lang }: { lang: Lang }) {
  const ko = isKorean(lang);
  const [area, setArea] = useState<AreaKey>(crowdedRules.areas[0].key);

  const currentArea = crowdedRules.areas.find((item) => item.key === area) ?? crowdedRules.areas[0];
  const areaName = ko ? currentArea.labels.ko : currentArea.labels.default;
  const bottleneck = pickText(currentArea.bottleneck, ko);
  const tips = pickText(currentArea.escapePattern, ko);

  return (
    <section className="mt-6 space-y-4">
      <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-zinc-500">{ko ? "지역 선택" : "Area select"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {crowdedRules.areas.map((item) => {
            const active = area === item.key;
            const label = ko ? item.labels.ko : item.labels.default;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setArea(item.key)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{ko ? `${areaName} 어디가 붐비나` : `${areaName} crowded points`}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {bottleneck.map((item, index) => (
            <li key={item}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 text-zinc-100 sm:p-6">
        <h2 className="text-lg font-black tracking-tight">{ko ? `${areaName} 혼잡 회피 팁` : `${areaName} quick tips`}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-200">
          {tips.map((item, index) => (
            <li key={item}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
