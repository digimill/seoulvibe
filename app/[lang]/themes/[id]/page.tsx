import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagBadge } from "@/components/TagBadge";
import { getThemes } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type ThemeDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

export default async function ThemeDetailPage({ params }: ThemeDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const theme = (await getThemes(locale)).find((item) => item.id === id);

  if (!theme) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link href={`/${locale}/themes`} className="text-sm text-zinc-500">
        {t.back}
      </Link>
      <div className="mt-4 rounded-3xl border border-black/5 bg-white/90 p-7 shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:p-10">
        {theme.image ? (
          <div className="relative mb-6 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={theme.image.src}
              alt={theme.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{theme.title}</h1>
        <p className="mt-3 max-w-3xl text-base text-zinc-600">{theme.summary}</p>
        {theme.hook ? <p className="mt-3 text-sm font-medium text-zinc-900">{theme.hook}</p> : null}
        {theme.friend_note ? <p className="mt-2 text-sm leading-6 text-zinc-700">{theme.friend_note}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {theme.tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ideal for</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.ideal_for}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Flow</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.flow}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Highlight</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.highlight}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Budget</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.budget}</dd>
          </div>
          {theme.food_break ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Food break</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.food_break}</dd>
            </div>
          ) : null}
          {theme.rain_swap ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Rain swap</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.rain_swap}</dd>
            </div>
          ) : null}
          {theme.creator_note ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Creator note</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.creator_note}</dd>
            </div>
          ) : null}
          {theme.route_stops && theme.route_stops.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Route stops</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{theme.route_stops.join(" -> ")}</dd>
            </div>
          ) : null}
          {theme.real_spots && theme.real_spots.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Real spots</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">
                {theme.real_spots
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
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Container>
  );
}
