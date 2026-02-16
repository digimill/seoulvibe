import type { Lang } from "@/lib/i18n";

export const TRAVEL_AREA_IDS = ["hongdae", "myeongdong", "gangnam", "seongsu", "itaewon", "jamsil"] as const;

export type TravelAreaId = (typeof TRAVEL_AREA_IDS)[number];

type Localized = {
  en: string;
  ko?: string;
  ja?: string;
  "zh-cn"?: string;
  "zh-tw"?: string;
  "zh-hk"?: string;
};

type TravelAreaDraft = {
  id: TravelAreaId;
  name: Localized;
  summary: Localized;
  image: { src: string; alt: string };
  oneLineConclusion: Localized;
  stayHereIf: Localized[];
  avoidIf: Localized[];
  nightNoiseLevel: Localized;
  airportAccessReality: Localized;
  alternatives: Array<{ id: TravelAreaId; reason: Localized }>;
  connections: Array<{ to: TravelAreaId; why: Localized; move: Localized }>;
};

export type TravelAreaProfile = {
  id: TravelAreaId;
  name: string;
  summary: string;
  image: { src: string; alt: string };
  oneLineConclusion: string;
  stayHereIf: string[];
  avoidIf: string[];
  nightNoiseLevel: string;
  airportAccessReality: string;
  alternatives: Array<{ id: TravelAreaId; reason: string }>;
  connections: Array<{ to: TravelAreaId; why: string; move: string }>;
};

