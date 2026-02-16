import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { getTravelArea, getTravelAreaName } from "@/lib/travel-ia";

type AreaDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<{ ms?: string | string[] }>;
};

type MatchScores = Record<string, number>;

function parseMatchScores(raw: string | string[] | undefined): MatchScores | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;

  const out: MatchScores = {};
  value.split(",").forEach((pair) => {
    const [key, scoreRaw] = pair.split(":");
    if (!key || !scoreRaw) return;
    const score = Number(scoreRaw);
    if (!Number.isFinite(score)) return;
    out[key] = score;
  });

  return Object.keys(out).length > 0 ? out : null;
}

function getSectionCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      oneLine: "1줄 결론",
      stay: "여기 맞는 경우",
      avoid: "피해야 하는 경우",
      noise: "야간 소음 수준",
      airport: "공항 접근 현실",
      alternatives: "대안 지역",
      connections: "연결 동선",
      openArea: "지역 열기",
      match: "매칭 점수",
      matchPlaceholder: "where-to-stay를 완료하면 개인 점수/순위가 표시됩니다.",
      matchMine: "내 점수",
      matchRank: "내 순위",
      matchTop: "상위 추천",
      nowCta: "여행 중 문제 해결로 이동",
      planCta: "숙소 위치 매칭 다시 하기",
      areasBack: "Areas 목록으로",
    };
  }
  if (lang === "ja") {
    return {
      oneLine: "1行結論",
      stay: "向いている人",
      avoid: "避けるべき人",
      noise: "夜の騒音レベル",
      airport: "空港アクセスの現実",
      alternatives: "代替エリア",
      connections: "接続ルート",
      openArea: "エリアを開く",
      match: "マッチスコア",
      matchPlaceholder: "where-to-stay を完了すると個別スコア/順位が表示されます。",
      matchMine: "あなたのスコア",
      matchRank: "あなたの順位",
      matchTop: "上位おすすめ",
      nowCta: "旅行中の即時解決へ",
      planCta: "宿泊エリアマッチングを再実行",
      areasBack: "Areas一覧へ",
    };
  }
  if (lang === "zh-cn") {
    return {
      oneLine: "一句结论",
      stay: "适合谁住",
      avoid: "谁该避开",
      noise: "夜间噪音等级",
      airport: "机场通达现实",
      alternatives: "替代区域",
      connections: "联动路线",
      openArea: "打开区域",
      match: "匹配分数",
      matchPlaceholder: "完成 where-to-stay 后会显示你的个性化分数和排名。",
      matchMine: "我的分数",
      matchRank: "我的排名",
      matchTop: "Top 推荐",
      nowCta: "前往即时解决",
      planCta: "重新做住宿匹配",
      areasBack: "返回 Areas 列表",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      oneLine: "一句結論",
      stay: "適合誰住",
      avoid: "誰該避開",
      noise: "夜間噪音等級",
      airport: "機場通達現實",
      alternatives: "替代區域",
      connections: "連動路線",
      openArea: "開啟區域",
      match: "匹配分數",
      matchPlaceholder: "完成 where-to-stay 後會顯示你的個人化分數與排名。",
      matchMine: "我的分數",
      matchRank: "我的排名",
      matchTop: "Top 推薦",
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
    matchPlaceholder: "Complete where-to-stay to see your personalized score and rank here.",
    matchMine: "Your score",
    matchRank: "Your rank",
    matchTop: "Top area",
    nowCta: "Go to live fixes",
    planCta: "Run where-to-stay matcher",
    areasBack: "Back to Areas",
  };
}

export default async function AreaDetailPage({ params, searchParams }: AreaDetailPageProps) {
  const { lang, id } = await params;
  const qs = await searchParams;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const c = getSectionCopy(locale);
  const area = getTravelArea(locale, id);
  const matchScores = parseMatchScores(qs.ms);
  const serializedMatch = Array.isArray(qs.ms) ? qs.ms[0] : qs.ms;

  if (!area) notFound();

  const rankedAreas = matchScores
    ? Object.entries(matchScores)
        .sort((a, b) => b[1] - a[1])
        .map(([areaId], index) => ({ areaId, rank: index + 1 }))
    : [];
  const currentScore = matchScores ? matchScores[area.id] ?? 0 : null;
  const currentRank = rankedAreas.find((item) => item.areaId === area.id)?.rank ?? null;
  const topArea = rankedAreas.length > 0 ? getTravelArea(locale, rankedAreas[0].areaId)?.name ?? null : null;
  const maxScore = matchScores ? Math.max(...Object.values(matchScores), 1) : null;
  const scorePercent = currentScore !== null && maxScore ? Math.round((currentScore / maxScore) * 100) : null;
  const withMatch = (areaId: string) => (serializedMatch ? `/${locale}/areas/${areaId}?ms=${encodeURIComponent(serializedMatch)}` : `/${locale}/areas/${areaId}`);

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/areas`} className="text-sm font-semibold text-zinc-600">
        {c.areasBack}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <ResponsiveImage
          src={area.image.src}
          alt={area.image.alt}
          ratio="16 / 9"
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
            <Link key={item.id} href={withMatch(item.id)} className="rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50">
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
                <Link href={withMatch(item.to)} className="text-xs font-semibold underline text-zinc-700">
                  {c.openArea}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.match}</h2>
        {currentScore === null ? (
          <p className="mt-3 text-sm leading-6 text-zinc-700">{c.matchPlaceholder}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.matchMine}</p>
              <p className="mt-1 text-xl font-black text-zinc-950">{currentScore}</p>
              <p className="text-xs text-zinc-600">{scorePercent}%</p>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.matchRank}</p>
              <p className="mt-1 text-xl font-black text-zinc-950">{currentRank ?? "-"}</p>
              <p className="text-xs text-zinc-600">/ {rankedAreas.length}</p>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-600">{c.matchTop}</p>
              <p className="mt-1 text-base font-black text-zinc-950">{topArea ?? "-"}</p>
            </article>
          </div>
        )}
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
