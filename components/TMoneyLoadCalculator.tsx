"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type AreaId = "hongdae" | "seongsu" | "bukchon" | "gangnam" | "euljiro" | "other";

const AREA_COST: Record<AreaId, number> = {
  hongdae: 5000,
  seongsu: 5200,
  bukchon: 4800,
  gangnam: 5600,
  euljiro: 5000,
  other: 5200,
};

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "How much should I load?",
      desc: "T-money에 얼마 넣을지 바로 계산합니다.",
      days: "체류 일수",
      area: "숙소 위치",
      airport: "공항 왕복 이동 포함",
      recommended: "권장 충전액",
      perDay: "1일 평균 교통비",
      extra: "추가 여유 금액",
      tip: "여유 금액은 길 찾기 실수/우회 이동 대비입니다.",
      areas: {
        hongdae: "홍대",
        seongsu: "성수",
        bukchon: "북촌",
        gangnam: "강남",
        euljiro: "을지로",
        other: "기타",
      },
    };
  }
  if (lang === "ja") {
    return {
      title: "How much should I load?",
      desc: "T-moneyの推奨チャージ額を即計算。",
      days: "滞在日数",
      area: "宿エリア",
      airport: "空港往復を含める",
      recommended: "推奨チャージ額",
      perDay: "1日平均交通費",
      extra: "予備金",
      tip: "予備金は乗り間違い・迂回に備える金額です。",
      areas: {
        hongdae: "ホンデ",
        seongsu: "ソンス",
        bukchon: "プクチョン",
        gangnam: "カンナム",
        euljiro: "ウルチロ",
        other: "その他",
      },
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "How much should I load?",
      desc: "快速算出 T-money 建议充值额。",
      days: "停留天数",
      area: "住宿区域",
      airport: "包含机场往返",
      recommended: "建议充值额",
      perDay: "日均交通费",
      extra: "额外余量",
      tip: "余量用于坐反方向、临时绕路。",
      areas: {
        hongdae: "弘大",
        seongsu: "圣水",
        bukchon: "北村",
        gangnam: "江南",
        euljiro: "乙支路",
        other: "其他",
      },
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "How much should I load?",
      desc: "快速計算 T-money 建議儲值金額。",
      days: "停留天數",
      area: "住宿區域",
      airport: "包含機場往返",
      recommended: "建議儲值額",
      perDay: "每日平均交通費",
      extra: "額外預留",
      tip: "預留金額用於坐錯方向與臨時繞路。",
      areas: {
        hongdae: "弘大",
        seongsu: "聖水",
        bukchon: "北村",
        gangnam: "江南",
        euljiro: "乙支路",
        other: "其他",
      },
    };
  }
  return {
    title: "How much should I load?",
    desc: "Estimate your T-money load in seconds.",
    days: "Days in Seoul",
    area: "Stay area",
    airport: "Include airport round trip",
    recommended: "Recommended top-up",
    perDay: "Average per day",
    extra: "Extra buffer",
    tip: "Buffer covers wrong transfers and detours.",
    areas: {
      hongdae: "Hongdae",
      seongsu: "Seongsu",
      bukchon: "Bukchon",
      gangnam: "Gangnam",
      euljiro: "Euljiro",
      other: "Other",
    },
  };
}

export function TMoneyLoadCalculator({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [days, setDays] = useState(4);
  const [area, setArea] = useState<AreaId>("hongdae");
  const [airportRoundTrip, setAirportRoundTrip] = useState(true);

  const { baseTotal, perDay, airportCost, buffer, recommended } = useMemo(() => {
    const safeDays = Math.max(1, days);
    const daily = AREA_COST[area];
    const transportTotal = daily * safeDays;
    const airport = airportRoundTrip ? 10000 : 0;
    const base = transportTotal + airport;
    const extra = Math.max(5000, Math.round((base * 0.2) / 1000) * 1000);
    return {
      baseTotal: base,
      perDay: daily,
      airportCost: airport,
      buffer: extra,
      recommended: base + extra,
    };
  }, [days, area, airportRoundTrip]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.days}</p>
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
          />
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.area}</p>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value as AreaId)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          >
            <option value="hongdae">{c.areas.hongdae}</option>
            <option value="seongsu">{c.areas.seongsu}</option>
            <option value="bukchon">{c.areas.bukchon}</option>
            <option value="gangnam">{c.areas.gangnam}</option>
            <option value="euljiro">{c.areas.euljiro}</option>
            <option value="other">{c.areas.other}</option>
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold text-zinc-800">
          <input
            type="checkbox"
            checked={airportRoundTrip}
            onChange={(e) => setAirportRoundTrip(e.target.checked)}
            className="h-4 w-4"
          />
          {c.airport}
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.recommended}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{recommended.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.perDay}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{perDay.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.extra}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{buffer.toLocaleString()}</p>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-zinc-600">
        Base ₩{baseTotal.toLocaleString()} + Airport ₩{airportCost.toLocaleString()} + Buffer ₩{buffer.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{c.tip}</p>
    </section>
  );
}
