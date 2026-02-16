"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type BrandId = "mega" | "compose" | "starbucks" | "lotteria" | "hansot";
type UiLang = "ko" | "en";

type MenuItem = {
  id: string;
  name: string;
  enName: string;
  price: number;
  tint: string;
};

type Category = {
  id: string;
  label: string;
  enLabel: string;
};

type Brand = {
  id: BrandId;
  label: string;
  topTone: string;
  topText: string;
  panelTone: string;
  payTone: string;
  langButton: string;
  langHint: string;
  payMethods: string[];
  categories: Category[];
  itemsByCategory: Record<string, MenuItem[]>;
};

type CartItem = MenuItem & { qty: number };

const KRW = new Intl.NumberFormat("ko-KR");

const BRANDS: Brand[] = [
  {
    id: "mega",
    label: "메가커피",
    topTone: "bg-amber-500",
    topText: "text-zinc-900",
    panelTone: "bg-amber-400",
    payTone: "bg-rose-500",
    langButton: "LANG",
    langHint: "우상단 LANG 버튼",
    payMethods: ["카드결제", "카카오페이", "네이버페이"],
    categories: [
      { id: "reco-drink", label: "추천(음료)", enLabel: "Recommended" },
      { id: "coffee-hot", label: "커피(HOT)", enLabel: "Coffee(HOT)" },
      { id: "coffee-ice", label: "커피(ICE)", enLabel: "Coffee(ICE)" },
      { id: "tea", label: "티(Tea)", enLabel: "Tea" },
      { id: "ade", label: "에이드&주스", enLabel: "Ade & Juice" },
      { id: "dessert", label: "디저트", enLabel: "Dessert" },
    ],
    itemsByCategory: {
      "reco-drink": [
        { id: "mg-1", name: "메가리카노", enName: "Mega Americano", price: 3000, tint: "from-cyan-200 to-blue-300" },
        { id: "mg-2", name: "꿀복숭아 아이스티", enName: "Peach Iced Tea", price: 3500, tint: "from-amber-200 to-orange-300" },
        { id: "mg-3", name: "수박주스", enName: "Watermelon Juice", price: 4000, tint: "from-rose-300 to-red-400" },
        { id: "mg-4", name: "체리콕에이드", enName: "Cherry Coke Ade", price: 4000, tint: "from-rose-200 to-red-300" },
        { id: "mg-5", name: "애플망고스무디", enName: "Mango Smoothie", price: 4300, tint: "from-lime-200 to-green-300" },
        { id: "mg-6", name: "딸기스무디", enName: "Strawberry Smoothie", price: 4000, tint: "from-pink-200 to-rose-300" },
        { id: "mg-7", name: "딸기요거트스무디", enName: "Strawberry Yogurt", price: 4300, tint: "from-pink-100 to-fuchsia-200" },
        { id: "mg-8", name: "레몬에이드", enName: "Lemon Ade", price: 3900, tint: "from-yellow-100 to-amber-200" },
        { id: "mg-9", name: "블루레몬에이드", enName: "Blue Lemon Ade", price: 3900, tint: "from-cyan-100 to-sky-300" },
      ],
      "coffee-hot": [
        { id: "h-1", name: "아메리카노(HOT)", enName: "Americano(HOT)", price: 2000, tint: "from-amber-200 to-orange-300" },
        { id: "h-2", name: "카페라떼(HOT)", enName: "Cafe Latte(HOT)", price: 3200, tint: "from-orange-100 to-amber-200" },
        { id: "h-3", name: "바닐라라떼(HOT)", enName: "Vanilla Latte(HOT)", price: 3500, tint: "from-yellow-100 to-orange-200" },
      ],
      "coffee-ice": [
        { id: "i-1", name: "아메리카노(ICE)", enName: "Americano(ICE)", price: 2300, tint: "from-cyan-200 to-blue-300" },
        { id: "i-2", name: "카페라떼(ICE)", enName: "Cafe Latte(ICE)", price: 3500, tint: "from-cyan-100 to-sky-200" },
        { id: "i-3", name: "바닐라라떼(ICE)", enName: "Vanilla Latte(ICE)", price: 3800, tint: "from-sky-100 to-cyan-200" },
      ],
      tea: [
        { id: "t-1", name: "자몽티", enName: "Grapefruit Tea", price: 3500, tint: "from-orange-100 to-amber-200" },
        { id: "t-2", name: "레몬티", enName: "Lemon Tea", price: 3300, tint: "from-yellow-100 to-orange-200" },
      ],
      ade: [
        { id: "a-1", name: "청포도 에이드", enName: "Green Grape Ade", price: 3900, tint: "from-lime-100 to-green-200" },
        { id: "a-2", name: "블루레몬 에이드", enName: "Blue Lemon Ade", price: 3900, tint: "from-cyan-100 to-sky-200" },
      ],
      dessert: [
        { id: "d-1", name: "크로플", enName: "Croffle", price: 3300, tint: "from-amber-100 to-yellow-200" },
        { id: "d-2", name: "허니브레드", enName: "Honey Bread", price: 4800, tint: "from-yellow-100 to-orange-200" },
      ],
    },
  },
  {
    id: "compose",
    label: "컴포즈커피",
    topTone: "bg-zinc-900",
    topText: "text-yellow-300",
    panelTone: "bg-white",
    payTone: "bg-blue-600",
    langButton: "LANG",
    langHint: "홈 아이콘 주변 또는 상단 LANG",
    payMethods: ["카드결제", "카카오페이", "네이버페이", "쿠폰/복합결제"],
    categories: [
      { id: "coffee", label: "커피", enLabel: "Coffee" },
      { id: "non-coffee", label: "논커피", enLabel: "Non-coffee" },
      { id: "smoothie", label: "스무디/프라페", enLabel: "Smoothie/Frappe" },
      { id: "tea", label: "티", enLabel: "Tea" },
      { id: "dessert", label: "디저트", enLabel: "Dessert" },
    ],
    itemsByCategory: {
      coffee: [
        { id: "cp-1", name: "아메리카노", enName: "Americano", price: 2500, tint: "from-yellow-100 to-zinc-200" },
        { id: "cp-2", name: "카페라떼", enName: "Cafe Latte", price: 3900, tint: "from-yellow-100 to-amber-200" },
        { id: "cp-3", name: "디카페인 디카페라떼", enName: "Decaf Cafe Latte", price: 4500, tint: "from-zinc-100 to-yellow-100" },
        { id: "cp-4", name: "카푸치노", enName: "Cappuccino", price: 3900, tint: "from-yellow-50 to-zinc-200" },
      ],
      "non-coffee": [
        { id: "cp-5", name: "초코라떼", enName: "Choco Latte", price: 3900, tint: "from-amber-100 to-yellow-200" },
        { id: "cp-6", name: "바닐라라떼", enName: "Vanilla Latte", price: 4100, tint: "from-yellow-100 to-orange-100" },
      ],
      smoothie: [
        { id: "cp-7", name: "쿠키프라페", enName: "Cookie Frappe", price: 4500, tint: "from-zinc-100 to-blue-100" },
        { id: "cp-8", name: "딸기스무디", enName: "Strawberry Smoothie", price: 4500, tint: "from-rose-100 to-pink-200" },
      ],
      tea: [
        { id: "cp-9", name: "자몽차", enName: "Grapefruit Tea", price: 4100, tint: "from-orange-100 to-yellow-100" },
        { id: "cp-10", name: "레몬차", enName: "Lemon Tea", price: 4000, tint: "from-yellow-100 to-lime-100" },
      ],
      dessert: [
        { id: "cp-11", name: "크로플", enName: "Croffle", price: 3900, tint: "from-amber-100 to-yellow-200" },
        { id: "cp-12", name: "와플", enName: "Waffle", price: 4300, tint: "from-yellow-100 to-amber-200" },
      ],
    },
  },
  {
    id: "starbucks",
    label: "스타벅스",
    topTone: "bg-emerald-800",
    topText: "text-emerald-50",
    panelTone: "bg-emerald-700",
    payTone: "bg-emerald-900",
    langButton: "LANG",
    langHint: "우상단 LANGUAGE",
    payMethods: ["카드결제", "간편결제"],
    categories: [
      { id: "coffee", label: "커피", enLabel: "Coffee" },
      { id: "tea", label: "티", enLabel: "Tea" },
    ],
    itemsByCategory: {
      coffee: [
        { id: "sb-1", name: "아메리카노", enName: "Americano", price: 4500, tint: "from-zinc-200 to-zinc-300" },
        { id: "sb-2", name: "카페라떼", enName: "Cafe Latte", price: 5200, tint: "from-amber-100 to-yellow-200" },
      ],
      tea: [{ id: "sb-3", name: "유자 민트티", enName: "Yuja Mint Tea", price: 6100, tint: "from-lime-100 to-green-200" }],
    },
  },
  {
    id: "lotteria",
    label: "롯데리아",
    topTone: "bg-red-700",
    topText: "text-yellow-100",
    panelTone: "bg-yellow-400",
    payTone: "bg-red-600",
    langButton: "EN",
    langHint: "상단 우측 LANG 또는 언어 버튼",
    payMethods: ["카드결제", "간편결제"],
    categories: [
      { id: "set", label: "세트", enLabel: "Set" },
      { id: "side", label: "사이드", enLabel: "Side" },
    ],
    itemsByCategory: {
      set: [
        { id: "lt-1", name: "핫크리스피버거 세트", enName: "Hot Crispy Burger Set", price: 7900, tint: "from-amber-100 to-orange-200" },
        { id: "lt-2", name: "리아 불고기버거 세트", enName: "Bulgogi Burger Set", price: 8500, tint: "from-orange-100 to-amber-200" },
      ],
      side: [{ id: "lt-3", name: "양념감자", enName: "Seasoned Fries", price: 2700, tint: "from-yellow-100 to-amber-200" }],
    },
  },
  {
    id: "hansot",
    label: "한솥",
    topTone: "bg-orange-700",
    topText: "text-orange-50",
    panelTone: "bg-orange-500",
    payTone: "bg-zinc-900",
    langButton: "LANG",
    langHint: "상단 LANGUAGE 또는 설정",
    payMethods: ["카드결제", "간편결제"],
    categories: [
      { id: "dosirak", label: "도시락", enLabel: "Lunch Box" },
      { id: "extra", label: "추가", enLabel: "Extra" },
    ],
    itemsByCategory: {
      dosirak: [
        { id: "hs-1", name: "도련님도시락", enName: "Doryeonnim Lunch Box", price: 5200, tint: "from-amber-100 to-orange-200" },
        { id: "hs-2", name: "치킨마요", enName: "Chicken Mayo", price: 4500, tint: "from-lime-100 to-green-200" },
      ],
      extra: [{ id: "hs-3", name: "계란후라이 추가", enName: "Add Fried Egg", price: 800, tint: "from-yellow-100 to-zinc-100" }],
    },
  },
];

