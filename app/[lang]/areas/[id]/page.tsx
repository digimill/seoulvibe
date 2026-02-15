import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagBadge } from "@/components/TagBadge";
import { getAreas } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";
import { getSpotPicks, toGoogleMapSearchUrl, toPerplexitySearchUrl } from "@/lib/spot-picks";

type AreaDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function getThreeThings(areaId: string, locale: Lang) {
  const byLocale = {
    ko: {
      hongdae: [
        "18시 이전 또는 22시 이후에 움직이기.",
        "메인거리 말고 옆 골목에서 식사하기.",
        "홍대입구역은 혼잡 출구를 피해서 나오기.",
      ],
      seongsu: [
        "핵심 매장은 2곳만 잡기.",
        "가능하면 평일 오전에 방문하기.",
        "대기 길면 서울숲 쪽으로 바로 이동하기.",
      ],
      bukchon: [
        "10시 전 도착해서 핵심 동선 먼저 끝내기.",
        "주거지라서 소리 낮추고 짧게 이동하기.",
        "붐비면 삼청길로 먼저 우회하기.",
      ],
      gangnam: [
        "18-20시 메인 출구는 피하기.",
        "핵심 목적지 1개만 먼저 처리하기.",
        "붐비면 옆 역으로 이동 후 짧게 복귀하기.",
      ],
      fallback: [
        "혼잡 시간대 먼저 확인하기.",
        "핵심 1개 + 백업 1개만 잡기.",
        "줄 길어지기 전에 빠르게 이탈하기.",
      ],
    },
    ja: {
      hongdae: [
        "18時前か22時以降に動く。",
        "メイン通りより横道で食事する。",
        "ホンデ入口駅は混雑出口を避ける。",
      ],
      seongsu: [
        "コア店舗は2か所まで。",
        "可能なら平日午前に行く。",
        "待ちが長いならソウルの森側へ移動。",
      ],
      bukchon: [
        "10時前に到着して主要動線を先に終える。",
        "住宅地なので声は小さく短く回る。",
        "混んだら先にサムチョンギルへ。",
      ],
      gangnam: [
        "18-20時の主要出口を避ける。",
        "目的地はまず1つだけ処理。",
        "混雑時は隣駅へ移動して短く戻る。",
      ],
      fallback: [
        "混雑時間を先に確認する。",
        "優先1件＋予備1件に絞る。",
        "行列が伸びる前に離脱する。",
      ],
    },
    "zh-cn": {
      hongdae: [
        "尽量在18点前或22点后行动。",
        "吃饭走侧街，不挤主街。",
        "弘大入口站尽量避开最拥挤出口。",
      ],
      seongsu: [
        "核心店控制在2家以内。",
        "尽量选工作日上午去。",
        "排队太长就立刻转去首尔林一带。",
      ],
      bukchon: [
        "10点前到，先走核心路线。",
        "居民区请降低音量，快速通过。",
        "太挤就先转去三清路。",
      ],
      gangnam: [
        "18-20点避开主出口。",
        "先完成1个核心目的地。",
        "拥挤时先去邻站再短程回跳。",
      ],
      fallback: [
        "先看拥挤时段再出发。",
        "只留1个核心点+1个备选点。",
        "排队变长前尽快离开。",
      ],
    },
    "zh-tw": {
      hongdae: [
        "盡量在18點前或22點後移動。",
        "吃飯走側街，不擠主街。",
        "弘大入口站盡量避開最擁擠出口。",
      ],
      seongsu: [
        "核心店控制在2家以內。",
        "盡量選平日上午去。",
        "排隊太長就立刻轉去首爾林一帶。",
      ],
      bukchon: [
        "10點前到，先跑核心路線。",
        "住宅區請降低音量，快速通過。",
        "太擠就先轉去三清街。",
      ],
      gangnam: [
        "18-20點避開主要出口。",
        "先完成1個核心目的地。",
        "擁擠時先去鄰站再短程回跳。",
      ],
      fallback: [
        "先看人潮時段再出發。",
        "只留1個核心點+1個備選點。",
        "排隊拉長前先離開。",
      ],
    },
    "zh-hk": {
      hongdae: [
        "盡量18點前或22點後先郁。",
        "食飯行側街，唔好逼主街。",
        "弘大入口站盡量避開最逼出口。",
      ],
      seongsu: [
        "核心店控制喺2間以內。",
        "盡量揀平日上午去。",
        "排隊太長就即刻轉去首爾林一帶。",
      ],
      bukchon: [
        "10點前到，先走核心路線。",
        "住宅區請細聲啲，快啲通過。",
        "太逼就先轉去三清街。",
      ],
      gangnam: [
        "18-20點避開主要出口。",
        "先完成1個核心目的地。",
        "太逼就先去隔籬站再短程返轉頭。",
      ],
      fallback: [
        "出發前先睇人潮時段。",
        "只留1個核心點+1個備選點。",
        "排隊一拉長就即刻離開。",
      ],
    },
    en: {
      hongdae: [
        "Go before 6pm or after 10pm.",
        "Eat in side streets, not the main strip.",
        "Use less crowded Hongik Univ. exits.",
      ],
      seongsu: [
        "Pick 2 stores max.",
        "Weekday mornings are easiest.",
        "If queues spike, shift to Seoul Forest side.",
      ],
      bukchon: [
        "Go before 10am.",
        "Keep voice low in residential lanes.",
        "If packed, pivot to Samcheong-gil.",
      ],
      gangnam: [
        "Avoid main exits at 6-8pm.",
        "Do one core stop first.",
        "If crowded, shift one station and hop back.",
      ],
      fallback: [
        "Check peak crowd window before going.",
        "Pick one core stop and one backup.",
        "Leave early if queues compound.",
      ],
    },
  } as const;

  const localeMap = byLocale[locale] ?? byLocale.en;
  return localeMap[areaId as keyof typeof localeMap] ?? localeMap.fallback;
}

