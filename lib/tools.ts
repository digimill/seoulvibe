import type { Lang } from "@/lib/i18n";

export const TOOL_IDS = ["real-cost", "tmoney-load", "olive-budget"] as const;
export type ToolId = (typeof TOOL_IDS)[number];

type ToolCopy = {
  title: string;
  desc: string;
};

const TOOL_COPY: Record<Lang, Record<ToolId, ToolCopy>> = {
  en: {
    "real-cost": { title: "Exchange Calculator", desc: "Convert KRW and your currency both ways." },
    "tmoney-load": { title: "How much should I load?", desc: "Estimate your T-money top-up fast." },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "Build a practical basket by budget." },
  },
  ko: {
    "real-cost": { title: "환율 계산기", desc: "원화와 내 통화를 양방향으로 바로 계산." },
    "tmoney-load": { title: "How much should I load?", desc: "T-money 권장 충전액 즉시 계산." },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "예산 기준으로 바로 구매 리스트 생성." },
  },
  ja: {
    "real-cost": { title: "為替計算機", desc: "KRWと自分の通貨を双方向で即計算。" },
    "tmoney-load": { title: "How much should I load?", desc: "T-money推奨チャージ額を即計算。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "予算に合わせて買う物を即作成。" },
  },
  "zh-cn": {
    "real-cost": { title: "汇率计算器", desc: "韩元与本币双向快速换算。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速算出T-money建议充值额。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "按预算生成实用购物清单。" },
  },
  "zh-tw": {
    "real-cost": { title: "匯率計算器", desc: "韓元與本幣雙向快速換算。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速計算T-money建議儲值額。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "依預算建立實用購買清單。" },
  },
  "zh-hk": {
    "real-cost": { title: "匯率計算器", desc: "韓元同本幣雙向快速換算。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速計算T-money建議增值額。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "按預算建立實用購買清單。" },
  },
};

export function getToolCopy(lang: Lang, id: ToolId): ToolCopy {
  return TOOL_COPY[lang][id];
}
