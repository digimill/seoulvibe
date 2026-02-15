import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type CrowdedPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CrowdedPage({ params }: CrowdedPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">It&apos;s too crowded here</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          You do not need to force it. Seoul has backups everywhere.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Do this now</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>1. Walk 2 blocks off main street.</li>
          <li>2. Switch to a side station.</li>
          <li>3. Move the hot spot to weekday daytime.</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Fast exits by area</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          <li>Hongdae packed: walk to Yeonnam side and eat there first.</li>
          <li>Seongsu packed: skip the first viral cafe. Use Seoul Forest side cafes.</li>
          <li>Bukchon packed: go to Samcheong-gil and return early next morning.</li>
          <li>Gangnam packed: avoid Line 2 peak hour. Move by bus or taxi short-hop.</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Why it happens</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700">Weekend rush. Viral spots. Same time, same station, same block.</p>
      </section>
    </Container>
  );
}
