"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Currency = "KRW" | "USD" | "JPY" | "CNY" | "TWD" | "HKD" | "EUR";
type Category = "food" | "transport" | "shopping" | "other";
type Allocation = Record<Category, number>;

type Copy = {
  title: string;
  lead: string;
  dailyBudget: string;
  budgetCurrency: string;
  tripDays: string;
  strategySummary: string;
  tripTotal: string;
  expectedAvg: string;
  status: string;
  statusRelaxed: string;
  statusTight: string;
  statusRisk: string;
  categoryTitle: string;
  percent: string;
  amount: string;
  allocationWarn: string;
  normalize: string;
  assumptionsTitle: string;
  assumptionsToggleOpen: string;
  assumptionsToggleClose: string;
  mealsPerDay: string;
  mealAvg: string;
  transportPerDay: string;
  transportAvg: string;
  shoppingMin: string;
  shoppingMax: string;
  estimatedDaily: string;
  estimatedTrip: string;
  budgetGap: string;
  feedbackTitle: string;
  feedbackLowTransport: string;
  feedbackHighShopping: string;
  feedbackLowFood: string;
  feedbackBadTotal: string;
  feedbackRisk: string;
  feedbackTight: string;
  feedbackRelaxed: string;
  categories: Record<Category, string>;
};

const BUDGET_KEY = "sv-expense-budget-v1";
const PLAN_CURRENCY_KEY = "sv-plan-budget-currency-v1";
const PLAN_DAYS_KEY = "sv-plan-budget-days-v1";
const PLAN_ALLOC_KEY = "sv-plan-budget-allocation-v1";
const PLAN_ASSUMPTIONS_KEY = "sv-plan-budget-assumptions-v1";

const CURRENCIES: Currency[] = ["KRW", "USD", "JPY", "CNY", "TWD", "HKD", "EUR"];
const CATEGORY_ORDER: Category[] = ["food", "transport", "shopping", "other"];

function copy(lang: Lang): Copy {
  if (lang === "ko") {
    return {
      title: "전략 설계 플래너",
      lead: "입력보다 결론을 먼저 보고, 구조를 조정하세요.",
      dailyBudget: "하루 총 예산 (KRW)",
      budgetCurrency: "기준 통화",
      tripDays: "여행 일수",
      strategySummary: "전략 요약",
      tripTotal: "총 여행 예산",
      expectedAvg: "예상 평균 소비",
      status: "설계 상태",
      statusRelaxed: "여유",
      statusTight: "타이트",
      statusRisk: "위험",
      categoryTitle: "카테고리 배분",
      percent: "비율",
      amount: "금액",
      allocationWarn: "카테고리 합계가 100%가 아닙니다.",
      normalize: "100% 자동 맞춤",
      assumptionsTitle: "소비 가정 (고급 설정)",
      assumptionsToggleOpen: "고급 설정 열기",
      assumptionsToggleClose: "고급 설정 닫기",
      mealsPerDay: "하루 식사 횟수",
      mealAvg: "식사 1회 평균 (KRW)",
      transportPerDay: "하루 교통 횟수",
      transportAvg: "교통 1회 평균 (KRW)",
      shoppingMin: "쇼핑 최소 (일/ KRW)",
      shoppingMax: "쇼핑 최대 (일/ KRW)",
      estimatedDaily: "가정 기준 일일 예상",
      estimatedTrip: "가정 기준 전체 예상",
      budgetGap: "예산 대비 차이",
      feedbackTitle: "전략 피드백",
      feedbackLowTransport: "교통 비중이 낮습니다. 이동 변동에 취약할 수 있습니다.",
      feedbackHighShopping: "쇼핑 비중이 높습니다. 체험/식사 예산 압박을 확인하세요.",
      feedbackLowFood: "식사 비중이 낮습니다. 실제 결제에서 초과 가능성이 큽니다.",
      feedbackBadTotal: "배분 합계가 100%가 아닙니다. 기준선을 먼저 고정하세요.",
      feedbackRisk: "현재 설계는 평균 소비 대비 부족합니다. 예산 또는 기간 조정이 필요합니다.",
      feedbackTight: "현재 설계는 타이트합니다. 교통/식사 완충 예산을 권장합니다.",
      feedbackRelaxed: "현재 설계는 평균 소비 대비 여유가 있습니다.",
      categories: {
        food: "식사",
        transport: "교통",
        shopping: "쇼핑",
        other: "기타",
      },
    };
  }

  return {
    title: "Strategy planner",
    lead: "See the result first, then tune your structure.",
    dailyBudget: "Daily budget (KRW)",
    budgetCurrency: "Base currency",
    tripDays: "Trip days",
    strategySummary: "Strategy summary",
    tripTotal: "Trip budget total",
    expectedAvg: "Expected average spend",
    status: "Plan status",
    statusRelaxed: "Relaxed",
    statusTight: "Tight",
    statusRisk: "Risk",
    categoryTitle: "Category allocation",
    percent: "Percent",
    amount: "Amount",
    allocationWarn: "Category total is not 100%.",
    normalize: "Normalize to 100%",
    assumptionsTitle: "Spend assumptions (Advanced)",
    assumptionsToggleOpen: "Open advanced settings",
    assumptionsToggleClose: "Close advanced settings",
    mealsPerDay: "Meals per day",
    mealAvg: "Average per meal (KRW)",
    transportPerDay: "Transport rides per day",
    transportAvg: "Average per ride (KRW)",
    shoppingMin: "Shopping min per day (KRW)",
    shoppingMax: "Shopping max per day (KRW)",
    estimatedDaily: "Estimated daily by assumptions",
    estimatedTrip: "Estimated trip by assumptions",
    budgetGap: "Gap vs budget",
    feedbackTitle: "Strategy feedback",
    feedbackLowTransport: "Transport share looks low. Add buffer for route changes.",
    feedbackHighShopping: "Shopping share is high. Check pressure on food/experience budget.",
    feedbackLowFood: "Food share looks low. Daily overrun risk is high.",
    feedbackBadTotal: "Allocation total is not 100%. Lock the baseline first.",
    feedbackRisk: "Current plan is below expected spend. Adjust budget or trip length.",
    feedbackTight: "Current plan is tight. Add transport/meal buffer.",
    feedbackRelaxed: "Current plan has healthy margin over expected spend.",
    categories: {
      food: "Food",
      transport: "Transport",
      shopping: "Shopping",
      other: "Other",
    },
  };
}

