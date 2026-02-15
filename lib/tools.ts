import type { Lang } from "@/lib/i18n";

export const TOOL_IDS = ["real-cost", "tmoney-load", "olive-budget", "quick-picks"] as const;
export type ToolId = (typeof TOOL_IDS)[number];

type ToolCopy = {
  title: string;
  desc: string;
};

const TOOL_COPY: Record<Lang, Record<ToolId, ToolCopy>> = {
  en: {
    "real-cost": { title: "Real Cost Calculator", desc: "Price impact vs today's budget." },
    "tmoney-load": { title: "How much should I load?", desc: "Estimate your T-money top-up fast." },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "Build a practical basket by budget." },
    "quick-picks": { title: "Quick Picks", desc: "2-3 low-regret options in under 10 seconds." },
  },
  ko: {
    "real-cost": { title: "체감 환율 계산기", desc: "가격이 오늘 예산에 얼마나 큰지 확인." },
    "tmoney-load": { title: "How much should I load?", desc: "T-money 권장 충전액 즉시 계산." },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "예산 기준으로 바로 구매 리스트 생성." },
    "quick-picks": { title: "Quick Picks", desc: "10초 안에 후회 적은 선택 2-3개 추천." },
  },
  ja: {
    "real-cost": { title: "体感レート計算", desc: "この支出が今日予算に与える重さを確認。" },
    "tmoney-load": { title: "How much should I load?", desc: "T-money推奨チャージ額を即計算。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "予算に合わせて買う物を即作成。" },
    "quick-picks": { title: "Quick Picks", desc: "10秒で後悔の少ない候補を2-3個。" },
  },
  "zh-cn": {
    "real-cost": { title: "体感汇率计算器", desc: "先看这笔消费占今天预算多少。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速算出T-money建议充值额。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "按预算生成实用购物清单。" },
    "quick-picks": { title: "Quick Picks", desc: "10 秒内给你 2-3 个低后悔选项。" },
  },
  "zh-tw": {
    "real-cost": { title: "體感匯率計算器", desc: "先看這筆花費佔今天預算多少。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速計算T-money建議儲值額。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "依預算建立實用購買清單。" },
    "quick-picks": { title: "Quick Picks", desc: "10 秒內給你 2-3 個低後悔選項。" },
  },
  "zh-hk": {
    "real-cost": { title: "體感匯率計算器", desc: "先看呢筆花費佔今日預算幾多。" },
    "tmoney-load": { title: "How much should I load?", desc: "快速計算T-money建議增值額。" },
    "olive-budget": { title: "Olive Young Budget Builder", desc: "按預算建立實用購買清單。" },
    "quick-picks": { title: "Quick Picks", desc: "10 秒內畀你 2-3 個低後悔選項。" },
  },
};

export function getToolCopy(lang: Lang, id: ToolId): ToolCopy {
  return TOOL_COPY[lang][id];
}
