"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type BrandId = "mega" | "compose" | "starbucks" | "lotteria" | "hansot";
type LotteriaStage = "place" | "menu" | "confirm" | "card";

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
      ],
      "coffee-ice": [
        { id: "i-1", name: "아메리카노(ICE)", enName: "Americano(ICE)", price: 2300, tint: "from-cyan-200 to-blue-300" },
        { id: "i-2", name: "카페라떼(ICE)", enName: "Cafe Latte(ICE)", price: 3500, tint: "from-cyan-100 to-sky-200" },
      ],
      tea: [{ id: "t-1", name: "자몽티", enName: "Grapefruit Tea", price: 3500, tint: "from-orange-100 to-amber-200" }],
      ade: [{ id: "a-1", name: "청포도 에이드", enName: "Green Grape Ade", price: 3900, tint: "from-lime-100 to-green-200" }],
      dessert: [{ id: "d-1", name: "크로플", enName: "Croffle", price: 3300, tint: "from-amber-100 to-yellow-200" }],
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
      { id: "season", label: "시즌메뉴", enLabel: "Season" },
      { id: "coffee", label: "커피", enLabel: "Coffee" },
      { id: "non-coffee", label: "논커피", enLabel: "Non-coffee" },
      { id: "smoothie", label: "스무디/프라페", enLabel: "Smoothie" },
      { id: "ade", label: "에이드/주스", enLabel: "Ade/Juice" },
      { id: "tea", label: "티", enLabel: "Tea" },
      { id: "shake", label: "밀크쉐이크", enLabel: "Shake" },
      { id: "dessert", label: "디저트", enLabel: "Dessert" },
    ],
    itemsByCategory: {
      season: [
        { id: "cs-1", name: "여름 라떼", enName: "Summer Latte", price: 4300, tint: "from-yellow-100 to-orange-100" },
        { id: "cs-2", name: "자몽 에이드", enName: "Grapefruit Ade", price: 4500, tint: "from-orange-100 to-rose-100" },
      ],
      coffee: [
        { id: "cp-1", name: "아메리카노", enName: "Americano", price: 2500, tint: "from-yellow-100 to-zinc-200" },
        { id: "cp-2", name: "카페라떼", enName: "Cafe Latte", price: 3900, tint: "from-yellow-100 to-amber-200" },
        { id: "cp-3", name: "디카페인 라떼", enName: "Decaf Latte", price: 4500, tint: "from-zinc-100 to-yellow-100" },
        { id: "cp-4", name: "카푸치노", enName: "Cappuccino", price: 3900, tint: "from-yellow-50 to-zinc-200" },
      ],
      "non-coffee": [{ id: "cp-5", name: "초코라떼", enName: "Choco Latte", price: 3900, tint: "from-amber-100 to-yellow-200" }],
      smoothie: [{ id: "cp-7", name: "쿠키프라페", enName: "Cookie Frappe", price: 4500, tint: "from-zinc-100 to-blue-100" }],
      ade: [{ id: "cp-8", name: "레몬에이드", enName: "Lemon Ade", price: 4200, tint: "from-yellow-100 to-amber-200" }],
      tea: [{ id: "cp-9", name: "자몽차", enName: "Grapefruit Tea", price: 4100, tint: "from-orange-100 to-yellow-100" }],
      shake: [{ id: "cp-10", name: "밀크쉐이크", enName: "Milk Shake", price: 4300, tint: "from-zinc-100 to-slate-100" }],
      dessert: [{ id: "cp-11", name: "크로플", enName: "Croffle", price: 3900, tint: "from-amber-100 to-yellow-200" }],
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
    categories: [{ id: "coffee", label: "커피", enLabel: "Coffee" }],
    itemsByCategory: {
      coffee: [{ id: "sb-1", name: "아메리카노", enName: "Americano", price: 4500, tint: "from-zinc-200 to-zinc-300" }],
    },
  },
  {
    id: "lotteria",
    label: "롯데리아",
    topTone: "bg-zinc-900",
    topText: "text-zinc-100",
    panelTone: "bg-zinc-100",
    payTone: "bg-red-600",
    langButton: "LANG",
    langHint: "상단 우측 언어 버튼",
    payMethods: ["카드결제", "롯데잇츠페이", "쿠폰/복합결제"],
    categories: [
      { id: "burger", label: "버거", enLabel: "Burger" },
      { id: "side", label: "사이드", enLabel: "Side" },
      { id: "drink", label: "음료", enLabel: "Drink" },
    ],
    itemsByCategory: {
      burger: [
        { id: "lt-1", name: "핫크리스피버거", enName: "Hot Crispy Burger", price: 5900, tint: "from-amber-100 to-orange-200" },
        { id: "lt-2", name: "리아 불고기버거", enName: "Bulgogi Burger", price: 5200, tint: "from-orange-100 to-amber-200" },
      ],
      side: [{ id: "lt-3", name: "양념감자", enName: "Seasoned Fries", price: 2500, tint: "from-yellow-100 to-amber-200" }],
      drink: [{ id: "lt-5", name: "콜라", enName: "Coke", price: 2000, tint: "from-zinc-100 to-zinc-200" }],
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
    categories: [{ id: "dosirak", label: "도시락", enLabel: "Lunch Box" }],
    itemsByCategory: {
      dosirak: [{ id: "hs-1", name: "도련님도시락", enName: "Doryeonnim Lunch Box", price: 5200, tint: "from-amber-100 to-orange-200" }],
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
      englishDesc: "버튼 위치만 익히는 용도입니다. 체험 화면 텍스트는 한국어로 고정됩니다.",
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
      close: "닫기",
    };
  }

  return {
    title: "Brand Kiosk Practice",
    subtitle: "Choose a brand and start with a realistic kiosk layout.",
    englishTitle: "Find English menu",
    englishDesc: "Button location training only. Kiosk UI text stays in Korean.",
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
    close: "Close",
  };
}

