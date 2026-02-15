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
      badge: "서울 생존 가이드",
      title: "서울에서 일정 꼬였나요?",
      subtitleA: "뭐가 꼬였나요?",
      subtitleB: "60초 안에 정리해요.",
      skipLine: "검색 말고 여기부터.",
      stayLabel: "숙소가 여기라면:",
      deepGuides: "심화 가이드",
      deep1: "키오스크 카드 오류 상세",
      deep2: "티머니 충전 가이드",
      deep3: "올리브영 상세 가이드",
      cards: [
        "키오스크 카드 오류 바로 해결",
        "지금 맞는 지하철 노선 찾기",
        "올리브영 30분 쇼핑 리스트",
        "사람 많은 구역 빠져나오기",
      ],
      cardNotes: [
        "탭 결제 -> 카드 변경 -> 카운터 이동",
        "숙소 기준 노선부터 먼저 확인",
        "기본 세트 먼저 담고 끝내기",
        "빨리 빠져나와 동선 재설정",
      ],
      areas: ["홍대", "성수", "북촌", "강남"],
    };
  }
  if (lang === "ja") {
    return {
      badge: "ソウル即対応ガイド",
      title: "ソウルで困った？",
      subtitleA: "トラブル発生？",
      subtitleB: "60秒で立て直そう。",
      skipLine: "検索より先に、ここを見る。",
      stayLabel: "滞在先がここなら:",
      deepGuides: "詳細ガイド",
      deep1: "キオスク決済エラー詳細",
      deep2: "T-moneyチャージガイド",
      deep3: "オリーブヤング詳細ガイド",
      cards: [
        "キオスク決済エラーをすぐ解決",
        "地下鉄の正しい路線を今すぐ確認",
        "オリーブヤング30分買い物リスト",
        "混雑エリアから素早く離脱",
      ],
      cardNotes: [
        "タッチ -> 別カード -> カウンター",
        "宿基準で路線を先に決める",
        "基本セットを先に確保",
        "すぐ離脱して動線を再設定",
      ],
      areas: ["弘大", "聖水", "北村", "江南"],
    };
  }
  if (lang === "zh-cn") {
    return {
      badge: "首尔应急指引",
      title: "在首尔遇到麻烦了？",
      subtitleA: "出状况了？",
      subtitleB: "60 秒内先解决。",
      skipLine: "先别搜，从这里开始。",
      stayLabel: "如果你住在：",
      deepGuides: "深度指南",
      deep1: "自助机刷卡失败详解",
      deep2: "T-money 充值指南",
      deep3: "Olive Young 详细指南",
      cards: [
        "马上处理自助机刷卡失败",
        "立刻选对地铁线路",
        "Olive Young 30 分钟购物清单",
        "快速离开拥挤区域",
      ],
      cardNotes: [
        "先 tap，再换卡，再走柜台",
        "先按住宿位置选线",
        "先拿基础组合再停手",
        "先脱离拥挤再重排路线",
      ],
      areas: ["弘大", "圣水", "北村", "江南"],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      badge: "首爾即時應對指南",
      title: "在首爾遇到狀況了？",
      subtitleA: "出狀況了？",
      subtitleB: "60 秒內先處理。",
      skipLine: "先別搜尋，先看這裡。",
      stayLabel: "如果你住在：",
      deepGuides: "深度指南",
      deep1: "自助機刷卡失敗詳解",
      deep2: "T-money 儲值指南",
      deep3: "Olive Young 詳細指南",
      cards: [
        "立即處理自助機刷卡失敗",
        "馬上選對地鐵路線",
        "Olive Young 30 分鐘購物清單",
        "快速離開人潮區域",
      ],
      cardNotes: [
        "先 tap，再換卡，再走櫃檯",
        "先按住宿位置選線",
        "先拿基本組合再停手",
        "先離開人潮再重排行程",
      ],
      areas: ["弘大", "聖水", "北村", "江南"],
    };
  }
  return {
    badge: "Seoul Emergency Guide",
    title: "Stuck in Seoul?",
    subtitleA: "Something went wrong?",
    subtitleB: "Fix it in under 60 seconds.",
    skipLine: "Skip Google. Start here.",
    stayLabel: "If you're staying in:",
    deepGuides: "Deep guides",
    deep1: "Kiosk card rejected guide",
    deep2: "How much T-money you need",
    deep3: "Olive Young tourist guide",
    cards: [
      "Fix card rejected at kiosk",
      "Pick the right subway line now",
      "Get a fast Olive Young list",
      "Escape a crowded area",
    ],
    cardNotes: [
      "Tap. Switch card. Move to counter.",
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
      href: `/${lang}/tips/kiosk-survival-flow`,
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
          <Link href={`/${locale}/how-much-tmoney`} className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
            {copy.deep2}
          </Link>
          <Link href={`/${locale}/olive-young-tourist-guide`} className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
            {copy.deep3}
          </Link>
        </div>
      </section>
    </Container>
  );
}
