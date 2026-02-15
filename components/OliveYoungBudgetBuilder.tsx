"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Budget = 30 | 50 | 100;
type Purpose = "self" | "gift";
type SkinType = "oily" | "dry" | "sensitive" | "combination";

type PickItem = { name: string; priceKrw: number };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Olive Young Budget Builder",
      desc: "예산에 맞춰 바로 살 리스트를 만듭니다.",
      budget: "예산 (USD)",
      purpose: "목적",
      skin: "피부 타입",
      self: "셀프",
      gift: "선물",
      oily: "지성",
      dry: "건성",
      sensitive: "민감성",
      combination: "복합성",
      list: "구매 리스트",
      total: "예상 KRW 합계",
      tax: "택스리펀",
      taxYes: "가능 (여권 필요, 매장 정책 확인)",
      taxNo: "어려움 (금액이 낮음)",
      liveRate: "실시간 환율",
    };
  }
  if (lang === "ja") {
    return {
      title: "Olive Young Budget Builder",
      desc: "予算に合わせて買う物を即作成。",
      budget: "予算 (USD)",
      purpose: "目的",
      skin: "肌タイプ",
      self: "自分用",
      gift: "ギフト",
      oily: "脂性肌",
      dry: "乾燥肌",
      sensitive: "敏感肌",
      combination: "混合肌",
      list: "購入リスト",
      total: "予想 KRW 合計",
      tax: "Tax refund",
      taxYes: "可能（パスポート必須・店舗条件あり）",
      taxNo: "難しい（購入額が低い）",
      liveRate: "ライブ為替",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Olive Young Budget Builder",
      desc: "按预算快速生成购买清单。",
      budget: "预算 (USD)",
      purpose: "目的",
      skin: "肤质",
      self: "自用",
      gift: "送礼",
      oily: "油性",
      dry: "干性",
      sensitive: "敏感",
      combination: "混合",
      list: "购买清单",
      total: "预计 KRW 总额",
      tax: "退税",
      taxYes: "可退税（需护照，视门店政策）",
      taxNo: "较难（金额偏低）",
      liveRate: "实时汇率",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Olive Young Budget Builder",
      desc: "依預算快速產生購買清單。",
      budget: "預算 (USD)",
      purpose: "目的",
      skin: "膚質",
      self: "自用",
      gift: "送禮",
      oily: "油性",
      dry: "乾性",
      sensitive: "敏感",
      combination: "混合",
      list: "購買清單",
      total: "預估 KRW 總額",
      tax: "退稅",
      taxYes: "可退稅（需護照，依門市政策）",
      taxNo: "較難（金額偏低）",
      liveRate: "即時匯率",
    };
  }
  return {
    title: "Olive Young Budget Builder",
    desc: "Build a practical basket by budget.",
    budget: "Budget (USD)",
    purpose: "Purpose",
    skin: "Skin type",
    self: "Self",
    gift: "Gift",
    oily: "Oily",
    dry: "Dry",
    sensitive: "Sensitive",
    combination: "Combination",
    list: "Buy list",
    total: "Estimated KRW total",
    tax: "Tax refund",
    taxYes: "Possible (passport required, store policy applies)",
    taxNo: "Unlikely (basket too small)",
    liveRate: "Live rate",
  };
}

function skinItem(lang: Lang, skin: SkinType): PickItem {
  const label =
    lang === "ko"
      ? skin === "oily"
        ? "가벼운 수분크림"
        : skin === "dry"
          ? "보습 크림"
          : skin === "sensitive"
            ? "진정 크림"
            : "밸런스 크림"
      : lang === "ja"
        ? skin === "oily"
          ? "軽め保湿クリーム"
          : skin === "dry"
            ? "高保湿クリーム"
            : skin === "sensitive"
              ? "鎮静クリーム"
              : "バランスクリーム"
        : lang === "zh-cn"
          ? skin === "oily"
            ? "清爽面霜"
            : skin === "dry"
              ? "高保湿面霜"
              : skin === "sensitive"
                ? "舒缓面霜"
                : "平衡面霜"
          : (lang === "zh-tw" || lang === "zh-hk")
            ? skin === "oily"
              ? "清爽面霜"
              : skin === "dry"
                ? "高保濕面霜"
                : skin === "sensitive"
                  ? "舒緩面霜"
                  : "平衡面霜"
            : skin === "oily"
              ? "Light moisturizer"
              : skin === "dry"
                ? "Rich moisturizer"
                : skin === "sensitive"
                  ? "Soothing cream"
                  : "Balance cream";
  return { name: label, priceKrw: 18000 };
}

