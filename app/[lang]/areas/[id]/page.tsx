import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { getTravelArea, getTravelAreaName } from "@/lib/travel-ia";

type AreaDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function getSectionCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      oneLine: "1줄 결론",
      stay: "Stay here if",
      avoid: "Avoid if",
      noise: "Night noise level",
      airport: "Airport access reality",
      alternatives: "Alternatives",
      connections: "Connected routes",
      openArea: "지역 열기",
      match: "Match score",
      matchPlaceholder: "Where-to-stay 결과와 연결 예정 (MVP 자리 확보)",
      nowCta: "여행 중 문제 해결로 이동",
      planCta: "숙소 위치 매칭 다시 하기",
      areasBack: "Areas 목록으로",
    };
  }
  if (lang === "ja") {
    return {
      oneLine: "1行結論",
      stay: "Stay here if",
      avoid: "Avoid if",
      noise: "Night noise level",
      airport: "Airport access reality",
      alternatives: "Alternatives",
      connections: "Connected routes",
      openArea: "エリアを開く",
      match: "Match score",
      matchPlaceholder: "where-to-stay の個別スコア連携領域（MVP）",
      nowCta: "旅行中の即時解決へ",
      planCta: "宿泊エリアマッチングを再実行",
      areasBack: "Areas一覧へ",
    };
  }
  if (lang === "zh-cn") {
    return {
      oneLine: "一句结论",
      stay: "Stay here if",
      avoid: "Avoid if",
      noise: "Night noise level",
      airport: "Airport access reality",
      alternatives: "Alternatives",
      connections: "Connected routes",
      openArea: "打开区域",
      match: "Match score",
      matchPlaceholder: "预留给 where-to-stay 个性化分数（MVP）",
      nowCta: "前往即时解决",
      planCta: "重新做住宿匹配",
      areasBack: "返回 Areas 列表",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      oneLine: "一句結論",
      stay: "Stay here if",
      avoid: "Avoid if",
      noise: "Night noise level",
      airport: "Airport access reality",
      alternatives: "Alternatives",
      connections: "Connected routes",
      openArea: "開啟區域",
      match: "Match score",
      matchPlaceholder: "預留給 where-to-stay 個人化分數（MVP）",
      nowCta: "前往即時解決",
      planCta: "重新做住宿配對",
      areasBack: "返回 Areas 列表",
    };
  }

  return {
    oneLine: "One-line conclusion",
    stay: "Stay here if",
    avoid: "Avoid if",
    noise: "Night noise level",
    airport: "Airport access reality",
    alternatives: "Alternatives",
    connections: "Connected routes",
    openArea: "Open area",
    match: "Match score",
    matchPlaceholder: "Reserved for personalized score from the where-to-stay matcher (MVP placeholder)",
    nowCta: "Go to live fixes",
    planCta: "Run where-to-stay matcher",
    areasBack: "Back to Areas",
  };
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const c = getSectionCopy(locale);
  const area = getTravelArea(locale, id);

  if (!area) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/areas`} className="text-sm font-semibold text-zinc-600">
        {c.areasBack}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <ResponsiveImage
          src={area.image.src}
          alt={area.image.alt}
          ratio="21 / 9"
          sizes="(max-width: 768px) 100vw, 80vw"
          className="mb-5 rounded-2xl"
          imageClassName="brightness-[0.95]"
        />
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{area.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{area.summary}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.oneLine}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-800">{area.oneLineConclusion}</p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.stay}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
            {area.stayHereIf.map((line) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.avoid}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
            {area.avoidIf.map((line) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.noise}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{area.nightNoiseLevel}</p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.airport}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{area.airportAccessReality}</p>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.alternatives}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {area.alternatives.map((item) => (
            <Link key={item.id} href={`/${locale}/areas/${item.id}`} className="rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50">
              <p className="text-sm font-black text-zinc-950">{getTravelAreaName(locale, item.id)}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-700">{item.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.connections}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {area.connections.map((item) => (
            <article key={item.to} className="rounded-xl border border-zinc-200 p-3">
              <p className="text-sm font-black text-zinc-950">{getTravelAreaName(locale, item.to)}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-700">{item.why}</p>
              <p className="mt-1 text-xs font-semibold text-zinc-600">{item.move}</p>
              <div className="mt-2">
                <Link href={`/${locale}/areas/${item.to}`} className="text-xs font-semibold underline text-zinc-700">
                  {c.openArea}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.match}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700">{c.matchPlaceholder}</p>
      </section>

      <section className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/where-to-stay`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
          {c.planCta}
        </Link>
        <Link href={`/${locale}/now`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
          {c.nowCta}
        </Link>
        <Link href={`/${locale}`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
          {t.back}
        </Link>
      </section>
    </Container>
  );
}
