"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Category = "transport" | "food" | "shopping" | "other";

type ExpenseItem = {
  id: string;
  amountKrw: number;
  category: Category;
  note: string;
  createdAt: string;
};

type ExpenseTrackerProps = {
  lang: Lang;
};

type Currency = "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD" | "GBP" | "AUD" | "CAD" | "SGD" | "THB" | "VND";

type PricePreset = {
  id: string;
  label: string;
  amountKrw: number;
  category: Category;
};

function getCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "오늘 지출 기록",
      desc: "쓴 금액을 바로 넣고 합계를 확인하세요.",
      amount: "금액 (KRW)",
      category: "카테고리",
      note: "메모",
      add: "추가",
      budget: "오늘 예산 (KRW)",
      total: "오늘 합계",
      remain: "남은 예산",
      list: "기록",
      empty: "아직 기록이 없습니다.",
      remove: "삭제",
      convert: "환산 보기",
      rate: "환율 (1통화 = KRW)",
      topCurrencies: "대표 통화",
      allCurrencies: "전체 통화",
      quick: "빠른 입력",
      snapshot: "대표 물가",
      natural: "자유입력",
      naturalHint: "예) 택시 12000원 / coffee $4.5 / 점심 15000",
      naturalAdd: "문장으로 추가",
      parseFail: "금액을 찾지 못했습니다. 숫자를 포함해 입력해 주세요.",
      categories: {
        transport: "교통",
        food: "식비",
        shopping: "쇼핑",
        other: "기타",
      },
    };
  }
  if (lang === "ja") {
    return {
      title: "今日の支出記録",
      desc: "使った金額を入れて合計をすぐ確認。",
      amount: "金額 (KRW)",
      category: "カテゴリ",
      note: "メモ",
      add: "追加",
      budget: "今日の予算 (KRW)",
      total: "今日の合計",
      remain: "残り予算",
      list: "記録",
      empty: "まだ記録がありません。",
      remove: "削除",
      convert: "通貨換算",
      rate: "為替 (1通貨 = KRW)",
      topCurrencies: "主要通貨",
      allCurrencies: "全通貨",
      quick: "クイック入力",
      snapshot: "相場の目安",
      natural: "自由入力",
      naturalHint: "例) タクシー 12000ウォン / coffee $4.5 / ランチ 15000",
      naturalAdd: "文章で追加",
      parseFail: "金額を読み取れませんでした。数字を含めてください。",
      categories: {
        transport: "交通",
        food: "食費",
        shopping: "買い物",
        other: "その他",
      },
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "今日支出记录",
      desc: "马上记录金额并查看合计。",
      amount: "金额 (KRW)",
      category: "分类",
      note: "备注",
      add: "添加",
      budget: "今日预算 (KRW)",
      total: "今日合计",
      remain: "剩余预算",
      list: "记录",
      empty: "还没有记录。",
      remove: "删除",
      convert: "换算",
      rate: "汇率 (1货币 = KRW)",
      topCurrencies: "常用货币",
      allCurrencies: "全部货币",
      quick: "快速输入",
      snapshot: "常见物价",
      natural: "自然语言输入",
      naturalHint: "例) 出租车 12000韩元 / coffee $4.5 / 午饭 15000",
      naturalAdd: "按句子添加",
      parseFail: "未识别到金额，请输入数字。",
      categories: {
        transport: "交通",
        food: "餐饮",
        shopping: "购物",
        other: "其他",
      },
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "今日支出紀錄",
      desc: "立即記錄金額並查看總和。",
      amount: "金額 (KRW)",
      category: "分類",
      note: "備註",
      add: "新增",
      budget: "今日預算 (KRW)",
      total: "今日總計",
      remain: "剩餘預算",
      list: "紀錄",
      empty: "還沒有紀錄。",
      remove: "刪除",
      convert: "換算",
      rate: "匯率 (1貨幣 = KRW)",
      topCurrencies: "常用貨幣",
      allCurrencies: "全部貨幣",
      quick: "快速輸入",
      snapshot: "常見物價",
      natural: "自然語言輸入",
      naturalHint: "例) 計程車 12000韓元 / coffee $4.5 / 午餐 15000",
      naturalAdd: "用句子新增",
      parseFail: "無法辨識金額，請輸入數字。",
      categories: {
        transport: "交通",
        food: "餐飲",
        shopping: "購物",
        other: "其他",
      },
    };
  }
  return {
    title: "Today Expense Tracker",
    desc: "Log spending now and see totals instantly.",
    amount: "Amount (KRW)",
    category: "Category",
    note: "Note",
    add: "Add",
    budget: "Daily budget (KRW)",
    total: "Today total",
    remain: "Budget left",
    list: "Entries",
    empty: "No entries yet.",
    remove: "Remove",
    convert: "Conversion",
    rate: "Rate (1 currency = KRW)",
    topCurrencies: "Top currencies",
    allCurrencies: "All currencies",
    quick: "Quick add",
    snapshot: "Price snapshot",
    natural: "Natural input",
    naturalHint: "Ex) taxi 12000 krw / coffee $4.5 / lunch 15000",
    naturalAdd: "Add from sentence",
    parseFail: "Could not detect amount. Please include a number.",
    categories: {
      transport: "Transport",
      food: "Food",
      shopping: "Shopping",
      other: "Other",
    },
  };
}

