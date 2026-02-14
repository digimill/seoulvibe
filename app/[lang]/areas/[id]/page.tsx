import Link from "next/link";
import Image from "next/image";
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

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const area = (await getAreas(locale)).find((item) => item.id === id);

  if (!area) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link href={`/${locale}/areas`} className="text-sm text-zinc-500">
        {t.back}
      </Link>
      <div className="mt-4 rounded-3xl border border-black/5 bg-white/90 p-7 shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:p-10">
        {area.image ? (
          <div className="relative mb-6 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={area.image.src}
              alt={area.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{area.name}</h1>
        <div className="mt-3 max-w-3xl space-y-2 text-base leading-7 text-zinc-700">
          <p>{area.summary}</p>
          {area.hook ? <p>{area.hook}</p> : null}
          {area.friend_note ? <p>{area.friend_note}</p> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {area.tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Vibe</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.vibe}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Best time</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.best_time}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">How to get</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.how_to_get}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Must do</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.must_do}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Hidden tip</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.hidden_tip}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Do not</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.do_not}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Budget</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.budget}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Crowd</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.crowd}</dd>
          </div>
          {area.photo_spot ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Photo spot</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.photo_spot}</dd>
            </div>
          ) : null}
          {area.food_pairing ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Food pairing</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.food_pairing}</dd>
            </div>
          ) : null}
          {area.rain_option ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Rain option</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.rain_option}</dd>
            </div>
          ) : null}
          {area.night_option ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Night option</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.night_option}</dd>
            </div>
          ) : null}
          {area.one_line_route ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">One-line route</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{area.one_line_route}</dd>
            </div>
          ) : null}
          {area.real_spots && area.real_spots.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Real spots</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">
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
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Container>
  );
}
