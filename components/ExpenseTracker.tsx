"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Category = "transport" | "food" | "experience" | "shopping" | "other";

type ExpenseItem = {
  id: string;
  amountKrw: number;
  category: Category;
  note: string;
  createdAt: string;
};

type ExpenseTrackerProps = {
  lang: Lang;
  readOnlyBudget?: boolean;
};

type Currency = "KRW" | "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD" | "GBP" | "AUD" | "CAD" | "SGD" | "THB" | "VND";

type PricePreset = {
  id: string;
  label: string;
  amountKrw: number;
  category: Category;
};

type PlanCategory = "food" | "transport" | "experience" | "shopping" | "buffer";
type PlanMode = "percent" | "fixed";
type PlanSplit = Record<PlanCategory, { mode: PlanMode; value: number }>;
type PlanBudgetConfig = {
  baseCurrency: Currency;
  dailyBudgetUser: number;
  dailyBudgetKrw: number;
  categorySplit: PlanSplit;
  tripDays: number;
};

function getCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "오늘 지출 기록",
      desc: "쓴 금액을 바로 넣고 합계를 확인하세요.",
      amount: "금액",
      category: "카테고리",
      note: "메모",
      noteOptional: "메모(선택)",
      noteAdd: "메모 추가",
      noteHide: "메모 숨기기",
      noteRecent: "최근 메모",
      add: "추가",
      budget: "오늘 예산",
      total: "오늘 합계",
      remain: "남은 예산",
      planBudget: "오늘 예산 (Plan 설정)",
      categoryRemain: "카테고리별 남은 예산",
      usedPct: "예산 사용률",
      repeatFromInput: "현재 입력 기준 반복 가능",
      budgetFromPlan: "예산 설정은 Plan > Daily budget에서 변경할 수 있습니다.",
      goPlanBudget: "Plan 예산 페이지로 이동",
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
      viewToday: "오늘",
      viewAll: "전체",
      allTotal: "전체 합계",
      exportCsv: "CSV 내보내기",
      categories: {
        transport: "교통",
        food: "식비",
        shopping: "쇼핑",
        experience: "체험",
        other: "기타",
      },
    };
  }
  if (lang === "ja") {
    return {
      title: "今日の支出記録",
      desc: "使った金額を入れて合計をすぐ確認。",
      amount: "金額",
      category: "カテゴリ",
      note: "メモ",
      noteOptional: "メモ (任意)",
      noteAdd: "メモ追加",
      noteHide: "メモを閉じる",
      noteRecent: "最近のメモ",
      add: "追加",
      budget: "今日の予算",
      total: "今日の合計",
      remain: "残り予算",
      planBudget: "今日の予算 (Plan設定)",
      categoryRemain: "カテゴリ別残額",
      usedPct: "予算使用率",
      repeatFromInput: "現在入力基準での繰り返し回数",
      budgetFromPlan: "予算の変更は Plan > Daily budget で行ってください。",
      goPlanBudget: "Plan予算ページへ",
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
      viewToday: "今日",
      viewAll: "全体",
      allTotal: "全体合計",
      exportCsv: "CSV出力",
      categories: {
        transport: "交通",
        food: "食費",
        shopping: "買い物",
        experience: "体験",
        other: "その他",
      },
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "今日支出记录",
      desc: "马上记录金额并查看合计。",
      amount: "金额",
      category: "分类",
      note: "备注",
      noteOptional: "备注（可选）",
      noteAdd: "添加备注",
      noteHide: "收起备注",
      noteRecent: "最近备注",
      add: "添加",
      budget: "今日预算",
      total: "今日合计",
      remain: "剩余预算",
      planBudget: "今日预算 (Plan设置)",
      categoryRemain: "分类剩余额度",
      usedPct: "预算使用率",
      repeatFromInput: "按当前输入可重复次数",
      budgetFromPlan: "预算请在 Plan > Daily budget 中调整。",
      goPlanBudget: "前往 Plan 预算页",
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
      viewToday: "今日",
      viewAll: "全部",
      allTotal: "总计",
      exportCsv: "导出CSV",
      categories: {
        transport: "交通",
        food: "餐饮",
        shopping: "购物",
        experience: "体验",
        other: "其他",
      },
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "今日支出紀錄",
      desc: "立即記錄金額並查看總和。",
      amount: "金額",
      category: "分類",
      note: "備註",
      noteOptional: "備註（可選）",
      noteAdd: "新增備註",
      noteHide: "收起備註",
      noteRecent: "最近備註",
      add: "新增",
      budget: "今日預算",
      total: "今日總計",
      remain: "剩餘預算",
      planBudget: "今日預算 (Plan設定)",
      categoryRemain: "分類剩餘額度",
      usedPct: "預算使用率",
      repeatFromInput: "按目前輸入可重複次數",
      budgetFromPlan: "預算請在 Plan > Daily budget 內調整。",
      goPlanBudget: "前往 Plan 預算頁",
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
      viewToday: "今日",
      viewAll: "全部",
      allTotal: "總計",
      exportCsv: "匯出CSV",
      categories: {
        transport: "交通",
        food: "餐飲",
        shopping: "購物",
        experience: "體驗",
        other: "其他",
      },
    };
  }
  return {
    title: "Today Expense Tracker",
    desc: "Log spending now and see totals instantly.",
    amount: "Amount",
    category: "Category",
    note: "Note",
    noteOptional: "Note (optional)",
    noteAdd: "Add note",
    noteHide: "Hide note",
    noteRecent: "Recent notes",
    add: "Add",
    budget: "Today budget",
    total: "Today total",
    remain: "Budget left",
    planBudget: "Today's budget (Plan setup)",
    categoryRemain: "Category budgets left",
    usedPct: "Budget used",
    repeatFromInput: "Repeatable by current input",
    budgetFromPlan: "Budget is managed in Plan > Daily budget.",
    goPlanBudget: "Go to Plan budget page",
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
    viewToday: "Today",
    viewAll: "All",
    allTotal: "All-time total",
    exportCsv: "Export CSV",
    categories: {
      transport: "Transport",
      food: "Food",
      shopping: "Shopping",
      experience: "Experience",
      other: "Other",
    },
  };
}

