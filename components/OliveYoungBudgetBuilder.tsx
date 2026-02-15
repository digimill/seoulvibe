"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Budget = 30 | 50 | 100;
type BudgetKrwPreset = 50000 | 90000 | 140000;
type Purpose = "self" | "gift";
type SkinType = "oily" | "dry" | "sensitive" | "combination";
type GiftStyle = "practical" | "cute" | "trendy";
type Currency = "USD" | "EUR" | "JPY" | "CNY" | "TWD" | "HKD" | "GBP" | "AUD" | "CAD" | "SGD" | "THB" | "VND";

type PickItem = { name: string; priceKrw: number; alt?: string };
type PickOption = { name: string; priceKrw: number };

type DisplayItem = {
  key: string;
  options: PickOption[];
  selectedIndex: number;
  checked: boolean;
};
type BaseItem = {
  key: string;
  options: PickOption[];
};

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
const OLIVE_DISPLAY_CURRENCY_KEY = "sv-olive-display-currency-v1";

function localeCurrency(lang: Lang): Currency {
  if (lang === "ja") return "JPY";
  if (lang === "zh-cn") return "CNY";
  if (lang === "zh-tw") return "TWD";
  if (lang === "zh-hk") return "HKD";
  return "USD";
}

function currencyFromNavigator(): Currency | null {
  if (typeof navigator === "undefined") return null;
  const locale = (navigator.language || "").toLowerCase();
  if (locale.startsWith("ja")) return "JPY";
  if (locale.startsWith("zh-cn")) return "CNY";
  if (locale.startsWith("zh-tw")) return "TWD";
  if (locale.startsWith("zh-hk") || locale.startsWith("zh-mo") || locale.startsWith("yue")) return "HKD";
  if (locale.startsWith("en-gb")) return "GBP";
  if (locale.startsWith("en-au")) return "AUD";
  if (locale.startsWith("en-ca")) return "CAD";
  if (locale.startsWith("en-sg")) return "SGD";
  if (locale.startsWith("th")) return "THB";
  if (locale.startsWith("vi")) return "VND";
  return "USD";
}

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Olive Young Budget Builder",
      desc: "체크하면서 고르고, 예산 안에서 끝냅니다.",
      fastMode: "30분 빠른 모드",
      fastOn: "켜짐",
      fastOff: "꺼짐",
      budget: "예산",
      budgetPreset: "예산 단계 (KRW)",
      budgetGuide: "원화 기준으로 고른 뒤, 아래 통화로 환산해 보세요.",
      budgetKrw: "선택 예산 (KRW)",
      budgetByCurrency: "표시 통화",
      purpose: "목적",
      skin: "피부 타입",
      skinHelp: "셀프 선택 시에만 반영됩니다.",
      giftStyle: "선물 성향",
      self: "셀프",
      gift: "선물",
      practical: "실용형",
      cute: "가벼운 소품형",
      trendy: "트렌드형",
      oily: "지성",
      dry: "건성",
      sensitive: "민감성",
      combination: "복합성",
      list: "구매 리스트 (체크 가능)",
      listHelp: "체크된 항목만 최종 합계에 반영됩니다.",
      swap: "옵션 변경",
      total: "전체 합계",
      checkedTotal: "체크 합계",
      tax: "택스리펀",
      taxYes: "가능 (여권 필요, 매장 정책 확인)",
      taxNo: "어려움 (금액이 낮음)",
      liveRate: "실시간 환율",
      budgetLeft: "예산 여유",
      budgetOver: "예산 초과",
      copyList: "체크 리스트 복사",
      copied: "복사 완료",
      soldOut: "품절 시 대체",
      examplesLabel: "대표 예시",
      skipTitle: "이번엔 건너뛰기",
      skipItems: ["10단계 루틴 세트", "영문 라벨 없는 제품", "지금 유행만 타는 랜덤템"],
      routeTitle: "매장 동선 (빠르게)",
      routeItems: ["마스크팩/클렌징 먼저", "컬러/립 포인트만 추가", "계산 전 택스리펀 가능 여부 확인"],
    };
  }
  if (lang === "ja") {
    return {
      title: "Olive Young Budget Builder",
      desc: "チェックしながら選んで、予算内で終える。",
      fastMode: "30分クイックモード",
      fastOn: "ON",
      fastOff: "OFF",
      budget: "予算",
      budgetPreset: "予算段階 (KRW)",
      budgetGuide: "KRW基準で選んで、下の通貨に換算してください。",
      budgetKrw: "選択予算 (KRW)",
      budgetByCurrency: "表示通貨",
      purpose: "目的",
      skin: "肌タイプ",
      skinHelp: "自分用を選んだときのみ反映。",
      giftStyle: "ギフトタイプ",
      self: "自分用",
      gift: "ギフト",
      practical: "実用",
      cute: "軽い小物",
      trendy: "トレンド",
      oily: "脂性肌",
      dry: "乾燥肌",
      sensitive: "敏感肌",
      combination: "混合肌",
      list: "購入リスト (チェック可)",
      listHelp: "チェックした項目のみ最終合計に反映。",
      swap: "候補を変更",
      total: "全体合計",
      checkedTotal: "チェック合計",
      tax: "Tax refund",
      taxYes: "可能（パスポート必須・店舗条件あり）",
      taxNo: "難しい（購入額が低い）",
      liveRate: "ライブ為替",
      budgetLeft: "予算余裕",
      budgetOver: "予算オーバー",
      copyList: "チェックリストをコピー",
      copied: "コピー完了",
      soldOut: "在庫切れ時の代替",
      examplesLabel: "代表例",
      skipTitle: "今回は見送る",
      skipItems: ["10ステップルーティンセット", "英語ラベルなし商品", "流行だけのランダム商品"],
      routeTitle: "店内の動線（最短）",
      routeItems: ["マスク/洗顔を先に確保", "カラー系は必要分だけ", "会計前に免税対象を確認"],
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Olive Young Budget Builder",
      desc: "边选边勾选，控制在预算内。",
      fastMode: "30分钟快速模式",
      fastOn: "开启",
      fastOff: "关闭",
      budget: "预算",
      budgetPreset: "预算档位 (KRW)",
      budgetGuide: "先按韩元选择档位，再换算到你的货币。",
      budgetKrw: "所选预算 (KRW)",
      budgetByCurrency: "显示货币",
      purpose: "目的",
      skin: "肤质",
      skinHelp: "仅在选择自用时生效。",
      giftStyle: "送礼风格",
      self: "自用",
      gift: "送礼",
      practical: "实用型",
      cute: "轻巧小物",
      trendy: "潮流型",
      oily: "油性",
      dry: "干性",
      sensitive: "敏感",
      combination: "混合",
      list: "购买清单（可勾选）",
      listHelp: "仅勾选项计入最终合计。",
      swap: "切换选项",
      total: "全部合计",
      checkedTotal: "勾选合计",
      tax: "退税",
      taxYes: "可退税（需护照，视门店政策）",
      taxNo: "较难（金额偏低）",
      liveRate: "实时汇率",
      budgetLeft: "预算剩余",
      budgetOver: "预算超出",
      copyList: "复制勾选清单",
      copied: "已复制",
      soldOut: "缺货可替代",
      examplesLabel: "代表示例",
      skipTitle: "这次先跳过",
      skipItems: ["10步护肤整套", "无英文标签产品", "只靠热搜的随机爆款"],
      routeTitle: "店内动线（最快）",
      routeItems: ["先拿面膜/清洁", "彩妆只补关键单品", "结账前确认退税条件"],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Olive Young Budget Builder",
      desc: "邊選邊勾，控制在預算內。",
      fastMode: "30分鐘快速模式",
      fastOn: "開啟",
      fastOff: "關閉",
      budget: "預算",
      budgetPreset: "預算檔位 (KRW)",
      budgetGuide: "先按韓元選檔位，再換算成你的貨幣。",
      budgetKrw: "所選預算 (KRW)",
      budgetByCurrency: "顯示貨幣",
      purpose: "目的",
      skin: "膚質",
      skinHelp: "僅在選擇自用時生效。",
      giftStyle: "送禮風格",
      self: "自用",
      gift: "送禮",
      practical: "實用型",
      cute: "輕巧小物",
      trendy: "潮流型",
      oily: "油性",
      dry: "乾性",
      sensitive: "敏感",
      combination: "混合",
      list: "購買清單（可勾選）",
      listHelp: "只把勾選項目算進最終合計。",
      swap: "切換選項",
      total: "全部合計",
      checkedTotal: "勾選合計",
      tax: "退稅",
      taxYes: "可退稅（需護照，依門市政策）",
      taxNo: "較難（金額偏低）",
      liveRate: "即時匯率",
      budgetLeft: "預算剩餘",
      budgetOver: "預算超出",
      copyList: "複製勾選清單",
      copied: "已複製",
      soldOut: "缺貨替代",
      examplesLabel: "代表範例",
      skipTitle: "這次先跳過",
      skipItems: ["10步保養整套", "沒有英文標示的產品", "只靠熱搜的隨機爆款"],
      routeTitle: "店內動線（最快）",
      routeItems: ["先拿面膜/清潔", "彩妝只補關鍵品", "結帳前先確認退稅條件"],
    };
  }
  return {
    title: "Olive Young Budget Builder",
    desc: "Pick with checkboxes and stay inside budget.",
    fastMode: "30-min quick mode",
    fastOn: "On",
    fastOff: "Off",
    budget: "Budget",
    budgetPreset: "Budget tiers (KRW)",
    budgetGuide: "Choose KRW first, then view in your currency.",
    budgetKrw: "Selected budget (KRW)",
    budgetByCurrency: "Display currency",
    purpose: "Purpose",
    skin: "Skin type",
    skinHelp: "Applied only when purpose is Self.",
    giftStyle: "Gift style",
    self: "Self",
    gift: "Gift",
    practical: "Practical",
    cute: "Cute mini set",
    trendy: "Trendy picks",
    oily: "Oily",
    dry: "Dry",
    sensitive: "Sensitive",
    combination: "Combination",
    list: "Buy list (checkable)",
    listHelp: "Only checked items are included in final total.",
    swap: "Swap option",
    total: "Planned total",
    checkedTotal: "Checked total",
    tax: "Tax refund",
    taxYes: "Possible (passport required, store policy applies)",
    taxNo: "Unlikely (basket too small)",
    liveRate: "Live rate",
    budgetLeft: "Budget left",
    budgetOver: "Over budget",
    copyList: "Copy checked list",
    copied: "Copied",
    soldOut: "If sold out, swap to",
    examplesLabel: "Example picks",
    skipTitle: "Skip this time",
    skipItems: ["10-step routine sets", "Items without English labels", "Random hype products only"],
    routeTitle: "In-store route (fast)",
    routeItems: ["Grab masks/cleanser first", "Add only key color items", "Check tax refund eligibility before paying"],
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
  return { name: label, priceKrw: 18000, alt: lang === "ko" ? "수분 크림" : "Basic moisturizer" };
}