function numberInput(value: string | number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function PlanBudgetDesigner({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [dailyBudgetKrw, setDailyBudgetKrw] = useState(120000);
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [days, setDays] = useState(5);
  const [allocation, setAllocation] = useState<Allocation>({ food: 40, transport: 20, shopping: 30, other: 10 });

  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [mealAvg, setMealAvg] = useState(12000);
  const [transportPerDay, setTransportPerDay] = useState(3);
  const [transportAvg, setTransportAvg] = useState(1500);
  const [shoppingMin, setShoppingMin] = useState(15000);
  const [shoppingMax, setShoppingMax] = useState(40000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const rawBudget = localStorage.getItem(BUDGET_KEY);
    const rawCurrency = localStorage.getItem(PLAN_CURRENCY_KEY) as Currency | null;
    const rawDays = localStorage.getItem(PLAN_DAYS_KEY);
    const rawAllocation = localStorage.getItem(PLAN_ALLOC_KEY);
    const rawAssumptions = localStorage.getItem(PLAN_ASSUMPTIONS_KEY);

    if (rawBudget && !Number.isNaN(Number(rawBudget))) setDailyBudgetKrw(Math.max(0, Number(rawBudget)));
    if (rawCurrency && CURRENCIES.includes(rawCurrency)) setCurrency(rawCurrency);
    if (rawDays && !Number.isNaN(Number(rawDays))) setDays(Math.max(1, Math.round(Number(rawDays))));

    if (rawAllocation) {
      try {
        const parsed = JSON.parse(rawAllocation) as Partial<Allocation>;
        setAllocation((prev) => ({
          food: Number.isFinite(parsed.food) ? Number(parsed.food) : prev.food,
          transport: Number.isFinite(parsed.transport) ? Number(parsed.transport) : prev.transport,
          shopping: Number.isFinite(parsed.shopping) ? Number(parsed.shopping) : prev.shopping,
          other: Number.isFinite(parsed.other) ? Number(parsed.other) : prev.other,
        }));
      } catch {
        // ignore parse failure
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
        // ignore parse failure
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, String(Math.max(0, Math.round(dailyBudgetKrw))));
  }, [dailyBudgetKrw]);

  useEffect(() => {
    localStorage.setItem(PLAN_CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(PLAN_DAYS_KEY, String(Math.max(1, Math.round(days))));
  }, [days]);

  useEffect(() => {
    localStorage.setItem(PLAN_ALLOC_KEY, JSON.stringify(allocation));
  }, [allocation]);

  useEffect(() => {
    localStorage.setItem(
      PLAN_ASSUMPTIONS_KEY,
      JSON.stringify({ mealsPerDay, mealAvg, transportPerDay, transportAvg, shoppingMin, shoppingMax }),
    );
  }, [mealsPerDay, mealAvg, transportPerDay, transportAvg, shoppingMin, shoppingMax]);

  const safeDays = Math.max(1, Math.round(days));
  const safeBudget = Math.max(0, Math.round(dailyBudgetKrw));
  const allocationTotal = useMemo(() => CATEGORY_ORDER.reduce((sum, key) => sum + allocation[key], 0), [allocation]);

  const dailyAssumptionMin = mealsPerDay * mealAvg + transportPerDay * transportAvg + Math.min(shoppingMin, shoppingMax);
  const dailyAssumptionMax = mealsPerDay * mealAvg + transportPerDay * transportAvg + Math.max(shoppingMin, shoppingMax);
  const dailyAssumptionMid = (dailyAssumptionMin + dailyAssumptionMax) / 2;

  const tripBudgetTotal = safeBudget * safeDays;
  const tripAssumptionMin = dailyAssumptionMin * safeDays;
  const tripAssumptionMax = dailyAssumptionMax * safeDays;
  const tripAssumptionMid = dailyAssumptionMid * safeDays;
  const tripGapMid = tripBudgetTotal - tripAssumptionMid;

  const status: "relaxed" | "tight" | "risk" =
    tripGapMid >= tripBudgetTotal * 0.1 ? "relaxed" : tripGapMid >= -tripBudgetTotal * 0.05 ? "tight" : "risk";
  const statusLabel = status === "relaxed" ? c.statusRelaxed : status === "tight" ? c.statusTight : c.statusRisk;
  const statusTone = status === "relaxed" ? "text-emerald-700" : status === "tight" ? "text-amber-700" : "text-red-700";

  const feedback = useMemo(() => {
    const lines: string[] = [];
    if (allocationTotal !== 100) lines.push(c.feedbackBadTotal);
    if (allocation.transport < 15) lines.push(c.feedbackLowTransport);
    if (allocation.shopping > 40) lines.push(c.feedbackHighShopping);
    if (allocation.food < 25) lines.push(c.feedbackLowFood);
    if (status === "risk") lines.push(c.feedbackRisk);
    else if (status === "tight") lines.push(c.feedbackTight);
    else lines.push(c.feedbackRelaxed);
    return lines;
  }, [allocation.food, allocation.shopping, allocation.transport, allocationTotal, c, status]);

  function setPercent(category: Category, value: number) {
    setAllocation((prev) => ({ ...prev, [category]: Math.max(0, Math.min(100, Math.round(value))) }));
  }

  function normalizeAllocation() {
    const total = CATEGORY_ORDER.reduce((sum, key) => sum + allocation[key], 0);
    if (total <= 0) {
      setAllocation({ food: 40, transport: 20, shopping: 30, other: 10 });
      return;
    }

    const next: Allocation = { food: 0, transport: 0, shopping: 0, other: 0 };
    let assigned = 0;
    CATEGORY_ORDER.forEach((key, idx) => {
      if (idx === CATEGORY_ORDER.length - 1) {
        next[key] = Math.max(0, 100 - assigned);
      } else {
        const pct = Math.round((allocation[key] / total) * 100);
        next[key] = pct;
        assigned += pct;
      }
    });
    setAllocation(next);
  }

  const toneByCategory: Record<Category, string> = {
    food: "bg-emerald-500",
    transport: "bg-sky-500",
    shopping: "bg-fuchsia-500",
    other: "bg-zinc-500",
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h3 className="text-xl font-black tracking-tight text-zinc-950">{c.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{c.lead}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.dailyBudget}</p>
            <input
              type="number"
              min={0}
              value={safeBudget}
              onChange={(e) => setDailyBudgetKrw(Math.max(0, numberInput(e.target.value)))}
              className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
            />
          </label>
          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.budgetCurrency}</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm font-bold text-zinc-900 outline-none"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.tripDays}</p>
            <input
              type="number"
              min={1}
              value={safeDays}
              onChange={(e) => setDays(Math.max(1, numberInput(e.target.value) || 1))}
              className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-zinc-100">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">{c.strategySummary}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.dailyBudget}</p>
              <p className="mt-1 text-lg font-black text-white">₩{safeBudget.toLocaleString()}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.tripTotal}</p>
              <p className="mt-1 text-lg font-black text-white">₩{tripBudgetTotal.toLocaleString()}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.expectedAvg}</p>
              <p className="mt-1 text-lg font-black text-white">₩{Math.round(dailyAssumptionMid).toLocaleString()}</p>
            </article>
            <article>
              <p className="text-[11px] font-semibold text-zinc-400">{c.status}</p>
              <p className={`mt-1 text-lg font-black ${statusTone}`}>{statusLabel}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.categoryTitle}</h4>
          <button
            type="button"
            onClick={normalizeAllocation}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-700 hover:border-zinc-900"
          >
            {c.normalize}
          </button>
        </div>

        <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="flex h-full w-full">
            {CATEGORY_ORDER.map((key) => (
              <div key={key} className={toneByCategory[key]} style={{ width: `${Math.max(0, allocation[key])}%` }} />
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {CATEGORY_ORDER.map((key) => {
            const pct = allocation[key];
            const amount = (safeBudget * pct) / 100;
            return (
              <article key={key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_120px_150px] sm:items-center">
                  <p className="text-sm font-black text-zinc-900">{c.categories[key]}</p>
                  <label className="text-xs font-semibold text-zinc-600">
                    {c.percent}
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pct}
                      onChange={(e) => setPercent(key, numberInput(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm font-bold text-zinc-900"
                    />
                  </label>
                  <div>
                    <p className="text-xs font-semibold text-zinc-600">{c.amount}</p>
                    <p className="mt-1 text-sm font-black text-zinc-900">₩{Math.round(amount).toLocaleString()}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className={`mt-3 text-xs font-semibold ${allocationTotal === 100 ? "text-emerald-700" : "text-amber-700"}`}>
          {c.percent}: {allocationTotal}% {allocationTotal === 100 ? "" : `· ${c.allocationWarn}`}
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.assumptionsTitle}</h4>
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-700 hover:border-zinc-900"
          >
            {showAdvanced ? c.assumptionsToggleClose : c.assumptionsToggleOpen}
          </button>
        </div>

        {showAdvanced ? (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.mealsPerDay}</p>
                <input type="number" min={0} value={mealsPerDay} onChange={(e) => setMealsPerDay(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.mealAvg}</p>
                <input type="number" min={0} value={mealAvg} onChange={(e) => setMealAvg(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.transportPerDay}</p>
                <input type="number" min={0} value={transportPerDay} onChange={(e) => setTransportPerDay(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.transportAvg}</p>
                <input type="number" min={0} value={transportAvg} onChange={(e) => setTransportAvg(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.shoppingMin}</p>
                <input type="number" min={0} value={shoppingMin} onChange={(e) => setShoppingMin(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
              <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.shoppingMax}</p>
                <input type="number" min={0} value={shoppingMax} onChange={(e) => setShoppingMax(Math.max(0, numberInput(e.target.value)))} className="mt-1 w-full bg-transparent text-base font-black text-zinc-900 outline-none" />
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.estimatedDaily}</p>
                <p className="mt-1 text-sm font-black text-zinc-900">₩{Math.round(dailyAssumptionMin).toLocaleString()} - ₩{Math.round(dailyAssumptionMax).toLocaleString()}</p>
              </article>
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.estimatedTrip}</p>
                <p className="mt-1 text-sm font-black text-zinc-900">₩{Math.round(tripAssumptionMin).toLocaleString()} - ₩{Math.round(tripAssumptionMax).toLocaleString()}</p>
              </article>
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-600">{c.budgetGap}</p>
                <p className={`mt-1 text-sm font-black ${tripGapMid >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  ₩{Math.round(tripGapMid).toLocaleString()}
                </p>
              </article>
            </div>
          </>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h4 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.feedbackTitle}</h4>
        <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          {feedback.map((line) => (
            <p key={line}>- {line}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