const STORAGE_KEY = "sv-expense-tracker-v1";
const BUDGET_KEY = "sv-expense-budget-v1";
const CURRENCY_KEY = "sv-expense-currency-v1";
const PLAN_CONFIG_KEY = "sv-plan-budget-config-v1";
const QUICK_AMOUNTS = [4500, 10000, 15000, 30000];
const DEFAULT_RATES: Record<Currency, number> = {
  KRW: 1,
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
const ALL_CURRENCIES: Currency[] = ["KRW", "USD", "EUR", "JPY", "CNY", "TWD", "HKD", "GBP", "AUD", "CAD", "SGD", "THB", "VND"];

function getDefaultCurrencyByLocale(lang: Lang): Currency {
  if (lang === "ko") return "KRW";
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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeAmountInput(value: string, currency: Currency): string {
  const allowDecimal = currency !== "KRW" && currency !== "JPY";
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!allowDecimal) return cleaned.replace(/\./g, "");
  const [intPart = "", ...rest] = cleaned.split(".");
  const decimalPart = rest.join("");
  return rest.length > 0 ? `${intPart}.${decimalPart}` : intPart;
}

function formatAmountInput(value: string, currency: Currency): string {
  if (!value) return "";
  const allowDecimal = currency !== "KRW" && currency !== "JPY";
  const [intPartRaw = "", decimalPartRaw = ""] = value.split(".");
  const intPart = intPartRaw.replace(/\D/g, "");
  const withComma = intPart ? Number(intPart).toLocaleString() : "0";
  if (!allowDecimal) return withComma;
  return decimalPartRaw.length > 0 ? `${withComma}.${decimalPartRaw}` : withComma;
}

export function ExpenseTracker({ lang, readOnlyBudget = false }: ExpenseTrackerProps) {
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
  const [planConfig, setPlanConfig] = useState<PlanBudgetConfig | null>(null);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function readPlanConfigFromStorage(): PlanBudgetConfig | null {
    const raw = localStorage.getItem(PLAN_CONFIG_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as PlanBudgetConfig;
      if (!parsed || typeof parsed.dailyBudgetKrw !== "number" || !parsed.baseCurrency) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function applyPlanConfig(next: PlanBudgetConfig | null, currentRates: Record<Currency, number>) {
    setPlanConfig(next);
    if (!next) return;
    if (Number.isFinite(next.dailyBudgetKrw)) {
      setBudgetKrw(Math.max(0, Math.round(next.dailyBudgetKrw)));
    }
    if (currentRates[next.baseCurrency]) {
      setCurrency(next.baseCurrency);
      setRate(currentRates[next.baseCurrency]);
    }
  }

  useEffect(() => {
    const rawItems = localStorage.getItem(STORAGE_KEY);
    const rawBudget = localStorage.getItem(BUDGET_KEY);
    const rawCurrency = localStorage.getItem(CURRENCY_KEY) as Currency | null;
    const rawPlanConfig = localStorage.getItem(PLAN_CONFIG_KEY);

    let parsedPlan: PlanBudgetConfig | null = null;
    if (rawPlanConfig) {
      try {
        const parsed = JSON.parse(rawPlanConfig) as PlanBudgetConfig;
        if (parsed && typeof parsed.dailyBudgetKrw === "number" && parsed.baseCurrency) {
          parsedPlan = parsed;
        }
      } catch {
        parsedPlan = null;
      }
    }
    applyPlanConfig(parsedPlan, rates);

    if (rawItems) {
      try {
        const parsed = JSON.parse(rawItems) as ExpenseItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    }
    if (!parsedPlan && rawBudget && !Number.isNaN(Number(rawBudget))) {
      setBudgetKrw(Number(rawBudget));
    }

    if (!parsedPlan && rawCurrency && rates[rawCurrency]) {
      setCurrency(rawCurrency);
      setRate(rates[rawCurrency]);
    } else if (!parsedPlan) {
      setCurrency(defaultCurrency);
      setRate(rates[defaultCurrency]);
    }
    setLoaded(true);
  }, [defaultCurrency, rates]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== PLAN_CONFIG_KEY && event.key !== BUDGET_KEY) return;

      if (event.key === PLAN_CONFIG_KEY) {
        if (!event.newValue) {
          applyPlanConfig(null, rates);
          return;
        }
        try {
          const parsed = JSON.parse(event.newValue) as PlanBudgetConfig;
          if (parsed && typeof parsed.dailyBudgetKrw === "number" && parsed.baseCurrency) {
            applyPlanConfig(parsed, rates);
          }
        } catch {
          // ignore malformed payload
        }
      }

      if (event.key === BUDGET_KEY && !planConfig && event.newValue && !Number.isNaN(Number(event.newValue))) {
        setBudgetKrw(Number(event.newValue));
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [planConfig, rates]);

  useEffect(() => {
    function syncOnFocus() {
      const latest = readPlanConfigFromStorage();
      if (latest) applyPlanConfig(latest, rates);
    }
    function syncOnVisibility() {
      if (document.visibilityState !== "visible") return;
      const latest = readPlanConfigFromStorage();
      if (latest) applyPlanConfig(latest, rates);
    }
    window.addEventListener("focus", syncOnFocus);
    document.addEventListener("visibilitychange", syncOnVisibility);
    return () => {
      window.removeEventListener("focus", syncOnFocus);
      document.removeEventListener("visibilitychange", syncOnVisibility);
    };
  }, [rates]);

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
  const planDisplayRate =
    planConfig && planConfig.dailyBudgetUser > 0 ? planConfig.dailyBudgetKrw / planConfig.dailyBudgetUser : null;
  const planDisplayCurrency = planConfig?.baseCurrency ?? currency;
  const usedPercent = budgetKrw > 0 ? Math.min(999, (totalToday / budgetKrw) * 100) : 0;
  const amountInputRaw = Math.max(0, Number(amountInput) || 0);
  const amountInputKrw = currency === "KRW" ? amountInputRaw : Math.round(amountInputRaw * rate);

  const categoryTotals = useMemo(() => {
    return todayItems.reduce<Record<Category, number>>(
      (acc, item) => {
        acc[item.category] += item.amountKrw;
        return acc;
      },
      { transport: 0, food: 0, experience: 0, shopping: 0, other: 0 },
    );
  }, [todayItems]);

  const noteSuggestions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of todayItems) {
      const note = item.note.trim();
      if (!note || seen.has(note)) continue;
      seen.add(note);
      out.push(note);
      if (out.length >= 4) break;
    }
    return out;
  }, [todayItems]);

  const planCategoryBudget = useMemo(() => {
    if (!planConfig?.categorySplit) return null;
    const split = planConfig.categorySplit;
    const budget = Math.max(0, budgetKrw);

    const fixedTotal = (["food", "transport", "experience", "shopping", "buffer"] as PlanCategory[]).reduce(
      (sum, key) => sum + (split[key]?.mode === "fixed" ? Math.max(0, split[key].value) : 0),
      0,
    );
    const percentTotal = (["food", "transport", "experience", "shopping", "buffer"] as PlanCategory[]).reduce(
      (sum, key) => sum + (split[key]?.mode === "percent" ? Math.max(0, split[key].value) : 0),
      0,
    );
    const remaining = Math.max(0, budget - fixedTotal);
    const alloc = { food: 0, transport: 0, experience: 0, shopping: 0, other: 0 };

    const resolve = (key: PlanCategory): number => {
      const cell = split[key];
      if (!cell) return 0;
      if (cell.mode === "fixed") return Math.max(0, cell.value);
      if (percentTotal <= 0) return 0;
      return (remaining * Math.max(0, cell.value)) / percentTotal;
    };

    alloc.food = resolve("food");
    alloc.transport = resolve("transport");
    alloc.experience = resolve("experience");
    alloc.shopping = resolve("shopping");
    alloc.other = resolve("buffer");
    return alloc;
  }, [planConfig, budgetKrw]);

  const categoryRemain = useMemo(() => {
    if (!planCategoryBudget) return null;
    return {
      food: planCategoryBudget.food - categoryTotals.food,
      transport: planCategoryBudget.transport - categoryTotals.transport,
      experience: planCategoryBudget.experience - categoryTotals.experience,
      shopping: planCategoryBudget.shopping - categoryTotals.shopping,
      other: planCategoryBudget.other - categoryTotals.other,
    };
  }, [planCategoryBudget, categoryTotals]);
  const selectedCategoryRemain = categoryRemain ? categoryRemain[categoryInput] : null;
  const usedPercentForBar = Math.max(0, Math.min(100, usedPercent));
  const planBudgetHref = `/${lang}/plan/daily-budget`;
  const inputDisplayValue = amountInputRaw > 0 ? formatAmountInput(String(amountInputRaw), currency) : "0";

  function formatInPlanCurrency(krw: number): string {
    const rateForDisplay = planDisplayRate && planDisplayRate > 0 ? planDisplayRate : rate;
    const value = rateForDisplay > 0 ? krw / rateForDisplay : 0;
    if (planDisplayCurrency === "KRW") {
      const rounded = Math.round(value);
      return `${rounded < 0 ? "-" : ""}₩${Math.abs(rounded).toLocaleString()}`;
    }
    return `${value.toFixed(planDisplayCurrency === "JPY" ? 0 : 2)} ${planDisplayCurrency}`;
  }

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
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setPendingDeleteId((prev) => (prev === id ? null : prev));
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-semibold text-zinc-600">{c.remain}</p>
        <p className={`mt-1 text-2xl font-black ${remainToday >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{remainToday.toLocaleString()}</p>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className={`h-full ${usedPercent <= 100 ? "bg-zinc-900" : "bg-red-600"}`} style={{ width: `${usedPercentForBar}%` }} />
        </div>
        <p className="mt-2 text-xs font-semibold text-zinc-600">
          {usedPercent.toFixed(1)}% {lang === "ko" ? "사용" : "used"}
        </p>
        <p className="mt-1 text-xs font-semibold text-zinc-600">
          {c.budget} ₩{budgetKrw.toLocaleString()}{" "}
          <Link href={planBudgetHref} className="inline-flex align-middle text-zinc-500 hover:text-zinc-900" aria-label={lang === "ko" ? "예산 수정" : "Edit budget"}>
            ✎
          </Link>
          {" · "}
          {lang === "ko" ? "사용" : c.total} ₩{totalToday.toLocaleString()}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <label className="block rounded-xl border border-zinc-200 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-600">{c.amount}</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-bold text-zinc-900 outline-none"
            >
              {ALL_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            inputMode={currency === "KRW" || currency === "JPY" ? "numeric" : "decimal"}
            placeholder="0"
            value={formatAmountInput(amountInput, currency)}
            onChange={(e) => setAmountInput(normalizeAmountInput(e.target.value, currency))}
            className="mt-1 w-full bg-transparent text-3xl font-black text-zinc-900 outline-none"
          />
          <p className="mt-1 text-sm font-bold text-zinc-700">
            {inputDisplayValue} {currency}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            {currency === "KRW" ? `≈ ${formatInPlanCurrency(amountInputKrw)}` : `≈ ₩${amountInputKrw.toLocaleString()}`}
          </p>
        </label>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.category}</p>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as Category)}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
            >
              <option value="transport">{c.categories.transport}</option>
              <option value="food">{c.categories.food}</option>
              <option value="experience">{c.categories.experience}</option>
              <option value="shopping">{c.categories.shopping}</option>
              <option value="other">{c.categories.other}</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => addItem(amountInputKrw)}
            className="rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800"
          >
            {c.add}
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.noteOptional}</p>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
          />
          {noteSuggestions.length > 0 ? (
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-zinc-500">{c.noteRecent}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {noteSuggestions.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => setNoteInput(note)}
                    className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:border-zinc-900"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {categoryRemain ? (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-zinc-700">{c.categoryRemain}</p>
          {selectedCategoryRemain !== null ? (
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories[categoryInput]}</p>
              <p className={`text-base font-black ${selectedCategoryRemain >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                ₩{Math.round(selectedCategoryRemain).toLocaleString()}
              </p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(selectedCategoryRemain)}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setShowCategoryDetails((prev) => !prev)}
            className="mt-2 rounded-full border border-zinc-300 px-3 py-1 text-[11px] font-bold text-zinc-700 hover:border-zinc-900"
          >
            {showCategoryDetails
              ? lang === "ko"
                ? "전체 카테고리 숨기기"
                : "Hide all categories"
              : lang === "ko"
                ? "전체 카테고리 보기"
                : "View all categories"}
          </button>
          <div className={`${showCategoryDetails ? "mt-2 grid gap-2 sm:grid-cols-2" : "hidden"}`}>
            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories.transport}</p>
              <p className={`text-sm font-black ${categoryRemain.transport >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.round(categoryRemain.transport).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(categoryRemain.transport)}</p>
            </article>
            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories.food}</p>
              <p className={`text-sm font-black ${categoryRemain.food >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.round(categoryRemain.food).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(categoryRemain.food)}</p>
            </article>
            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories.experience}</p>
              <p className={`text-sm font-black ${categoryRemain.experience >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.round(categoryRemain.experience).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(categoryRemain.experience)}</p>
            </article>
            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories.shopping}</p>
              <p className={`text-sm font-black ${categoryRemain.shopping >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.round(categoryRemain.shopping).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(categoryRemain.shopping)}</p>
            </article>
            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 sm:col-span-2">
              <p className="text-[11px] font-semibold text-zinc-600">{c.categories.other}</p>
              <p className={`text-sm font-black ${categoryRemain.other >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.round(categoryRemain.other).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-zinc-500">{formatInPlanCurrency(categoryRemain.other)}</p>
            </article>
          </div>
        </div>
      ) : null}

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
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
          <p>{c.categories.experience}: ₩{categoryTotals.experience.toLocaleString()}</p>
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
                {pendingDeleteId === item.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-bold text-red-700 hover:text-red-800"
                    >
                      {lang === "ko" ? "삭제 확인" : "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                    >
                      {lang === "ko" ? "취소" : "Cancel"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(item.id)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                  >
                    {c.remove}
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