function exampleProducts(name: string): string[] {
  const n = name.toLowerCase();
  if (/클렌저|cleanser|洗顔|清洁|清潔/.test(n)) return ["Round Lab Dokdo Cleanser", "COSRX Low pH Good Morning"];
  if (/토너|toner|化粧水|爽肤水|化妝水/.test(n)) return ["Anua Heartleaf 77 Toner", "Round Lab Dokdo Toner"];
  if (/마스크|mask/.test(n)) return ["Mediheal N.M.F", "Abib Gummy Sheet Mask"];
  if (/립|lip|tint|gloss|balm/.test(n)) return ["rom&nd Juicy Lasting Tint", "Peripera Ink Mood Glowy Tint"];
  if (/선크림|sunscreen|sun/.test(n)) return ["Beauty of Joseon Relief Sun", "Round Lab Birch Juice Sun Cream"];
  if (/쿠션|cushion/.test(n)) return ["CLIO Kill Cover Cushion", "TIRTIR Mask Fit Cushion"];
  if (/세럼|serum|ampoule/.test(n)) return ["Torriden Dive-In Serum", "Anua Peach 70 Niacin Serum"];
  if (/핸드크림|hand cream/.test(n)) return ["Atrix Hand Cream", "W.Dressroom Hand Cream"];
  if (/바디|body/.test(n)) return ["ILLIYOON Ceramide Ato Lotion", "Derma:B Daily Moisture Body Lotion"];
  if (/향수|fragrance|perfume/.test(n)) return ["W.Dressroom Dress & Living", "Ariul Perfume Hand Cream"];
  return ["Round Lab", "COSRX"];
}

