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
        <h2 className="text-lg font-black tracking-tight text-zinc-950">If you only remember 3 things:</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900">
          {topThree.map((line) => (
            <li key={line}>- {line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What usually goes wrong?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">{area.crowd}. Visitors stack too many stops and lose time in lines.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">Why it happens?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Main exits and social-media spots pull everyone into one block.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What to do immediately?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Anchor on {area.best_time}. Use {area.how_to_get}. Avoid this: {area.do_not}</p>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Quick local plan</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          <li><span className="font-bold">Must do:</span> {area.must_do}</li>
          <li><span className="font-bold">Hidden tip:</span> {area.hidden_tip}</li>
          <li><span className="font-bold">Budget:</span> {area.budget}</li>
          {area.one_line_route ? <li><span className="font-bold">Route:</span> {area.one_line_route}</li> : null}
        </ul>
      </section>

      {area.id === "hongdae" ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black tracking-tight text-zinc-950">Situation triggers</h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-zinc-900">
            <li>Too loud? - Walk toward Yeonnam side.</li>
            <li>Queue insane? - Move 2 streets east.</li>
            <li>Lost in main street? - Head to side alley bars.</li>
          </ul>
        </section>
      ) : null}

      {area.real_spots && area.real_spots.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black tracking-tight text-zinc-950">Real spots</h2>
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