function Header({ brand }: { brand: Brand }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${brand.topTone} ${brand.topText}`}>
      <button type="button" className="text-lg font-black">⌂</button>
      <p className="text-xl font-black tracking-tight">
        {brand.id === "compose" ? "COMPOSE COFFEE" : brand.id === "lotteria" ? "LOTTERIA KIOSK" : "Easy KIOSK"}
      </p>
      <button type="button" className="rounded-lg bg-white/85 px-3 py-1 text-sm font-black text-zinc-900">{brand.langButton}</button>
    </div>
  );
}

function MegaBody({ brand, categoryIndex, setCategoryIndex, menuItems, cart, addToCart, setCart, c, timeLeft, selectedCount, total, onPay }: {
  brand: Brand;
  categoryIndex: number;
  setCategoryIndex: (v: number) => void;
  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  setCart: (v: CartItem[]) => void;
  c: ReturnType<typeof getCopy>;
  timeLeft: number;
  selectedCount: number;
  total: number;
  onPay: () => void;
}) {
  return (
    <>
      <div className={`${brand.panelTone} px-3 py-2 text-zinc-900`}>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button type="button" onClick={() => setCategoryIndex(Math.max(0, categoryIndex - 1))} className="rounded-md bg-white px-2 py-1 text-sm font-black">←</button>
          {brand.categories.map((cat, idx) => (
            <button key={cat.id} type="button" onClick={() => setCategoryIndex(idx)} className={`shrink-0 rounded-md px-3 py-1 text-sm font-black ${idx === categoryIndex ? "bg-zinc-900 text-white" : "bg-white/90"}`}>
              {cat.label}
            </button>
          ))}
          <button type="button" onClick={() => setCategoryIndex(Math.min(brand.categories.length - 1, categoryIndex + 1))} className="rounded-md bg-white px-2 py-1 text-sm font-black">→</button>
        </div>
      </div>

      <div className="grid min-h-[42rem] grid-cols-[1fr_11rem] bg-zinc-50">
        <div className="border-r border-zinc-300 p-3">
          <div className="grid grid-cols-3 gap-2">
            {menuItems.map((item) => (
              <button key={item.id} type="button" onClick={() => addToCart(item)} className="rounded-xl border border-zinc-200 bg-white p-2 text-left">
                <div className={`aspect-[4/5] rounded-lg bg-gradient-to-br ${item.tint}`} />
                <p className="mt-2 line-clamp-2 text-[11px] font-black text-zinc-900">{item.name}</p>
                <p className="mt-1 text-[11px] font-bold text-rose-600">{toKrw(item.price)}</p>
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[9.5rem] rounded-xl border border-zinc-300 bg-white p-2">
            <p className="text-xs font-black text-zinc-700">{c.selected}</p>
            <div className="mt-2 space-y-1 text-xs font-semibold text-zinc-800">
              {cart.length === 0 ? <p className="text-zinc-500">-</p> : cart.map((item) => <p key={item.id}>{item.name} x{item.qty}</p>)}
            </div>
          </div>
        </div>

        <aside className={`p-3 ${brand.panelTone}`}>
          <div className="rounded-xl bg-white p-2 text-center">
            <p className="text-[11px] font-black text-zinc-700">{c.remain}</p>
            <p className="mt-1 text-3xl font-black text-rose-600">{timeLeft}</p>
            <p className="text-[10px] font-bold text-zinc-600">sec</p>
          </div>

          <button type="button" onClick={() => setCart([])} className="mt-2 w-full rounded-xl bg-white px-2 py-2 text-xs font-black text-zinc-900">{c.clear}</button>

          <div className="mt-2 rounded-xl bg-white p-2 text-center">
            <p className="text-[11px] font-black text-zinc-700">{c.selected}</p>
            <p className="mt-1 text-xl font-black text-zinc-900">{selectedCount} {c.qty}</p>
          </div>

          <div className="mt-2 rounded-xl bg-white p-2 text-center">
            <p className="text-[11px] font-black text-zinc-700">{c.total}</p>
            <p className="mt-1 text-lg font-black text-zinc-900">{toKrw(total)}</p>
          </div>

          <button type="button" disabled={cart.length === 0} onClick={onPay} className={`mt-3 w-full rounded-xl px-2 py-4 text-sm font-black text-white ${cart.length > 0 ? brand.payTone : "bg-zinc-400"}`}>
            {toKrw(total)} {c.pay}
          </button>
        </aside>
      </div>
    </>
  );
}

function ComposeBody({ brand, categoryIndex, setCategoryIndex, menuItems, cart, addToCart, c, total, onPay }: {
  brand: Brand;
  categoryIndex: number;
  setCategoryIndex: (v: number) => void;
  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  c: ReturnType<typeof getCopy>;
  total: number;
  onPay: () => void;
}) {
  const active = cart[0] ?? null;

  return (
    <>
      <div className="bg-white px-3 py-2 text-zinc-900">
        <div className="grid grid-cols-4 gap-y-1 text-center text-sm font-bold">
          {brand.categories.slice(0, 4).map((cat, idx) => (
            <button key={cat.id} type="button" onClick={() => setCategoryIndex(idx)} className={`rounded-full px-2 py-1 ${idx === categoryIndex ? "bg-blue-600 text-white" : ""}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-4 gap-y-1 text-center text-sm font-bold">
          {brand.categories.slice(4, 8).map((cat, idx) => {
            const realIdx = idx + 4;
            return (
              <button key={cat.id} type="button" onClick={() => setCategoryIndex(realIdx)} className={`rounded-full px-2 py-1 ${realIdx === categoryIndex ? "bg-blue-600 text-white" : ""}`}>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-h-[42rem] grid-rows-[1fr_7.5rem] bg-zinc-50">
        <div className="p-3">
          <div className="grid grid-cols-4 gap-2">
            {menuItems.map((item) => (
              <button key={item.id} type="button" onClick={() => addToCart(item)} className="rounded-lg border border-zinc-200 bg-white p-2 text-left">
                <div className={`aspect-[4/5] rounded-md bg-gradient-to-br ${item.tint}`} />
                <p className="mt-2 line-clamp-2 text-[11px] font-black text-zinc-900">{item.name}</p>
                <p className="mt-1 text-[11px] font-bold text-blue-700">{toKrw(item.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[2.2rem_1fr_1fr_1fr_7.5rem] border-t border-zinc-300 bg-white">
          <div className="grid place-items-center border-r border-zinc-200 text-lg font-black text-zinc-400">‹</div>
          <div className="border-r border-zinc-200 p-2">
            {active ? (
              <>
                <p className="line-clamp-1 text-xs font-black">{active.name}</p>
                <div className="mt-1 flex items-center gap-1">
                  <button type="button" className="h-5 w-5 rounded border border-zinc-300 text-[10px]">-</button>
                  <span className="text-[11px] font-black">{active.qty}</span>
                  <button type="button" className="h-5 w-5 rounded border border-zinc-300 text-[10px]">+</button>
                </div>
              </>
            ) : <p className="text-xs font-semibold text-zinc-400">-</p>}
          </div>
          <div className="border-r border-zinc-200" />
          <div className="border-r border-zinc-200" />
          <button type="button" onClick={onPay} disabled={cart.length === 0} className={`p-2 text-center text-white ${cart.length > 0 ? brand.payTone : "bg-zinc-400"}`}>
            <p className="text-xs font-bold">{toKrw(total)}</p>
            <p className="text-sm font-black">{c.pay}</p>
          </button>
        </div>
      </div>
    </>
  );
}

export function KioskPracticeSimulator({ lang }: { lang: Lang }) {
  const c = getCopy(lang);
  const [brandId, setBrandId] = useState<BrandId>("mega");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [lotteriaStage, setLotteriaStage] = useState<LotteriaStage>("place");

  const brand = useMemo(() => BRANDS.find((b) => b.id === brandId) ?? BRANDS[0], [brandId]);
  const category = brand.categories[Math.max(0, Math.min(categoryIndex, brand.categories.length - 1))];
  const menuItems = brand.itemsByCategory[category.id] ?? [];

  useEffect(() => {
    setTimeLeft(120);
    const t = window.setInterval(() => setTimeLeft((prev) => (prev <= 0 ? 120 : prev - 1)), 1000);
    return () => window.clearInterval(t);
  }, [brandId]);

  const selectedCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const isLotteria = brand.id === "lotteria";

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

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setBrandId(b.id);
              setCategoryIndex(0);
              setCart([]);
              setPaymentOpen(false);
              setLotteriaStage(b.id === "lotteria" ? "place" : "menu");
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

      {isLotteria ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([
            ["place", "매장/포장 선택"],
            ["menu", "메뉴 선택"],
            ["confirm", "주문 확인"],
            ["card", "카드 결제 안내"],
          ] as const).map(([stage, label]) => (
            <button key={stage} type="button" onClick={() => setLotteriaStage(stage)} className={`rounded-lg border px-3 py-2 text-xs font-black sm:text-sm ${lotteriaStage === stage ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-800"}`}>
              {label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="mx-auto w-[720px] overflow-hidden rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl">
          <Header brand={brand} />

          {isLotteria && lotteriaStage === "place" ? (
            <div className="grid min-h-[42rem] place-items-center bg-zinc-100 p-6">
              <div className="w-full max-w-md rounded-2xl border border-zinc-300 bg-white p-6">
                <p className="text-center text-2xl font-black text-zinc-900">식사 장소를 선택해 주세요</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setLotteriaStage("menu")} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-6 text-sm font-black">매장식사</button>
                  <button type="button" onClick={() => setLotteriaStage("menu")} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-6 text-sm font-black">포장주문</button>
                </div>
              </div>
            </div>
          ) : null}

          {isLotteria && lotteriaStage === "confirm" ? (
            <div className="grid min-h-[42rem] bg-zinc-100 p-4">
              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-xl font-black text-zinc-900">주문하신 내역을 확인해주세요</p>
                <div className="mt-3 space-y-2">
                  {cart.length === 0 ? <p className="text-sm font-semibold text-zinc-500">장바구니가 비어 있습니다.</p> : cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-2 text-sm font-semibold">
                      <span>{item.name} x{item.qty}</span>
                      <span>{toKrw(item.qty * item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-lg font-black">
                  <span>{c.total}</span>
                  <span>{toKrw(total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setLotteriaStage("menu")} className="rounded-lg border border-zinc-300 px-4 py-3 text-sm font-black">메뉴로</button>
                  <button type="button" onClick={() => setLotteriaStage("card")} className="rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white">결제선택</button>
                </div>
              </div>
            </div>
          ) : null}

          {isLotteria && lotteriaStage === "card" ? (
            <div className="grid min-h-[42rem] place-items-center bg-zinc-100 p-6">
              <div className="w-full max-w-md rounded-2xl border border-zinc-300 bg-white p-6 text-center">
                <p className="text-2xl font-black text-zinc-900">카드를 리더기에 올려주세요</p>
                <div className="mx-auto mt-5 h-36 w-36 rounded-full bg-amber-100" />
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setLotteriaStage("confirm")} className="rounded-lg border border-zinc-300 px-4 py-3 text-sm font-black">취소</button>
                  <button type="button" onClick={() => setLotteriaStage("menu")} className="rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white">카드 인식 완료</button>
                </div>
              </div>
            </div>
          ) : null}

          {!isLotteria || lotteriaStage === "menu" ? (
            brand.id === "compose" ? (
              <ComposeBody
                brand={brand}
                categoryIndex={categoryIndex}
                setCategoryIndex={setCategoryIndex}
                menuItems={menuItems}
                cart={cart}
                addToCart={addToCart}
                c={c}
                total={total}
                onPay={() => setPaymentOpen(true)}
              />
            ) : (
              <MegaBody
                brand={brand}
                categoryIndex={categoryIndex}
                setCategoryIndex={setCategoryIndex}
                menuItems={menuItems}
                cart={cart}
                addToCart={addToCart}
                setCart={setCart}
                c={c}
                timeLeft={timeLeft}
                selectedCount={selectedCount}
                total={total}
                onPay={() => (isLotteria ? setLotteriaStage("confirm") : setPaymentOpen(true))}
              />
            )
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link href={`/${lang}/tips/kiosk-survival-flow`} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-center text-sm font-bold text-zinc-900">{c.quickGuide}</Link>
        <Link href={`/${lang}/kiosk-card-rejected`} className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-center text-sm font-bold text-zinc-900">{c.deepGuide}</Link>
      </div>

      {paymentOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h3 className="text-xl font-black text-zinc-950">{c.payModalTitle}</h3>
            <p className="mt-1 text-sm font-semibold text-zinc-600">{c.payModalDesc}</p>
            <div className="mt-4 space-y-2">
              {brand.payMethods.map((method, idx) => (
                <button key={method} type="button" className={`w-full rounded-xl border px-4 py-3 text-sm font-black ${idx === 0 ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-900"}`}>
                  {method}
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