function budgetTierFromKrw(krw: number): Budget {
  if (krw < 65000) return 30;
  if (krw < 130000) return 50;
  return 100;
}

function buildList(lang: Lang, budgetTier: Budget, purpose: Purpose, skin: SkinType, giftStyle: GiftStyle, rushMode: boolean): PickItem[] {
  const baseSelf: Record<Budget, PickItem[]> = {
    30: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000, alt: lang === "ko" ? "약산성 폼클렌저" : "Low-pH cleanser" },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000, alt: lang === "ko" ? "미스트 토너" : "Mist toner" },
      { name: lang === "ko" ? "시트마스크 5매" : "Sheet mask x5", priceKrw: 9000, alt: lang === "ko" ? "진정 마스크 3매" : "Soothing mask x3" },
    ],
    50: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000, alt: lang === "ko" ? "클렌징 워터" : "Cleansing water" },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000, alt: lang === "ko" ? "토너 패드" : "Toner pads" },
      { name: lang === "ko" ? "시트마스크 10매" : "Sheet mask x10", priceKrw: 15000, alt: lang === "ko" ? "마스크 5매" : "Sheet mask x5" },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000, alt: lang === "ko" ? "립밤" : "Lip balm" },
    ],
    100: [
      { name: lang === "ko" ? "클렌저" : "Cleanser", priceKrw: 12000, alt: lang === "ko" ? "클렌징 밤" : "Cleansing balm" },
      { name: lang === "ko" ? "토너" : "Toner", priceKrw: 14000, alt: lang === "ko" ? "토너 패드" : "Toner pads" },
      { name: lang === "ko" ? "시트마스크 20매" : "Sheet mask x20", priceKrw: 28000, alt: lang === "ko" ? "시트마스크 10매" : "Sheet mask x10" },
      { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000, alt: lang === "ko" ? "글로스" : "Lip gloss" },
      { name: lang === "ko" ? "선크림" : "Sunscreen", priceKrw: 18000, alt: lang === "ko" ? "선스틱" : "Sun stick" },
    ],
  };

  const giftSets: Record<GiftStyle, Record<Budget, PickItem[]>> = {
    practical: {
      30: [
        { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000, alt: lang === "ko" ? "핸드크림 2개" : "Hand cream duo" },
        { name: lang === "ko" ? "마스크팩 선물팩" : "Mask gift pack", priceKrw: 13000, alt: lang === "ko" ? "시트팩 소포장" : "Mini mask pack" },
        { name: lang === "ko" ? "립밤" : "Lip balm", priceKrw: 8000, alt: lang === "ko" ? "립케어" : "Lip care" },
      ],
      50: [
        { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000, alt: lang === "ko" ? "핸드워시+핸드크림" : "Hand wash + cream" },
        { name: lang === "ko" ? "마스크팩 선물팩" : "Mask gift pack", priceKrw: 18000, alt: lang === "ko" ? "마스크팩 10매" : "Mask x10" },
        { name: lang === "ko" ? "보습 립케어" : "Lip care set", priceKrw: 12000, alt: lang === "ko" ? "립밤 2개" : "Lip balm duo" },
        { name: lang === "ko" ? "바디로션 미니" : "Mini body lotion", priceKrw: 17000, alt: lang === "ko" ? "바디워시 미니" : "Mini body wash" },
      ],
      100: [
        { name: lang === "ko" ? "핸드크림 세트" : "Hand cream set", priceKrw: 15000, alt: lang === "ko" ? "핸드케어 키트" : "Hand care kit" },
        { name: lang === "ko" ? "마스크팩 대용량" : "Large mask bundle", priceKrw: 28000, alt: lang === "ko" ? "마스크팩 세트" : "Mask set" },
        { name: lang === "ko" ? "바디케어 세트" : "Body care set", priceKrw: 23000, alt: lang === "ko" ? "바디로션+워시" : "Lotion + wash" },
        { name: lang === "ko" ? "풋케어 세트" : "Foot care set", priceKrw: 16000, alt: lang === "ko" ? "풋마스크" : "Foot mask" },
        { name: lang === "ko" ? "립밤 2개" : "Lip balm duo", priceKrw: 14000, alt: lang === "ko" ? "립케어 세트" : "Lip care set" },
      ],
    },
    cute: {
      30: [
        { name: lang === "ko" ? "미니 핸드크림" : "Mini hand cream", priceKrw: 9000, alt: lang === "ko" ? "향 핸드크림" : "Scented hand cream" },
        { name: lang === "ko" ? "틴트 미니" : "Mini lip tint", priceKrw: 11000, alt: lang === "ko" ? "립밤 미니" : "Mini lip balm" },
        { name: lang === "ko" ? "캐릭터 시트팩" : "Character sheet pack", priceKrw: 10000, alt: lang === "ko" ? "디자인 마스크" : "Design mask pack" },
      ],
      50: [
        { name: lang === "ko" ? "미니 향수" : "Mini fragrance", priceKrw: 17000, alt: lang === "ko" ? "롤온 향수" : "Roll-on perfume" },
        { name: lang === "ko" ? "틴트 2개" : "Lip tint x2", priceKrw: 22000, alt: lang === "ko" ? "틴트+글로스" : "Tint + gloss" },
        { name: lang === "ko" ? "포켓 핸드크림" : "Pocket hand cream", priceKrw: 10000, alt: lang === "ko" ? "포켓 미스트" : "Pocket mist" },
      ],
      100: [
        { name: lang === "ko" ? "미니 향수 세트" : "Mini fragrance set", priceKrw: 34000, alt: lang === "ko" ? "향수 미니 듀오" : "Mini perfume duo" },
        { name: lang === "ko" ? "쿠션 리필 포함" : "Cushion + refill", priceKrw: 32000, alt: lang === "ko" ? "쿠션 단품" : "Cushion only" },
        { name: lang === "ko" ? "틴트 2개" : "Lip tint x2", priceKrw: 22000, alt: lang === "ko" ? "틴트+글로스" : "Tint + gloss" },
        { name: lang === "ko" ? "마스크팩 세트" : "Mask pack set", priceKrw: 12000, alt: lang === "ko" ? "스팟 패치" : "Spot patch" },
      ],
    },
    trendy: {
      30: [
        { name: lang === "ko" ? "트렌딩 마스크팩" : "Trending sheet mask", priceKrw: 12000, alt: lang === "ko" ? "신상 마스크팩" : "New mask pack" },
        { name: lang === "ko" ? "신상 립틴트" : "New lip tint", priceKrw: 12000, alt: lang === "ko" ? "신상 립글로스" : "New lip gloss" },
        { name: lang === "ko" ? "클린 포뮬라 미니" : "Clean formula mini", priceKrw: 9000, alt: lang === "ko" ? "저자극 미니" : "Low-irritation mini" },
      ],
      50: [
        { name: lang === "ko" ? "신상 쿠션 미니" : "New cushion mini", priceKrw: 21000, alt: lang === "ko" ? "신상 파운데이션 미니" : "New foundation mini" },
        { name: lang === "ko" ? "트렌딩 세럼" : "Trending serum", priceKrw: 19000, alt: lang === "ko" ? "신상 앰플" : "New ampoule" },
        { name: lang === "ko" ? "립틴트" : "Lip tint", priceKrw: 12000, alt: lang === "ko" ? "립글로스" : "Lip gloss" },
      ],
      100: [
        { name: lang === "ko" ? "트렌딩 세럼" : "Trending serum", priceKrw: 19000, alt: lang === "ko" ? "트렌딩 앰플" : "Trending ampoule" },
        { name: lang === "ko" ? "신상 쿠션 + 리필" : "New cushion + refill", priceKrw: 32000, alt: lang === "ko" ? "쿠션 단품" : "Cushion only" },
        { name: lang === "ko" ? "선크림 듀오" : "Sunscreen duo", priceKrw: 28000, alt: lang === "ko" ? "선스틱 듀오" : "Sun stick duo" },
        { name: lang === "ko" ? "립틴트 2개" : "Lip tint x2", priceKrw: 22000, alt: lang === "ko" ? "립틴트+립밤" : "Tint + balm" },
      ],
    },
  };

  const core = purpose === "self" ? baseSelf[budgetTier] : giftSets[giftStyle][budgetTier];
  const full = purpose === "self" ? [...core, skinItem(lang, skin)] : core;
  return rushMode ? full.slice(0, 3) : full;
}

