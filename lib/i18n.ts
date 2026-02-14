export const LANGS = ["en", "ko", "zh-cn", "ja", "zh-tw", "zh-hk"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: string): value is Lang => {
  return LANGS.includes(value as Lang);
};

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  "zh-cn": "简体中文",
  ja: "日本語",
  "zh-tw": "繁體中文(台灣)",
  "zh-hk": "繁體中文(香港)",
};

const detectFromToken = (token: string): Lang | null => {
  if (token.startsWith("ko")) return "ko";
  if (token.startsWith("ja")) return "ja";
  if (token.startsWith("zh-hk") || token.startsWith("zh-mo") || token.startsWith("yue")) return "zh-hk";
  if (token.startsWith("zh-tw")) return "zh-tw";
  if (token.startsWith("zh")) return "zh-cn";
  if (token.startsWith("en")) return "en";
  return null;
};

export const detectPreferredLanguage = (acceptLanguage: string | null): Lang => {
  if (!acceptLanguage) {
    return "en";
  }

  const tokens = acceptLanguage
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().split(";")[0]);

  for (const token of tokens) {
    const detected = detectFromToken(token);
    if (detected) return detected;
  }

  return "en";
};

export const copy = {
  en: {
    appName: "Seoul Vibe",
    tagline: "Almost everything about Seoul.",
    nav: {
      areas: "Areas",
      themes: "Themes",
      tips: "Tips",
      spots: "Spots",
      korea101: "Korea 101"
    },
    heroTitle: "A smooth Seoul day, planned in minutes.",
    heroDescription:
      "Pick a vibe, move naturally, and skip the awkward tourist moments.",
    featuredAreas: "Popular Areas",
    featuredThemes: "Travel Themes",
    featuredTips: "Street-Smart Tips",
    featuredSpots: "Curated Spots",
    featuredKorea101: "Korea 101: First-Time Guide",
    discover: "Discover",
    detail: "View details",
    back: "Back",
    notFound: "Content not found.",
    areaDetails: "Area Notes",
    themeDetails: "Theme Guide",
    tipDetails: "Quick Guide",
    footer: "Stay easy. Stay curious."
  },
  ko: {
    appName: "Seoul Vibe",
    tagline: "거의 서울에 관한 모든 것.",
    nav: {
      areas: "지역",
      themes: "테마",
      tips: "팁",
      spots: "감각 스팟",
      korea101: "한국 101"
    },
    heroTitle: "서울 방문객에게 필요한 정보, 여기서 한 번에.",
    heroDescription:
      "공항·교통·결제 같은 실전 정보부터 역사·문화·트렌드까지. 서울에서 알아야 할 핵심을 빠짐없이 담았습니다.",
    featuredAreas: "인기 지역",
    featuredThemes: "여행 테마",
    featuredTips: "실전 팁",
    featuredSpots: "감각 스팟",
    featuredKorea101: "Korea 101: 한국 기본 가이드",
    discover: "둘러보기",
    detail: "자세히 보기",
    back: "뒤로",
    notFound: "콘텐츠를 찾을 수 없습니다.",
    areaDetails: "지역 가이드",
    themeDetails: "테마 가이드",
    tipDetails: "실전 가이드",
    footer: "가볍게, 자연스럽게, 서울답게."
  },
  "zh-cn": {
    appName: "Seoul Vibe",
    tagline: "关于首尔，几乎所有你会好奇的内容。",
    nav: {
      areas: "区域",
      themes: "主题",
      tips: "实用贴士",
      spots: "精选地点",
      korea101: "韩国101"
    },
    heroTitle: "几分钟内规划顺畅的首尔一天。",
    heroDescription: "选好风格，动线自然，避开尴尬游客时刻。",
    featuredAreas: "热门区域",
    featuredThemes: "旅行主题",
    featuredTips: "街头实用贴士",
    featuredSpots: "真实地点",
    featuredKorea101: "韩国101：新手指南",
    discover: "探索",
    detail: "查看详情",
    back: "返回",
    notFound: "未找到内容。",
    areaDetails: "区域笔记",
    themeDetails: "主题指南",
    tipDetails: "快速指南",
    footer: "轻松出发，保持好奇。"
  },
  ja: {
    appName: "Seoul Vibe",
    tagline: "ソウルのことを、ほぼまるごと。",
    nav: {
      areas: "エリア",
      themes: "テーマ",
      tips: "コツ",
      spots: "スポット",
      korea101: "韓国101"
    },
    heroTitle: "数分で、なめらかなソウル1日プラン。",
    heroDescription: "好みを選ぶだけで、移動も流れも自然に。",
    featuredAreas: "人気エリア",
    featuredThemes: "旅のテーマ",
    featuredTips: "実用ガイド",
    featuredSpots: "リアルスポット",
    featuredKorea101: "韓国101：はじめてガイド",
    discover: "見る",
    detail: "詳細を見る",
    back: "戻る",
    notFound: "コンテンツが見つかりません。",
    areaDetails: "エリアメモ",
    themeDetails: "テーマガイド",
    tipDetails: "クイックガイド",
    footer: "気軽に、好奇心のままに。"
  },
  "zh-tw": {
    appName: "Seoul Vibe",
    tagline: "關於首爾，幾乎所有你會好奇的內容。",
    nav: {
      areas: "區域",
      themes: "主題",
      tips: "實用技巧",
      spots: "精選景點",
      korea101: "韓國101"
    },
    heroTitle: "幾分鐘內，排好順暢的首爾一天。",
    heroDescription: "選好風格，移動自然，避開尷尬旅遊時刻。",
    featuredAreas: "熱門區域",
    featuredThemes: "旅行主題",
    featuredTips: "街頭實用技巧",
    featuredSpots: "真實景點",
    featuredKorea101: "韓國101：新手指南",
    discover: "探索",
    detail: "查看詳情",
    back: "返回",
    notFound: "找不到內容。",
    areaDetails: "區域筆記",
    themeDetails: "主題指南",
    tipDetails: "快速指南",
    footer: "輕鬆出發，保持好奇。"
  },
  "zh-hk": {
    appName: "Seoul Vibe",
    tagline: "關於首爾，幾乎所有你會好奇嘅內容。",
    nav: {
      areas: "地區",
      themes: "主題",
      tips: "實用貼士",
      spots: "精選景點",
      korea101: "韓國101"
    },
    heroTitle: "幾分鐘就規劃好順暢首爾一日。",
    heroDescription: "揀好風格，動線自然，避開尷尬遊客時刻。",
    featuredAreas: "人氣地區",
    featuredThemes: "旅行主題",
    featuredTips: "街頭實用貼士",
    featuredSpots: "真實景點",
    featuredKorea101: "韓國101：新手指南",
    discover: "探索",
    detail: "查看詳情",
    back: "返回",
    notFound: "搵唔到內容。",
    areaDetails: "地區筆記",
    themeDetails: "主題指南",
    tipDetails: "快速指南",
    footer: "輕鬆出發，保持好奇。"
  }
} as const;

export const getCopy = (lang: Lang) => copy[lang];
