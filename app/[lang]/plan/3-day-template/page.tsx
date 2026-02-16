import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function ThreeDayTemplatePage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">3-day template</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Use one core area per half-day. Avoid over-switching neighborhoods.</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Day 1</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">Arrival + base setup + one short evening zone near your hotel.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Day 2</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">Main exploration day. One anchor district in daytime, one optional night block.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Day 3</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">Low-risk route near departure corridor. Keep transfer complexity low.</p>
        </article>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/where-to-stay`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">Match your base</Link>
        <Link href={`/${locale}/areas`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Compare areas</Link>
      </div>
    </Container>
  );
}
