"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { ExpenseTracker } from "@/components/ExpenseTracker";

type Currency = "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD" | "GBP" | "AUD" | "CAD" | "SGD" | "THB" | "VND";

const RATES: Record<Currency, number> = {
  USD: 1400,
  EUR: 1520,
  JPY: 9.4,
  CNY: 195,
  TWD: 44,
  HKD: 179,
  GBP: 1780,
  AUD: 910,
  CAD: 1020,
  SGD: 1030,
  THB: 39,
  VND: 0.055,
};

const TOP_CURRENCIES: Currency[] = ["USD", "JPY", "CNY", "TWD", "HKD", "EUR"];
const ALL_CURRENCIES: Currency[] = ["USD", "EUR", "JPY", "CNY", "TWD", "HKD", "GBP", "AUD", "CAD", "SGD", "THB", "VND"];
const CALC_CURRENCY_KEY = "sv-calc-currency-v1";

function localeCurrency(lang: Lang): Currency {
  if (lang === "ja") return "JPY";
  if (lang === "zh-cn") return "CNY";
  if (lang === "zh-tw") return "TWD";
  if (lang === "zh-hk") return "HKD";
  return "USD";
}

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "체감 환율 계산기",
      desc: "가격이 오늘 예산에 얼마나 큰지 먼저 보세요.",
      amount: "가격 (KRW)",
      budget: "총 예산 (KRW)",
      daysLeft: "남은 일수",
      currency: "통화",
      result: "환산 금액",
      useRate: "오늘 예산 사용률",
      coffeeEq: "커피 기준",
      subwayEq: "지하철 기준",
      coffeeUnit: "잔",
      subwayUnit: "회",
      liveRate: "실시간 환율",
      fallback: "실시간 환율을 불러오지 못해 기본값을 사용 중입니다.",
      presets: "대표 가격 넣기",
      detail: "지출기록 상세 열기",
      detailDesc: "오늘 쓴 금액 기록/합산/예산 관리",
      presetList: [
        { label: "택시 단거리", amount: 9000 },
        { label: "카페 커피", amount: 5500 },
        { label: "식사 1회", amount: 12000 },
        { label: "올리브영 소액", amount: 30000 },
      ],
    };
  }
  if (lang === "ja") {
    return {
      title: "体感レート計算",
      desc: "この支出が今日の予算でどれだけ重いか先に確認。",
      amount: "価格 (KRW)",
      budget: "総予算 (KRW)",
      daysLeft: "残り日数",
      currency: "通貨",
      result: "換算金額",
      useRate: "今日予算の使用率",
      coffeeEq: "コーヒー換算",
      subwayEq: "地下鉄換算",
      coffeeUnit: "杯",
      subwayUnit: "回",
      liveRate: "ライブ為替",
      fallback: "ライブ為替を取得できず、既定値を使用中です。",
      presets: "代表価格を入力",
      detail: "支出記録の詳細を開く",
      detailDesc: "今日の支出記録・合計・予算管理",
      presetList: [
        { label: "タクシー短距離", amount: 9000 },
        { label: "カフェコーヒー", amount: 5500 },
        { label: "食事1回", amount: 12000 },
        { label: "オリヤン少額", amount: 30000 },
      ],
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "体感汇率计算器",
      desc: "先看这笔消费占你今天预算多少。",
      amount: "价格 (KRW)",
      budget: "总预算 (KRW)",
      daysLeft: "剩余天数",
      currency: "货币",
      result: "换算金额",
      useRate: "今日预算占比",
      coffeeEq: "约等于咖啡",
      subwayEq: "约等于地铁",
      coffeeUnit: "杯",
      subwayUnit: "次",
      liveRate: "实时汇率",
      fallback: "实时汇率获取失败，当前使用默认值。",
      presets: "快速填入常见金额",
      detail: "打开支出记录详情",
      detailDesc: "今日记录/合计/预算管理",
      presetList: [
        { label: "出租车短途", amount: 9000 },
        { label: "咖啡", amount: 5500 },
        { label: "一餐", amount: 12000 },
        { label: "橄榄洋小额", amount: 30000 },
      ],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "體感匯率計算器",
      desc: "先看這筆花費佔你今天預算多少。",
      amount: "價格 (KRW)",
      budget: "總預算 (KRW)",
      daysLeft: "剩餘天數",
      currency: "貨幣",
      result: "換算金額",
      useRate: "今日預算占比",
      coffeeEq: "約等於咖啡",
      subwayEq: "約等於地鐵",
      coffeeUnit: "杯",
      subwayUnit: "次",
      liveRate: "即時匯率",
      fallback: "即時匯率讀取失敗，正在使用預設值。",
      presets: "快速帶入常見金額",
      detail: "開啟支出紀錄詳情",
      detailDesc: "今日紀錄/總計/預算管理",
      presetList: [
        { label: "計程車短程", amount: 9000 },
        { label: "咖啡", amount: 5500 },
        { label: "一餐", amount: 12000 },
        { label: "Olive Young 小額", amount: 30000 },
      ],
    };
  }
  return {
    title: "Real Cost Calculator",
    desc: "See how heavy a price is against today's budget.",
    amount: "Price (KRW)",
    budget: "Trip budget (KRW)",
    daysLeft: "Days left",
    currency: "Currency",
    result: "Converted",
    useRate: "Today budget usage",
    coffeeEq: "Coffee equivalent",
    subwayEq: "Subway equivalent",
    coffeeUnit: "cups",
    subwayUnit: "rides",
    liveRate: "Live rate",
    fallback: "Live rate unavailable. Using fallback rate.",
    presets: "Quick price presets",
    detail: "Open expense tracker details",
    detailDesc: "Today log / totals / budget",
    presetList: [
      { label: "Taxi short ride", amount: 9000 },
      { label: "Cafe coffee", amount: 5500 },
      { label: "One meal", amount: 12000 },
      { label: "Olive Young small basket", amount: 30000 },
    ],
  };
}