function buildList(lang: Lang, budgetUsd: Budget, purpose: Purpose, skin: SkinType): PickItem[] {
  const baseSelf: Record<Budget, PickItem[]> = {
    30: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000 },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000 },
      { name: lang === "ko" ? "시트마스크 5매" : "Sheet mask x5", priceKrw: 9000 },
    ],
    50: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000 },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000 },
      { name: lang === "ko" ? "시트마스크 10매" : "Sheet mask x10", priceKrw: 15000 },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000 },
    ],
    100: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000 },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000 },
      { name: lang === "ko" ? "시트마스크 20매" : "Sheet mask x20", priceKrw: 28000 },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000 },
      { name: lang === "ko" ? "선크림" : "Sunscreen", priceKrw: 18000 },
    ],
  };

  const baseGift: Record<Budget, PickItem[]> = {
    30: [
      { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000 },
      { name: lang === "ko" ? "마스크팩 선물팩" : "Mask gift pack", priceKrw: 13000 },
      { name: lang === "ko" ? "립밤" : "Lip balm", priceKrw: 8000 },
    ],
    50: [
      { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000 },
      { name: lang === "ko" ? "마스크팩 선물팩" : "Mask gift pack", priceKrw: 18000 },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000 },
      { name: lang === "ko" ? "미니 향수" : "Mini fragrance", priceKrw: 17000 },
    ],
    100: [
      { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000 },
      { name: lang === "ko" ? "마스크팩 대용량" : "Large mask bundle", priceKrw: 28000 },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000 },
      { name: lang === "ko" ? "미니 향수" : "Mini fragrance", priceKrw: 17000 },
      { name: lang === "ko" ? "바디케어 세트" : "Body care set", priceKrw: 23000 },
    ],
  };

  const core = purpose === "self" ? baseSelf[budgetUsd] : baseGift[budgetUsd];
  return purpose === "self" ? [...core, skinItem(lang, skin)] : core;
}

export function OliveYoungBudgetBuilder({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [budgetUsd, setBudgetUsd] = useState<Budget>(50);
  const [purpose, setPurpose] = useState<Purpose>("self");
  const [skin, setSkin] = useState<SkinType>("combination");
  const [usdRate, setUsdRate] = useState(1400);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/exchange-rates");
        if (!res.ok) return;
        const json = (await res.json()) as { ok?: boolean; ratesKrwPerUnit?: Record<string, number> };
        if (!cancelled && json.ok && json.ratesKrwPerUnit?.USD) {
          setUsdRate(json.ratesKrwPerUnit.USD);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const picks = useMemo(() => buildList(lang, budgetUsd, purpose, skin), [lang, budgetUsd, purpose, skin]);
  const totalKrw = useMemo(() => picks.reduce((sum, item) => sum + item.priceKrw, 0), [picks]);
  const budgetKrw = Math.round(budgetUsd * usdRate);
  const taxRefund = totalKrw >= 30000;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.budget}</p>
          <div className="mt-2 flex gap-2">
            {[30, 50, 100].map((usd) => (
              <button
                key={usd}
                type="button"
                onClick={() => setBudgetUsd(usd as Budget)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetUsd === usd ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700"}`}
              >
                {usd}
              </button>
            ))}
          </div>
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.purpose}</p>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as Purpose)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
          >
            <option value="self">{c.self}</option>
            <option value="gift">{c.gift}</option>
          </select>
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.skin}</p>
          <select
            value={skin}
            onChange={(e) => setSkin(e.target.value as SkinType)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
          >
            <option value="oily">{c.oily}</option>
            <option value="dry">{c.dry}</option>
            <option value="sensitive">{c.sensitive}</option>
            <option value="combination">{c.combination}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.total}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{totalKrw.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.budget}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{budgetKrw.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.tax}</p>
          <p className="mt-1 text-sm font-black text-zinc-900">{taxRefund ? c.taxYes : c.taxNo}</p>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-zinc-600">{c.liveRate}: 1 USD = ₩{usdRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-black text-zinc-900">{c.list}</h3>
        <ul className="mt-2 space-y-2 text-sm text-zinc-800">
          {picks.map((item) => (
            <li key={`${item.name}-${item.priceKrw}`} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
              <span className="font-semibold">{item.name}</span>
              <span className="font-black">₩{item.priceKrw.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
