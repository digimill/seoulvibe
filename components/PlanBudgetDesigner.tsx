"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Currency = "KRW" | "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD";
type Category = "food" | "transport" | "experience" | "shopping" | "buffer";
type AllocationMode = "percent" | "fixed";

type AllocationCell = {
  mode: AllocationMode;
  value: number;
};

type Allocation = Record<Category, AllocationCell>;

type Copy = {
  title: string;
  lead: string;
  step1: string;
  step2: string;
  step3: string;
  dailyBudget: string;
  budgetCurrency: string;
  tripDays: string;
  krwFixed: string;
  avgGuide: string;
  presetLow: string;
  presetMid: string;
  presetHigh: string;
  custom: string;
  budgetSummary: string;
  tripTotal: string;
  expectedByAssumption: string;
  status: string;
  reason: string;
  statusRelaxed: string;
  statusTight: string;
  statusRisk: string;
  categoryTitle: string;
  mode: string;
  percent: string;
  fixed: string;
  amount: string;
  normalize: string;
  allocationWarn: string;
  assumptionsTitle: string;
  assumptionsOpen: string;
  assumptionsClose: string;
  mealsPerDay: string;
  mealAvg: string;
  transportPerDay: string;
  transportAvg: string;
  shoppingMin: string;
  shoppingMax: string;
  estimatedDaily: string;
  estimatedTrip: string;
  budgetGap: string;
  guidanceTitle: string;
  guidanceNoIssue: string;
  categories: Record<Category, string>;
};

const BUDGET_KEY = "sv-expense-budget-v1";
const PLAN_DAYS_KEY = "sv-plan-budget-days-v1";
const PLAN_CURRENCY_KEY = "sv-plan-budget-currency-v1";
const PLAN_ALLOC_KEY = "sv-plan-budget-allocation-v2";
const PLAN_ASSUMPTIONS_KEY = "sv-plan-budget-assumptions-v1";
const PLAN_CONFIG_KEY = "sv-plan-budget-config-v1";
const RATES_KRW_PER_UNIT: Record<Currency, number> = {
  KRW: 1,
  USD: 1400,
  EUR: 1520,
  JPY: 9.4,
  CNY: 195,
  TWD: 44,
  HKD: 179,
};

const CATEGORY_ORDER: Category[] = ["food", "transport", "experience", "shopping", "buffer"];
const CATEGORY_COLOR: Record<Category, string> = {
  food: "#10b981",
  transport: "#0ea5e9",
  experience: "#8b5cf6",
  shopping: "#d946ef",
  buffer: "#71717a",
};
const PLAN_CURRENCIES: Currency[] = ["USD", "EUR", "JPY", "CNY", "TWD", "HKD"];

const CATEGORY_GUIDE: Record<Category, { low: number; high: number }> = {
  food: { low: 25, high: 40 },
  transport: { low: 12, high: 25 },
  experience: { low: 10, high: 22 },
  shopping: { low: 12, high: 35 },
  buffer: { low: 5, high: 18 },
};

const DEFAULT_ALLOCATION: Allocation = {
  food: { mode: "percent", value: 30 },
  transport: { mode: "percent", value: 18 },
  experience: { mode: "percent", value: 17 },
  shopping: { mode: "percent", value: 25 },
  buffer: { mode: "percent", value: 10 },
};

const SEOUL_PRESETS = {
  low: 60000,
  mid: 90000,
  high: 130000,
} as const;

