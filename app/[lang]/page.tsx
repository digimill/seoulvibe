import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

type EmergencyCard = {
  title: string;
  href: string;
  note: string;
};

type HomeCopy = {
  badge: string;
  title: string;
  subtitleA: string;
  subtitleB: string;
  skipLine: string;
  stayLabel: string;
  deepGuides: string;
  deep1: string;
  deep2: string;
  deep3: string;
  cards: [string, string, string, string];
  cardNotes: [string, string, string, string];
  areas: [string, string, string, string];
};

function getHomeCopy(lang: Lang): HomeCopy {
  if (lang === "ko") {
    return {
      badge: "서울 방문 필수",
      title: "도움이 필요하다면?",
      subtitleA: "필요한 것만 빠르게,",
      subtitleB: "바로 확인하세요.",
      skipLine: "검색 전에 여기부터.",
      stayLabel: "숙소가 여기라면:",
      deepGuides: "심화 가이드",
      deep1: "키오스크 결제 실패 심화",
      deep2: "티머니 충전 계산기",
      deep3: "올리브영 예산 빌더",
      cards: [
        "키오스크 체험 시작",
        "지금 맞는 지하철 노선 찾기",
        "올리브영 30분 쇼핑 리스트",
        "사람 많은 구역 빠져나오기",
      ],
      cardNotes: [
        "1분/3분 모드로 커피·식당 주문 미리 연습",
        "숙소 기준 노선부터 먼저 확인",
        "기본 세트 먼저 담고 끝내기",
        "빨리 빠져나와 동선 재설정",
      ],
      areas: ["홍대", "성수", "북촌", "강남"],
    };
  }
  if (lang === "ja") {
    return {
      badge: "ソウル旅行必須",
      title: "ソウルで詰まった？",
      subtitleA: "必要な情報だけ、",
      subtitleB: "すぐ確認。",
      skipLine: "検索前にここから。",
      stayLabel: "滞在先がここなら:",
      deepGuides: "詳細ガイド",
      deep1: "キオスク決済エラー詳細",
      deep2: "T-moneyチャージ計算",
      deep3: "オリーブヤング予算ビルダー",
      cards: [
        "キオスク練習を始める",
        "地下鉄の正しい路線を今すぐ確認",
        "オリーブヤング30分買い物リスト",
        "混雑エリアから素早く離脱",
      ],
      cardNotes: [
        "1分/3分モードでコーヒー・食事注文を練習",
        "宿基準で路線を先に決める",
        "基本セットを先に確保",
        "すぐ離脱して動線を再設定",
      ],
      areas: ["弘大", "聖水", "北村", "江南"],
    };
  }
  if (lang === "zh-cn") {
    return {
      badge: "首尔旅行必备",
      title: "在首尔卡住了？",
      subtitleA: "只看需要的，",
      subtitleB: "马上处理。",
      skipLine: "搜索前先看这里。",
      stayLabel: "如果你住在：",
      deepGuides: "进阶指南",
      deep1: "自助机刷卡失败进阶",
      deep2: "T-money 充值计算器",
      deep3: "Olive Young 预算工具",
      cards: [
        "开始自助机练习",
        "立刻选对地铁线路",
        "Olive Young 30 分钟购物清单",
        "快速离开拥挤区域",
      ],
      cardNotes: [
        "1分钟/3分钟模式预练咖啡和餐饮流程",
        "先按住宿位置选线",
        "先拿基础组合再停手",
        "先脱离拥挤再重排路线",
      ],
      areas: ["弘大", "圣水", "北村", "江南"],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      badge: "首爾旅行必備",
      title: "在首爾卡住了？",
      subtitleA: "只看需要的，",
      subtitleB: "馬上處理。",
      skipLine: "搜尋前先看這裡。",
      stayLabel: "如果你住在：",
      deepGuides: "進階指南",
      deep1: "自助機刷卡失敗進階",
      deep2: "T-money 儲值計算器",
      deep3: "Olive Young 預算工具",
      cards: [
        "開始自助機練習",
        "馬上選對地鐵路線",
        "Olive Young 30 分鐘購物清單",
        "快速離開人潮區域",
      ],
      cardNotes: [
        "1分鐘/3分鐘模式預練咖啡與餐飲流程",
        "先按住宿位置選線",
        "先拿基本組合再停手",
        "先離開人潮再重排行程",
      ],
      areas: ["弘大", "聖水", "北村", "江南"],
    };
  }
  return {
    badge: "Seoul Visit Essentials",
    title: "Stuck in Seoul?",
    subtitleA: "Only what you need,",
    subtitleB: "check it fast.",
    skipLine: "Skip Google. Start here.",
    stayLabel: "If you're staying in:",
    deepGuides: "Deep guides",
    deep1: "Kiosk payment failure deep guide",
    deep2: "T-money load calculator",
    deep3: "Olive Young budget builder",
    cards: [
      "Start kiosk practice",
      "Pick the right subway line now",
      "Get a fast Olive Young list",
      "Escape a crowded area",
    ],
    cardNotes: [
      "1-minute or 3-minute simulation for coffee and food orders",
      "Start with your base line.",
      "Get the basic set first.",
      "Exit fast. Reset route.",
    ],
    areas: ["Hongdae", "Seongsu", "Bukchon", "Gangnam"],
  };
}

function getEmergencyCards(lang: Lang): EmergencyCard[] {
  const copy = getHomeCopy(lang);
  return [
    {
      title: copy.cards[0],
      href: `/${lang}/tools/kiosk-practice`,
      note: copy.cardNotes[0],
    },
    {
      title: copy.cards[1],
      href: `/${lang}/tips/subway-map-confusion-cuts`,
      note: copy.cardNotes[1],
    },
    {
      title: copy.cards[2],
      href: `/${lang}/tips/oliveyoung-master-playbook`,
      note: copy.cardNotes[2],
    },
    {
      title: copy.cards[3],
      href: `/${lang}/crowded`,
      note: copy.cardNotes[3],
    },
  ];
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const copy = getHomeCopy(locale);
  const emergencyCards = getEmergencyCards(locale);

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-3xl border border-red-900/20 bg-red-50 p-6 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">{copy.badge}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-6xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-zinc-800 sm:text-xl">
          {copy.subtitleA}
          <br />
          {copy.subtitleB}
        </p>
        <p className="mt-3 text-sm font-semibold text-zinc-700">{copy.skipLine}</p>
      </section>

      <section className="mt-8 sm:mt-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {emergencyCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_10px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5 hover:bg-zinc-50"
            >
              <p className="text-xl font-extrabold tracking-tight text-zinc-950">{card.title}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-700">{card.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 sm:mt-12 sm:p-8">
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.stayLabel}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${locale}/areas/hongdae`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            {copy.areas[0]}
          </Link>
          <Link href={`/${locale}/areas/seongsu`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            {copy.areas[1]}
          </Link>
          <Link href={`/${locale}/areas/bukchon`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            {copy.areas[2]}
          </Link>
          <Link href={`/${locale}/areas/gangnam`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            {copy.areas[3]}
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 sm:mt-12 sm:p-8">
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.deepGuides}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href={`/${locale}/kiosk-card-rejected`} className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
            {copy.deep1}
          </Link>
          <Link href={`/${locale}/tools/tmoney-load`} className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
            {copy.deep2}
          </Link>
          <Link href={`/${locale}/tools/olive-budget`} className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
            {copy.deep3}
          </Link>
        </div>
      </section>
    </Container>
  );
}
