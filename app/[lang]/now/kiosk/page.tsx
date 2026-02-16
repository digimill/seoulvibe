import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { KioskPracticeSimulator } from "@/components/KioskPracticeSimulator";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NowKioskPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Kiosk</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">Practice first, then handle live errors with a fixed sequence.</p>
      <div className="mt-6">
        <KioskPracticeSimulator lang={locale} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/kiosk-card-rejected`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">Card rejected flow</Link>
        <Link href={`/${locale}/tips/kiosk-survival-flow`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Full kiosk guide</Link>
      </div>
    </Container>
  );
}