function copy(lang: Lang): Copy {
  if (lang === "ko") {
    return {
      title: "하루 예산 구성",
      lead: "먼저 하루 예산 감을 잡고, 그다음 카테고리로 나눠보세요.",
      step1: "1단계: 하루 예산 정하기",
      step2: "2단계: 예산 나누기",
      step3: "3단계: 예산 안내 확인",
      dailyBudget: "하루 예산",
      budgetCurrency: "기준 통화",
      tripDays: "여행 일수",
      krwFixed: "하루 예산은 KRW로 입력하고, 선택 통화는 함께 참고할 수 있습니다.",
      avgGuide: "서울 평균 소비 기준: 저예산 6만원 · 보통 9만원 · 여유형 13만원",
      presetLow: "저예산",
      presetMid: "보통",
      presetHigh: "여유형",
      custom: "직접 입력",
      budgetSummary: "예산 요약",
      tripTotal: "총 여행 예산",
      expectedByAssumption: "예상 일지출",
      status: "현재 상태",
      reason: "이유",
      statusRelaxed: "여유",
      statusTight: "타이트",
      statusRisk: "위험",
      categoryTitle: "예산 나누기",
      mode: "계산 방식",
      percent: "비율(%)",
      fixed: "고정 금액",
      amount: "하루 배정 금액",
      normalize: "비율 자동 맞춤",
      allocationWarn: "비율 방식 항목은 남은 금액에서 자동 비례 배분됩니다.",
      assumptionsTitle: "소비 가정 (상세 설정)",
      assumptionsOpen: "상세 설정 열기",
      assumptionsClose: "상세 설정 닫기",
      mealsPerDay: "하루 식사 횟수",
      mealAvg: "식사 1회 평균 (KRW)",
      transportPerDay: "하루 교통 횟수",
      transportAvg: "교통 1회 평균 (KRW)",
      shoppingMin: "쇼핑 최소 (일/ KRW)",
      shoppingMax: "쇼핑 최대 (일/ KRW)",
      estimatedDaily: "가정 기준 일일 예상",
      estimatedTrip: "가정 기준 전체 예상",
      budgetGap: "예산 대비 차이",
      guidanceTitle: "예산 안내",
      guidanceNoIssue: "현재 설정은 기준 범위 안에 있습니다.",
      categories: {
        food: "식사",
        transport: "교통",
        experience: "체험",
        shopping: "쇼핑",
        buffer: "예비/기타",
      },
    };
  }

  return {
    title: "Daily budget setup",
    lead: "Set your daily budget first, then split it by category.",
    step1: "Step 1: Set daily budget",
    step2: "Step 2: Split budget",
    step3: "Step 3: Check guidance",
    dailyBudget: "Daily budget",
    budgetCurrency: "Base currency",
    tripDays: "Trip days",
      krwFixed: "Enter daily budget in KRW. Your selected currency is shown as reference.",
    avgGuide: "Seoul daily baseline: low 60k · typical 90k · comfortable 130k KRW",
    presetLow: "Low",
    presetMid: "Typical",
    presetHigh: "Comfortable",
    custom: "Custom",
    budgetSummary: "Budget summary",
    tripTotal: "Trip budget total",
    expectedByAssumption: "Estimated daily spend",
    status: "Current status",
    reason: "Reason",
    statusRelaxed: "Relaxed",
    statusTight: "Tight",
    statusRisk: "Risk",
    categoryTitle: "Budget split",
    mode: "Method",
    percent: "Percent (%)",
    fixed: "Fixed amount",
    amount: "Daily allocated amount",
    normalize: "Auto-fit percent",
    allocationWarn: "Percent-mode items are proportionally distributed from remaining budget.",
    assumptionsTitle: "Spend assumptions (Detailed)",
    assumptionsOpen: "Open details",
    assumptionsClose: "Close details",
    mealsPerDay: "Meals per day",
    mealAvg: "Average per meal (KRW)",
    transportPerDay: "Transport rides per day",
    transportAvg: "Average per ride (KRW)",
    shoppingMin: "Shopping min per day (KRW)",
    shoppingMax: "Shopping max per day (KRW)",
    estimatedDaily: "Estimated daily by assumptions",
    estimatedTrip: "Estimated trip by assumptions",
    budgetGap: "Gap vs budget",
    guidanceTitle: "Budget guidance",
    guidanceNoIssue: "Current setup is inside guide range.",
    categories: {
      food: "Food",
      transport: "Transport",
      experience: "Experience",
      shopping: "Shopping",
      buffer: "Buffer/Other",
    },
  };
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function statusTone(status: "relaxed" | "tight" | "risk"): string {
  if (status === "relaxed") return "text-emerald-700";
  if (status === "tight") return "text-amber-700";
  return "text-red-700";
}

export function PlanBudgetDesigner({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const budgetInputRef = useRef<HTMLInputElement>(null);

  const [dailyBudgetKrw, setDailyBudgetKrw] = useState<number>(SEOUL_PRESETS.mid);
  const [budgetPreset, setBudgetPreset] = useState<"low" | "mid" | "high" | "custom">("mid");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [days, setDays] = useState(5);
  const [allocation, setAllocation] = useState<Allocation>(DEFAULT_ALLOCATION);

  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [mealAvg, setMealAvg] = useState(12000);
  const [transportPerDay, setTransportPerDay] = useState(3);
  const [transportAvg, setTransportAvg] = useState(1500);
  const [shoppingMin, setShoppingMin] = useState(15000);
  const [shoppingMax, setShoppingMax] = useState(40000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const rawBudget = localStorage.getItem(BUDGET_KEY);
    const rawDays = localStorage.getItem(PLAN_DAYS_KEY);
    const rawCurrency = localStorage.getItem(PLAN_CURRENCY_KEY) as Currency | null;
    const rawAllocation = localStorage.getItem(PLAN_ALLOC_KEY);
    const rawAssumptions = localStorage.getItem(PLAN_ASSUMPTIONS_KEY);

    if (rawBudget && !Number.isNaN(Number(rawBudget))) setDailyBudgetKrw(Math.max(0, Number(rawBudget)));
    if (rawDays && !Number.isNaN(Number(rawDays))) setDays(Math.max(1, Math.round(Number(rawDays))));
    if (rawCurrency && PLAN_CURRENCIES.includes(rawCurrency)) setCurrency(rawCurrency);

    if (rawAllocation) {
      try {
        const parsed = JSON.parse(rawAllocation) as Partial<Record<Category, Partial<AllocationCell>>>;
        const next: Allocation = { ...DEFAULT_ALLOCATION };
        for (const key of CATEGORY_ORDER) {
          const cell = parsed[key];
          if (!cell) continue;
          next[key] = {
            mode: cell.mode === "fixed" ? "fixed" : "percent",
            value: Math.max(0, toNumber(cell.value)),
          };
        }
        setAllocation(next);
      } catch {
        // ignore
      }
    }

    if (rawAssumptions) {
      try {
        const parsed = JSON.parse(rawAssumptions) as {
          mealsPerDay?: number;
          mealAvg?: number;
          transportPerDay?: number;
          transportAvg?: number;
          shoppingMin?: number;
          shoppingMax?: number;
        };
        if (Number.isFinite(parsed.mealsPerDay)) setMealsPerDay(Math.max(0, Number(parsed.mealsPerDay)));
        if (Number.isFinite(parsed.mealAvg)) setMealAvg(Math.max(0, Number(parsed.mealAvg)));
        if (Number.isFinite(parsed.transportPerDay)) setTransportPerDay(Math.max(0, Number(parsed.transportPerDay)));
        if (Number.isFinite(parsed.transportAvg)) setTransportAvg(Math.max(0, Number(parsed.transportAvg)));
        if (Number.isFinite(parsed.shoppingMin)) setShoppingMin(Math.max(0, Number(parsed.shoppingMin)));
        if (Number.isFinite(parsed.shoppingMax)) setShoppingMax(Math.max(0, Number(parsed.shoppingMax)));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, String(Math.max(0, Math.round(dailyBudgetKrw))));
  }, [dailyBudgetKrw]);

  useEffect(() => {
    localStorage.setItem(PLAN_DAYS_KEY, String(Math.max(1, Math.round(days))));
  }, [days]);

  useEffect(() => {
    localStorage.setItem(PLAN_CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(PLAN_ALLOC_KEY, JSON.stringify(allocation));
  }, [allocation]);

  useEffect(() => {
    localStorage.setItem(
      PLAN_ASSUMPTIONS_KEY,
      JSON.stringify({ mealsPerDay, mealAvg, transportPerDay, transportAvg, shoppingMin, shoppingMax }),
    );
  }, [mealsPerDay, mealAvg, transportPerDay, transportAvg, shoppingMin, shoppingMax]);

  const safeBudget = Math.max(0, Math.round(dailyBudgetKrw));
  const safeDays = Math.max(1, Math.round(days));

  useEffect(() => {
    const nextPreset: "low" | "mid" | "high" | "custom" =
      safeBudget === SEOUL_PRESETS.low ? "low" : safeBudget === SEOUL_PRESETS.mid ? "mid" : safeBudget === SEOUL_PRESETS.high ? "high" : "custom";
    setBudgetPreset(nextPreset);
  }, [safeBudget]);
  const rate = RATES_KRW_PER_UNIT[currency];

  function toDisplay(krw: number): string {
    if (currency === "KRW") return `₩${Math.round(krw).toLocaleString()}`;
    const value = rate > 0 ? krw / rate : 0;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: currency === "JPY" ? 0 : 2 })} ${currency}`;
  }

  const fixedTotal = useMemo(
    () => CATEGORY_ORDER.reduce((sum, key) => sum + (allocation[key].mode === "fixed" ? allocation[key].value : 0), 0),
    [allocation],
  );
  const percentInputTotal = useMemo(
    () => CATEGORY_ORDER.reduce((sum, key) => sum + (allocation[key].mode === "percent" ? allocation[key].value : 0), 0),
    [allocation],
  );

  const remainingPool = Math.max(0, safeBudget - fixedTotal);
  const allocatedAmount = useMemo(() => {
    const out: Record<Category, number> = { food: 0, transport: 0, experience: 0, shopping: 0, buffer: 0 };

    for (const key of CATEGORY_ORDER) {
      const cell = allocation[key];
      if (cell.mode === "fixed") {
        out[key] = Math.max(0, cell.value);
      } else if (percentInputTotal > 0) {
        out[key] = (remainingPool * cell.value) / percentInputTotal;
      }
    }
    return out;
  }, [allocation, percentInputTotal, remainingPool]);

  useEffect(() => {
    const payload = {
      baseCurrency: currency,
      dailyBudgetUser:
        currency === "KRW"
          ? safeBudget
          : Number((safeBudget / RATES_KRW_PER_UNIT[currency]).toFixed(currency === "JPY" ? 0 : 2)),
      dailyBudgetKrw: safeBudget,
      categorySplit: allocation,
      tripDays: safeDays,
    };
    localStorage.setItem(PLAN_CONFIG_KEY, JSON.stringify(payload));
  }, [allocation, currency, safeBudget, safeDays]);

  const actualShare = useMemo(() => {
    const out: Record<Category, number> = { food: 0, transport: 0, experience: 0, shopping: 0, buffer: 0 };
    if (safeBudget <= 0) return out;
    for (const key of CATEGORY_ORDER) out[key] = (allocatedAmount[key] / safeBudget) * 100;
    return out;
  }, [allocatedAmount, safeBudget]);

  const dailyAssumptionMin = mealsPerDay * mealAvg + transportPerDay * transportAvg + Math.min(shoppingMin, shoppingMax);
  const dailyAssumptionMax = mealsPerDay * mealAvg + transportPerDay * transportAvg + Math.max(shoppingMin, shoppingMax);
  const dailyAssumptionMid = (dailyAssumptionMin + dailyAssumptionMax) / 2;

  const tripBudgetTotal = safeBudget * safeDays;
  const tripAssumptionMin = dailyAssumptionMin * safeDays;
  const tripAssumptionMax = dailyAssumptionMax * safeDays;
  const tripAssumptionMid = dailyAssumptionMid * safeDays;

  const gap = tripBudgetTotal - tripAssumptionMid;
  const gapRate = tripAssumptionMid > 0 ? (gap / tripAssumptionMid) * 100 : 0;

  const status: "relaxed" | "tight" | "risk" =
    fixedTotal > safeBudget ? "risk" : gapRate >= 10 ? "relaxed" : gapRate >= -5 ? "tight" : "risk";
  const statusLabel = status === "relaxed" ? c.statusRelaxed : status === "tight" ? c.statusTight : c.statusRisk;

  const statusReason =
    fixedTotal > safeBudget
      ? lang === "ko"
        ? `고정 금액 합이 하루 예산보다 큽니다.`
        : "Fixed amounts exceed daily budget."
      : lang === "ko"
        ? `평균 소비 대비 ${gapRate >= 0 ? "+" : ""}${gapRate.toFixed(1)}%입니다.`
        : `${gapRate >= 0 ? "+" : ""}${gapRate.toFixed(1)}% vs expected average spend.`;

  const feedbackLines = useMemo(() => {
    const lines: string[] = [];

    if (status === "risk") {
      lines.push(lang === "ko" ? "현재 설정은 위험 구간입니다. 예산이나 여행 일수를 먼저 조정하세요." : "Current setup is in risk zone. Adjust budget or trip days first.");
    } else if (status === "tight") {
      lines.push(lang === "ko" ? "현재 설정은 타이트합니다. 예비/교통 예산을 조금 더 확보하세요." : "Current setup is tight. Add more buffer/transport budget.");
    } else {
      lines.push(lang === "ko" ? "현재 설정은 평균 소비보다 여유가 있습니다." : "Current setup has margin over expected spend.");
    }

    lines.push(
      lang === "ko"
        ? `평균 대비 ${gapRate >= 0 ? "+" : ""}${gapRate.toFixed(1)}%.`
        : `${gapRate >= 0 ? "+" : ""}${gapRate.toFixed(1)}% vs expected average.`,
    );

    for (const key of CATEGORY_ORDER) {
      const range = CATEGORY_GUIDE[key];
      const value = actualShare[key];
      if (value < range.low) {
        lines.push(lang === "ko" ? `${c.categories[key]} 예산이 평균보다 낮습니다.` : `${c.categories[key]} budget is below typical range.`);
      } else if (value > range.high) {
        lines.push(lang === "ko" ? `${c.categories[key]} 예산이 평균보다 높습니다.` : `${c.categories[key]} budget is above typical range.`);
      }
    }

    if (lines.length === 2) lines.push(c.guidanceNoIssue);
    return lines;
  }, [actualShare, c, gapRate, lang, status]);

  function setPreset(type: "low" | "mid" | "high") {
    setBudgetPreset(type);
    setDailyBudgetKrw(SEOUL_PRESETS[type]);
  }

  function selectCustomInput() {
    setBudgetPreset("custom");
    budgetInputRef.current?.focus();
    budgetInputRef.current?.select();
  }

  function setCellMode(category: Category, mode: AllocationMode) {
    setAllocation((prev) => ({
      ...prev,
      [category]: {
        mode,
        value:
          mode === "fixed"
            ? Math.round(prev[category].mode === "fixed" ? prev[category].value : (safeBudget * prev[category].value) / 100)
            : prev[category].mode === "percent"
              ? prev[category].value
              : safeBudget > 0
                ? Math.round((prev[category].value / safeBudget) * 100)
                : 0,
      },
    }));
  }

  function setCellValue(category: Category, value: number) {
    setAllocation((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        value: Math.max(0, prev[category].mode === "percent" ? Math.min(100, Math.round(value)) : Math.round(value)),
      },
    }));
  }

  function normalizePercentModes() {
    const percentCats = CATEGORY_ORDER.filter((key) => allocation[key].mode === "percent");
    const total = percentCats.reduce((sum, key) => sum + allocation[key].value, 0);
    if (percentCats.length === 0) return;

    const next = { ...allocation };
    if (total <= 0) {
      const even = Math.floor(100 / percentCats.length);
      let assigned = 0;
      percentCats.forEach((key, idx) => {
        const value = idx === percentCats.length - 1 ? 100 - assigned : even;
        next[key] = { ...next[key], value };
        assigned += value;
      });
      setAllocation(next);
      return;
    }

    let assigned = 0;
    percentCats.forEach((key, idx) => {
      const value = idx === percentCats.length - 1 ? Math.max(0, 100 - assigned) : Math.round((allocation[key].value / total) * 100);
      next[key] = { ...next[key], value };
      assigned += value;
    });
    setAllocation(next);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-xl font-black tracking-tight text-zinc-950">{c.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{c.lead}</p>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 sm:p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.step1}</p>
          <p className="mt-2 text-xs font-semibold text-zinc-600">{c.avgGuide}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreset("low")}
              className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetPreset === "low" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-900"}`}
            >
              {c.presetLow}
            </button>
            <button
              type="button"
              onClick={() => setPreset("mid")}
              className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetPreset === "mid" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-900"}`}
            >
              {c.presetMid}
            </button>
            <button
              type="button"
              onClick={() => setPreset("high")}
              className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetPreset === "high" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-900"}`}
            >
              {c.presetHigh}
            </button>
            <button
              type="button"
              onClick={selectCustomInput}
              className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetPreset === "custom" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-900"}`}
            >
              {c.custom}
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem] sm:items-end">
                <label className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-600">{c.dailyBudget} (KRW)</p>
                  <input
                    ref={budgetInputRef}
                    type="number"
                    min={0}
                    step={1000}
                    value={safeBudget}
                    onChange={(e) => {
                      setBudgetPreset("custom");
                      setDailyBudgetKrw(Math.max(0, Math.round(toNumber(e.target.value))));
                    }}
                    className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
                  />
                </label>
                <label>
                  <p className="text-xs font-semibold text-zinc-600">{c.budgetCurrency}</p>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm font-bold text-zinc-900 outline-none"
                  >
                    {PLAN_CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-2 text-xs font-semibold text-zinc-500">
                {currency === "KRW" ? `₩${safeBudget.toLocaleString()}` : `${toDisplay(safeBudget)}`}
              </p>
            </div>
            <label className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.tripDays}</p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDays((prev) => Math.max(1, prev - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-base font-black text-zinc-700"
                  aria-label={lang === "ko" ? "여행 일수 줄이기" : "Decrease trip days"}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={safeDays}
                  onChange={(e) => setDays(Math.max(1, toNumber(e.target.value) || 1))}
                  className="w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDays((prev) => prev + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-base font-black text-zinc-700"
                  aria-label={lang === "ko" ? "여행 일수 늘리기" : "Increase trip days"}
                >
                  +
                </button>
              </div>
            </label>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-zinc-500">{c.krwFixed}</p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            {c.presetLow}: {toDisplay(SEOUL_PRESETS.low)} · {c.presetMid}: {toDisplay(SEOUL_PRESETS.mid)} · {c.presetHigh}: {toDisplay(SEOUL_PRESETS.high)}
          </p>
        </div>

      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.step2}</h4>
          <button
            type="button"
            onClick={normalizePercentModes}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-700 hover:border-zinc-900"
          >
            {c.normalize}
          </button>
        </div>

        <p className="mt-2 text-xs font-semibold text-zinc-600">{c.categoryTitle}</p>
        <div className="mt-3 rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-zinc-100">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">{c.budgetSummary}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.tripTotal}</p>
              <p className="mt-1 text-lg font-black text-white">{toDisplay(tripBudgetTotal)}</p>
              <p className="text-[11px] font-semibold text-zinc-400">₩{tripBudgetTotal.toLocaleString()}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.expectedByAssumption}</p>
              <p className="mt-1 text-lg font-black text-white">{toDisplay(dailyAssumptionMid)}</p>
              <p className="text-[11px] font-semibold text-zinc-400">₩{Math.round(dailyAssumptionMid).toLocaleString()}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.status}</p>
              <p className={`mt-1 text-xl font-black ${statusTone(status)}`}>{statusLabel}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.reason}</p>
              <p className="mt-1 text-xs font-semibold text-zinc-200">{statusReason}</p>
            </article>
          </div>
        </div>

        <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="flex h-full w-full">
            {CATEGORY_ORDER.map((key) => (
              <div key={key} style={{ width: `${Math.max(0, actualShare[key])}%`, backgroundColor: CATEGORY_COLOR[key] }} />
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {CATEGORY_ORDER.map((key) => {
            const cell = allocation[key];
            return (
              <article key={key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_190px_140px_150px] sm:items-center">
                  <p className="flex items-center gap-2 text-sm font-black text-zinc-900">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLOR[key] }} aria-hidden />
                    {c.categories[key]}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-zinc-600">{c.mode}</p>
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCellMode(key, "percent")}
                        className={`rounded-full border px-2 py-1 text-xs font-bold ${cell.mode === "percent" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700"}`}
                      >
                        {c.percent}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCellMode(key, "fixed")}
                        className={`rounded-full border px-2 py-1 text-xs font-bold ${cell.mode === "fixed" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700"}`}
                      >
                        {c.fixed}
                      </button>
                    </div>
                  </div>
                  <label>
                    <p className="text-xs font-semibold text-zinc-600">{cell.mode === "percent" ? c.percent : c.fixed}</p>
                    <input
                      type="number"
                      min={0}
                      value={Math.round(cell.value)}
                      onChange={(e) => setCellValue(key, toNumber(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm font-bold text-zinc-900"
                    />
                  </label>
                  <div>
                    <p className="text-xs font-semibold text-zinc-600">{c.amount}</p>
                    <p className="mt-1 text-sm font-black text-zinc-900">{toDisplay(allocatedAmount[key])}</p>
                    <p className="text-[11px] font-semibold text-zinc-500">₩{Math.round(allocatedAmount[key]).toLocaleString()}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-3 text-xs font-semibold text-zinc-600">{c.allocationWarn}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.assumptionsTitle}</h4>
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-700 hover:border-zinc-900"
          >
            {showAdvanced ? c.assumptionsClose : c.assumptionsOpen}
          </button>
        </div>

        {showAdvanced ? (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.mealsPerDay}</p>
                <input type="number" min={0} value={mealsPerDay} onChange={(e) => setMealsPerDay(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.mealAvg}</p>
                <input type="number" min={0} value={mealAvg} onChange={(e) => setMealAvg(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.transportPerDay}</p>
                <input type="number" min={0} value={transportPerDay} onChange={(e) => setTransportPerDay(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.transportAvg}</p>
                <input type="number" min={0} value={transportAvg} onChange={(e) => setTransportAvg(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.shoppingMin}</p>
                <input type="number" min={0} value={shoppingMin} onChange={(e) => setShoppingMin(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.shoppingMax}</p>
                <input type="number" min={0} value={shoppingMax} onChange={(e) => setShoppingMax(Math.max(0, toNumber(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.estimatedDaily}</p>
                <p className="mt-1 text-sm font-black text-zinc-900">{toDisplay(dailyAssumptionMin)} - {toDisplay(dailyAssumptionMax)}</p>
                <p className="text-[11px] font-semibold text-zinc-500">₩{Math.round(dailyAssumptionMin).toLocaleString()} - ₩{Math.round(dailyAssumptionMax).toLocaleString()}</p>
              </article>
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.estimatedTrip}</p>
                <p className="mt-1 text-sm font-black text-zinc-900">{toDisplay(tripAssumptionMin)} - {toDisplay(tripAssumptionMax)}</p>
                <p className="text-[11px] font-semibold text-zinc-500">₩{Math.round(tripAssumptionMin).toLocaleString()} - ₩{Math.round(tripAssumptionMax).toLocaleString()}</p>
              </article>
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.budgetGap}</p>
                <p className={`mt-1 text-sm font-black ${gap >= 0 ? "text-emerald-700" : "text-red-700"}`}>{toDisplay(gap)}</p>
                <p className="text-[11px] font-semibold text-zinc-500">₩{Math.round(gap).toLocaleString()}</p>
              </article>
            </div>
          </>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.step3}</h4>
        <p className="mt-1 text-xs font-semibold text-zinc-600">{c.guidanceTitle}</p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          {feedbackLines.map((line) => (
            <p key={line}>- {line}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
