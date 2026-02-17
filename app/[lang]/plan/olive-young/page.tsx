import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { OliveYoungBudgetBuilder } from "@/components/OliveYoungBudgetBuilder";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Olive Young 예산",
      lead: "매장 입장 전에 화장품/생필품 예산을 먼저 정해 결제 판단을 빠르게 만드세요.",
      back: "일일 예산으로 돌아가기",
    };
  }
  if (lang === "ja") {
    return {
      title: "Olive Young予算",
      lead: "入店前にコスメ/日用品の予算を決めて、会計判断を速くしましょう。",
      back: "1日予算に戻る",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Olive Young预算",
      lead: "进店前先设定美妆/日用品预算，现场结账决策会更快。",
      back: "返回每日预算",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Olive Young預算",
      lead: "進店前先設定美妝/日用品預算，現場結帳判斷會更快。",
      back: "返回每日預算",
    };
  }
  return {
    title: "Olive Young budget",
    lead: "Set cosmetics and essentials budget before entering the store so checkout decisions are faster.",
    back: "Back to daily budget",
  };
}

export default async function PlanOliveYoungPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6">
        <OliveYoungBudgetBuilder lang={locale} />
      </section>

      <div className="mt-6 text-sm font-semibold">
        <Link href={`/${locale}/plan/daily-budget`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
          {c.back}
        </Link>
      </div>
    </Container>
  );
}
