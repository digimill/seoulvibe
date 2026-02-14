import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type TipDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const tip = (await getTips(locale)).find((item) => item.id === id);

  if (!tip) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link href={`/${locale}/tips`} className="text-sm text-zinc-500">
        {t.back}
      </Link>
      <div className="mt-4 rounded-3xl border border-black/5 bg-white/90 p-7 shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:p-10">
        {tip.image ? (
          <div className="relative mb-6 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={tip.image.src}
              alt={tip.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tip.title}</h1>
        <p className="mt-3 max-w-3xl text-base text-zinc-600">{tip.summary}</p>
        {tip.hook ? <p className="mt-3 text-sm font-medium text-zinc-900">{tip.hook}</p> : null}
        {tip.friend_note ? <p className="mt-2 text-sm leading-6 text-zinc-700">{tip.friend_note}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {tip.tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">What to know</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.what_to_know}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Why it matters</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.why_it_matters}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Avoid this</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.avoid_this}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Quick fix</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.quick_fix}</dd>
          </div>
          {tip.real_scene ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Real scene</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.real_scene}</dd>
            </div>
          ) : null}
          {tip.local_move ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Local move</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.local_move}</dd>
            </div>
          ) : null}
          {tip.line_to_use ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Line to use</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.line_to_use}</dd>
            </div>
          ) : null}
          {tip.quick_checklist && tip.quick_checklist.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Quick checklist</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.quick_checklist.join(" / ")}</dd>
            </div>
          ) : null}
          {tip.real_spots && tip.real_spots.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Where to try</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">
                {tip.real_spots
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
