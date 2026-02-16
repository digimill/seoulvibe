import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TMoneyLoadCalculator } from "@/components/TMoneyLoadCalculator";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NowTMoneyPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">T-money</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">Estimate top-up by stay length and keep a safety floor before night moves.</p>
      <div className="mt-6">
        <TMoneyLoadCalculator lang={locale} />
      </div>
      <div className="mt-6 text-sm font-semibold">
        <Link href={`/${locale}/how-much-tmoney`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Open quick baseline guide</Link>
      </div>
    </Container>
  );
}