const STORAGE_KEY = "sv-expense-tracker-v1";
const BUDGET_KEY = "sv-expense-budget-v1";
const CURRENCY_KEY = "sv-expense-currency-v1";
const QUICK_AMOUNTS = [4500, 10000, 15000, 30000];
const DEFAULT_RATES: Record<Currency, number> = {
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

const CURRENCY_PATTERNS: Array<{ code: Currency; pattern: RegExp }> = [
  { code: "USD", pattern: /(\$|usd|dollar|달러)/i },
  { code: "EUR", pattern: /(€|eur)/i },
  { code: "JPY", pattern: /(jpy|yen|엔|円|엔화)/i },
  { code: "CNY", pattern: /(cny|rmb|yuan|위안|元)/i },
  { code: "TWD", pattern: /(twd|ntd|대만달러)/i },
  { code: "HKD", pattern: /(hkd|hk\$|홍콩달러)/i },
];

function getDefaultCurrencyByLocale(lang: Lang): Currency {
  if (lang === "ja") return "JPY";
  if (lang === "zh-cn") return "CNY";
  if (lang === "zh-tw") return "TWD";
  if (lang === "zh-hk") return "HKD";
  return "USD";
}

function getPricePresets(lang: Lang): PricePreset[] {
  if (lang === "ko") {
    return [
      { id: "taxi-short", label: "택시(단거리)", amountKrw: 9000, category: "transport" },
      { id: "coffee", label: "카페 커피 1잔", amountKrw: 5500, category: "food" },
      { id: "meal", label: "식사 1회", amountKrw: 12000, category: "food" },
      { id: "subway-pass", label: "지하철 이동(1일)", amountKrw: 5000, category: "transport" },
    ];
  }
  if (lang === "ja") {
    return [
      { id: "taxi-short", label: "タクシー(短距離)", amountKrw: 9000, category: "transport" },
      { id: "coffee", label: "コーヒー1杯", amountKrw: 5500, category: "food" },
      { id: "meal", label: "食事1回", amountKrw: 12000, category: "food" },
      { id: "subway-pass", label: "地下鉄移動(1日)", amountKrw: 5000, category: "transport" },
    ];
  }
  if (lang === "zh-cn") {
    return [
      { id: "taxi-short", label: "出租车(短途)", amountKrw: 9000, category: "transport" },
      { id: "coffee", label: "咖啡一杯", amountKrw: 5500, category: "food" },
      { id: "meal", label: "一顿简餐", amountKrw: 12000, category: "food" },
      { id: "subway-pass", label: "地铁通勤(1天)", amountKrw: 5000, category: "transport" },
    ];
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return [
      { id: "taxi-short", label: "計程車(短程)", amountKrw: 9000, category: "transport" },
      { id: "coffee", label: "咖啡一杯", amountKrw: 5500, category: "food" },
      { id: "meal", label: "一餐簡餐", amountKrw: 12000, category: "food" },
      { id: "subway-pass", label: "地鐵通勤(1日)", amountKrw: 5000, category: "transport" },
    ];
  }
  return [
    { id: "taxi-short", label: "Taxi (short ride)", amountKrw: 9000, category: "transport" },
    { id: "coffee", label: "Coffee", amountKrw: 5500, category: "food" },
    { id: "meal", label: "Meal", amountKrw: 12000, category: "food" },
    { id: "subway-pass", label: "Subway day movement", amountKrw: 5000, category: "transport" },
  ];
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function ExpenseTracker({ lang }: ExpenseTrackerProps) {
  const c = getCopy(lang);
  const presets = getPricePresets(lang);
  const defaultCurrency = getDefaultCurrencyByLocale(lang);
  const [loaded, setLoaded] = useState(false);
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [budgetKrw, setBudgetKrw] = useState<number>(100000);
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [rate, setRate] = useState<number>(rates[defaultCurrency]);
  const [isLiveRate, setIsLiveRate] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<Category>("food");
  const [noteInput, setNoteInput] = useState("");
  const [naturalInput, setNaturalInput] = useState("");
  const [naturalError, setNaturalError] = useState("");

  useEffect(() => {
    const rawItems = localStorage.getItem(STORAGE_KEY);
    const rawBudget = localStorage.getItem(BUDGET_KEY);
    const rawCurrency = localStorage.getItem(CURRENCY_KEY) as Currency | null;

    if (rawItems) {
      try {
        const parsed = JSON.parse(rawItems) as ExpenseItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    }
    if (rawBudget && !Number.isNaN(Number(rawBudget))) setBudgetKrw(Number(rawBudget));
    if (rawCurrency && rates[rawCurrency]) {
      setCurrency(rawCurrency);
      setRate(rates[rawCurrency]);
    } else {
      setCurrency(defaultCurrency);
      setRate(rates[defaultCurrency]);
    }
    setLoaded(true);
  }, [defaultCurrency, rates]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const applyRates = (next: Record<Currency, number>) => {
        if (cancelled) return;
        const merged = { ...DEFAULT_RATES } as Record<Currency, number>;
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
        const converted: Record<Currency, number> = { ...DEFAULT_RATES };
        for (const code of ALL_CURRENCIES) {
          const perKrw = sourceRates[code];
          if (typeof perKrw === "number" && perKrw > 0) converted[code] = Number((1 / perKrw).toFixed(6));
        }
        applyRates(converted);
        return true;
      };

      try {
        const okInternal = await tryInternal();
        if (!okInternal) {
          const okDirect = await tryDirect();
          if (!okDirect && !cancelled) setIsLiveRate(false);
        }
      } catch {
        // keep fallback rates
        if (!cancelled) setIsLiveRate(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(BUDGET_KEY, String(budgetKrw));
  }, [budgetKrw, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency, loaded]);

  useEffect(() => {
    setRate(rates[currency]);
  }, [currency, rates]);

  const today = todayKey();
  const todayItems = useMemo(() => items.filter((item) => item.createdAt.startsWith(today)), [items, today]);
  const totalToday = useMemo(() => todayItems.reduce((sum, item) => sum + item.amountKrw, 0), [todayItems]);
  const remainToday = budgetKrw - totalToday;

  const categoryTotals = useMemo(() => {
    return todayItems.reduce<Record<Category, number>>(
      (acc, item) => {
        acc[item.category] += item.amountKrw;
        return acc;
      },
      { transport: 0, food: 0, shopping: 0, other: 0 },
    );
  }, [todayItems]);

  function addItem(amountKrw: number, forcedCategory?: Category, forcedNote?: string) {
    if (!Number.isFinite(amountKrw) || amountKrw <= 0) return;
    const next: ExpenseItem = {
      id: crypto.randomUUID(),
      amountKrw: Math.round(amountKrw),
      category: forcedCategory ?? categoryInput,
      note: (forcedNote ?? noteInput).trim(),
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [next, ...prev]);
    setAmountInput("");
    setNoteInput("");
    setNaturalError("");
  }

  function detectCategory(text: string): Category | null {
    if (/taxi|subway|bus|metro|train|교통|지하철|버스|택시|電車|地下鉄|公交|地铁|計程車/.test(text)) return "transport";
    if (/coffee|cafe|meal|lunch|dinner|food|식사|커피|카페|ご飯|食事|咖啡|餐|飲食/.test(text)) return "food";
    if (/shop|shopping|olive|mall|쇼핑|買い物|购物|購物/.test(text)) return "shopping";
    return null;
  }

  function parseNaturalAmountKrw(text: string): number | null {
    const numberMatch = text.match(/(\d[\d,]*\.?\d*)/);
    if (!numberMatch) return null;
    const raw = Number(numberMatch[1].replace(/,/g, ""));
    if (!Number.isFinite(raw) || raw <= 0) return null;
    if (/krw|won|원|₩/i.test(text)) return Math.round(raw);

    const hit = CURRENCY_PATTERNS.find((item) => item.pattern.test(text));
    if (!hit) return Math.round(raw);
    const baseRate = rates[hit.code];
    return Math.round(raw * baseRate);
  }

  function addFromNatural() {
    const normalized = naturalInput.trim();
    if (!normalized) return;
    const amountKrw = parseNaturalAmountKrw(normalized);
    if (!amountKrw) {
      setNaturalError(c.parseFail);
      return;
    }
    const detected = detectCategory(normalized.toLowerCase());
    addItem(amountKrw, detected ?? categoryInput, normalized);
    setNaturalInput("");
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.budget}</p>
          <input
            type="number"
            min={0}
            value={budgetKrw}
            onChange={(e) => setBudgetKrw(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full bg-transparent text-lg font-bold text-zinc-900 outline-none"
          />
        </label>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.total}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">{totalToday.toLocaleString()} KRW</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.remain}</p>
          <p className={`mt-1 text-lg font-black ${remainToday >= 0 ? "text-emerald-700" : "text-red-700"}`}>{remainToday.toLocaleString()} KRW</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.convert}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">
            {rate > 0 ? (totalToday / rate).toFixed(2) : "0.00"} {currency}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <label className="lg:col-span-2">
          <p className="text-xs font-semibold text-zinc-600">{c.amount}</p>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          />
        </label>
        <label>
          <p className="text-xs font-semibold text-zinc-600">{c.category}</p>
          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value as Category)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          >
            <option value="transport">{c.categories.transport}</option>
            <option value="food">{c.categories.food}</option>
            <option value="shopping">{c.categories.shopping}</option>
            <option value="other">{c.categories.other}</option>
          </select>
        </label>
        <label>
          <p className="text-xs font-semibold text-zinc-600">{c.note}</p>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          />
        </label>
        <button
          type="button"
          onClick={() => addItem(Number(amountInput))}
          className="self-end rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800"
        >
          {c.add}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-zinc-600">{c.quick}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => addItem(n)}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-800 hover:border-zinc-900"
            >
              ₩{n.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-zinc-600">{c.snapshot}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => addItem(preset.amountKrw, preset.category, preset.label)}
              className="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 py-2 text-left hover:border-zinc-900"
            >
              <span className="text-sm font-semibold text-zinc-800">{preset.label}</span>
              <span className="text-sm font-black text-zinc-900">₩{preset.amountKrw.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-semibold text-zinc-600">{c.natural}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder={c.naturalHint}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          />
          <button
            type="button"
            onClick={addFromNatural}
            className="rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800"
          >
            {c.naturalAdd}
          </button>
        </div>
        {naturalError ? <p className="mt-2 text-xs font-semibold text-red-600">{naturalError}</p> : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          <p className="text-xs font-semibold text-zinc-600">{c.topCurrencies}</p>
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
        </label>
        <label>
          <p className="text-xs font-semibold text-zinc-600">{c.allCurrencies}</p>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          >
            {ALL_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!isLiveRate ? (
        <p className="mt-2 text-[11px] font-semibold text-amber-700">
          {lang === "ko" ? "실시간 환율을 불러오지 못해 기본값을 사용 중입니다." : "Live rate unavailable. Using fallback rate."}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-black text-zinc-900">{c.list}</h3>
        <div className="mt-2 grid gap-1 text-xs font-semibold text-zinc-700 sm:grid-cols-2">
          <p>{c.categories.transport}: ₩{categoryTotals.transport.toLocaleString()}</p>
          <p>{c.categories.food}: ₩{categoryTotals.food.toLocaleString()}</p>
          <p>{c.categories.shopping}: ₩{categoryTotals.shopping.toLocaleString()}</p>
          <p>{c.categories.other}: ₩{categoryTotals.other.toLocaleString()}</p>
        </div>

        <div className="mt-3 space-y-2">
          {todayItems.length === 0 ? (
            <p className="text-sm text-zinc-500">{c.empty}</p>
          ) : (
            todayItems.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-bold text-zinc-900">₩{item.amountKrw.toLocaleString()} · {c.categories[item.category]}</p>
                  <p className="text-xs text-zinc-500">{item.note || "-"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                >
                  {c.remove}
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
