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
const CALC_RATE_KEY = "sv-calc-rate-v1";

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
      title: "빠른 계산기",
      desc: "원화 기준으로 빠르게 환산하세요.",
      amount: "금액 (KRW)",
      rate: "환율 (1통화 = KRW)",
      result: "환산 결과",
      presets: "대표 물가",
      detail: "지출기록 상세 열기",
      detailDesc: "오늘 지출 기록/합산/예산관리",
      presetList: [
        { label: "택시(단거리)", amount: 9000 },
        { label: "카페 커피", amount: 5500 },
        { label: "식사 1회", amount: 12000 },
        { label: "지하철(1일)", amount: 5000 },
      ],
    };
  }
  if (lang === "ja") {
    return {
      title: "クイック計算機",
      desc: "KRW基準ですぐ換算。",
      amount: "金額 (KRW)",
      rate: "為替 (1通貨 = KRW)",
      result: "換算結果",
      presets: "相場の目安",
      detail: "支出記録の詳細を開く",
      detailDesc: "今日の記録・合計・予算管理",
      presetList: [
        { label: "タクシー(短距離)", amount: 9000 },
        { label: "コーヒー", amount: 5500 },
        { label: "食事1回", amount: 12000 },
        { label: "地下鉄(1日)", amount: 5000 },
      ],
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "快速计算器",
      desc: "按 KRW 快速换算。",
      amount: "金额 (KRW)",
      rate: "汇率 (1货币 = KRW)",
      result: "换算结果",
      presets: "常见物价",
      detail: "打开支出记录详情",
      detailDesc: "今日记录/合计/预算管理",
      presetList: [
        { label: "出租车(短途)", amount: 9000 },
        { label: "咖啡", amount: 5500 },
        { label: "一顿简餐", amount: 12000 },
        { label: "地铁(1天)", amount: 5000 },
      ],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "快速計算器",
      desc: "以 KRW 快速換算。",
      amount: "金額 (KRW)",
      rate: "匯率 (1貨幣 = KRW)",
      result: "換算結果",
      presets: "常見物價",
      detail: "開啟支出紀錄詳情",
      detailDesc: "今日紀錄/總計/預算管理",
      presetList: [
        { label: "計程車(短程)", amount: 9000 },
        { label: "咖啡", amount: 5500 },
        { label: "一餐簡餐", amount: 12000 },
        { label: "地鐵(1日)", amount: 5000 },
      ],
    };
  }
  return {
    title: "Quick Calculator",
    desc: "Convert fast with KRW as base.",
    amount: "Amount (KRW)",
    rate: "Rate (1 currency = KRW)",
    result: "Converted",
    presets: "Typical prices",
    detail: "Open expense tracker details",
    detailDesc: "Today log / totals / budget",
    presetList: [
      { label: "Taxi (short)", amount: 9000 },
      { label: "Coffee", amount: 5500 },
      { label: "Meal", amount: 12000 },
      { label: "Subway (day)", amount: 5000 },
    ],
  };
}

export function TravelCalculator({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const localeDefault = localeCurrency(lang);
  const [amountKrw, setAmountKrw] = useState(10000);
  const [currency, setCurrency] = useState<Currency>(localeDefault);
  const [rate, setRate] = useState<number>(RATES[localeDefault]);
  const [rates, setRates] = useState<Record<Currency, number>>(RATES);
  const converted = useMemo(() => (rate > 0 ? amountKrw / rate : 0), [amountKrw, rate]);

  useEffect(() => {
    const rawCurrency = localStorage.getItem(CALC_CURRENCY_KEY) as Currency | null;
    const rawRate = localStorage.getItem(CALC_RATE_KEY);
    if (rawCurrency && rates[rawCurrency]) {
      setCurrency(rawCurrency);
      setRate(rates[rawCurrency]);
    }
    if (rawRate && !Number.isNaN(Number(rawRate))) setRate(Number(rawRate));
  }, [rates]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/exchange-rates");
        if (!res.ok) return;
        const json = (await res.json()) as { ok: boolean; ratesKrwPerUnit?: Record<string, number> };
        if (!json.ok || !json.ratesKrwPerUnit || cancelled) return;
        const merged = { ...RATES } as Record<Currency, number>;
        for (const code of ALL_CURRENCIES) {
          const v = json.ratesKrwPerUnit[code];
          if (typeof v === "number" && v > 0) merged[code] = v;
        }
        setRates(merged);
      } catch {
        // keep fallback rates
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CALC_CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(CALC_RATE_KEY, String(rate));
  }, [rate]);

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

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">Currency</p>
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
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.result}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{converted.toFixed(2)} {currency}</p>
          </div>
        </div>

        <div className="mt-3">
          <label className="block">
            <p className="text-xs font-semibold text-zinc-600">{c.rate}</p>
            <input
              type="number"
              min={0}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
            />
          </label>
        </div>

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