function toKrw(value: number): string {
  return `${KRW.format(value)}원`;
}

function getCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "브랜드 키오스크 체험",
      subtitle: "상단에서 브랜드를 고르면 바로 실물형 화면으로 시작됩니다.",
      englishTitle: "영어 메뉴 찾기",
      englishDesc: "대부분 우상단 LANG/EN 버튼에서 영어 메뉴를 켤 수 있습니다.",
      selected: "선택한 상품",
      remain: "남은시간",
      clear: "전체삭제",
      pay: "결제하기",
      qty: "개",
      total: "합계",
      quickGuide: "문제 해결 가이드",
      deepGuide: "심화 가이드",
      payModalTitle: "결제 단계 체험",
      payModalDesc: "여기서는 흐름만 체험합니다. 실제 결제는 진행되지 않습니다.",
      card: "카드 결제",
      mobile: "모바일 결제",
      close: "닫기",
      home: "처음 화면",
    };
  }

  return {
    title: "Brand Kiosk Practice",
    subtitle: "Choose a brand and start with a realistic kiosk layout.",
    englishTitle: "Find English menu",
    englishDesc: "Use the top-right LANG/EN button on most kiosks.",
    selected: "Selected",
    remain: "Time left",
    clear: "Clear",
    pay: "Pay",
    qty: "items",
    total: "Total",
    quickGuide: "Quick guide",
    deepGuide: "Deep guide",
    payModalTitle: "Payment practice",
    payModalDesc: "Practice flow only. No real charge.",
    card: "Card",
    mobile: "Mobile",
    close: "Close",
    home: "Home",
  };
}

