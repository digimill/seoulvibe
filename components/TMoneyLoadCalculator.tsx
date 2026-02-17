"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type AreaId =
  | "hongdaeMapo"
  | "seongsuEast"
  | "jongnoCentral"
  | "gangnamSouth"
  | "yongsanYeouido"
  | "airportSide"
  | "outsideSeoul"
  | "other";

const AREA_COST: Record<AreaId, number> = {
  hongdaeMapo: 5000,
  seongsuEast: 5300,
  jongnoCentral: 5200,
  gangnamSouth: 5800,
  yongsanYeouido: 5600,
  airportSide: 6500,
  outsideSeoul: 8200,
  other: 6200,
};

const PLAN_CONFIG_KEY = "sv-plan-budget-config-v1";

type PlanBudgetConfig = {
  dailyBudgetKrw: number;
  tripDays: number;
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
        hongdaeMapo: "홍대/합정/연남 (서북권)",
        seongsuEast: "성수/건대 (동북권)",
        jongnoCentral: "종로/을지로/명동 (중심권)",
        gangnamSouth: "강남/잠실 (남동권)",
        yongsanYeouido: "용산/여의도 (서남권)",
        airportSide: "공항 인근 (인천공항/김포공항 근처)",
        outsideSeoul: "서울 외 숙소 (인천/경기 등)",
        other: "기타/모르겠음",
      },
      breakdown: "기준",
      airportLabel: "공항",
      bufferLabel: "여유",
      planGuide: "Plan 기준 교통 예산 가이드(약 18%)",
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
        hongdaeMapo: "ホンデ/マポ（西北）",
        seongsuEast: "ソンス/東側（東北）",
        jongnoCentral: "チョンノ/明洞（中心）",
        gangnamSouth: "カンナム/チャムシル（南東）",
        yongsanYeouido: "ヨンサン/ヨイド（西南）",
        airportSide: "空港周辺",
        outsideSeoul: "ソウル外（仁川・京畿）",
        other: "その他",
      },
      breakdown: "内訳",
      airportLabel: "空港",
      bufferLabel: "予備",
      planGuide: "Plan基準の交通予算ガイド(約18%)",
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
        hongdaeMapo: "弘大/麻浦（西北）",
        seongsuEast: "圣水/东部（东北）",
        jongnoCentral: "钟路/明洞（中心）",
        gangnamSouth: "江南/蚕室（东南）",
        yongsanYeouido: "龙山/汝矣岛（西南）",
        airportSide: "机场附近",
        outsideSeoul: "首尔外（仁川/京畿）",
        other: "其他",
      },
      breakdown: "构成",
      airportLabel: "机场",
      bufferLabel: "余量",
      planGuide: "按 Plan 估算的交通预算(约18%)",
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
        hongdaeMapo: "弘大/麻浦（西北）",
        seongsuEast: "聖水/東區（東北）",
        jongnoCentral: "鐘路/明洞（中心）",
        gangnamSouth: "江南/蠶室（東南）",
        yongsanYeouido: "龍山/汝矣島（西南）",
        airportSide: "機場附近",
        outsideSeoul: "首爾外（仁川/京畿）",
        other: "其他",
      },
      breakdown: "組成",
      airportLabel: "機場",
      bufferLabel: "預留",
      planGuide: "按 Plan 估算的交通預算(約18%)",
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
      hongdaeMapo: "Hongdae/Mapo (Northwest)",
      seongsuEast: "Seongsu/East (Northeast)",
      jongnoCentral: "Jongno/Myeongdong (Central)",
      gangnamSouth: "Gangnam/Jamsil (Southeast)",
      yongsanYeouido: "Yongsan/Yeouido (Southwest)",
      airportSide: "Near Airport",
      outsideSeoul: "Outside Seoul (Incheon/Gyeonggi)",
      other: "Other / Not sure",
    },
    breakdown: "Breakdown",
    airportLabel: "Airport",
    bufferLabel: "Buffer",
    planGuide: "Transport guide from Plan (about 18%)",
  };
}

export function TMoneyLoadCalculator({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [days, setDays] = useState(4);
  const [area, setArea] = useState<AreaId>("hongdaeMapo");
  const [airportRoundTrip, setAirportRoundTrip] = useState(true);
  const [planGuideKrw, setPlanGuideKrw] = useState<number | null>(null);

  useEffect(() => {
    const rawPlan = localStorage.getItem(PLAN_CONFIG_KEY);
    if (!rawPlan) return;
    try {
      const parsed = JSON.parse(rawPlan) as PlanBudgetConfig;
      if (Number.isFinite(parsed.tripDays) && parsed.tripDays > 0) {
        setDays(Math.max(1, Math.round(parsed.tripDays)));
      }
      if (Number.isFinite(parsed.dailyBudgetKrw) && Number.isFinite(parsed.tripDays)) {
        const guide = Math.round(parsed.dailyBudgetKrw * parsed.tripDays * 0.18);
        setPlanGuideKrw(Math.max(0, guide));
      }
    } catch {
      setPlanGuideKrw(null);
    }
  }, []);

  const { baseTotal, perDay, airportCost, buffer, recommended } = useMemo(() => {
    const safeDays = Math.max(1, days);
    const daily = AREA_COST[area];
    const transportTotal = daily * safeDays;
    const airport = airportRoundTrip ? 10000 : 0;
    const base = transportTotal + airport;
    const bufferRate = area === "outsideSeoul" || area === "other" ? 0.3 : 0.2;
    const minimumBuffer = area === "outsideSeoul" ? 8000 : 5000;
    const extra = Math.max(minimumBuffer, Math.round((base * bufferRate) / 1000) * 1000);
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
            <option value="hongdaeMapo">{c.areas.hongdaeMapo}</option>
            <option value="seongsuEast">{c.areas.seongsuEast}</option>
            <option value="jongnoCentral">{c.areas.jongnoCentral}</option>
            <option value="gangnamSouth">{c.areas.gangnamSouth}</option>
            <option value="yongsanYeouido">{c.areas.yongsanYeouido}</option>
            <option value="airportSide">{c.areas.airportSide}</option>
            <option value="outsideSeoul">{c.areas.outsideSeoul}</option>
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
        {c.breakdown} ₩{baseTotal.toLocaleString()} + {c.airportLabel} ₩{airportCost.toLocaleString()} + {c.bufferLabel} ₩{buffer.toLocaleString()}
      </p>
      {planGuideKrw ? (
        <p className="mt-1 text-xs font-semibold text-zinc-600">
          {c.planGuide}: ₩{planGuideKrw.toLocaleString()}
        </p>
      ) : null}
      <p className="mt-1 text-xs text-zinc-500">{c.tip}</p>
    </section>
  );
}
