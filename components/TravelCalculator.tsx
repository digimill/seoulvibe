"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Currency = "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD" | "GBP" | "AUD" | "CAD" | "SGD" | "THB" | "VND";

type PricePreset = {
  id: string;
  label: string;
  amountKrw: number;
};
type NotePreset = {
  id: string;
  label: string;
};

type CalcLogItem = {
  id: string;
  amountKrw: number;
  currency: Currency;
  rateKrwPerUnit: number;
  converted: number;
  note: string;
  createdAt: string;
};

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
const CALC_LOG_KEY = "sv-real-cost-log-v1";

function parseKrwInput(value: string): number {
  const input = value.trim().toLowerCase();
  if (!input) return 0;

  const normalized = input.replace(/,/g, "").replace(/\s+/g, "");
  const manMatch = normalized.match(/^(\d+(\.\d+)?)만$/);
  if (manMatch) {
    const n = Number(manMatch[1]);
    return Number.isFinite(n) ? Math.round(n * 10000) : 0;
  }
  const cheonMatch = normalized.match(/^(\d+(\.\d+)?)천$/);
  if (cheonMatch) {
    const n = Number(cheonMatch[1]);
    return Number.isFinite(n) ? Math.round(n * 1000) : 0;
  }

  const digitsOnly = normalized.replace(/[^\d.]/g, "");
  const parsed = Number(digitsOnly);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function formatKrwInput(value: string): string {
  if (!value) return "";
  if (/[만천]/.test(value)) return value;
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString();
}

function parseNumberInput(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatForeignInput(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function localeCurrency(lang: Lang): Currency {
  if (lang === "ja") return "JPY";
  if (lang === "zh-cn") return "CNY";
  if (lang === "zh-tw") return "TWD";
  if (lang === "zh-hk") return "HKD";
  return "USD";
}

function presetsForLang(lang: Lang): PricePreset[] {
  if (lang === "ko") {
    return [
      { id: "subway", label: "지하철 1회", amountKrw: 1500 },
      { id: "coffee", label: "카페 커피 1잔", amountKrw: 5500 },
      { id: "bigmac", label: "빅맥 세트", amountKrw: 7900 },
      { id: "meal", label: "일반 식사 1회", amountKrw: 12000 },
      { id: "taxi-short", label: "택시 단거리", amountKrw: 9000 },
      { id: "airport-arex", label: "AREX 일반열차", amountKrw: 4750 },
      { id: "olive-small", label: "올리브영 소액", amountKrw: 30000 },
      { id: "convenience", label: "편의점 간식", amountKrw: 4000 },
    ];
  }
  if (lang === "ja") {
    return [
      { id: "subway", label: "地下鉄1回", amountKrw: 1500 },
      { id: "coffee", label: "カフェコーヒー", amountKrw: 5500 },
      { id: "bigmac", label: "ビッグマックセット", amountKrw: 7900 },
      { id: "meal", label: "一般的な食事1回", amountKrw: 12000 },
      { id: "taxi-short", label: "タクシー短距離", amountKrw: 9000 },
      { id: "airport-arex", label: "AREX一般列車", amountKrw: 4750 },
      { id: "olive-small", label: "Olive Young少額", amountKrw: 30000 },
      { id: "convenience", label: "コンビニ軽食", amountKrw: 4000 },
    ];
  }
  if (lang === "zh-cn") {
    return [
      { id: "subway", label: "地铁单程", amountKrw: 1500 },
      { id: "coffee", label: "咖啡一杯", amountKrw: 5500 },
      { id: "bigmac", label: "巨无霸套餐", amountKrw: 7900 },
      { id: "meal", label: "普通一餐", amountKrw: 12000 },
      { id: "taxi-short", label: "短途出租车", amountKrw: 9000 },
      { id: "airport-arex", label: "AREX普通列车", amountKrw: 4750 },
      { id: "olive-small", label: "Olive Young小额", amountKrw: 30000 },
      { id: "convenience", label: "便利店小吃", amountKrw: 4000 },
    ];
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return [
      { id: "subway", label: "地鐵單程", amountKrw: 1500 },
      { id: "coffee", label: "咖啡一杯", amountKrw: 5500 },
      { id: "bigmac", label: "大麥克套餐", amountKrw: 7900 },
      { id: "meal", label: "一般一餐", amountKrw: 12000 },
      { id: "taxi-short", label: "短程計程車", amountKrw: 9000 },
      { id: "airport-arex", label: "AREX普通列車", amountKrw: 4750 },
      { id: "olive-small", label: "Olive Young小額", amountKrw: 30000 },
      { id: "convenience", label: "便利店零食", amountKrw: 4000 },
    ];
  }
  return [
    { id: "subway", label: "Subway single ride", amountKrw: 1500 },
    { id: "coffee", label: "Cafe coffee", amountKrw: 5500 },
    { id: "bigmac", label: "Big Mac set", amountKrw: 7900 },
    { id: "meal", label: "Regular meal", amountKrw: 12000 },
    { id: "taxi-short", label: "Taxi short ride", amountKrw: 9000 },
    { id: "airport-arex", label: "AREX all-stop train", amountKrw: 4750 },
    { id: "olive-small", label: "Olive Young small basket", amountKrw: 30000 },
    { id: "convenience", label: "Convenience snack", amountKrw: 4000 },
  ];
}

function notePresetsForLang(lang: Lang): NotePreset[] {
  if (lang === "ko") {
    return [
      { id: "coffee", label: "☕ 커피" },
      { id: "meal", label: "🍜 식사" },
      { id: "transport", label: "🚇 교통" },
      { id: "shopping", label: "🛍 쇼핑" },
      { id: "ticket", label: "🎟 입장료" },
      { id: "snack", label: "🥐 간식" },
    ];
  }
  if (lang === "ja") {
    return [
      { id: "coffee", label: "☕ コーヒー" },
      { id: "meal", label: "🍜 食事" },
      { id: "transport", label: "🚇 交通" },
      { id: "shopping", label: "🛍 買い物" },
      { id: "ticket", label: "🎟 入場料" },
      { id: "snack", label: "🥐 軽食" },
    ];
  }
  if (lang === "zh-cn") {
    return [
      { id: "coffee", label: "☕ 咖啡" },
      { id: "meal", label: "🍜 餐饮" },
      { id: "transport", label: "🚇 交通" },
      { id: "shopping", label: "🛍 购物" },
      { id: "ticket", label: "🎟 门票" },
      { id: "snack", label: "🥐 零食" },
    ];
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return [
      { id: "coffee", label: "☕ 咖啡" },
      { id: "meal", label: "🍜 餐飲" },
      { id: "transport", label: "🚇 交通" },
      { id: "shopping", label: "🛍 購物" },
      { id: "ticket", label: "🎟 門票" },
      { id: "snack", label: "🥐 零食" },
    ];
  }
  return [
    { id: "coffee", label: "☕ Coffee" },
    { id: "meal", label: "🍜 Meal" },
    { id: "transport", label: "🚇 Transport" },
    { id: "shopping", label: "🛍 Shopping" },
    { id: "ticket", label: "🎟 Ticket" },
    { id: "snack", label: "🥐 Snack" },
  ];
}

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "환율 계산기",
      desc: "KRW와 내 통화를 바로 변환하세요.",
      amountKrw: "금액 (KRW)",
      amountForeign: "금액 (선택 통화)",
      currency: "통화",
      liveRate: "실시간 환율",
      updated: "업데이트",
      fallback: "실시간 환율을 불러오지 못해 기본값을 사용 중입니다.",
      mathTitle: "빠른 계산",
      mathHint: "인원 나누기/수량 곱하기",
      mathInput: "직접 n",
      mathMultiply: "곱하기",
      mathDivide: "나누기",
      mathMore: "빠른 계산 열기",
      mathLess: "빠른 계산 접기",
      refTitle: "대표 물가 참고",
      refMore: "대표 물가로 감잡기",
      refLess: "프리셋 접기",
      memo: "메모 (선택)",
      noteQuick: "빠른 메모",
      saveResult: "이 결과 저장",
      logTitle: "계산 로그",
      logDesc: "저장한 계산값과 메모를 보고 합계를 확인하세요.",
      logEmpty: "저장된 로그가 없습니다.",
      clearAll: "전체 삭제",
      remove: "삭제",
      sumKrw: "합계 (KRW)",
      sumCurrency: "합계 (선택 통화)",
    };
  }
  if (lang === "ja") {
    return {
      title: "為替計算機",
      desc: "KRWと自分の通貨をすぐ変換。",
      amountKrw: "金額 (KRW)",
      amountForeign: "金額 (選択通貨)",
      currency: "通貨",
      liveRate: "ライブ為替",
      updated: "更新",
      fallback: "ライブ為替を取得できず、既定値を使用中です。",
      mathTitle: "クイック計算",
      mathHint: "人数割り/数量掛け算",
      mathInput: "nを入力",
      mathMultiply: "掛ける",
      mathDivide: "割る",
      mathMore: "クイック計算を開く",
      mathLess: "クイック計算を閉じる",
      refTitle: "相場の目安",
      refMore: "相場を確認",
      refLess: "折りたたむ",
      memo: "メモ (任意)",
      noteQuick: "クイックメモ",
      saveResult: "この結果を保存",
      logTitle: "計算ログ",
      logDesc: "保存した計算結果とメモ。合計も確認できます。",
      logEmpty: "保存されたログはまだありません。",
      clearAll: "すべて削除",
      remove: "削除",
      sumKrw: "合計 (KRW)",
      sumCurrency: "合計 (選択通貨)",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "汇率计算器",
      desc: "韩元和本币快速双向换算。",
      amountKrw: "金额 (KRW)",
      amountForeign: "金额（所选货币）",
      currency: "货币",
      liveRate: "实时汇率",
      updated: "更新时间",
      fallback: "实时汇率获取失败，当前使用默认值。",
      mathTitle: "快速计算",
      mathHint: "按人数平摊/按数量放大",
      mathInput: "输入 n",
      mathMultiply: "乘",
      mathDivide: "除",
      mathMore: "打开快速计算",
      mathLess: "收起快速计算",
      refTitle: "常见价格参考",
      refMore: "用常见价格估算",
      refLess: "收起预设",
      memo: "备注（可选）",
      noteQuick: "快速备注",
      saveResult: "保存此结果",
      logTitle: "计算记录",
      logDesc: "查看已保存结果和备注，并自动合计。",
      logEmpty: "还没有保存记录。",
      clearAll: "清空",
      remove: "删除",
      sumKrw: "合计 (KRW)",
      sumCurrency: "合计 (所选货币)",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "匯率計算器",
      desc: "韓元與本幣快速雙向換算。",
      amountKrw: "金額 (KRW)",
      amountForeign: "金額（所選貨幣）",
      currency: "貨幣",
      liveRate: "即時匯率",
      updated: "更新時間",
      fallback: "即時匯率讀取失敗，正在使用預設值。",
      mathTitle: "快速計算",
      mathHint: "按人數分攤/按數量放大",
      mathInput: "輸入 n",
      mathMultiply: "乘",
      mathDivide: "除",
      mathMore: "打開快速計算",
      mathLess: "收起快速計算",
      refTitle: "常見價格參考",
      refMore: "用常見價格估算",
      refLess: "收起預設",
      memo: "備註（可選）",
      noteQuick: "快速備註",
      saveResult: "儲存此結果",
      logTitle: "計算紀錄",
      logDesc: "查看已儲存結果與備註，並自動合計。",
      logEmpty: "目前沒有儲存紀錄。",
      clearAll: "清空",
      remove: "刪除",
      sumKrw: "總計 (KRW)",
      sumCurrency: "總計 (所選貨幣)",
    };
  }
  return {
    title: "Exchange Calculator",
    desc: "Convert KRW and your currency both ways.",
    amountKrw: "Amount (KRW)",
    amountForeign: "Amount (Selected currency)",
    currency: "Currency",
    liveRate: "Live rate",
    updated: "Updated",
    fallback: "Live rate unavailable. Using fallback rate.",
    mathTitle: "Quick math",
    mathHint: "Split by people or multiply by quantity",
    mathInput: "Enter n",
    mathMultiply: "Multiply",
    mathDivide: "Divide",
    mathMore: "Open quick math",
    mathLess: "Hide quick math",
    refTitle: "Reference prices",
    refMore: "Use reference prices",
    refLess: "Hide presets",
    memo: "Memo (optional)",
    noteQuick: "Quick note",
    saveResult: "Save this result",
    logTitle: "Calculation log",
    logDesc: "Saved conversions and notes with automatic totals.",
    logEmpty: "No saved results yet.",
    clearAll: "Clear all",
    remove: "Remove",
    sumKrw: "Total (KRW)",
    sumCurrency: "Total (selected currency)",
  };
}

