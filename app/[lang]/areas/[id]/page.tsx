import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagBadge } from "@/components/TagBadge";
import { getAreas } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type AreaDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function getThreeThings(areaName: string) {
  if (areaName.toLowerCase() === "hongdae") {
    return [
      "Go before 6pm or after 10pm. Peak time is gridlock.",
      "Eat in side streets, not the main strip.",
      "Use Hongik Univ. Station exits away from busking square.",
    ];
  }

  if (areaName.toLowerCase() === "seongsu") {
    return [
      "Pick 2 stores max. Queue time kills schedules.",
      "Visit weekdays before noon for shortest lines.",
      "Use Seoul Forest side cafes as backup.",
    ];
  }

  if (areaName.toLowerCase() === "bukchon") {
    return [
      "Go before 10am. Tour groups surge after lunch.",
      "Keep voice low. People actually live there.",
      "If packed, move to Samcheong-gil and return later.",
    ];
  }

  if (areaName.toLowerCase() === "gangnam") {
    return [
      "Avoid main exits at 6-8pm. They choke fast.",
      "Pick one destination only, then move to side blocks.",
      "If crowded, shift one station and short-hop back.",
    ];
  }

  return [
    "Check peak crowd window before going.",
    "Pick one core stop, then one backup nearby.",
    "Leave early if queues start compounding.",
  ];
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const area = (await getAreas(locale)).find((item) => item.id === id);

  if (!area) notFound();

  const topThree = getThreeThings(area.name);
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
    </Container>
  );
}