export function TravelCalculator({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const localeDefault = localeCurrency(lang);
  const [amountKrw, setAmountKrw] = useState(12000);
  const [stayBudgetKrw, setStayBudgetKrw] = useState(600000);
  const [daysLeft, setDaysLeft] = useState(3);
  const [currency, setCurrency] = useState<Currency>(localeDefault);
  const [rate, setRate] = useState<number>(RATES[localeDefault]);
  const [rates, setRates] = useState<Record<Currency, number>>(RATES);
  const [isLiveRate, setIsLiveRate] = useState(false);

  const converted = useMemo(() => (rate > 0 ? amountKrw / rate : 0), [amountKrw, rate]);
  const todayBudget = useMemo(() => stayBudgetKrw / Math.max(1, daysLeft), [stayBudgetKrw, daysLeft]);
  const budgetUsage = useMemo(() => (todayBudget > 0 ? (amountKrw / todayBudget) * 100 : 0), [amountKrw, todayBudget]);
  const coffeeEq = useMemo(() => amountKrw / 5500, [amountKrw]);
  const subwayEq = useMemo(() => amountKrw / 1500, [amountKrw]);

  useEffect(() => {
    const rawCurrency = localStorage.getItem(CALC_CURRENCY_KEY) as Currency | null;
    if (rawCurrency && rates[rawCurrency]) {
      setCurrency(rawCurrency);
      setRate(rates[rawCurrency]);
    }
  }, [rates]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const applyRates = (next: Record<Currency, number>) => {
        if (cancelled) return;
        const merged = { ...RATES } as Record<Currency, number>;
        for (const code of ALL_CURRENCIES) {
          const v = next[code];
          if (typeof v === "number" && v > 0) merged[code] = v;
        }
        setRates(merged);
        setIsLiveRate(true);
      };

      const tryInternal = async () => {
        const res = await fetch("/api/exchange-rates");
        if (!res.ok) return false;
        const json = (await res.json()) as { ok: boolean; ratesKrwPerUnit?: Record<string, number> };
        if (!json.ok || !json.ratesKrwPerUnit) return false;
        applyRates(json.ratesKrwPerUnit as Record<Currency, number>);
        return true;
      };

      const tryDirect = async () => {
        const res = await fetch("https://open.er-api.com/v6/latest/KRW");
        if (!res.ok) return false;
        const json = (await res.json()) as { result?: string; rates?: Record<string, number>; conversion_rates?: Record<string, number> };
        const sourceRates = json.rates ?? json.conversion_rates;
        if (json.result !== "success" || !sourceRates) return false;

        const convertedRates: Record<Currency, number> = { ...RATES };
        for (const code of ALL_CURRENCIES) {
          const perKrw = sourceRates[code];
          if (typeof perKrw === "number" && perKrw > 0) {
            convertedRates[code] = Number((1 / perKrw).toFixed(6));
          }
        }
        applyRates(convertedRates);
        return true;
      };

      const okInternal = await tryInternal();
      if (!okInternal) {
        const okDirect = await tryDirect();
        if (!okDirect && !cancelled) setIsLiveRate(false);
      }
    })().catch(() => {
      if (!cancelled) setIsLiveRate(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CALC_CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    setRate(rates[currency]);
  }, [currency, rates]);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.amount}</p>
            <input
              type="number"
              min={0}
              value={amountKrw}
              onChange={(e) => setAmountKrw(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
            />
          </label>

          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.budget}</p>
            <input
              type="number"
              min={0}
              value={stayBudgetKrw}
              onChange={(e) => setStayBudgetKrw(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
            />
          </label>

          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.daysLeft}</p>
            <input
              type="number"
              min={1}
              value={daysLeft}
              onChange={(e) => setDaysLeft(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-full bg-transparent text-lg font-black text-zinc-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.currency}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {TOP_CURRENCIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(code)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${currency === code ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-900"}`}
              >
                {code}
              </button>
            ))}
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          >
            {ALL_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.result}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{converted.toFixed(2)} {currency}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.useRate}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{budgetUsage.toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.coffeeEq}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{coffeeEq.toFixed(1)} {c.coffeeUnit}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.subwayEq}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{subwayEq.toFixed(1)} {c.subwayUnit}</p>
          </div>
        </div>

        <p className="mt-3 text-xs font-semibold text-zinc-600">
          {c.liveRate}: 1 {currency} = ₩{rate.toLocaleString(undefined, { maximumFractionDigits: 3 })}
        </p>
        {!isLiveRate ? <p className="mt-1 text-[11px] font-semibold text-amber-700">{c.fallback}</p> : null}

        <div className="mt-4">
          <p className="text-xs font-semibold text-zinc-600">{c.presets}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {c.presetList.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setAmountKrw(item.amount)}
                className="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 py-2 text-left hover:border-zinc-900"
              >
                <span className="text-sm font-semibold text-zinc-800">{item.label}</span>
                <span className="text-sm font-black text-zinc-900">₩{item.amount.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <details className="rounded-2xl border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer list-none text-sm font-black text-zinc-900">{c.detail}</summary>
        <p className="mt-2 text-xs text-zinc-600">{c.detailDesc}</p>
        <div className="mt-4">
          <ExpenseTracker lang={lang} />
        </div>
      </details>
    </div>
  );
}
