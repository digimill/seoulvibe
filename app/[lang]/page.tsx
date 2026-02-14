import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getAreas, getHeroImage, getKorea101, getThemes, getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

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
  const [areas, themes, tips, korea101, heroImage] = await Promise.all([
    getAreas(locale),
    getThemes(locale),
    getTips(locale),
    getKorea101(locale),
    getHeroImage(locale),
  ]);

  return (
    <>
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
              <p className="text-sm font-medium text-zinc-500">{t.tagline}</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{t.heroTitle}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">{t.heroDescription}</p>
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
    </>
  );
}
