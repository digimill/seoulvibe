import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { QuickPicksTool } from "@/components/QuickPicksTool";
import { isLang, type Lang } from "@/lib/i18n";

type QuickPicksPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function QuickPicksPage({ params }: QuickPicksPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const back = locale === "ko" ? "홈으로" : "Back";

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}`} className="text-sm font-semibold text-zinc-600">
        {back}
      </Link>
      <div className="mt-4">
        <QuickPicksTool lang={locale} />
      </div>
    </Container>
  );
}

