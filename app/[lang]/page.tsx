import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getAreas, getThemes, getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { getSpotPicks, pickRandomSpots, toGoogleMapSearchUrl, toPerplexitySearchUrl } from "@/lib/spot-picks";
import { getSiteUrl } from "@/lib/site";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const korea101Cta = locale === "ko" ? "한 번에 읽기" : "Scroll Read";
  const spotsDescription =
    locale === "ko"
      ? "너무 뻔한 코스보다, 요즘 감도와 동선 효율을 함께 잡는 스팟만 골랐습니다."
      : "A curated list of places with strong local taste and practical flow.";
  const sourceLabel =
    locale === "ko"
      ? { area: "대략적 위치", spot: "스팟", note: "설명", price: "가격대(비용)", closed: "휴무일", map: "지도", pplx: "검색", more: "전체 보기" }
      : { area: "Area", spot: "Spot", note: "Description", price: "Price", closed: "Closed days", map: "Map", pplx: "Search", more: "View all" };
  const [areas, themes, tips] = await Promise.all([
    getAreas(locale),
    getThemes(locale),
    getTips(locale),
  ]);
  const spotPool = getSpotPicks(locale);
  const featuredSpots = pickRandomSpots(spotPool, 6);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t.appName,
    url: pageUrl,
    inLanguage: locale,
    description: t.tagline,
    publisher: {
      "@type": "Organization",
      name: t.appName,
    },
  };

  return (
    <>
      <Script id={`website-jsonld-${locale}`} type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <section className="pt-6 sm:pt-8">
        <Container>
          <Link
            href={`/${locale}/korea-101`}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-zinc-300 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
          >
            <span className="truncate">
              {locale === "ko"
                ? "Korea 101 빠르게 보기"
                : "Korea 101 Quick Guide"}
            </span>
            <span className="shrink-0 rounded-full border border-white/40 px-3 py-1 text-xs font-medium transition group-hover:bg-white group-hover:text-zinc-900">
              {korea101Cta}
            </span>
          </Link>
        </Container>
      </section>
      <section className="pt-14 pb-12 sm:pt-20 sm:pb-16">
        <Container>
          <div className="hero-shell relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-12">
            <div className="hero-grid-lines absolute inset-0" />
            <div className="hero-beam absolute -left-1/3 top-0 h-full w-1/2" />
            <div className="hero-orb hero-orb-a absolute -left-16 -top-14 h-48 w-48 rounded-full bg-zinc-300/40 blur-3xl sm:h-64 sm:w-64" />
            <div className="hero-orb hero-orb-b absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-zinc-200/50 blur-3xl sm:h-72 sm:w-72" />
            <div className="hero-ticker-wrap absolute inset-x-4 top-4 overflow-hidden rounded-full border border-zinc-200/70 bg-white/70 px-4 py-2 sm:inset-x-6">
              <div className="hero-ticker text-[10px] font-semibold tracking-[0.28em] text-zinc-500 sm:text-xs">
                SEOUL VIBE SEOUL VIBE SEOUL VIBE SEOUL VIBE SEOUL VIBE SEOUL VIBE
              </div>
            </div>

            <div className="relative pt-12 sm:pt-14">
              <p className="text-sm font-medium tracking-[0.12em] text-zinc-500">Seoul Vibe</p>
              <h1 className="hero-headline mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">{t.tagline}</h1>
              <p className="hero-copy mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                {locale === "ko"
                  ? "서울 방문객이 궁금해하는 핵심 정보만 깔끔하게 모았어요."
                  : "A clean guide to the most useful Seoul info for visitors."}
              </p>
              <div className="hero-cta mt-8 flex flex-wrap gap-3 text-sm">
                <Link className="rounded-full bg-zinc-900 px-5 py-2.5 font-medium text-white" href={`/${locale}/areas`}>
                  {t.nav.areas}
                </Link>
                <Link className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 font-medium" href={`/${locale}/themes`}>
                  {t.nav.themes}
                </Link>
                <Link className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 font-medium" href={`/${locale}/tips`}>
                  {t.nav.tips}
                </Link>
                <Link className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 font-medium" href={`/${locale}/spots`}>
                  {t.nav.spots}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionBlock title={t.featuredAreas}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Card
              key={area.id}
              href={`/${locale}/areas/${area.id}`}
              title={area.name}
              description={area.summary}
              image={area.image}
              footer={area.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title={t.featuredThemes}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              href={`/${locale}/themes/${theme.id}`}
              title={theme.title}
              description={theme.summary}
              image={theme.image}
              footer={theme.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title={t.featuredTips}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <Card
              key={tip.id}
              href={`/${locale}/tips/${tip.id}`}
              title={tip.title}
              description={tip.summary}
              image={tip.image}
              footer={tip.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            />
          ))}
        </div>
      </SectionBlock>

      {featuredSpots.length > 0 ? (
        <SectionBlock title={t.featuredSpots} description={spotsDescription}>
          <div className="mb-3 flex justify-end">
            <Link
              href={`/${locale}/spots`}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {sourceLabel.more}
            </Link>
          </div>
          <div className="space-y-3 md:hidden">
            {featuredSpots.map((spot) => (
              <div key={spot.id} className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <p className="text-base font-semibold text-zinc-900">{spot.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <TagBadge>{spot.area}</TagBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{spot.summary}</p>
                <p className="mt-2 text-xs text-zinc-600">
                  <span className="font-medium">{sourceLabel.price}:</span> {spot.price}
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  <span className="font-medium">{sourceLabel.closed}:</span> {spot.closed}
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={toGoogleMapSearchUrl(spot.map_query)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    {sourceLabel.map}
                  </a>
                  <a
                    href={toPerplexitySearchUrl(spot.map_query, locale)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    {sourceLabel.pplx}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:block">
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-50/95">
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-3">{sourceLabel.spot}</th>
                    <th className="px-4 py-3">{sourceLabel.area}</th>
                    <th className="px-4 py-3">{sourceLabel.note}</th>
                    <th className="px-4 py-3">{sourceLabel.price}</th>
                    <th className="px-4 py-3">{sourceLabel.closed}</th>
                    <th className="px-4 py-3">{sourceLabel.map}</th>
                    <th className="px-4 py-3">{sourceLabel.pplx}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {featuredSpots.map((spot) => (
                    <tr key={spot.name} className="align-top">
                      <td className="px-4 py-3 font-semibold text-zinc-900">{spot.name}</td>
                      <td className="px-4 py-3">
                        <TagBadge>{spot.area}</TagBadge>
                      </td>
                      <td className="max-w-[420px] px-4 py-3 text-zinc-600">{spot.summary}</td>
                      <td className="px-4 py-3 text-zinc-700">{spot.price}</td>
                      <td className="px-4 py-3 text-zinc-700">{spot.closed}</td>
                      <td className="px-4 py-3">
                        <a
                          href={toGoogleMapSearchUrl(spot.map_query)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          {sourceLabel.map}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={toPerplexitySearchUrl(spot.map_query, locale)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          {sourceLabel.pplx}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionBlock>
      ) : null}
    </>
  );
}
