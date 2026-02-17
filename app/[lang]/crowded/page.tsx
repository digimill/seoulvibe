import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CrowdedDecisionEngine } from "@/components/CrowdedDecisionEngine";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type CrowdedPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CrowdedPage({ params }: CrowdedPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const copy = locale === "ko"
    ? {
        title: "혼잡 회피 의사결정 엔진",
        lead: "지금 위치와 체감 혼잡도를 입력하면 즉시 행동 전략을 제안합니다.",
      }
    : {
        title: "Crowd Escape Decision Engine",
        lead: "Input your current location and crowd level to get immediate actions.",
      };

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          {copy.lead}
        </p>
      </section>
      <CrowdedDecisionEngine lang={locale} />
    </Container>
  );
}