export function TravelCalculator({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const presetList = presetsForLang(lang);
  const notePresets = notePresetsForLang(lang);
  const localeDefault = localeCurrency(lang);

  const [amountInput, setAmountInput] = useState("12,000");
  const [foreignInput, setForeignInput] = useState("8.57");
  const [amountKrw, setAmountKrw] = useState(12000);
  const [currency, setCurrency] = useState<Currency>(localeDefault);
  const [rates, setRates] = useState<Record<Currency, number>>(RATES);
  const [isLiveRate, setIsLiveRate] = useState(false);
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);
  const [memoInput, setMemoInput] = useState("");
  const [logItems, setLogItems] = useState<CalcLogItem[]>([]);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [showQuickMath, setShowQuickMath] = useState(false);
  const [mathN, setMathN] = useState("4");
  const [isCalcInputFocused, setIsCalcInputFocused] = useState(false);

  const currentRate = rates[currency] ?? RATES[currency];
  const converted = currentRate > 0 ? amountKrw / currentRate : 0;
  const totalKrw = useMemo(() => logItems.reduce((sum, item) => sum + item.amountKrw, 0), [logItems]);
  const totalInSelectedCurrency = currentRate > 0 ? totalKrw / currentRate : 0;

  useEffect(() => {
    const rawCurrency = localStorage.getItem(CALC_CURRENCY_KEY) as Currency | null;
    if (rawCurrency && RATES[rawCurrency]) setCurrency(rawCurrency);

    const rawLogs = localStorage.getItem(CALC_LOG_KEY);
    if (!rawLogs) return;
    try {
      const parsed = JSON.parse(rawLogs) as CalcLogItem[];
      if (Array.isArray(parsed)) setLogItems(parsed);
    } catch {
      setLogItems([]);
    }
  }, []);

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
        const json = (await res.json()) as { ok: boolean; ratesKrwPerUnit?: Record<string, number>; updatedAt?: string | null };
        if (!json.ok || !json.ratesKrwPerUnit) return false;
        applyRates(json.ratesKrwPerUnit as Record<Currency, number>);
        setRateUpdatedAt(json.updatedAt ?? null);
        return true;
      };

      const tryDirect = async () => {
        const res = await fetch("https://open.er-api.com/v6/latest/KRW");
        if (!res.ok) return false;
        const json = (await res.json()) as { result?: string; rates?: Record<string, number>; conversion_rates?: Record<string, number>; time_last_update_utc?: string };
        const sourceRates = json.rates ?? json.conversion_rates;
        if (json.result !== "success" || !sourceRates) return false;

        const convertedRates: Record<Currency, number> = { ...RATES };
        for (const code of ALL_CURRENCIES) {
          const perKrw = sourceRates[code];
          if (typeof perKrw === "number" && perKrw > 0) convertedRates[code] = Number((1 / perKrw).toFixed(6));
        }
        applyRates(convertedRates);
        setRateUpdatedAt(json.time_last_update_utc ?? null);
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
    localStorage.setItem(CALC_LOG_KEY, JSON.stringify(logItems));
  }, [logItems]);

  useEffect(() => {
    setForeignInput(formatForeignInput(converted));
  }, [converted, currency]);

  function applyAmount(nextKrw: number) {
    const safe = Math.max(0, Math.round(nextKrw));
    setAmountKrw(safe);
    setAmountInput(safe > 0 ? safe.toLocaleString() : "");
    setForeignInput(formatForeignInput(currentRate > 0 ? safe / currentRate : 0));
  }

  function handleAmountInputChange(next: string) {
    setAmountInput(formatKrwInput(next));
    setAmountKrw(parseKrwInput(next));
  }

  function handleForeignInputChange(next: string) {
    setForeignInput(next);
    const parsedForeign = parseNumberInput(next);
    applyAmount(parsedForeign * currentRate);
  }

  function multiplyBy(factor: number) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    applyAmount(amountKrw * factor);
  }

  function divideBy(divisor: number) {
    if (!Number.isFinite(divisor) || divisor <= 0) return;
    applyAmount(amountKrw / divisor);
  }

  function saveCurrentResult() {
    if (!Number.isFinite(amountKrw) || amountKrw <= 0 || !Number.isFinite(currentRate) || currentRate <= 0) return;
    const nextItem: CalcLogItem = {
      id: crypto.randomUUID(),
      amountKrw: Math.round(amountKrw),
      currency,
      rateKrwPerUnit: currentRate,
      converted: Number(converted.toFixed(2)),
      note: memoInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setLogItems((prev) => [nextItem, ...prev]);
    setMemoInput("");
  }

  function updateNote(id: string, nextNote: string) {
    setLogItems((prev) => prev.map((item) => (item.id === id ? { ...item, note: nextNote } : item)));
  }

  function addNotePreset(note: string) {
    setMemoInput((prev) => (prev.trim() ? `${prev} · ${note}` : note));
  }

  function handleCalcInputFocus() {
    setIsCalcInputFocused(true);
  }

  function handleCalcInputBlur() {
    window.setTimeout(() => {
      setIsCalcInputFocused(false);
    }, 120);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

        <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.amountKrw}</p>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9,만천.]*"
                enterKeyHint="done"
                autoComplete="off"
                value={amountInput}
                onChange={(e) => handleAmountInputChange(e.target.value)}
                onFocus={handleCalcInputFocus}
                onBlur={handleCalcInputBlur}
                className="mt-1 w-full bg-transparent text-xl font-black text-zinc-900 outline-none"
              />
            </label>

            <label className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.amountForeign}</p>
              <input
                type="text"
                inputMode="decimal"
                enterKeyHint="done"
                autoComplete="off"
                value={foreignInput}
                onChange={(e) => handleForeignInputChange(e.target.value)}
                onFocus={handleCalcInputFocus}
                onBlur={handleCalcInputBlur}
                className="mt-1 w-full bg-transparent text-xl font-black text-zinc-900 outline-none"
              />
            </label>
          </div>

          <p className="mt-3 text-xs font-semibold text-zinc-700">
            {c.liveRate}: 1 {currency} = ₩{currentRate.toLocaleString(undefined, { maximumFractionDigits: 3 })}
          </p>
          {rateUpdatedAt ? (
            <p className="mt-1 text-[11px] font-semibold text-zinc-500">
              {c.updated}: {new Date(rateUpdatedAt).toLocaleString()}
            </p>
          ) : null}
          {!isLiveRate ? <p className="mt-1 text-[11px] font-semibold text-amber-700">{c.fallback}</p> : null}
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
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

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-600">{c.mathTitle}</p>
            <button
              type="button"
              onClick={() => setShowQuickMath((prev) => !prev)}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-900"
            >
              {showQuickMath ? c.mathLess : c.mathMore}
            </button>
          </div>
          {showQuickMath ? (
            <>
              <p className="mt-1 text-[11px] font-semibold text-zinc-500">{c.mathHint}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => multiplyBy(2)} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-800 hover:border-zinc-900">×2</button>
                <button type="button" onClick={() => multiplyBy(3)} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-800 hover:border-zinc-900">×3</button>
                <button type="button" onClick={() => divideBy(2)} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-800 hover:border-zinc-900">÷2</button>
                <button type="button" onClick={() => divideBy(3)} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-800 hover:border-zinc-900">÷3</button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-[120px_auto_auto]">
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="done"
                  min={1}
                  value={mathN}
                  onChange={(e) => setMathN(e.target.value)}
                  aria-label={c.mathInput}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => multiplyBy(Number(mathN) || 1)}
                  className="rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800"
                >
                  × n {c.mathMultiply}
                </button>
                <button
                  type="button"
                  onClick={() => divideBy(Number(mathN) || 1)}
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-800 hover:border-zinc-900"
                >
                  ÷ n {c.mathDivide}
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-600">{c.refTitle}</p>
            <button
              type="button"
              onClick={() => setShowAllPresets((prev) => !prev)}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-900"
            >
              {showAllPresets ? c.refLess : c.refMore}
            </button>
          </div>
          {showAllPresets ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {presetList.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyAmount(preset.amountKrw)}
                  className="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 py-2 text-left hover:border-zinc-900"
                >
                  <span className="text-sm font-semibold text-zinc-800">{preset.label}</span>
                  <span className="text-sm font-black text-zinc-900">₩{preset.amountKrw.toLocaleString()}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <label>
            <p className="text-xs font-semibold text-zinc-600">{c.memo}</p>
            <p className="mt-1 text-[11px] font-semibold text-zinc-500">{c.noteQuick}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {notePresets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addNotePreset(item.label)}
                  className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
                  aria-label={`${c.noteQuick}: ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={memoInput}
              onChange={(e) => setMemoInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
            />
          </label>
          <button
            type="button"
            onClick={saveCurrentResult}
            className="self-end rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800"
          >
            {c.saveResult}
          </button>
        </div>
      </section>

      {isCalcInputFocused ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 p-2 pb-[calc(env(safe-area-inset-bottom)+8px)] backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuickMath((prev) => !prev)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${showQuickMath ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-800"}`}
            >
              {c.mathTitle}
            </button>
            <button
              type="button"
              onClick={() => setShowAllPresets((prev) => !prev)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${showAllPresets ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-800"}`}
            >
              {c.refTitle}
            </button>
            <button
              type="button"
              onClick={() => {
                const active = document.activeElement as HTMLElement | null;
                active?.blur();
                setIsCalcInputFocused(false);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-800"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-zinc-900">{c.logTitle}</h3>
            <p className="mt-1 text-xs text-zinc-600">{c.logDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => setLogItems([])}
            className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-bold text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
          >
            {c.clearAll}
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.sumKrw}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">₩{totalKrw.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.sumCurrency}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{totalInSelectedCurrency.toFixed(2)} {currency}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {logItems.length === 0 ? (
            <p className="text-sm text-zinc-500">{c.logEmpty}</p>
          ) : (
            logItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-zinc-900">₩{item.amountKrw.toLocaleString()} -&gt; {item.converted.toFixed(2)} {item.currency}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-500">
                      1 {item.currency} = ₩{item.rateKrwPerUnit.toLocaleString(undefined, { maximumFractionDigits: 3 })} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogItems((prev) => prev.filter((x) => x.id !== item.id))}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                  >
                    {c.remove}
                  </button>
                </div>
                <input
                  type="text"
                  value={item.note}
                  onChange={(e) => updateNote(item.id, e.target.value)}
                  placeholder={c.memo}
                  className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                />
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