const AREA_DRAFTS: Record<TravelAreaId, TravelAreaDraft> = {
  hongdae: {
    id: "hongdae",
    name: { en: "Hongdae", ko: "홍대", ja: "ホンデ", "zh-cn": "弘大", "zh-tw": "弘大", "zh-hk": "弘大" },
    summary: {
      en: "Best for nightlife, late food, and social energy.",
      ko: "밤 문화, 늦은 식사, 활기 있는 분위기에 적합합니다.",
      ja: "夜の活気・深夜ごはん・社交的な雰囲気に強いエリアです。",
      "zh-cn": "适合夜生活、深夜餐饮和高活力社交氛围。",
      "zh-tw": "適合夜生活、深夜餐飲與高活力社交氛圍。",
      "zh-hk": "適合夜生活、宵夜同高活力社交氛圍。",
    },
    image: { src: "/images/areas/hongdae.jpg", alt: "Hongdae street at night" },
    oneLineConclusion: {
      en: "Choose Hongdae if you want maximum energy and don't mind noise.",
      ko: "활기와 야간 동선이 중요하고 소음을 감수할 수 있다면 홍대가 맞습니다.",
    },
    stayHereIf: [
      { en: "You prioritize nightlife and late-night food.", ko: "밤 활동과 심야 식사를 우선합니다." },
      { en: "You want easy airport rail access.", ko: "공항철도 접근성을 중요하게 봅니다." },
      { en: "Your group enjoys social and casual vibes.", ko: "일행이 캐주얼하고 소셜한 분위기를 선호합니다." },
    ],
    avoidIf: [
      { en: "You are a very light sleeper.", ko: "잠이 예민한 편입니다." },
      { en: "You dislike weekend crowd density.", ko: "주말 인파 밀도를 싫어합니다." },
      { en: "You want quiet luxury over convenience.", ko: "편의보다 정숙한 고급 분위기를 원합니다." },
    ],
    nightNoiseLevel: {
      en: "High. Main zones stay loud until late.",
      ko: "높음. 메인 구역은 늦은 시간까지 소음이 큽니다.",
    },
    airportAccessReality: {
      en: "Strong. Airport Railroad access is straightforward for most arrivals.",
      ko: "좋음. 공항철도 기반 이동이 비교적 단순합니다.",
    },
    alternatives: [
      { id: "seongsu", reason: { en: "Still trendy but calmer at night.", ko: "트렌디하지만 밤에는 더 차분합니다." } },
      { id: "jamsil", reason: { en: "Cleaner and quieter base with good transit.", ko: "더 조용하고 정돈된 베이스입니다." } },
    ],
    connections: [
      { to: "seongsu", why: { en: "Move here for calmer daytime cafe/design flow.", ko: "낮 시간 카페/디자인 탐색은 성수로 이동하세요." }, move: { en: "About 25-35 min by subway.", ko: "지하철 약 25-35분." } },
      { to: "myeongdong", why: { en: "Switch for central shopping and hotel access.", ko: "중심 쇼핑/숙소 접근이 필요하면 명동으로 전환." }, move: { en: "About 20-30 min by subway.", ko: "지하철 약 20-30분." } },
    ],
  },
  myeongdong: {
    id: "myeongdong",
    name: { en: "Myeongdong", ko: "명동", ja: "明洞", "zh-cn": "明洞", "zh-tw": "明洞", "zh-hk": "明洞" },
    summary: {
      en: "Central for shopping and first-time tourist convenience.",
      ko: "쇼핑 중심이며 첫 방문자에게 이동/편의가 쉽습니다.",
      ja: "買い物中心で、初訪問でも動線が分かりやすいエリアです。",
      "zh-cn": "购物中心区，首访游客也容易上手。",
      "zh-tw": "購物中心區，首訪旅客也容易上手。",
      "zh-hk": "購物中心區，第一次去都好易上手。",
    },
    image: { src: "/images/areas/myeongdong.jpg", alt: "Myeongdong street at night" },
    oneLineConclusion: {
      en: "Choose Myeongdong for convenience and central positioning over local vibe.",
      ko: "로컬 감성보다 중심 접근성과 편의를 우선하면 명동이 유리합니다.",
      ja: "ローカル感より、中心アクセスと利便性を重視するなら明洞が有利です。",
    },
    stayHereIf: [
      { en: "You want shopping and hotel options in one area.", ko: "쇼핑과 숙소 옵션을 한 구역에서 해결하고 싶습니다.", ja: "買い物とホテル選択を1エリアで完結させたい。" },
      { en: "You prefer short, simple first-time routes.", ko: "첫 여행에서 단순한 동선을 선호합니다.", ja: "初訪問でも短くて分かりやすい動線を優先したい。" },
      { en: "You value direct airport bus options.", ko: "공항 리무진 버스 접근성을 중요하게 봅니다.", ja: "空港リムジンバスの乗りやすさを重視する。" },
    ],
    avoidIf: [
      { en: "You want local neighborhood character.", ko: "로컬 동네 감성이 최우선입니다.", ja: "ローカルな街感を最優先したい。" },
      { en: "You dislike high tourist density.", ko: "관광객 밀집 환경을 싫어합니다.", ja: "観光客の密度が高い環境を避けたい。" },
      { en: "You prefer quiet late evenings.", ko: "밤에 조용한 분위기를 원합니다.", ja: "夜は静かな環境で過ごしたい。" },
    ],
    nightNoiseLevel: {
      en: "Medium to high around main shopping corridors.",
      ko: "중~높음. 메인 쇼핑 동선 중심으로 붐빕니다.",
      ja: "中〜高。主要ショッピング通り周辺は夜までにぎわいます。",
    },
    airportAccessReality: {
      en: "Strong for airport buses; rail is workable but often transfer-heavy depending on hotel block.",
      ko: "공항버스는 강점이며, 철도는 숙소 위치에 따라 환승이 늘 수 있습니다.",
      ja: "空港バスは強み。鉄道も可能ですが、ホテル位置によって乗換が増えやすいです。",
    },
    alternatives: [
      { id: "jamsil", reason: { en: "Modern facilities with less tourist compression.", ko: "관광객 압축도가 상대적으로 낮습니다.", ja: "施設が新しく、観光密度が相対的に低めです。" } },
      { id: "gangnam", reason: { en: "Business-friendly base with broader dining spread.", ko: "비즈니스/식사 동선이 넓게 분산됩니다.", ja: "ビジネス向けで、食事選択肢が広く分散しています。" } },
    ],
    connections: [
      { to: "hongdae", why: { en: "Add late-night energy after central daytime routes.", ko: "중심 관광 후 야간 에너지는 홍대로 이동." }, move: { en: "About 20-30 min by subway.", ko: "지하철 약 20-30분." } },
      { to: "itaewon", why: { en: "Switch for global dining and mixed night options.", ko: "다국적 식사/바 옵션은 이태원이 유리합니다." }, move: { en: "About 15-25 min by bus or subway.", ko: "버스/지하철 약 15-25분." } },
    ],
  },
  gangnam: {
    id: "gangnam",
    name: { en: "Gangnam", ko: "강남", ja: "江南", "zh-cn": "江南", "zh-tw": "江南", "zh-hk": "江南" },
    summary: {
      en: "Efficient for modern Seoul, business trips, and polished stays.",
      ko: "현대적 서울 동선, 비즈니스, 깔끔한 숙박에 적합합니다.",
      ja: "モダンな都市動線・出張・安定した宿泊品質に向きます。",
      "zh-cn": "适合现代首尔动线、商务行程和稳定住宿品质。",
      "zh-tw": "適合現代首爾動線、商務行程與穩定住宿品質。",
      "zh-hk": "適合現代首爾動線、商務行程同穩定住宿品質。",
    },
    image: { src: "/images/areas/gangnam.jpg", alt: "Street in Gangnam, Seoul" },
    oneLineConclusion: {
      en: "Choose Gangnam for polished infrastructure and predictable comfort.",
      ko: "정돈된 인프라와 예측 가능한 편의가 중요하면 강남이 맞습니다.",
    },
    stayHereIf: [
      { en: "You need strong hotel quality consistency.", ko: "숙소 품질의 안정성이 중요합니다." },
      { en: "You have work meetings or business plans.", ko: "업무 일정/미팅 중심 일정이 있습니다." },
      { en: "You want high-end dining and shopping nearby.", ko: "고급 식음/쇼핑 접근성을 원합니다." },
    ],
    avoidIf: [
      { en: "You want cheaper food and nightlife density.", ko: "저렴한 식사/밤문화 밀도를 원합니다." },
      { en: "You are optimizing purely for airport simplicity.", ko: "공항 이동 단순성만 최우선입니다." },
      { en: "You prefer indie and artsy street texture.", ko: "인디/로컬 감성 위주를 선호합니다." },
    ],
    nightNoiseLevel: {
      en: "Medium. Busy on main roads, quieter in residential-adjacent blocks.",
      ko: "중간. 대로변은 바쁘고 주거 인접 블록은 비교적 조용합니다.",
    },
    airportAccessReality: {
      en: "Moderate. Good buses and rail options, but travel time can stretch in peak traffic.",
      ko: "보통. 버스/철도 선택지는 좋지만 피크 시간에는 소요가 늘어납니다.",
    },
    alternatives: [
      { id: "jamsil", reason: { en: "Similar comfort profile with calmer evenings.", ko: "유사한 편의성에 저녁 밀도는 더 완만합니다." } },
      { id: "seongsu", reason: { en: "Modern vibe with a more creative local layer.", ko: "현대적이면서 창의적 로컬 분위기가 있습니다." } },
    ],
    connections: [
      { to: "jamsil", why: { en: "Move for family-friendly parks and calmer evenings.", ko: "가족 동선/저녁 안정감은 잠실로 연결." }, move: { en: "About 15-25 min by subway.", ko: "지하철 약 15-25분." } },
      { to: "itaewon", why: { en: "Switch for international food and bar mix.", ko: "다국적 식사와 바 믹스는 이태원으로 전환." }, move: { en: "About 20-35 min by taxi/subway.", ko: "택시/지하철 약 20-35분." } },
    ],
  },
  seongsu: {
    id: "seongsu",
    name: { en: "Seongsu", ko: "성수", ja: "聖水", "zh-cn": "圣水", "zh-tw": "聖水", "zh-hk": "聖水" },
    summary: {
      en: "Great for design cafés, curated shopping, and daytime exploration.",
      ko: "디자인 카페, 큐레이션 쇼핑, 낮 중심 탐색에 좋습니다.",
      ja: "デザイン系カフェとセレクトショップ、昼の散策に最適です。",
      "zh-cn": "适合设计咖啡馆、精选购物和白天探索。",
      "zh-tw": "適合設計咖啡館、精選購物與白天探索。",
      "zh-hk": "適合設計Cafe、精選購物同日間探索。",
    },
    image: { src: "/images/areas/seongsu.jpg", alt: "Seongsu cafes and industrial streets" },
    oneLineConclusion: {
      en: "Choose Seongsu for trend discovery with less nightlife chaos than Hongdae.",
      ko: "홍대보다 덜 혼잡한 밤 환경에서 트렌드 탐색을 원하면 성수가 맞습니다.",
    },
    stayHereIf: [
      { en: "You care about café and design scenes.", ko: "카페/디자인 씬이 중요합니다." },
      { en: "You like curated brands and concept stores.", ko: "큐레이션 브랜드/편집 매장을 선호합니다." },
      { en: "You prefer daytime activity over late nightlife.", ko: "심야보다 낮 활동 비중이 높습니다." },
    ],
    avoidIf: [
      { en: "You need fast airport transfer with no complexity.", ko: "공항 이동을 가장 단순하게 원합니다." },
      { en: "You want all attractions walkable at night.", ko: "밤에도 도보 중심 완결 동선을 원합니다." },
      { en: "You hate waiting lines for viral spots.", ko: "바이럴 스팟 대기를 싫어합니다." },
    ],
    nightNoiseLevel: {
      en: "Medium. Core blocks can still get loud, but quieter than Hongdae party zones.",
      ko: "중간. 핵심 블록은 붐비지만 홍대 파티권역보다 완만합니다.",
    },
    airportAccessReality: {
      en: "Moderate to weak depending on exact hotel; often requires transfer planning.",
      ko: "보통~약함. 숙소 위치에 따라 환승 설계가 필요합니다.",
    },
    alternatives: [
      { id: "hongdae", reason: { en: "If you want stronger late-night energy.", ko: "더 강한 야간 에너지가 필요하면 홍대." } },
      { id: "jamsil", reason: { en: "If you want calmer nights and family ease.", ko: "더 차분한 밤과 가족 동선을 원하면 잠실." } },
    ],
    connections: [
      { to: "gangnam", why: { en: "Move for polished dining/shopping in the evening.", ko: "저녁 고급 식음/쇼핑 동선은 강남이 좋습니다." }, move: { en: "About 20-30 min by subway.", ko: "지하철 약 20-30분." } },
      { to: "hongdae", why: { en: "Switch for stronger nightlife density.", ko: "더 강한 나이트라이프 밀도는 홍대로 전환." }, move: { en: "About 25-35 min by subway.", ko: "지하철 약 25-35분." } },
    ],
  },
  itaewon: {
    id: "itaewon",
    name: { en: "Itaewon", ko: "이태원", ja: "梨泰院", "zh-cn": "梨泰院", "zh-tw": "梨泰院", "zh-hk": "梨泰院" },
    summary: {
      en: "Flexible for international dining and mixed night options.",
      ko: "다국적 식음/바 선택지가 넓고 밤 동선이 유연합니다.",
      ja: "多国籍グルメが豊富で、夜の選択肢が幅広いエリアです。",
      "zh-cn": "国际餐饮选择丰富，夜间玩法弹性高。",
      "zh-tw": "國際餐飲選擇豐富，夜間玩法彈性高。",
      "zh-hk": "國際餐飲選擇多，夜晚玩法彈性高。",
    },
    image: { src: "/images/areas/itaewon-v2.jpg", alt: "Itaewon street scene in Seoul" },
    oneLineConclusion: {
      en: "Choose Itaewon for international food range and mixed nightlife access.",
      ko: "다국적 식사 선택지와 혼합형 나이트라이프를 원하면 이태원이 적합합니다.",
    },
    stayHereIf: [
      { en: "You want global food options every night.", ko: "매일 다양한 글로벌 음식 옵션을 원합니다." },
      { en: "Your group has mixed preferences.", ko: "일행 취향이 섞여 있습니다." },
      { en: "You plan evening bar or rooftop schedules.", ko: "저녁 바/루프탑 동선이 많습니다." },
    ],
    avoidIf: [
      { en: "You want very easy subway transfers at all times.", ko: "항상 쉬운 지하철 환승이 최우선입니다." },
      { en: "You are sensitive to weekend late-night noise.", ko: "주말 심야 소음에 민감합니다." },
      { en: "You prefer tightly structured family itinerary zones.", ko: "가족 중심의 안정적인 동선이 필요합니다." },
    ],
    nightNoiseLevel: {
      en: "Medium to high on weekends and bar-heavy streets.",
      ko: "중~높음. 주말/바 밀집 거리 중심으로 소음이 큽니다.",
    },
    airportAccessReality: {
      en: "Moderate. Often one transfer needed depending on arrival mode and luggage.",
      ko: "보통. 도착 수단/짐에 따라 환승 1회가 필요한 경우가 많습니다.",
    },
    alternatives: [
      { id: "hongdae", reason: { en: "For easier rail and younger crowd energy.", ko: "철도 접근성과 젊은 에너지가 더 필요하면 홍대." } },
      { id: "myeongdong", reason: { en: "For simpler first-time traveler logistics.", ko: "첫 여행 동선 단순성이 더 필요하면 명동." } },
    ],
    connections: [
      { to: "myeongdong", why: { en: "Move for central logistics and next-day departure ease.", ko: "중심 동선/다음날 이동 편의는 명동이 유리." }, move: { en: "About 15-25 min by subway/bus.", ko: "지하철/버스 약 15-25분." } },
      { to: "gangnam", why: { en: "Switch for cleaner daytime business-style routes.", ko: "낮 시간 정돈된 동선은 강남으로 전환." }, move: { en: "About 20-30 min by bus/subway.", ko: "버스/지하철 약 20-30분." } },
    ],
  },
  jamsil: {
    id: "jamsil",
    name: { en: "Jamsil", ko: "잠실", ja: "蚕室", "zh-cn": "蚕室", "zh-tw": "蠶室", "zh-hk": "蠶室" },
    summary: {
      en: "Balanced for families, cleaner streets, and quieter evenings.",
      ko: "가족 동선, 깔끔한 환경, 비교적 조용한 저녁에 유리합니다.",
      ja: "家族旅行向けで、街並みが整っており夜は比較的静かです。",
      "zh-cn": "适合家庭行程，环境整洁，夜间相对安静。",
      "zh-tw": "適合家庭行程，環境整潔，夜間相對安靜。",
      "zh-hk": "適合家庭行程，環境整潔，夜晚相對寧靜。",
    },
    image: { src: "/images/areas/jamsil-v2.jpg", alt: "Jamsil skyline with Lotte World Tower" },
    oneLineConclusion: {
      en: "Choose Jamsil for calmer nights and stable family-friendly logistics.",
      ko: "조용한 밤과 가족 친화 동선이 중요하면 잠실이 적합합니다.",
    },
    stayHereIf: [
      { en: "You want cleaner and calmer surroundings.", ko: "더 정돈되고 차분한 주변 환경을 원합니다." },
      { en: "You have family or multi-generation travelers.", ko: "가족/다세대 동행 여행입니다." },
      { en: "You value malls, parks, and easy daytime pacing.", ko: "몰/공원/낮 중심 완만한 일정이 중요합니다." },
    ],
    avoidIf: [
      { en: "You want dense nightlife every night.", ko: "매일 고밀도 나이트라이프를 원합니다." },
      { en: "You need highly central positioning for all sights.", ko: "모든 명소에 대한 초중심 입지를 원합니다." },
      { en: "You want indie local scene over convenience.", ko: "편의보다 인디 로컬 감성을 우선합니다." },
    ],
    nightNoiseLevel: {
      en: "Low to medium. Usually calmer than major nightlife zones.",
      ko: "낮음~중간. 주요 나이트라이프 권역보다 대체로 조용합니다.",
    },
    airportAccessReality: {
      en: "Moderate. Commute is predictable but can be long from Incheon.",
      ko: "보통. 동선은 예측 가능하지만 인천 기준 체감 거리가 길 수 있습니다.",
    },
    alternatives: [
      { id: "gangnam", reason: { en: "For stronger business and upscale options.", ko: "업무/업스케일 옵션을 강화하려면 강남." } },
      { id: "seongsu", reason: { en: "For trend-forward cafés and design stores.", ko: "트렌드 카페/디자인 스토어 중심이면 성수." } },
    ],
    connections: [
      { to: "seongsu", why: { en: "Move for daytime trend exploration and cafes.", ko: "낮 시간 트렌드 탐색/카페 동선은 성수로 이동." }, move: { en: "About 15-25 min by subway.", ko: "지하철 약 15-25분." } },
      { to: "myeongdong", why: { en: "Switch for central shopping before departure day.", ko: "출국 전 중심 쇼핑은 명동으로 전환." }, move: { en: "About 25-35 min by subway.", ko: "지하철 약 25-35분." } },
    ],
  },
};

