import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function AirportToCityPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Airport to city</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Pick based on arrival time, luggage, and transfer tolerance.</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">AREX / Rail</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">Best when you can handle 0-1 transfer and want stable timing.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">Airport Bus</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">Best for heavy luggage and simple drop-off near hotel district.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">Taxi</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">Best for late-night arrivals or tight group logistics.</p>
        </article>
      </section>

      <div className="mt-6 text-sm font-semibold">
        <Link href={`/${locale}/tips/airport-to-city`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">Open detailed guide</Link>
      </div>
    </Container>
  );
}