function getAreaSpotKeywords(areaId: string, locale: Lang): string[] {
  const byLocale: Record<Lang, Record<string, string[]>> = {
    ko: {
      hongdae: ["연남-망원", "합정-상수"],
      seongsu: ["성수"],
      bukchon: ["서촌-삼청"],
      gangnam: [],
    },
    en: {
      hongdae: ["Yeonnam-Mangwon", "Hapjeong-Sangsu"],
      seongsu: ["Seongsu"],
      bukchon: ["Seochon-Samcheong"],
      gangnam: [],
    },
    ja: {
      hongdae: ["延南-望遠", "合井-上水"],
      seongsu: ["聖水"],
      bukchon: ["西村-三清"],
      gangnam: [],
    },
    "zh-cn": {
      hongdae: ["延南-望远", "合井-上水"],
      seongsu: ["圣水"],
      bukchon: ["西村-三清"],
      gangnam: [],
    },
    "zh-tw": {
      hongdae: ["延南-望遠", "合井-上水"],
      seongsu: ["聖水"],
      bukchon: ["西村-三清"],
      gangnam: [],
    },
    "zh-hk": {
      hongdae: ["延南-望遠", "合井-上水"],
      seongsu: ["聖水"],
      bukchon: ["西村-三清"],
      gangnam: [],
    },
  };

  return byLocale[locale][areaId] ?? [];
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const area = (await getAreas(locale)).find((item) => item.id === id);

  if (!area) notFound();

  const topThree = getThreeThings(area.id, locale);
  const areaSpotKeywords = getAreaSpotKeywords(area.id, locale);
  const areaSpots = getSpotPicks(locale)
    .filter((spot) => areaSpotKeywords.some((keyword) => spot.area.includes(keyword)))
    .slice(0, 4);
  const c =
    locale === "ko"
      ? {
          remember: "이 3개만 기억하세요:",
          wrong: "자주 꼬이는 지점",
          why: "왜 생기나",
          now: "지금 바로 할 일",
          plan: "빠른 로컬 플랜",
          must: "꼭 할 것",
          hidden: "숨은 팁",
          budget: "예산",
          route: "동선",
          triggers: "상황별 대응",
          real: "실제 스팟",
          wrongBody: "한 구역에 일정을 몰아넣고 대기줄에서 시간을 잃습니다.",
          whyBody: "메인 출구와 바이럴 스팟에 인파가 동시에 몰립니다.",
          nowBody: `핵심 시간대는 ${area.best_time}. 이동은 ${area.how_to_get}. 피해야 할 행동은 ${area.do_not}`,
          trigger1: "너무 시끄러움? - 연남동 쪽으로 이동",
          trigger2: "줄이 너무 김? - 동쪽으로 2블록 이동",
          trigger3: "메인 거리에서 길 잃음? - 골목 바 거리로 이동",
        }
      : locale === "ja"
        ? {
            remember: "この3つだけ覚えておけばOK:",
            wrong: "よく詰まる点",
            why: "なぜ起きるか",
            now: "今すぐやること",
            plan: "ローカル即行プラン",
            must: "必須",
            hidden: "裏ワザ",
            budget: "予算",
            route: "動線",
            triggers: "状況トリガー",
            real: "実在スポット",
            wrongBody: "同じエリアに予定を詰め込み、行列で時間を失います。",
            whyBody: "主要出口と人気スポットに人が集中するためです。",
            nowBody: `狙い時間は ${area.best_time}。移動は ${area.how_to_get}。避けるべきは ${area.do_not}`,
            trigger1: "うるさすぎる？ - ヨンナム側へ移動",
            trigger2: "行列が長すぎる？ - 東へ2ブロック移動",
            trigger3: "メイン通りで迷う？ - 横道のバー通りへ",
          }
        : locale === "zh-cn"
          ? {
              remember: "只记住这 3 点就够了：",
              wrong: "常见卡点",
              why: "为什么会这样",
              now: "现在先做",
              plan: "本地快速方案",
              must: "必做",
              hidden: "隐藏技巧",
              budget: "预算",
              route: "路线",
              triggers: "场景触发",
              real: "真实地点",
              wrongBody: "把太多安排塞在同一区域，时间都耗在排队上。",
              whyBody: "主出口和网红点会在同一时段同时拥堵。",
              nowBody: `核心时段看 ${area.best_time}。移动按 ${area.how_to_get}。避开 ${area.do_not}`,
              trigger1: "太吵？- 往延南洞方向走",
              trigger2: "排队爆炸？- 向东移 2 个街区",
              trigger3: "主街迷路？- 转去侧巷酒吧区",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                remember: "只要記住這 3 點：",
                wrong: "常見卡點",
                why: "為什麼會發生",
                now: "現在先做",
                plan: "在地快速方案",
                must: "必做",
                hidden: "隱藏技巧",
                budget: "預算",
                route: "路線",
                triggers: "情境觸發",
                real: "真實地點",
                wrongBody: "把太多行程塞在同一區，時間都耗在排隊。",
                whyBody: "主要出口與網紅點會在同時段一起塞住。",
                nowBody: `核心時段看 ${area.best_time}。移動按 ${area.how_to_get}。避開 ${area.do_not}`,
                trigger1: "太吵？- 往延南洞方向走",
                trigger2: "排隊太誇張？- 往東移 2 個街區",
                trigger3: "主街迷路？- 轉去側巷酒吧區",
              }
            : {
                remember: "If you only remember 3 things:",
                wrong: "What usually goes wrong?",
                why: "Why it happens?",
                now: "What to do immediately?",
                plan: "Quick local plan",
                must: "Must do",
                hidden: "Hidden tip",
                budget: "Budget",
                route: "Route",
                triggers: "Situation triggers",
                real: "Real spots",
                wrongBody: "Visitors stack too many stops and lose time in lines.",
                whyBody: "Main exits and social-media spots pull everyone into one block.",
                nowBody: `Anchor on ${area.best_time}. Use ${area.how_to_get}. Avoid this: ${area.do_not}`,
                trigger1: "Too loud? - Walk toward Yeonnam side.",
                trigger2: "Queue insane? - Move 2 streets east.",
                trigger3: "Lost in main street? - Head to side alley bars.",
                areaSpots: "Nearby spot picks",
                map: "Map",
                search: "Ask",
                allSpots: "Open full spot list",
              };

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/areas`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{area.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{area.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {area.tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-red-50 p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.remember}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900">
          {topThree.map((line) => (
            <li key={line}>- {line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.wrong}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{area.crowd}. {c.wrongBody}</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.why}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{c.whyBody}</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.now}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{c.nowBody}</p>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.plan}</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          <li><span className="font-bold">{c.must}:</span> {area.must_do}</li>
          <li><span className="font-bold">{c.hidden}:</span> {area.hidden_tip}</li>
          <li><span className="font-bold">{c.budget}:</span> {area.budget}</li>
          {area.one_line_route ? <li><span className="font-bold">{c.route}:</span> {area.one_line_route}</li> : null}
        </ul>
      </section>

      {area.id === "hongdae" ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.triggers}</h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-zinc-900">
            <li>{c.trigger1}</li>
            <li>{c.trigger2}</li>
            <li>{c.trigger3}</li>
          </ul>
        </section>
      ) : null}

      {area.real_spots && area.real_spots.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.real}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">
            {area.real_spots
              .map((spot) => {
                const link = toSpotLink(spot);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-700"
                  >
                    {link.name}
                  </a>
                );
              })
              .reduce<ReactNode[]>((acc, node, index) => (index === 0 ? [node] : [...acc, " / ", node]), [])}
          </p>
        </section>
      ) : null}

      {areaSpots.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black tracking-tight text-zinc-950">
            {("areaSpots" in c ? c.areaSpots : locale === "ko" ? "근처 스팟" : "Nearby spot picks")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {areaSpots.map((spot) => (
              <article key={spot.id} className="rounded-xl border border-zinc-200 p-3">
                <p className="text-sm font-black text-zinc-950">{spot.name}</p>
                <p className="mt-1 text-xs text-zinc-600">{spot.summary}</p>
                <div className="mt-2 flex items-center gap-3 text-xs font-semibold">
                  <a href={toGoogleMapSearchUrl(spot.map_query)} target="_blank" rel="noreferrer" className="underline">
                    {"map" in c ? c.map : locale === "ko" ? "지도" : "Map"}
                  </a>
                  <a href={toPerplexitySearchUrl(`${spot.name} ${spot.area}`, locale, "spot")} target="_blank" rel="noreferrer" className="underline">
                    {"search" in c ? c.search : locale === "ko" ? "질문" : "Ask"}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/${locale}/spots`} className="text-sm font-semibold underline text-zinc-700">
              {"allSpots" in c ? c.allSpots : locale === "ko" ? "전체 스팟 리스트 보기" : "Open full spot list"}
            </Link>
          </div>
        </section>
      ) : null}
    </Container>
  );
}
