import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NowSubwayHelpPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Subway help</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">Check terminal direction first, then line color. This avoids most wrong-way losses.</p>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Fast recovery</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>- If wrong direction, get off at next station immediately.</li>
          <li>- Verify final station name before re-boarding.</li>
          <li>- Keep transfer window to avoid extra fare.</li>
        </ul>
      </section>

      <div className="mt-6 text-sm font-semibold">
        <Link href={`/${locale}/tips/subway-map-confusion-cuts`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">Open subway guide</Link>
      </div>
    </Container>
  );
}