function text(value: Localized, lang: Lang): string {
  return value[lang] ?? value.en;
}

export function getTravelAreas(lang: Lang): TravelAreaProfile[] {
  return TRAVEL_AREA_IDS.map((id) => {
    const area = AREA_DRAFTS[id];
    return {
      id: area.id,
      name: text(area.name, lang),
      summary: text(area.summary, lang),
      image: area.image,
      oneLineConclusion: text(area.oneLineConclusion, lang),
      stayHereIf: area.stayHereIf.map((item) => text(item, lang)),
      avoidIf: area.avoidIf.map((item) => text(item, lang)),
      nightNoiseLevel: text(area.nightNoiseLevel, lang),
      airportAccessReality: text(area.airportAccessReality, lang),
      alternatives: area.alternatives.map((item) => ({
        id: item.id,
        reason: text(item.reason, lang),
      })),
      connections: area.connections.map((item) => ({
        to: item.to,
        why: text(item.why, lang),
        move: text(item.move, lang),
      })),
    };
  });
}

export function getTravelArea(lang: Lang, id: string): TravelAreaProfile | null {
  if (!TRAVEL_AREA_IDS.includes(id as TravelAreaId)) return null;
  return getTravelAreas(lang).find((area) => area.id === id) ?? null;
}

export function getTravelAreaName(lang: Lang, id: TravelAreaId): string {
  const area = getTravelArea(lang, id);
  if (!area) return id;
  return area.name;
}
