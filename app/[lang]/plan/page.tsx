import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Plan: 여행 전 결정",
      lead: "숙소 위치와 이동 기준을 먼저 정하면 여행 중 실수를 크게 줄일 수 있습니다.",
      cards: [
        { href: "where-to-stay", title: "Where to stay", desc: "핵심 허브. 질문 5개로 숙소 동네 매칭." },
        { href: "3-day-template", title: "3-day template", desc: "동네 기준 3박 템플릿." },
        { href: "airport-to-city", title: "Airport to city", desc: "도착 시간/짐 기준 이동 선택." },
        { href: "daily-budget", title: "Daily budget", desc: "하루 예산 감각 빠르게 계산." },
      ],
    };
  }
  if (lang === "ja") {
    return {
      title: "Plan: 旅行前の意思決定",
      lead: "滞在拠点と移動基準を先に決めると、現地ミスを大きく減らせます。",
      cards: [
        { href: "where-to-stay", title: "滞在エリアマッチング", desc: "中核ハブ。5問で拠点エリアを提案。" },
        { href: "3-day-template", title: "3日テンプレート", desc: "エリア基準の3泊動線。" },
        { href: "airport-to-city", title: "空港から市内", desc: "到着時刻と荷物で移動手段を選択。" },
        { href: "daily-budget", title: "1日予算", desc: "日次予算感覚を素早く作る。" },
      ],
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Plan：出发前决策",
      lead: "先定住宿位置和移动逻辑，可以明显减少到达后的失误。",
      cards: [
        { href: "where-to-stay", title: "住宿区域匹配", desc: "核心入口。5个问题匹配落脚区域。" },
        { href: "3-day-template", title: "3天模板", desc: "按区域组织3晚行程结构。" },
        { href: "airport-to-city", title: "机场到市区", desc: "按到达时间和行李选交通方式。" },
        { href: "daily-budget", title: "每日预算", desc: "快速建立每日花费基线。" },
      ],
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Plan：出發前決策",
      lead: "先定住宿位置與移動邏輯，可明顯降低落地後失誤。",
      cards: [
        { href: "where-to-stay", title: "住宿區域配對", desc: "核心入口。5個問題配對落腳區域。" },
        { href: "3-day-template", title: "3天模板", desc: "按區域組織3晚行程結構。" },
        { href: "airport-to-city", title: "機場到市區", desc: "依到達時間與行李選交通方式。" },
        { href: "daily-budget", title: "每日預算", desc: "快速建立每日花費基線。" },
      ],
    };
  }

  return {
    title: "Plan: Pre-trip decisions",
    lead: "Set your base and movement logic before arrival to avoid expensive mistakes.",
    cards: [
      { href: "where-to-stay", title: "Where to stay", desc: "Core hub. Match your base area with 5 questions." },
      { href: "3-day-template", title: "3-day template", desc: "Neighborhood-first structure for 3 nights." },
      { href: "airport-to-city", title: "Airport to city", desc: "Pick transfer mode by arrival time and luggage." },
      { href: "daily-budget", title: "Daily budget", desc: "Get practical per-day spend baseline." },
    ],
  };
}

export default async function PlanPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {c.cards.map((card) => (
          <Link key={card.href} href={`/${locale}/plan/${card.href}`} className="rounded-2xl border-2 border-zinc-900 bg-white p-5 shadow-[0_8px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5">
            <h2 className="text-xl font-black tracking-tight text-zinc-950">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{card.desc}</p>
          </Link>
        ))}
      </section>
    </Container>
  );
}
