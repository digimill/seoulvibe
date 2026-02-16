import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { NowSubwayDirectionDecoder } from "@/components/NowSubwayDirectionDecoder";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NowSubwayHelpPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <NowSubwayDirectionDecoder lang={locale} />

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/tips/subway-map-confusion-cuts`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">Open subway guide</Link>
        <Link href={`/${locale}/now/t-money`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">T-money quick check</Link>
        <Link href={`/${locale}/now/crowd-escape`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Crowd escape</Link>
      </div>
    </Container>
  );
}
