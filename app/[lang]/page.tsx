import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getAreas, getHeroImage, getKorea101, getThemes, getTips } from "@/lib/content";
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
  const korea101Preview =
    locale === "ko"
      ? "한국의 교통, 식문화, 말투, 모임, 생활 인프라까지 한 페이지에서 흐름으로 읽을 수 있는 롱폼 가이드로 구성했습니다."
      : "A single-scroll long-form guide that helps first-time visitors understand Korea's transit, food culture, speech tone, social flow, and everyday infrastructure.";
  const spotsDescription =
    locale === "ko"
      ? "너무 뻔한 코스보다, 요즘 감도와 동선 효율을 함께 잡는 스팟만 골랐습니다."
      : "A curated list of places with strong local taste and practical flow.";
  const sourceLabel =
    locale === "ko"
      ? { area: "대략적 위치", spot: "스팟", note: "설명", price: "가격대(비용)", closed: "휴무일", map: "지도", pplx: "검색", more: "전체 보기" }
      : { area: "Area", spot: "Spot", note: "Description", price: "Price", closed: "Closed days", map: "Map", pplx: "Search", more: "View all" };
  const [areas, themes, tips, korea101, heroImage] = await Promise.all([
    getAreas(locale),
    getThemes(locale),
    getTips(locale),
    getKorea101(locale),
    getHeroImage(locale),
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
      <section className="pt-14 pb-12 sm:pt-20 sm:pb-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-12">
            {heroImage ? (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/78 to-white/56" />
            <div className="relative">
              <p className="text-sm font-medium tracking-wide text-zinc-500">Seoul Vibe</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{t.tagline}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                {locale === "ko"
                  ? "서울 방문객이 궁금해하는 핵심 정보만 깔끔하게 모았어요."
                  : "A clean guide to the most useful Seoul info for visitors."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
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
                <Link className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 font-medium" href={`/${locale}/korea-101`}>
                  {t.nav.korea101}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-8 sm:pb-10">
        <Container>
          <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700/80">{t.nav.korea101}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t.featuredKorea101}</h2>
              </div>
              <Link
                href={`/${locale}/korea-101`}
                className="rounded-full border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
              >
                {korea101Cta}
              </Link>
            </div>
            <p className="max-w-3xl text-base leading-8 text-zinc-700">
              {korea101[0]?.summary} {korea101[0]?.friend_note} {korea101Preview}
            </p>
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
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
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
