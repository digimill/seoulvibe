import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { TravelCalculator } from "@/components/TravelCalculator";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "지출 로그",
      lead: "이동 중 실제 지출을 기록하고 누적 합계를 바로 확인합니다.",
      tracker: "실사용 지출 기록",
      quick: "빠른 환율 체크",
      a1: "Plan 예산 페이지",
      a2: "올리브영 예산",
    };
  }
  return {
    title: "Spend log",
    lead: "Log real spend as you move. Keep running totals and use quick conversion when needed.",
    tracker: "Real spend tracker",
    quick: "Quick exchange check",
    a1: "Plan budget page",
    a2: "Olive Young budget",
  };
}

export default async function NowSpendLogPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{c.title}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{c.lead}</p>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.tracker}</h2>
        <div className="mt-4">
          <ExpenseTracker lang={locale} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.quick}</h2>
        <div className="mt-4">
          <TravelCalculator lang={locale} />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/daily-budget`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.a1}</Link>
        <Link href={`/${locale}/plan/daily-budget#olive-young-budget`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a2}</Link>
      </div>
    </Container>
  );
}