function buildOptions(item: PickItem): PickOption[] {
  if (!item.alt) return [{ name: item.name, priceKrw: item.priceKrw }];
  return [
    { name: item.name, priceKrw: item.priceKrw },
    { name: item.alt, priceKrw: Math.max(1000, Math.round(item.priceKrw * 0.9)) },
  ];
}

function autoFitSelections(baseItems: BaseItem[], budgetKrw: number): { selected: Record<string, number>; checked: Record<string, boolean> } {
  const safeBudget = Math.max(0, budgetKrw);
  const target = Math.round(safeBudget * 0.98);
  const selected: Record<string, number> = {};
  const checked: Record<string, boolean> = {};

  // Start from cheapest option on all items.
  let total = 0;
  for (const item of baseItems) {
    let minIdx = 0;
    let minPrice = item.options[0]?.priceKrw ?? 0;
    for (let i = 1; i < item.options.length; i += 1) {
      if (item.options[i].priceKrw < minPrice) {
        minPrice = item.options[i].priceKrw;
        minIdx = i;
      }
    }
    selected[item.key] = minIdx;
    checked[item.key] = true;
    total += minPrice;
  }

  // If over budget, uncheck from the end until under target.
  if (total > target) {
    for (let i = baseItems.length - 1; i >= 0; i -= 1) {
      if (total <= target) break;
      const item = baseItems[i];
      if (!checked[item.key]) continue;
      total -= item.options[selected[item.key]].priceKrw;
      checked[item.key] = false;
    }
  }

  // If under budget, upgrade options greedily within budget.
  if (total < target) {
    let improved = true;
    while (improved) {
      improved = false;
      let bestKey: string | null = null;
      let bestIdx = -1;
      let bestDelta = 0;

      for (const item of baseItems) {
        if (!checked[item.key]) continue;
        const currentIdx = selected[item.key];
        const currentPrice = item.options[currentIdx].priceKrw;
        for (let i = 0; i < item.options.length; i += 1) {
          const nextPrice = item.options[i].priceKrw;
          const delta = nextPrice - currentPrice;
          if (delta <= 0) continue;
          if (total + delta > safeBudget) continue;
          if (delta > bestDelta) {
            bestDelta = delta;
            bestKey = item.key;
            bestIdx = i;
          }
        }
      }

      if (bestKey && bestDelta > 0) {
        selected[bestKey] = bestIdx;
        total += bestDelta;
        improved = true;
      }
    }
  }

  return { selected, checked };
}

