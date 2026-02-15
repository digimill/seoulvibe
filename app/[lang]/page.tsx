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
  cards: [string, string, string, string];
};

function getHomeCopy(lang: Lang): HomeCopy {
  if (lang === "ko") {
    return {
      badge: "서울 긴급 가이드",
      title: "서울에서 막혔나요?",
      subtitleA: "문제가 생겼나요?",
      subtitleB: "60초 안에 해결하세요.",
      skipLine: "검색하지 말고 여기서 시작하세요.",
      stayLabel: "머무는 곳이 여기라면:",
      deepGuides: "심화 가이드",
      cards: [
        "키오스크 카드 오류 해결",
        "지금 맞는 지하철 노선 고르기",
        "올리브영 빠른 쇼핑 리스트",
        "붐비는 지역 빠져나오기",
      ],
    };
  }
  if (lang === "ja") {
    return {
      badge: "ソウル緊急ガイド",
      title: "ソウルで詰まった？",
      subtitleA: "何か問題が起きた？",
      subtitleB: "60秒で対処しよう。",
      skipLine: "検索は後回し。ここから始める。",
      stayLabel: "滞在エリア別:",
      deepGuides: "詳細ガイド",
      cards: [
        "キオスクのカード失敗を解決",
        "今すぐ正しい地下鉄路線を選ぶ",
        "オリーブヤング時短リスト",
        "混雑エリアから離脱する",
      ],
    };
  }
  if (lang === "zh-cn") {
    return {
      badge: "首尔应急指南",
      title: "在首尔卡住了？",
      subtitleA: "出问题了？",
      subtitleB: "60秒内先处理。",
      skipLine: "先别搜。先从这里开始。",
      stayLabel: "如果你住在：",
      deepGuides: "深度指南",
      cards: [
        "解决自助机刷卡失败",
        "马上选对地铁线路",
        "Olive Young 快速购物清单",
        "快速离开拥挤区域",
      ],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      badge: "首爾緊急指南",
      title: "在首爾卡住了？",
      subtitleA: "出狀況了？",
      subtitleB: "先在 60 秒內處理。",
      skipLine: "先不要搜尋。先從這裡開始。",
      stayLabel: "如果你住在：",
      deepGuides: "深度指南",
      cards: [
        "解決自助機刷卡失敗",
        "馬上選對地鐵路線",
        "Olive Young 快速購物清單",
        "快速離開人潮區域",
      ],
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
    cards: [
      "Fix card rejected at kiosk",
      "Pick the right subway line now",
      "Get a fast Olive Young list",
      "Escape a crowded area",
    ],
  };
}

function getEmergencyCards(lang: Lang): EmergencyCard[] {
  const copy = getHomeCopy(lang);
  return [
    {
      title: copy.cards[0],
      href: `/${lang}/tips/kiosk-survival-flow`,
      note: "Tap. Switch card. Move to counter.",
    },
    {
      title: copy.cards[1],
      href: `/${lang}/tips/subway-map-confusion-cuts`,
      note: "Pick your base line first.",
    },
    {
      title: copy.cards[2],
      href: `/${lang}/tips/oliveyoung-master-playbook`,
      note: "Get the $50 starter pack.",
    },
    {
      title: copy.cards[3],
      href: `/${lang}/crowded`,
      note: "Exit fast. Reset route.",
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
            Hongdae
          </Link>
          <Link href={`/${locale}/areas/seongsu`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Seongsu
          </Link>
          <Link href={`/${locale}/areas/bukchon`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Bukchon
          </Link>
          <Link href={`/${locale}/areas/gangnam`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Gangnam
          </Link>
        </div>
      </section>

      {locale === "en" ? (
        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 sm:mt-12 sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.deepGuides}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link href="/en/kiosk-card-rejected" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              Kiosk card rejected guide
            </Link>
            <Link href="/en/how-much-tmoney" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              How much T-money you need
            </Link>
            <Link href="/en/olive-young-tourist-guide" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              Olive Young tourist guide
            </Link>
          </div>
        </section>
      ) : null}
    </Container>
  );
}