export function KioskPracticeSimulator({ lang }: { lang: Lang }) {
  const c = getCopy(lang);
  const [brandId, setBrandId] = useState<BrandId>("mega");
  const [uiLang, setUiLang] = useState<UiLang>("ko");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const brand = useMemo(() => BRANDS.find((b) => b.id === brandId) ?? BRANDS[0], [brandId]);
  const category = brand.categories[Math.max(0, Math.min(categoryIndex, brand.categories.length - 1))];
  const menuItems = brand.itemsByCategory[category.id] ?? [];

  useEffect(() => {
    setTimeLeft(120);
    const t = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 120 : prev - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [brandId]);

  const selectedCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const found = prev.find((v) => v.id === item.id);
      if (!found) return [...prev, { ...item, qty: 1 }];
      return prev.map((v) => (v.id === item.id ? { ...v, qty: v.qty + 1 } : v));
    });
  }

  return (
    <section className="rounded-3xl border border-zinc-900 bg-white p-4 sm:p-6">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-600">{c.subtitle}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setBrandId(b.id);
              setUiLang("ko");
              setCategoryIndex(0);
              setCart([]);
              setPaymentOpen(false);
            }}
            className={`rounded-xl border px-3 py-3 text-sm font-black ${brandId === b.id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-zinc-50 text-zinc-900"}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-zinc-800">
        {c.englishTitle}: {brand.langHint} · {c.englishDesc}
      </div>

      <div className="mt-5 mx-auto w-full max-w-[720px] overflow-hidden rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className={`flex items-center justify-between px-4 py-3 ${brand.topTone} ${brand.topText}`}>
          <button type="button" className="text-lg font-black">⌂</button>
          <p className="text-xl font-black tracking-tight">{brand.id === "compose" ? "COMPOSE COFFEE" : "Easy KIOSK"}</p>
          <button
            type="button"
            onClick={() => setUiLang((prev) => (prev === "ko" ? "en" : "ko"))}
            className="rounded-lg bg-white/85 px-3 py-1 text-sm font-black text-zinc-900"
          >
            {brand.langButton}
          </button>
        </div>

        <div className={`${brand.panelTone} px-3 py-2 text-zinc-900`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategoryIndex((v) => Math.max(0, v - 1))}
              className="rounded-md bg-white px-2 py-1 text-sm font-black"
            >
              ←
            </button>
            {brand.categories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryIndex(idx)}
                className={`shrink-0 rounded-md px-3 py-1 text-sm font-black ${idx === categoryIndex ? brand.id === "compose" ? "bg-blue-600 text-white" : "bg-zinc-900 text-white" : "bg-white/90"}`}
              >
                {uiLang === "ko" ? cat.label : cat.enLabel}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCategoryIndex((v) => Math.min(brand.categories.length - 1, v + 1))}
              className="rounded-md bg-white px-2 py-1 text-sm font-black"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid min-h-[42rem] grid-cols-[1fr_11rem] bg-zinc-50">
          <div className="border-r border-zinc-300 p-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addToCart(item)}
                  className="rounded-xl border border-zinc-200 bg-white p-2 text-left"
                >
                  <div className={`aspect-[4/5] rounded-lg bg-gradient-to-br ${item.tint}`} />
                  <p className="mt-2 line-clamp-2 text-[11px] font-black text-zinc-900">{uiLang === "ko" ? item.name : item.enName}</p>
                  <p className="mt-1 text-[11px] font-bold text-rose-600">{toKrw(item.price)}</p>
                </button>
              ))}
            </div>

            <div className="mt-3 min-h-[9.5rem] rounded-xl border border-zinc-300 bg-white p-2">
              <p className="text-xs font-black text-zinc-700">{c.selected}</p>
              <div className="mt-2 space-y-1 text-xs font-semibold text-zinc-800">
                {cart.length === 0 ? <p className="text-zinc-500">-</p> : cart.map((item) => <p key={item.id}>{uiLang === "ko" ? item.name : item.enName} x{item.qty}</p>)}
              </div>
            </div>
          </div>

          <aside className={`p-3 ${brand.id === "compose" ? "bg-white border-l border-zinc-300" : brand.panelTone}`}>
            <div className="rounded-xl bg-white p-2 text-center">
              <p className="text-[11px] font-black text-zinc-700">{c.remain}</p>
              <p className="mt-1 text-3xl font-black text-rose-600">{timeLeft}</p>
              <p className="text-[10px] font-bold text-zinc-600">sec</p>
            </div>

            <button type="button" onClick={() => setCart([])} className="mt-2 w-full rounded-xl bg-white px-2 py-2 text-xs font-black text-zinc-900">
              {c.clear}
            </button>

            <div className="mt-2 rounded-xl bg-white p-2 text-center">
              <p className="text-[11px] font-black text-zinc-700">{c.selected}</p>
              <p className="mt-1 text-xl font-black text-zinc-900">{selectedCount} {c.qty}</p>
            </div>

            <div className="mt-2 rounded-xl bg-white p-2 text-center">
              <p className="text-[11px] font-black text-zinc-700">{c.total}</p>
              <p className="mt-1 text-lg font-black text-zinc-900">{toKrw(total)}</p>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setPaymentOpen(true)}
              className={`mt-3 w-full rounded-xl px-2 py-4 text-sm font-black text-white ${cart.length > 0 ? brand.payTone : "bg-zinc-400"}`}
            >
              {toKrw(total)} {c.pay}
            </button>
          </aside>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link href={`/${lang}/tips/kiosk-survival-flow`} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-900 text-center">
          {c.quickGuide}
        </Link>
        <Link href={`/${lang}/kiosk-card-rejected`} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-900 text-center">
          {c.deepGuide}
        </Link>
      </div>

      {paymentOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h3 className="text-xl font-black text-zinc-950">{c.payModalTitle}</h3>
            <p className="mt-1 text-sm font-semibold text-zinc-600">{c.payModalDesc}</p>
            <div className="mt-4 space-y-2">
              {brand.payMethods.map((method, idx) => (
                <button
                  key={method}
                  type="button"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-black ${idx === 0 ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-900"}`}
                >
                  {uiLang === "ko" ? method : method}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPaymentOpen(false)} className="mt-4 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black text-zinc-800">{c.close}</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