export function OliveYoungBudgetBuilder({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const localeDefault = localeCurrency(lang);
  const [budgetKrwPreset, setBudgetKrwPreset] = useState<BudgetKrwPreset>(90000);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(localeDefault);
  const [purpose, setPurpose] = useState<Purpose>("self");
  const [skin, setSkin] = useState<SkinType>("combination");
  const [giftStyle, setGiftStyle] = useState<GiftStyle>("practical");
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [rushMode, setRushMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOptionByKey, setSelectedOptionByKey] = useState<Record<string, number>>({});
  const [checkedByKey, setCheckedByKey] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/exchange-rates");
        if (!res.ok) return;
        const json = (await res.json()) as { ok?: boolean; ratesKrwPerUnit?: Record<string, number> };
        if (!cancelled && json.ok && json.ratesKrwPerUnit) {
          const merged = { ...DEFAULT_RATES } as Record<Currency, number>;
          for (const code of ALL_CURRENCIES) {
            const v = json.ratesKrwPerUnit[code];
            if (typeof v === "number" && v > 0) merged[code] = v;
          }
          setRates(merged);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(OLIVE_DISPLAY_CURRENCY_KEY) as Currency | null;
    if (stored && DEFAULT_RATES[stored]) {
      setDisplayCurrency(stored);
      return;
    }
    const navCurrency = currencyFromNavigator();
    if (navCurrency && DEFAULT_RATES[navCurrency]) {
      setDisplayCurrency(navCurrency);
      return;
    }
    setDisplayCurrency(localeDefault);
  }, [localeDefault]);

  useEffect(() => {
    localStorage.setItem(OLIVE_DISPLAY_CURRENCY_KEY, displayCurrency);
  }, [displayCurrency]);

  const budgetKrw = budgetKrwPreset;
  const budgetTier: Budget = budgetKrwPreset <= 50000 ? 30 : budgetKrwPreset <= 90000 ? 50 : 100;
  const displayRate = rates[displayCurrency] ?? DEFAULT_RATES[displayCurrency];
  const budgetInDisplayCurrency = displayRate > 0 ? budgetKrw / displayRate : 0;

  const picks = useMemo(() => {
    const base = buildList(lang, budgetTier, purpose, skin, giftStyle, rushMode);
    if (rushMode) return base;

    const topUps: PickItem[] = [
      { name: lang === "ko" ? "토너 패드" : "Toner pads", priceKrw: 15000, alt: lang === "ko" ? "코튼 패드" : "Cotton pads" },
      { name: lang === "ko" ? "스팟 패치" : "Spot patch", priceKrw: 7000, alt: lang === "ko" ? "트러블 패드" : "Trouble pad" },
      { name: lang === "ko" ? "미니 세럼" : "Mini serum", priceKrw: 13000, alt: lang === "ko" ? "앰플 미니" : "Mini ampoule" },
      { name: lang === "ko" ? "핸드크림" : "Hand cream", priceKrw: 9000, alt: lang === "ko" ? "립케어" : "Lip care" },
      { name: lang === "ko" ? "보습 바디로션" : "Body lotion", priceKrw: 17000, alt: lang === "ko" ? "바디워시" : "Body wash" },
      { name: lang === "ko" ? "마스크팩 번들" : "Mask bundle", priceKrw: 12000, alt: lang === "ko" ? "마스크팩 5매" : "Sheet mask x5" },
      { name: lang === "ko" ? "선케어 보조" : "Extra sun care", priceKrw: 18000, alt: lang === "ko" ? "선스틱" : "Sun stick" },
    ];

    const target = Math.max(0, budgetKrw - 10000);
    let total = base.reduce((sum, item) => sum + item.priceKrw, 0);
    const out = [...base];
    let i = 0;

    while (total < target && i < topUps.length) {
      out.push(topUps[i]);
      total += topUps[i].priceKrw;
      i += 1;
    }
    return out;
  }, [lang, budgetTier, purpose, skin, giftStyle, rushMode, budgetKrw]);

  const baseItems = useMemo<BaseItem[]>(() => {
    return picks.map((item, idx) => {
      const key = `${idx}-${item.name}`;
      const options = buildOptions(item);
      return { key, options };
    });
  }, [picks]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    return baseItems.map((item) => {
      return {
        key: item.key,
        options: item.options,
        selectedIndex: selectedOptionByKey[item.key] ?? 0,
        checked: checkedByKey[item.key] ?? true,
      };
    });
  }, [baseItems, selectedOptionByKey, checkedByKey]);

  useEffect(() => {
    const fitted = autoFitSelections(baseItems, budgetKrw);
    setSelectedOptionByKey(fitted.selected);
    setCheckedByKey(fitted.checked);
  }, [baseItems, budgetKrw]);

  const plannedTotalKrw = useMemo(() => {
    return displayItems.reduce((sum, item) => sum + item.options[item.selectedIndex].priceKrw, 0);
  }, [displayItems]);

  const checkedTotalKrw = useMemo(() => {
    return displayItems.reduce((sum, item) => {
      if (!item.checked) return sum;
      return sum + item.options[item.selectedIndex].priceKrw;
    }, 0);
  }, [displayItems]);

  const taxRefund = checkedTotalKrw >= 30000;
  const deltaKrw = budgetKrw - checkedTotalKrw;

  async function copyList() {
    const lines = displayItems
      .filter((item) => item.checked)
      .map((item) => {
        const opt = item.options[item.selectedIndex];
        return `- ${opt.name} (₩${opt.priceKrw.toLocaleString()})`;
      });
    const text = `${c.title}\n${c.budgetKrw}: ₩${budgetKrw.toLocaleString()}\n${c.budgetByCurrency}: ${budgetInDisplayCurrency.toFixed(2)} ${displayCurrency}\n${c.checkedTotal}: ₩${checkedTotalKrw.toLocaleString()}\n\n${lines.join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 lg:col-span-2">
          <p className="text-xs font-semibold text-zinc-600">{c.budget}</p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">{c.budgetPreset}</p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">{c.budgetGuide}</p>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={[50000, 90000, 140000].indexOf(budgetKrwPreset)}
            onChange={(e) => setBudgetKrwPreset(([50000, 90000, 140000][Number(e.target.value) || 0] as BudgetKrwPreset))}
            className="mt-2 w-full"
          />
          <div className="mt-2 flex gap-2">
            {[50000, 90000, 140000].map((krw) => (
              <button
                key={krw}
                type="button"
                onClick={() => setBudgetKrwPreset(krw as BudgetKrwPreset)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${budgetKrwPreset === krw ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700"}`}
              >
                ₩{krw.toLocaleString()}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-500">
            {c.budgetKrw}: ₩{budgetKrw.toLocaleString()}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-[140px_1fr]">
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-xs font-bold text-zinc-900 outline-none focus:border-zinc-900"
              aria-label={c.budgetByCurrency}
            >
              {TOP_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
              <optgroup label="All">
                {ALL_CURRENCIES.filter((code) => !TOP_CURRENCIES.includes(code)).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2">
              <p className="text-[11px] font-semibold text-zinc-500">{c.budgetByCurrency}</p>
              <p className="text-sm font-black text-zinc-900">
                {budgetInDisplayCurrency.toLocaleString(undefined, { maximumFractionDigits: displayCurrency === "JPY" ? 0 : 2 })} {displayCurrency}
              </p>
            </div>
          </div>
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.fastMode}</p>
          <button
            type="button"
            onClick={() => setRushMode((prev) => !prev)}
            className={`mt-2 rounded-full border px-3 py-1 text-xs font-bold ${rushMode ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-zinc-700"}`}
          >
            {rushMode ? c.fastOn : c.fastOff}
          </button>
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

        {purpose === "self" ? (
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
            <p className="mt-1 text-[11px] font-semibold text-zinc-500">{c.skinHelp}</p>
          </label>
        ) : (
          <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">{c.giftStyle}</p>
            <select
              value={giftStyle}
              onChange={(e) => setGiftStyle(e.target.value as GiftStyle)}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
            >
              <option value="practical">{c.practical}</option>
              <option value="cute">{c.cute}</option>
              <option value="trendy">{c.trendy}</option>
            </select>
          </label>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.budgetKrw}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{budgetKrw.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.total}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{plannedTotalKrw.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.checkedTotal}</p>
          <p className="mt-1 text-lg font-black text-zinc-900">₩{checkedTotalKrw.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.tax}</p>
          <p className="mt-1 text-sm font-black text-zinc-900">{taxRefund ? c.taxYes : c.taxNo}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{deltaKrw >= 0 ? c.budgetLeft : c.budgetOver}</p>
          <p className={`mt-1 text-lg font-black ${deltaKrw >= 0 ? "text-emerald-700" : "text-red-700"}`}>₩{Math.abs(deltaKrw).toLocaleString()}</p>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-zinc-600">{c.liveRate}: 1 {displayCurrency} = ₩{displayRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-black text-zinc-900">{c.list}</h3>
          <button
            type="button"
            onClick={copyList}
            className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-800 hover:border-zinc-900"
          >
            {copied ? c.copied : c.copyList}
          </button>
        </div>
        <p className="mt-1 text-xs font-semibold text-zinc-500">{c.listHelp}</p>

        <ul className="mt-2 space-y-2 text-sm text-zinc-800">
          {displayItems.map((item) => {
            const selected = item.options[item.selectedIndex];
            return (
              <li key={item.key} className="rounded-lg border border-zinc-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => setCheckedByKey((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <span className="font-semibold">{selected.name}</span>
                  </label>
                  <span className="font-black">₩{selected.priceKrw.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  {c.examplesLabel}: {exampleProducts(selected.name).join(" / ")}
                </p>

                {item.options.length > 1 ? (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-zinc-500">{c.soldOut}</p>
                    <select
                      value={String(item.selectedIndex)}
                      onChange={(e) => setSelectedOptionByKey((prev) => ({ ...prev, [item.key]: Number(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                      aria-label={c.swap}
                    >
                      {item.options.map((opt, idx) => (
                        <option key={`${item.key}-${opt.name}`} value={idx}>
                          {opt.name} (₩{opt.priceKrw.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="text-sm font-black text-zinc-900">{c.skipTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-zinc-700">
            {c.skipItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="text-sm font-black text-zinc-900">{c.routeTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-zinc-700">
            {c.routeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
